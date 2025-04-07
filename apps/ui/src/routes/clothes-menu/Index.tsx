import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { create } from 'mutative';
import { useEffect, useState } from 'react';
import { BiSolidChevronDown } from 'react-icons/bi';

interface Props {
  items: {
    id: number;
    name: string;
  }[];
  equippedIds?: number[];
}

export default function ClothesMenu({ items, equippedIds: initialEquippedIds }: Props) {
  const [equippedIds, setEquippedIds] = useState(new Set(initialEquippedIds));

  useEffect(() => {
    const handleOptionChange = (id: number, value: 'equip' | 'unequip') => {
      switch (value) {
        case 'equip':
          setEquippedIds((a) =>
            a
              ? create(a, (a) => {
                  a.add(id);
                })
              : a
          );
          break;
        case 'unequip':
          setEquippedIds((a) =>
            a
              ? create(a, (a) => {
                  a.delete(id);
                })
              : a
          );
          break;
      }
    };

    alt.on('clothes-menu.option.change', handleOptionChange);
    return () => {
      alt.off('clothes-menu.option.change', handleOptionChange);
    };
  });

  return (
    <>
      <div className="fixed left-8 top-20 bg-bg-2 rounded-lg overflow-hidden border border-bg-border fugaz">
        <h2 className="p-4 bg-bg-1 uppercase rounded-t-lg">Clothes menu</h2>
        <ul className="h-96 overflow-auto">
          {items.map(({ id, name }) => {
            const equipped = equippedIds?.has(id);
            return (
              <li key={id}>
                <Menu>
                  <MenuButton
                    type="button"
                    data-spawned={equipped ? true : undefined}
                    className="group flex justify-between gap-4 items-center w-full text-left p-4 text-fg-3 transition ease-in-out duration-75 data-[spawned]:text-fg-1 hover:bg-bg-hover hover:text-fg-1 data-[focus]:bg-bg-hover data-[focus]:text-fg-1 data-[open]:bg-bg-hover data-[open]:text-fg-1 focus:outline-none"
                  >
                    <span>{name}</span>
                    <div className="rotate-0 group-data-[open]:-rotate-90 transition-transform ease-in-out">
                      <BiSolidChevronDown />
                    </div>
                  </MenuButton>
                  <MenuItems
                    anchor={{ gap: '0.5rem', to: 'right start' }}
                    transition
                    className="transition w-48 data-[closed]:scale-95 data-[closed]:-translate-x-4 data-[closed]:opacity-0 translate-x-0 duration-75 ease-in-out focus:outline-none"
                  >
                    <MenuItem>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alt.emit('clothes-menu.option.change', id, equipped ? 'unequip' : 'equip');
                        }}
                        className="slanted group flex w-full items-center gap-2 p-4 bg-bg-2 data-[focus]:bg-bg-hover"
                      >
                        {equipped ? 'Unequip' : 'Equip'}
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
