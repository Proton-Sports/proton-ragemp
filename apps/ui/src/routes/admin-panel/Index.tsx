import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { lazy, Suspense, useState } from 'react';
import type { PlayerTabProps, VehicleTabProps } from './utils';

interface Props {
  tab?: number;
  players?: PlayerTabProps['players'];
  vehicles?: VehicleTabProps['vehicles'];
}

const PlayerTab = lazy(() => import('./PlayerTab'));
const VehicleTab = lazy(() => import('./VehicleTab'));
const BanTab = lazy(() => import('./BanTab'));

export default function Index(props: Props) {
  const defaultIndex = props.tab ?? 0;
  const [players, setPlayers] = useState(props?.players ?? []);
  const [vehicles, setVehicles] = useState(props?.vehicles ?? []);

  const handleChange = (index: number) => {
    switch (index) {
      case 0:
        alt.emit('admin-panel.players.get');
        break;
      case 1:
        alt.emit('admin-panel.vehicles.get');
        break;
    }
  };

  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <TabGroup vertical className="flex gap-2" defaultIndex={defaultIndex} onChange={handleChange}>
        <TabList className="flex flex-col font-black bg-bg-2 h-fit">
          <Tab
            className="px-8 py-4 uppercase text-fg-3 focus:outline-none
            data-[focus]:bg-bg-hover data-[focus]:outline data-[focus]:outline-red-500 data-[hover]:bg-bg-hover data-[selected]:bg-primary
            data-[focus]:text-fg-hover data-[hover]:text-fg-hover data-[selected]:text-primary-fg"
          >
            Player
          </Tab>
          <Tab
            className="px-8 py-4 uppercase text-fg-3 focus:outline-none
            data-[focus]:bg-bg-hover data-[focus]:outline data-[focus]:outline-red-500 data-[hover]:bg-bg-hover data-[selected]:bg-primary
            data-[focus]:text-fg-hover data-[hover]:text-fg-hover data-[selected]:text-primary-fg"
          >
            Vehicle
          </Tab>
          <Tab
            className="px-8 py-4 uppercase text-fg-3 focus:outline-none
            data-[focus]:bg-bg-hover data-[focus]:outline data-[focus]:outline-red-500 data-[hover]:bg-bg-hover data-[selected]:bg-primary
            data-[focus]:text-fg-hover data-[hover]:text-fg-hover data-[selected]:text-primary-fg"
          >
            Ban
          </Tab>
        </TabList>
        <TabPanels className="w-[40rem] h-[32rem] grid bg-bg-2 py-4">
          <TabPanel className="focus:outline-none grid overflow-hidden">
            <Suspense>
              <PlayerTab
                players={players}
                onPlayersChange={(a) => {
                  setPlayers(a ?? []);
                }}
              />
            </Suspense>
          </TabPanel>
          <TabPanel className="focus:outline-none grid overflow-hidden">
            <Suspense>
              <VehicleTab
                vehicles={vehicles}
                onVehiclesChange={(a) => {
                  setVehicles(a ?? []);
                }}
                onVehicleCreate={(a) => {
                  setVehicles((vehicles) => (vehicles ? [...vehicles, a] : vehicles));
                }}
                onVehicleDestroy={(a) => {
                  setVehicles((vehicles) => (vehicles ? vehicles.filter((b) => b.id !== a) : vehicles));
                }}
              />
            </Suspense>
          </TabPanel>
          <TabPanel className="focus:outline-none grid overflow-hidden">
            <Suspense>
              <BanTab />
            </Suspense>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
