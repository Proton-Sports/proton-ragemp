import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-menu',
    fn: ({ db, messenger }) => {
        const onGetToken = async (player: PlayerMp) => {
            const protonId = player.protonId;
            if (!protonId) {
                return;
            }

            const user = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, protonId),
                columns: {
                    money: true,
                },
            });
            messenger.publish(player, 'race-menu.tokens.get', user?.money ?? 0);
        };

        mp.events.add('race-menu.tokens.get', onGetToken);
    },
});
