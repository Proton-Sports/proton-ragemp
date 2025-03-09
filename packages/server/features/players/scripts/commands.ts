import { createScript } from '@kernel/script';

export default createScript({
    name: 'player-commands',
    fn: () => {
        mp.events.addCommand('hp', (player) => {
            player.health = 100;
        });

        mp.events.addCommand('armor', (player) => {
            player.armour = 100;
        });

        mp.events.addCommand('kill', (player) => {
            player.health = 0;
        });

        mp.events.addCommand('car', (player) => {
            mp.vehicles.new(mp.joaat('elegy'), player.position);
        });
    },
});
