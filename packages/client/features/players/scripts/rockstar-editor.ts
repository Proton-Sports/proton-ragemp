import { createScript } from '@kernel/script';

export default createScript({
    name: 'rockstar-editor',
    fn: ({ game, logger }) => {
        let interval: number | null = null;
        let recording = false;

        // Handle F9 (start/stop recording) and F10 (open editor) keys
        game.keys.bind(0x78, () => {
            // F9 key
            if (recording) {
                const result = mp.game.invoke('0x33D47E85B476ABCD', false); // SAVE_REPLAY_RECORDING
                mp.game.invoke('0x88BB3507ED41A240'); // STOP_REPLAY_RECORDING
                logger.info(`Save replay recording result: ${result}`);
            } else {
                mp.game.invoke('0xA5C80D8E768A9E66', 1); // START_REPLAY_RECORDING
            }
            recording = !recording;
        });

        game.keys.bind(0x79, () => {
            // F10 key
            mp.game.invoke('0x49DA8145672B2725', 1); // ACTIVATE_ROCKSTAR_EDITOR

            // Clear interval if it exists
            if (interval != null) {
                clearInterval(interval);
            }

            // Check for screen fade and fade in
            interval = setInterval(() => {
                if (mp.game.invoke('0x5CCABFFCA31DDE33')) {
                    // IS_SCREEN_FADED_OUT
                    mp.game.invoke('0xD4E8E24955024033', 1000); // DO_SCREEN_FADE_IN
                    if (interval) {
                        clearInterval(interval);
                        interval = null;
                    }
                }
            }, 1000) as unknown as number;
        });
    },
});
