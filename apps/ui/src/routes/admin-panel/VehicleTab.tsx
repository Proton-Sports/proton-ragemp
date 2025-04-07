import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdMenu } from 'react-icons/md';
import type { VehicleTabProps } from './utils';
import { useEffect } from 'react';
import CreateVehicleButton from './CreateVehicleButton';

export default function VehicleTab(props: VehicleTabProps) {
  const vehicles = props.vehicles ?? [];

  useEffect(() => {
    const handleGet = (vehicles: VehicleTabProps['vehicles']) => {
      props.onVehiclesChange(vehicles);
    };

    const handleCreate = (vehicle: NonNullable<VehicleTabProps['vehicles']>[number]) => {
      props.onVehicleCreate(vehicle);
    };

    const handleDestroy = (id: number) => {
      props.onVehicleDestroy(id);
    };

    alt.on('admin-panel.vehicles.get', handleGet);
    alt.on('admin-panel.vehicles.create', handleCreate);
    alt.on('admin-panel.vehicles.destroy', handleDestroy);
    return () => {
      alt.off('admin-panel.vehicles.get', handleGet);
      alt.off('admin-panel.vehicles.create', handleCreate);
      alt.off('admin-panel.vehicles.destroy', handleDestroy);
    };
  });

  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden">
      <h2 className="px-4 uppercase mb-4 leading-none font-black text-primary">Manage vehicles</h2>
      <div className="overflow-auto">
        <table className="text-left table-fixed w-full">
          <colgroup>
            <col className="w-12"></col>
            <col></col>
            <col className="w-40"></col>
          </colgroup>
          <thead>
            <tr className="text-sm font-bold text-primary/40 sticky top-0 bg-bg-2 *:px-4 *:py-2">
              <th>ID</th>
              <th>Name</th>
              <th>
                <CreateVehicleButton />
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((a) => (
              <tr key={a.id} className="odd:bg-primary/5 *:px-4 *:py-2">
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td className="flex gap-4 justify-end">
                  <Menu>
                    <MenuButton
                      type="button"
                      className="group text-fg-3 flex justify-between gap-4 items-center text-left p-1
                          rounded-sm transition ease-in-out duration-75
                          data-[spawned]:text-fg-1 hover:bg-primary-hover hover:text-fg-1 data-[focus]:bg-primary-active data-[focus]:text-fg-1 data-[open]:bg-primary-active data-[open]:text-fg-1 focus:outline-none"
                    >
                      <MdMenu />
                    </MenuButton>
                    <MenuItems
                      anchor={{ gap: '1.5rem', to: 'right start' }}
                      transition
                      className="transition border border-fg/10 bg-bg-2 font-medium tracking-tight rounded w-48 data-[closed]:scale-95 data-[closed]:-translate-x-0 data-[closed]:opacity-0 translate-x-0 duration-75 ease-out focus:outline-none"
                    >
                      <p className="px-4 my-2 font-bold text-primary">{a.name}</p>
                      <hr className="border-bg-hover" />
                      <MenuItem
                        as="button"
                        className="block w-full text-left px-4 py-2.5 data-[focus]:bg-primary/10"
                        onClick={() => {
                          alt.emit('admin-panel.vehicles.destroy', a.id);
                        }}
                      >
                        Destroy
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
