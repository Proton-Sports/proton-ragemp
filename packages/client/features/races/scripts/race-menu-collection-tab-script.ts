import { createScript } from '@kernel/script';

export default createScript({
    name: 'race-menu-collection-tab',
    fn: ({ ui, messenger }) => {
        ui.on('race-menu-collection.option.change', (option) => {
            onOptionChange(option);
        });

        function onOptionChange(option: string) {
            if (option !== 'cars' && option !== 'clothes') {
                return;
            }

            ui.router.unmount('race-menu');
            messenger.publish('race-menu-collection.option.change', option);
        }
    },
});
