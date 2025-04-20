import { createScript } from '@kernel/script';
import type { Character } from '@repo/shared/models/character-creator';
import { combineCleanup, createToggle, tryPromise } from '@repo/shared/utils';

const LOCATION_POSITION = new mp.Vector3(402.90833, -996.61365, -99.00013);
const ANIMATION_DICT = 'anim@heists@heist_corona@single_team';
const ANIMATION_NAME = 'single_team_loop_boss';

export default createScript({
    name: 'character-creator',
    fn: ({ ui, game, messenger, logger }) => {
        let characterCamera: CameraMp | null = null;
        let cameraFov: number = 70;
        let zPos: number = 0.5;
        let mouseEntered: boolean = false;
        let locationInterior: number = 0;
        let startCameraPosition: Vector3 | null = null;
        let startPosition: Vector3 | null = null;
        let characterPed: PedMp | null = null;

        messenger.on('character-creator.mount', () => {
            ui.router.mount('character-creator');
        });

        // Route mounting handler
        ui.router.onMount('character-creator', () => {
            const toggle = createToggle((toggle) => {
                ui.focus(toggle);
                game.cursor.show(toggle);
                game.freezeControls(toggle);
                mp.game.ui.displayRadar(!toggle);
            });

            toggle(true);
            locationInterior = mp.game.interior.getInteriorAtCoords(
                LOCATION_POSITION.x,
                LOCATION_POSITION.y,
                LOCATION_POSITION.z,
            );

            mp.game.interior.pinInMemory(locationInterior);

            // Create character with default model (male)
            const defaultModel = mp.game.joaat('mp_m_freemode_01');
            createCharacter(defaultModel);
            createCharacterCreatorCamera();
            setCharacterClothes(defaultModel);

            return combineCleanup(
                // Handle events from server
                messenger.on('character-creator.create', createCharacter),
                messenger.on('character-creator.unmount', () => {
                    ui.router.unmount('character-creator');
                }),
                // Setup UI event handlers
                ui.on('character-creator.setGender', setGender),
                ui.on('character-creator.setAppearance', setAppearance),
                ui.on('character-creator.submitAppearance', submitAppearance),
                ui.on('character-creator.mouseEntered', (isMouseEntered) => {
                    mouseEntered = isMouseEntered === true;
                }),
                // Cleanup function
                () => {
                    toggle(false);
                    mp.events.remove('render', controlCamera);
                    mp.game.interior.unpinInterior(locationInterior);
                    if (characterPed && mp.peds.exists(characterPed)) {
                        characterPed.destroy();
                        characterPed = null;
                    }
                    if (characterCamera) {
                        characterCamera.setActive(false);
                        mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
                        characterCamera.destroy(true);
                        characterCamera = null;
                    }
                },
            );
        });

        function createCharacterCreatorCamera() {
            startPosition = LOCATION_POSITION;

            if (characterCamera && mp.cameras.exists(characterCamera)) {
                return;
            }

            const forwardVector = mp.players.local.getForwardVector();
            const forwardCameraPosition = new mp.Vector3(
                startPosition.x + forwardVector.x * 1.2,
                startPosition.y + forwardVector.y * 1.2,
                startPosition.z + zPos,
            );

            startCameraPosition = forwardCameraPosition;
            characterCamera = mp.cameras.new(
                'DEFAULT_SCRIPTED_CAMERA',
                forwardCameraPosition,
                new mp.Vector3(0, 0, 0),
                cameraFov,
            );

            characterCamera.pointAtCoord(startPosition.x, startPosition.y, startPosition.z + zPos);
            characterCamera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

            mp.events.add('render', controlCamera);
        }

        async function createCharacter(characterModel: number) {
            if (characterPed && mp.peds.exists(characterPed)) {
                characterPed.model = characterModel;
                setCharacterClothes(characterModel);

                // Set animation
                characterPed.taskPlayAnim(ANIMATION_DICT, ANIMATION_NAME, 1.0, 1.0, -1, 1, 0, false, false, false);

                return;
            }

            // Create local ped
            characterPed = mp.peds.new(
                characterModel,
                LOCATION_POSITION,
                270, // Heading (3.14 radians in degrees)
                mp.players.local.dimension,
            );

            if (!characterPed) {
                logger.error('Failed to create character ped');
                return;
            }

            characterPed.freezePosition(true);

            // Request animation dictionary and play animation
            mp.game.streaming.requestAnimDict(ANIMATION_DICT);

            const loadAnimResult = await tryPromise(() => {
                return new Promise<boolean>((resolve) => {
                    const timeout = setTimeout(() => resolve(false), 10000);

                    const checkInterval = setInterval(() => {
                        if (mp.game.streaming.hasAnimDictLoaded(ANIMATION_DICT)) {
                            clearTimeout(timeout);
                            clearInterval(checkInterval);
                            resolve(true);
                        }
                    }, 100);
                });
            })();

            if (loadAnimResult.ok && loadAnimResult.data && characterPed && mp.peds.exists(characterPed)) {
                characterPed.taskPlayAnim(ANIMATION_DICT, ANIMATION_NAME, 1.0, 1.0, -1, 1, 0, false, false, false);

                setCharacterClothes(characterModel);
            }
        }

        function setCharacterClothes(characterModel: number) {
            if (!characterPed || !mp.peds.exists(characterPed)) {
                return;
            }

            // Model mp_m_freemode_01 (male) or mp_f_freemode_01 (female)
            const isFemale = characterModel === mp.game.joaat('mp_f_freemode_01');

            if (isFemale) {
                characterPed.setComponentVariation(4, 68, 3, 0);
                characterPed.setComponentVariation(11, 144, 3, 0);
                characterPed.setComponentVariation(6, 47, 3, 0);
                characterPed.setComponentVariation(3, 17, 0, 0);
                characterPed.setComponentVariation(8, 34, 0, 0);
            } else {
                characterPed.setComponentVariation(4, 66, 3, 0);
                characterPed.setComponentVariation(11, 147, 3, 0);
                characterPed.setComponentVariation(6, 46, 3, 0);
                characterPed.setComponentVariation(3, 165, 16, 0);
                characterPed.setComponentVariation(8, 15, 0, 0);
            }
        }

        function setGender(selectedModel: number) {
            if (!characterPed || !mp.peds.exists(characterPed)) {
                return;
            }

            const modelHash =
                selectedModel === 0
                    ? mp.game.joaat('mp_f_freemode_01') // Female
                    : mp.game.joaat('mp_m_freemode_01'); // Male

            // Check if we need to change the model
            if (characterPed.model === modelHash) {
                return;
            }

            createCharacter(modelHash);
        }

        function setAppearance(appearanceJson: string) {
            if (!characterPed || !mp.peds.exists(characterPed)) {
                return;
            }

            try {
                const characterAppearance = JSON.parse(appearanceJson) as Character;

                // Set head blend data - Need to use natives as RAGE:MP doesn't expose all these methods
                mp.game.ped.setHeadBlendData(characterPed.handle, 0, 0, 0, 0, 0, 0, 0, 0, 0, false); // Reset
                mp.game.ped.setHeadBlendData(
                    characterPed.handle,
                    characterAppearance.faceFather,
                    characterAppearance.faceMother,
                    0,
                    characterAppearance.skinFather,
                    characterAppearance.skinMother,
                    0,
                    characterAppearance.faceMix,
                    characterAppearance.skinMix,
                    0,
                    false,
                );

                // Set face features
                for (const faceFeature of characterAppearance.faceFeatures) {
                    mp.game.ped.setFaceFeature(characterPed.handle, faceFeature.index, faceFeature.value);
                }

                // Set face overlays
                for (const faceOverlay of characterAppearance.faceOverlays) {
                    mp.game.ped.setHeadOverlay(
                        characterPed.handle,
                        faceOverlay.index,
                        faceOverlay.value,
                        faceOverlay.opacity,
                    );

                    if (faceOverlay.hasColor) {
                        mp.game.ped.setHeadOverlayColor(
                            characterPed.handle,
                            faceOverlay.index,
                            2,
                            faceOverlay.firstColor,
                            faceOverlay.firstColor,
                        );
                    }
                }

                // Set hair
                characterPed.setComponentVariation(2, characterAppearance.hairDrawable, 0, 0);
                mp.game.ped.setHairColor(
                    characterPed.handle,
                    characterAppearance.firstHairColor,
                    characterAppearance.secondHairColor,
                );

                // Set facial hair
                mp.game.ped.setHeadOverlay(
                    characterPed.handle,
                    1,
                    characterAppearance.facialHair,
                    characterAppearance.facialHairOpacity,
                );
                mp.game.ped.setHeadOverlayColor(
                    characterPed.handle,
                    1,
                    1,
                    characterAppearance.firstFacialHairColor,
                    characterAppearance.secondFacialHairColor,
                );

                // Set eyebrows
                mp.game.ped.setHeadOverlay(characterPed.handle, 2, characterAppearance.eyebrows, 1);
                mp.game.ped.setHeadOverlayColor(
                    characterPed.handle,
                    2,
                    1,
                    characterAppearance.eyebrowsColor,
                    characterAppearance.eyebrowsColor,
                );

                // Set eye color
                mp.game.ped.setEyeColor(characterPed.handle, characterAppearance.eyeColor);
            } catch (error) {
                logger.error('Failed to parse or apply appearance', error);
            }
        }

        function submitAppearance(appearanceJson: string) {
            messenger.publish('character-creator.setAppearance', appearanceJson);
        }

        function controlCamera() {
            if (!characterPed || !mp.peds.exists(characterPed)) {
                return;
            }

            // Disable various control actions
            const controls = [0, 1, 2, 16, 17, 24, 25, 32, 33, 34, 35];
            for (const control of controls) {
                mp.game.controls.disableControlAction(0, control, true);
            }

            const screenResolution = mp.game.graphics.getScreenResolution();
            const cursorPosition = mp.gui.cursor.position;
            const cursorX = cursorPosition[0];
            let heading = characterPed.getHeading();

            // Camera zoom in
            if (mp.game.controls.isDisabledControlPressed(0, 17) && !mouseEntered) {
                cameraFov -= 2;
                if (cameraFov < 10) cameraFov = 10;

                if (characterCamera && mp.cameras.exists(characterCamera)) {
                    characterCamera.setFov(cameraFov);
                    // characterCamera.setActive(true);
                    // mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
                }
            }

            // Camera zoom out
            if (mp.game.controls.isDisabledControlPressed(0, 16) && !mouseEntered) {
                cameraFov += 2;
                if (cameraFov > 130) cameraFov = 130;

                if (characterCamera && mp.cameras.exists(characterCamera)) {
                    characterCamera.setFov(cameraFov);
                    // characterCamera.setActive(true);
                    // mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
                }
            }

            // Camera up
            if (mp.game.controls.isDisabledControlPressed(0, 32)) {
                zPos += 0.01;
                if (zPos > 1.2) zPos = 1.2;

                if (characterCamera && mp.cameras.exists(characterCamera) && startCameraPosition && startPosition) {
                    characterCamera.setCoord(startCameraPosition.x, startCameraPosition.y, startPosition.z + zPos);
                    characterCamera.pointAtCoord(startPosition.x, startPosition.y, startPosition.z + zPos);
                    // characterCamera.setActive(true);
                    // mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
                }
            }

            // Camera down
            if (mp.game.controls.isDisabledControlPressed(0, 33)) {
                zPos -= 0.01;
                if (zPos < -1.2) zPos = -1.2;

                if (characterCamera && mp.cameras.exists(characterCamera) && startCameraPosition && startPosition) {
                    characterCamera.setCoord(startCameraPosition.x, startCameraPosition.y, startPosition.z + zPos);
                    characterCamera.pointAtCoord(startPosition.x, startPosition.y, startPosition.z + zPos);
                    // characterCamera.setActive(true);
                    // mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
                }
            }

            // Rotate character based on mouse position
            if (mp.game.controls.isDisabledControlPressed(0, 25)) {
                if (cursorX < screenResolution.x / 2) {
                    heading -= 1;
                } else if (cursorX > screenResolution.x / 2) {
                    heading += 1;
                }

                characterPed.setHeading(heading);
            }

            // Rotate character right
            if (mp.game.controls.isDisabledControlPressed(0, 35)) {
                heading += 1;
                characterPed.setHeading(heading);
            }

            // Rotate character left
            if (mp.game.controls.isDisabledControlPressed(0, 34)) {
                heading -= 1;
                characterPed.setHeading(heading);
            }
        }
    },
});
