import { Menu, MenuItem, MenuButton, MenuItems } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { MdMenu } from 'react-icons/md';

interface Player {
  id: string;
  name: string;
}

export default function BanTab() {
  const [players, setPlayers] = useState<Player[] | null>(null);

  useEffect(() => {
    const getPlayers = (players: Player[]) => {
      setPlayers(players);
    };

    const removePlayer = (id: string) => {
      setPlayers((a) => (a == null ? a : a.filter((b) => b.id !== id)));
    };

    alt.on('admin-panel.ban.getPlayers', getPlayers);
    alt.on('admin-panel.ban.removePlayer', removePlayer);
    alt.emit('admin-panel.ban.getPlayers');

    return () => {
      alt.off('admin-panel.ban.getPlayers', getPlayers);
      alt.off('admin-panel.ban.removePlayer', removePlayer);
    };
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden">
      <h2 className="px-4 uppercase mb-4 leading-none font-black text-primary">Manage ban records</h2>
      <div className="overflow-auto">
        <table className="text-left table-fixed w-full">
          <colgroup>
            <col></col>
            <col></col>
            <col className="w-12"></col>
          </colgroup>
          <thead>
            <tr className="text-sm font-bold text-primary/40 sticky top-0 bg-bg-2 *:px-4 *:py-2">
              <th>ID</th>
              <th colSpan={2}>Name</th>
            </tr>
          </thead>
          <tbody>
            {players == null ? (
              <tr className="*:px-4 *:py-2 text-fg-3">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              players.map((a) => (
                <tr key={a.id} className="odd:bg-primary/5 *:px-4 *:py-2">
                  <td>{a.id}</td>
                  <td>{a.name}</td>
                  <td className="flex gap-4">
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
                            alt.emit('admin-panel.ban.action', a.id, 'unban');
                          }}
                        >
                          Unban
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
