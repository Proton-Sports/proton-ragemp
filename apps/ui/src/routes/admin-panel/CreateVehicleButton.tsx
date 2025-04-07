import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { HiMiniPlus } from 'react-icons/hi2';
import Input from '../../lib/components/Input';
import Button from '../../lib/components/Button';

export default function CreateVehicleButton() {
  return (
    <Popover className="relative">
      <PopoverButton
        className="flex gap-1 items-center px-2 py-1 rounded-sm transition ease-out duration-75
          hover:bg-primary-hover hover:text-primary-fg"
      >
        <HiMiniPlus className="mx-auto" />
        Create vehicle
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: 'right', gap: '2.5rem' }}
        className="bg-bg-2 border border-bg-border rounded p-4 w-60"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = new FormData(e.currentTarget).get('model');
            if (!name || name.toString().length === 0) {
              return;
            }
            alt.emit('admin-panel.vehicles.create', name);
          }}
        >
          <label htmlFor="model">Model name</label>
          <Input type="text" id="model" name="model" className="mb-4" />
          <Button type="submit" variant="primary" className="font-bold uppercase fugaz">
            Create
          </Button>
        </form>
      </PopoverPanel>
    </Popover>
  );
}
