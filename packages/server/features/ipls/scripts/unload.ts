import { createScript } from '@kernel/script';

export default createScript({
    name: 'unload-default-ipls',
    fn: ({ messenger, logger, ipl, iplOptions }) => {
        messenger.on('authentication.login', (player) => {
            ipl.load(player, 'dlc_mpexample');

            const iplNamesToUnload = iplOptions.entries.map((entry) => entry.name);
            logger.info(`Unloading IPLs for player ${player.name}: ${iplNamesToUnload.join(', ')}`);
            ipl.unloadBatch(player, iplNamesToUnload);
        });
    },
});
