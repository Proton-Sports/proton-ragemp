import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { BiSolidChevronDown } from 'react-icons/bi';

interface Props {
  items: {
    id: number;
    name: string;
  }[];
  spawnedIds?: number[];
}

export default function VehicleMenu({ items, spawnedIds: initialSpawnedIds }: Props) {
  const [spawnedIds, setSpawnedIds] = useState(initialSpawnedIds);
  useEffect(() => {
    const handleSpawn = (id: number) => {
      setSpawnedIds((a) => (a ? [...a, id] : [id]));
    };

    const handleDespawn = (id: number) => {
      setSpawnedIds((a) => a?.filter((a) => a !== id));
    };

    alt.on('vehicle-menu.spawn', handleSpawn);
    alt.on('vehicle-menu.despawn', handleDespawn);
    return () => {
      alt.off('vehicle-menu.spawn', handleSpawn);
      alt.off('vehicle-menu.despawn', handleDespawn);
    };
  });
  return (
    <>
      <div className="fixed left-8 top-20 bg-bg-2 rounded-lg overflow-hidden border border-bg-border fugaz">
        <h2 className="p-4 bg-bg-1 uppercase rounded-t-lg">Vehicle menu</h2>
        <ul className="h-96 overflow-auto">
          {items.map(({ id, name }) => {
            const spawned = spawnedIds?.includes(id);
            return (
              <li key={id}>
                <Menu>
                  <MenuButton
                    type="button"
                    data-spawned={spawned ? true : undefined}
                    className="flex justify-between gap-4 items-center w-full text-left p-4 text-fg-3 transition ease-in-out duration-75 data-[spawned]:text-fg-1 data-[hover]:bg-bg-hover data-[hover]:text-fg-1 data-[open]:bg-bg-hover data-[open]:text-fg-1"
                  >
                    <span>{name}</span>
                    <BiSolidChevronDown />
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="right"
                    className="w-52 fugaz origin-top-right rounded bg-bg-2 border border-bg-border transition duration-75 ease-in-out [--anchor-gap:0.5rem] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <MenuItem>
                      <button
                        className="group flex w-full items-center gap-2 p-4 data-[focus]:bg-white/10"
                        onClick={() => {
                          if (spawned) {
                            alt.emit('vehicle-menu.despawn', id);
                          } else {
                            alt.emit('vehicle-menu.spawn', id);
                          }
                        }}
                      >
                        {spawned ? 'Despawn' : 'Spawn'}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
