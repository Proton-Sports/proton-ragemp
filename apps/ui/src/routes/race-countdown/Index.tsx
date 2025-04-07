import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { HiCheck, HiMiniChevronDown } from 'react-icons/hi2';
import Background from '../../lib/assets/images/race-main-menu-bg.webp';
import Button from '../../lib/components/Button';

interface Participant {
  id: number;
  name: string;
  isHost: boolean;
  isReady: boolean;
  vehicle: Vehicle;
}

interface Props {
  id: number;
  mapName: string;
  durationSeconds: number;
  maxParticipants: number;
  participants: Participant[];
  vehicles: string[];
  ownedVehicles: Vehicle[];
}

interface Data {
  id: number;
  mapName: string;
  durationSeconds: number;
  maxParticipants: number;
  participants: Participant[];
  vehicles: Vehicle[];
}

interface Vehicle {
  id?: number;
  model: string;
}

export default function Index(props: Props) {
  const [data, setData] = useState<Data>({
    ...props,
    vehicles: [
      ...props.vehicles.map((a) => ({
        model: a,
      })),
      ...props.ownedVehicles,
    ],
  });
  const [isReady, setIsReady] = useState(data.participants.find((a) => a.id === props.id)?.isReady ?? false);
  const [remainingSeconds, setRemainingSeconds] = useState(data.durationSeconds);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);
  const selected = useMemo(() => {
    const found = data.participants.find((a) => a.id === props.id);
    return found?.vehicle.id ? found.vehicle.id : found?.vehicle.model ?? null;
  }, [props.id, data.participants]);

  useEffect(() => {
    const addParticipant = (participant: Participant) => {
      setData((v) => ({ ...v, participants: v.participants ? [...v.participants, participant] : [participant] }));
    };

    const removeParticipant = (id: number) => {
      setData((v) => ({ ...v, participants: v.participants.filter((a) => a.id !== id) }));
    };

    const changeParticipantReady = (id: number, ready: boolean) => {
      setData((v) => ({ ...v, participants: v.participants.map((a) => (a.id === id ? { ...a, isReady: ready } : a)) }));
    };

    const setCountdown = (seconds: number) => {
      setCountdownSeconds(seconds);
      setRemainingSeconds(seconds);
    };

    const changeParticipantVehicle = (id: number, vehicle: Vehicle) => {
      setData((v) => ({
        ...v,
        participants: v.participants.map((a) => (a.id === id ? { ...a, vehicle } : a)),
      }));
    };

    alt.on('race-countdown.participants.add', addParticipant);
    alt.on('race-countdown.participants.remove', removeParticipant);
    alt.on('race-countdown.ready.change', changeParticipantReady);
    alt.on('race-countdown.countdown.set', setCountdown);
    alt.on('race-countdown.vehicle.change', changeParticipantVehicle);
    return () => {
      alt.off('race-countdown.participants.add', addParticipant);
      alt.off('race-countdown.participants.remove', removeParticipant);
      alt.off('race-countdown.ready.change', changeParticipantReady);
      alt.off('race-countdown.countdown.set', setCountdown);
      alt.off('race-countdown.vehicle.change', changeParticipantVehicle);
    };
  }, []);

  useEffect(() => {
    if (countdownSeconds === 0) return;
    let cleared = false;
    const interval = setInterval(() => {
      setRemainingSeconds((a) => {
        if (a === 0) {
          cleared = true;
          clearInterval(interval);
          return 0;
        }
        return a - 1;
      });
    }, 1000);
    return () => {
      if (!cleared) {
        clearInterval(interval);
      }
    };
  }, [countdownSeconds]);

  function handleReadyChange() {
    setIsReady(!isReady);
    setData((b) => ({
      ...b,
      participants: b.participants.map((c) => (c.id === b.id ? { ...c, isReady: !isReady } : c)),
    }));
    alt.emit('race-countdown.ready.change', !isReady);
  }

  return (
    <div className="fixed w-96 top-4 right-4 fugaz">
      <div className="space-y-4 overflow-hidden rounded-xl bg-bg-1 proton-container mb-4">
        <img src={Background} className="absolute inset-0 object-cover max-w-[400%] opacity-5 rounded-xl" />
        <div className="relative p-4 space-y-4 rounded-xl">
          {data && (
            <>
              <h2 className="text-center uppercase text-md">{data.mapName}</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex justify-center text-4xl font-bold leading-none text-center">
                    {countdownSeconds === 0
                      ? '--'
                      : Array.from(remainingSeconds.toString()).map((digit, i) => (
                          <span key={i} className="block w-8 text-center">
                            {digit}
                          </span>
                        ))}
                  </p>
                  <p className="text-xs text-center uppercase text-fg/40">remaining seconds</p>
                </div>
                <div>
                  <p className="flex justify-center text-4xl font-bold leading-none">
                    {Array.from(`${data.participants.length}/${data.maxParticipants}`).map((digit, i) => (
                      <span key={i} className="block w-8 text-center">
                        {digit}
                      </span>
                    ))}
                  </p>
                  <p className="text-xs text-center uppercase text-fg/40">Participants</p>
                </div>
              </div>
            </>
          )}
          <div className={clsx('grid gap-4', data.vehicles.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
            {data.vehicles.length > 1 ? (
              <Vehicles
                vehicles={data.vehicles}
                selected={selected}
                onSelectedChange={(selected) => {
                  const vehicle = (typeof selected === 'number'
                    ? data.vehicles.find((a) => a.id === selected)
                    : typeof selected === 'string'
                    ? data.vehicles.find((a) => a.id == null && a.model === selected)
                    : null) ?? { model: '' };
                  alt.emit('race-countdown.vehicle.change', vehicle);
                  setData((v) => ({
                    ...v,
                    participants: v.participants.map((a) =>
                      a.id === data.id
                        ? {
                            ...a,
                            vehicle,
                          }
                        : a
                    ),
                  }));
                }}
              />
            ) : (
              <Ready isReady={isReady} handleReadyChange={handleReadyChange} />
            )}
            {data.vehicles.length > 1 && <Ready isReady={isReady} handleReadyChange={handleReadyChange} />}
          </div>
        </div>
      </div>
      <Participants participants={data.participants} />
      <div className="text-right mt-4">
        Press <span className="px-2 leading-none uppercase rounded bg-bg-2 border border-bg-1">Q</span> to leave the
        race
      </div>
    </div>
  );
}

function Ready({ isReady, handleReadyChange }: { isReady: boolean; handleReadyChange: () => void }) {
  return (
    <Button variant={isReady ? 'primary' : 'base'} className="fugaz" onClick={handleReadyChange}>
      {isReady ? 'Ready' : 'Not ready'}
    </Button>
  );
}

function Vehicles({
  vehicles,
  selected,
  onSelectedChange,
}: {
  vehicles: Vehicle[];
  selected: number | string | null;
  onSelectedChange: (value: number | string | null) => void;
}) {
  const label = useMemo(() => {
    const found =
      typeof selected === 'number'
        ? vehicles.find((a) => a.id === selected)
        : typeof selected === 'string'
        ? vehicles.find((a) => a.id == null && a.model === selected)
        : null;
    return found?.model ?? selected;
  }, [selected, vehicles]);
  return (
    <Listbox value={selected} onChange={onSelectedChange}>
      <ListboxButton
        className={clsx(
          'c-input relative whitespace-nowrap overflow-hidden text-ellipsis text-left',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-fg-1/25'
        )}
      >
        {label}
        <HiMiniChevronDown
          className="group pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 size-5"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={clsx(
          'w-[var(--button-width)] fugaz p-1 mt-1 overflow-auto text-base rounded-md shadow-lg bg-bg max-h-60 border border-bg-border focus:outline-none',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {vehicles.map((vehicle) => (
          <ListboxOption
            key={vehicle.id ? vehicle.id : vehicle.model}
            value={vehicle.id ?? vehicle.model}
            className={({ selected }) =>
              clsx(
                'group flex items-center gap-2 relative cursor-default select-none py-2 pl-4 pr-4 rounded',
                selected ? 'bg-primary text-primary-fg' : 'data-[focus]:bg-primary/20'
              )
            }
          >
            <HiCheck className="invisible size-4 group-data-[selected]:visible stroke-2" />
            <span>{vehicle.model}</span>
            {vehicle.id ? <span>{vehicle.id}</span> : null}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

function Participants({ participants }: { participants: Participant[] }) {
  return (
    <ol className="space-y-2">
      {participants.map(({ id, name, isHost, isReady, vehicle }, i) => (
        <li
          key={id}
          className={clsx('flex items-center justify-between bg-bg-1 px-4 py-2 rounded', !isReady && 'text-fg-3')}
        >
          <div>
            <span className="inline-block w-8 text-fg-3">{i + 1}.</span>
            <span>{name}</span>
            {isHost && <span className="inline-block text-primary ml-2">Host</span>}
          </div>
          <div className="space-x-4">
            <span>{vehicle.model}</span>
            <span>{isReady ? 'Ready' : 'Joined'}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
