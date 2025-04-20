import { createScript } from '@kernel/script';
import { characters } from '@repo/db/schema';
import { attempt } from '@repo/shared';
import type { Character } from '@repo/shared/models/character-creator';
import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';

export default createScript({
    name: 'character-creator',
    fn: ({ logger, messenger, db }) => {
        mp.events.add('authentication.ok', async (player: PlayerMp) => {
            const protonId = player.protonId;
            invariant(protonId != null && typeof protonId === 'number', 'player.protonId is not a number');

            // Check if player has a character using attempt pattern
            const hasCharacterAttempt = await attempt.promise(async () => {
                const count = await db.$count(characters, eq(characters.userId, protonId));
                return count > 0;
            })();

            if (!hasCharacterAttempt.ok) {
                logger.error(`Failed to check if player has character: ${hasCharacterAttempt.error}`);
                return;
            }

            if (hasCharacterAttempt.data) {
                // Player has character, load it
                const getCharacterAttempt = await attempt.promise(async () => {
                    const result = await db.select().from(characters).where(eq(characters.userId, protonId)).limit(1);
                    return result.length > 0 ? result[0] : null;
                })();

                if (!getCharacterAttempt.ok || !getCharacterAttempt.data) {
                    logger.error(
                        `Failed to retrieve character: ${
                            getCharacterAttempt.ok ? 'Not found' : getCharacterAttempt.error
                        }`,
                    );
                    player.kick('Invalid character. Please try again.');
                    return;
                }

                setPlayerAppearance(player, getCharacterAttempt.data);
            } else {
                // Player doesn't have a character, start character creator
                startCharacterCreator(player);
            }
        });

        // Listen for character appearance submission from client
        messenger.on('character-creator.setAppearance', async (player, appearanceJson: string) => {
            if (!player || !mp.players.exists(player)) {
                return;
            }

            // Parse appearance JSON
            const parseAttempt = attempt(() => JSON.parse(appearanceJson) as Character)();

            if (!parseAttempt.ok) {
                logger.error(`Failed to parse character appearance: ${parseAttempt.error}`);
                player.kick('Invalid appearance. Please try again.');
                return;
            }

            const characterAppearance = parseAttempt.data;

            // Set character's user ID
            const protonId = player.protonId;
            if (!protonId || typeof protonId !== 'number') {
                player.kick('Invalid player ID. Please try again.');
                return;
            }

            // Save character to database using drizzle ORM
            const saveAttempt = await attempt.promise(async () => {
                await db.insert(characters).values({
                    userId: protonId,
                    characterGender: characterAppearance.characterGender,
                    faceFather: characterAppearance.faceFather,
                    faceMother: characterAppearance.faceMother,
                    skinFather: characterAppearance.skinFather,
                    skinMother: characterAppearance.skinMother,
                    skinMix: characterAppearance.skinMix,
                    faceMix: characterAppearance.faceMix,
                    eyeColor: characterAppearance.eyeColor,
                    faceFeatures: characterAppearance.faceFeatures,
                    faceOverlays: characterAppearance.faceOverlays,
                    hairDrawable: characterAppearance.hairDrawable,
                    firstHairColor: characterAppearance.firstHairColor,
                    secondHairColor: characterAppearance.secondHairColor,
                    facialHair: characterAppearance.facialHair,
                    firstFacialHairColor: characterAppearance.firstFacialHairColor,
                    secondFacialHairColor: characterAppearance.secondFacialHairColor,
                    facialHairOpacity: characterAppearance.facialHairOpacity,
                    eyebrows: characterAppearance.eyebrows,
                    eyebrowsColor: characterAppearance.eyebrowsColor,
                });
            })();

            if (!saveAttempt.ok) {
                logger.error(`Failed to save character: ${saveAttempt.error}`);
                player.kick('Failed to save character. Please try again.');
                return;
            }

            // Apply appearance to player
            setPlayerAppearance(player, characterAppearance);

            // Notify client to stop character creator
            messenger.publish(player, 'character-creator.unmount');
        });

        function setPlayerAppearance(player: PlayerMp, character: Character) {
            // Spawn player at a specific location
            player.spawn(new mp.Vector3(551.916, 5562.336, -96.042));
            player.dimension = 0;
            player.freezePosition(true);
            player.setInvincible(true);
            player.heading = 0;
            player.alpha = 255; // Make visible
            player.health = 100;

            // Set player model based on gender
            const modelHash =
                character.characterGender === 0
                    ? mp.joaat('mp_f_freemode_01') // Female
                    : mp.joaat('mp_m_freemode_01'); // Male

            player.model = modelHash;

            // Apply head blend data
            player.setHeadBlend(
                character.faceFather,
                character.faceMother,
                0,
                character.skinFather,
                character.skinMother,
                0,
                character.faceMix,
                character.skinMix,
                0,
            );

            // Apply face features
            for (const faceFeature of character.faceFeatures) {
                player.setFaceFeature(faceFeature.index, faceFeature.value);
            }

            // Apply face overlays
            for (const faceOverlay of character.faceOverlays) {
                player.setHeadOverlay(faceOverlay.index, [
                    faceOverlay.value,
                    faceOverlay.opacity,
                    faceOverlay.firstColor,
                    faceOverlay.firstColor,
                ]);
            }

            // Set clothes and appearance
            player.setClothes(2, character.hairDrawable, 0, 0);
            player.setHeadOverlay(1, [
                character.facialHair,
                character.facialHairOpacity,
                character.firstFacialHairColor,
                character.secondFacialHairColor,
            ]);
            player.setHeadOverlay(2, [character.eyebrows, 1, character.eyebrowsColor, character.eyebrowsColor]);
            player.eyeColor = character.eyeColor;
            player.setHairColor(character.firstHairColor, character.secondHairColor);

            // Set default clothes based on gender
            if (character.characterGender === 0) {
                // Female
                player.setClothes(4, 68, 3, 0);
                player.setClothes(11, 144, 3, 0);
                player.setClothes(6, 47, 3, 0);
                player.setClothes(3, 17, 0, 0);
                player.setClothes(8, 34, 0, 0);
            } else {
                // Male
                player.setClothes(4, 66, 3, 0);
                player.setClothes(11, 147, 3, 0);
                player.setClothes(6, 46, 3, 0);
                player.setClothes(3, 165, 16, 0);
                player.setClothes(8, 15, 0, 0);
            }

            // Unfreeze player after a short delay
            setTimeout(() => {
                if (player && mp.players.exists(player)) {
                    player.freezePosition(false);
                }
            }, 2000);
        }

        function startCharacterCreator(player: PlayerMp) {
            // Place player in character creator location
            player.spawn(new mp.Vector3(402.90833, -996.61365, -99.00013));

            // Set player to unique dimension (prevents players from seeing each other)
            player.dimension = Number.MAX_SAFE_INTEGER - player.id;
            player.freezePosition(true);
            player.heading = 180; // 3.14 radians in degrees
            player.model = mp.joaat('mp_m_freemode_01'); // Default male model
            player.alpha = 0; // Make invisible during setup
            player.setInvincible(true);
            player.health = 100;

            // Notify client to start character creator
            messenger.publish(player, 'character-creator.mount');
        }
    },
});
