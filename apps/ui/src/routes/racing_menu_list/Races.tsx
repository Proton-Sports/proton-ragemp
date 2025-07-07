import { Dialog } from '@headlessui/react';
import { RaceType } from '@repo/shared';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Button from '../../lib/components/Button';

type Participant = { id: number; name: string };

interface Race {
  id: number;
  name: string;
  participants: number;
  maxParticipants: number;
  started: boolean;
  details?: RaceDetails;
}

interface RaceDetails {
  id: number;
  host: string;
  vehicleModel: string;
  type: RaceType;
  duration: number;
  ghosting: boolean;
  description: string;
  participants: Participant[];
  laps?: number;
}

export default function Races() {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null);
  const [joiningRaceId, setJoiningRaceId] = useState(0);

  useEffect(() => {
    function handleGetRaces(races: Race[]) {
      setRaces(races);
    }

    function handleGetDetails(details: RaceDetails) {
      setRaceDetails(details);
    }

    function handleParticipantChanged(raceId: number, type: 'joined' | 'left', participant: Participant) {
      setRaces((races) =>
        races.map((x) => (x.id === raceId ? { ...x, participants: x.participants + (type === 'joined' ? 1 : -1) } : x))
      );
      if (raceDetails?.id === raceId) {
        setRaceDetails((x) =>
          !x
            ? x
            : {
                ...x,
                participants:
                  type === 'joined'
                    ? [...x.participants, participant]
                    : x.participants.filter((y) => y.id !== participant.id),
              }
        );
      }
    }

    function handleRaceChanged(type: 'created' | string, race: Race) {
      if (type === 'created') {
        setRaces((races) => [...races, race]);
      }
    }

    alt.on('race-menu-races:getRaces', handleGetRaces);
    alt.on('race-menu-races:getDetails', handleGetDetails);
    alt.on('race-menu-races:participantChanged', handleParticipantChanged);
    alt.on('race-menu-races:raceChanged', handleRaceChanged);
    alt.emit('race-menu-races:getRaces');
    return () => {
      alt.off('race-menu-races:getRaces', handleGetRaces);
      alt.off('race-menu-races:getDetails', handleGetDetails);
      alt.off('race-menu-races:participantChanged', handleParticipantChanged);
      alt.off('race-menu-races:raceChanged', handleRaceChanged);
    };
  }, []);

  function handleSelectRace(race: Race) {
    setSelectedRace((x) => (x === race ? null : race));
    alt.emit('race-menu-races:getDetails', race.id);
    // setTimeout(() => {
    //   setRaceDetails({
    //     id: race.id,
    //     host: `Player ${race.id}`,
    //     vehicleModel: `Buffalo ${race.id}`,
    //     type: RaceType.Laps,
    //     laps: 2,
    //     duration: 120,
    //     ghosting: false,
    //     description:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget mollis erat. Suspendisse potenti. In ullamcorper eget neque eget mollis. Cras consequat massa sit amet bibendum scelerisque. Morbi lacinia nisl lectus, vitae ullamcorper augue efficitur ac. Vestibulum eu ornare neque. Aliquam vulputate diam a varius tempor. Sed viverra arcu at sodales convallis. Nunc pretium lorem eget turpis sagittis bibendum.',
    //     participants: new Array(race.participants).fill(0).map((_, i) => ({ id: i + 1, name: `Racer #${i}` })),
    //   });
    // }, 200);
  }

  function handleJoin(id: number) {
    setJoiningRaceId(id);
  }

  function handleConfirmJoin() {
    const race = races.find((x) => x.id === joiningRaceId);
    if (race && race.participants < race.maxParticipants) {
      alt.emit('race-menu-races:join', joiningRaceId);
    }
    setJoiningRaceId(0);
  }

  return (
    <>
      <div
        className={clsx(
          'fixed flex items-start p-4 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-xl gap-4 transition-[margin-left] ease-in-out duration-500',
          selectedRace && '-ml-12'
        )}
      >
        <div className="select-none grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] max-w-[48rem] content-start min-h-[42rem] max-h-[42rem] overflow-auto p-4 gap-4">
          {races.map((race) => (
            <Card
              key={race.id}
              race={race}
              isSelected={selectedRace === race}
              onSelect={() => handleSelectRace(race)}
              onJoin={() => handleJoin(race.id)}
            />
          ))}
        </div>
        <AnimatePresence>
          {selectedRace && <Info race={selectedRace} details={raceDetails ?? undefined} />}
        </AnimatePresence>
      </div>
      <Dialog open={!!joiningRaceId} onClose={() => setJoiningRaceId(0)} className="relative z-10">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0">
          <div className="flex items-center justify-center min-h-full">
            <Dialog.Panel className="p-8 text-center border-4 bg-bg-1 border-bg-border rounded-xl">
              <Dialog.Title className="uppercase fugaz" as="h1">
                Joining race
              </Dialog.Title>
              <Dialog.Description>Do you want to join the race?</Dialog.Description>
              <div className="w-full mt-4 space-x-2">
                <Button variant="primary" type="submit" onClick={() => handleConfirmJoin()}>
                  Join
                </Button>
                <Button type="button" onClick={() => setJoiningRaceId(0)}>
                  Cancel
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function Card({
  race: { id, name, participants: participants, maxParticipants: maxParticipants, started },
  isSelected,
  onSelect,
  onJoin,
}: {
  race: Race;
  isSelected: boolean;
  onSelect: () => void;
  onJoin: () => void;
}) {
  return (
    <div
      className={clsx(
        'cursor-pointer relative grid content-between p-4 transition duration-100 ease-in-out shadow-md shadow-black rounded-2xl bg-bg-3 aspect-square',
        isSelected
          ? 'ring ring-primary-hover scale-95 ring-offset-4 ring-offset-bg-2'
          : 'hover:ring hover:ring-primary-hover hover:scale-95 hover:ring-offset-4 hover:ring-offset-bg-2'
      )}
      onClick={onSelect}
    >
      <img
        src="https://c.wallhere.com/photos/dd/7a/Grand_Theft_Auto_Online_Grand_Theft_Auto_V_Mountain_Chiliad_Chiliad_Mountain_State_Wilderness_State_Wilderness_Paleto_Bay_Los_Santos-63102.jpg!d"
        className="absolute inset-0 object-cover object-center h-full rounded-2xl"
      />
      <div className="absolute inset-0 object-cover object-center bg-gradient-to-b from-black/80 to-black via-transparent rounded-2xl" />
      <div className="relative text-left">
        <p className="text-4xl font-bold leading-none">#{id}</p>
        <h2 className="text-base uppercase fugaz">{name}</h2>
      </div>
      <div className="relative flex justify-between gap-2">
        <div className="space-y-1 text-sm">
          <p className="text-sm leading-none text-fg/50">Participants</p>
          <div className="flex items-center justify-end gap-2">
            <Indicator type={started ? 'red' : 'green'} />
            <span className="leading-none">
              {participants}/{maxParticipants}
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          className="uppercase fugaz"
          disabled={started || participants >= maxParticipants}
          onClick={(e) => {
            e.stopPropagation();
            onJoin();
          }}
        >
          Join
        </Button>
      </div>
    </div>
  );
}

function Indicator({ type }: { type: 'green' | 'red' }) {
  return (
    <div
      className={clsx(
        'size-2 rounded-full ring',
        { green: 'bg-green-500 ring-green-500/30', red: 'bg-red-500 ring-red-500/30' }[type]
      )}
    />
  );
}

function Info({ race: { id, name }, details }: { race: Race; details?: RaceDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, right: '-100%', translateX: '100%' }}
      animate={{ opacity: 1, right: 0, translateX: '100%' }}
      exit={{ opacity: 0, right: '-100%', translateX: '100%' }}
      transition={{ duration: 0.6, ease: 'circInOut' }}
      className="absolute flex flex-col space-y-8 bottom-8 right-0 top-8 translate-x-[20rem] shadow-md shadow-bg bg-bg-1/80 border-2 border-bg rounded-xl w-[20rem]"
    >
      <div className="relative p-8 pb-0 text-left">
        <p className="text-4xl font-bold leading-none">#{id}</p>
        <h4 className="uppercase fugaz">{name}</h4>
      </div>
      {details && (
        <div className="p-8 pt-0 space-y-8 overflow-auto grow">
          <div>
            <h6 className="uppercase fugaz">Information</h6>
            <table className="w-full border-separate table-fixed border-spacing-0">
              <tbody>
                <tr className="group even:bg-fg/5">
                  <th className="px-4 py-1 text-left border-2 border-b-0 w-28 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                    Host
                  </th>
                  <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                    {details.host}
                  </td>
                </tr>
                <tr className="group even:bg-fg/5">
                  <th className="px-4 py-1 text-left border-2 border-b-0 w-28 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                    Vehicle
                  </th>
                  <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                    {details.vehicleModel}
                  </td>
                </tr>
                <tr className="group even:bg-fg/5">
                  <th className="px-4 py-1 text-left border-2 border-b-0 w-28 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                    Type
                  </th>
                  <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                    {displayRaceType(details.type)}
                  </td>
                </tr>
                {details.type === RaceType.Laps && (
                  <tr className="group even:bg-fg/5">
                    <th className="px-4 py-1 text-left border-2 border-b-0 w-28 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                      Laps
                    </th>
                    <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                      {details.laps}
                    </td>
                  </tr>
                )}
                <tr className="group even:bg-fg/5">
                  <th className="px-4 py-1 text-left border-2 border-b-0 w-28 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                    Duration
                  </th>
                  <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                    {details.duration} seconds
                  </td>
                </tr>
                <tr className="group even:bg-fg/5">
                  <th className="px-4 py-1 text-left border-2 border-b-0 w-28 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                    Ghosting
                  </th>
                  <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                    {details.ghosting ? 'Enabled' : 'Disabled'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {(details.participants.length ?? 0) > 0 && (
            <div>
              <h6 className="uppercase fugaz">Participants</h6>
              <AnimatePresence mode="wait">
                {details && (
                  <motion.div
                    key={details.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.5, transition: { duration: 0.1, ease: 'easeIn' } }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <table className="w-full border-separate table-fixed border-spacing-0">
                      <tbody>
                        {details.participants.map(({ id, name }) => (
                          <tr key={id} className="group even:bg-fg/5">
                            <th className="w-12 px-4 py-1 text-left border-2 border-b-0 border-fg/20 group-last:border-b-2 group-first:rounded-tl group-last:rounded-bl">
                              {id}
                            </th>
                            <td className="px-4 py-1 border-2 border-b-0 border-l-0 border-fg/20 group-last:border-b-2 group-first:rounded-tr group-last:rounded-br">
                              {name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {details.description && (
            <div>
              <h6 className="uppercase fugaz">Description</h6>
              <p>{details.description}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function displayRaceType(type?: RaceType) {
  switch (type) {
    case RaceType.Laps:
      return 'Laps';
    case RaceType.PointToPoint:
      return 'Point to point';
    default:
      return 'None';
  }
}
