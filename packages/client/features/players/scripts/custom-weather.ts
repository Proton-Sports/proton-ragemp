import type { WeatherType } from '@duydang2311/ragemp-utils-shared';
import { createScript } from '@kernel/script';

export default createScript({
    name: 'custom-weather',
    fn: ({ messenger }) => {
        messenger.on('players.setCustomWeather', (weatherType: WeatherType) => {
            mp.game.gameplay.setWeatherTypeNowPersist(weatherType);
        });
        messenger.on('players.unsetCustomWeather', () => {});
    },
});
