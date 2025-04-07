import { useState, type FormEvent, useEffect, type ChangeEvent, useMemo } from 'react';
import Button from '../../lib/components/Button';
import TextArea from '../../lib/components/TextArea';
import Input from '../../lib/components/Input';
import Radio from '../../lib/components/Radio';
import { Label, RadioGroup } from 'react-aria-components';
import Checkbox from '../../lib/components/Checkbox';
import { Radio as AriaRadio } from 'react-aria-components';
import clsx from 'clsx';
import Fuse from 'fuse.js';

type Map = { id: number; name: string };

export default function Host() {
  const [availableMaps, setAvailableMaps] = useState<Map[]>([]);
  const fuse = useMemo(
    () =>
      new Fuse(availableMaps, {
        keys: ['name'],
      }),
    [availableMaps]
  );
  const [query, setQuery] = useState('');
  const filteredMaps = useMemo(
    () => (query ? fuse.search(query).map(({ item }) => item) : availableMaps),
    [fuse, query, availableMaps]
  );
  const [maxRacers, setMaxRacers] = useState(1);

  useEffect(() => {
    function handleAvailableMaps(maps: Map[]) {
      setAvailableMaps(maps);
    }

    function handleGetMaxRacers(racers: number) {
      setMaxRacers(racers);
    }

    alt.emit('race-host:availableMaps');
    alt.on('race-host:availableMaps', handleAvailableMaps);
    alt.on('race-host:getMaxRacers', handleGetMaxRacers);
    return () => {
      alt.off('race-host:availableMaps', handleAvailableMaps);
      alt.off('race-host:getMaxRacers', handleGetMaxRacers);
    };
  }, []);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.currentTarget.value);
  }

  return (
    <div className="fixed p-8 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-bg-2 w-[56rem] rounded-xl">
      <form className="flex gap-8" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <h4 className="leading-none uppercase fugaz text-fg-1/40 w-max">Available races</h4>
          <Input type="text" placeholder="Search" value={query} onChange={handleSearchChange} />
          <RadioGroup aria-label="Races" name="mapId" onChange={handleMapChange} isRequired>
            <ul className="pr-2 space-y-2 overflow-auto max-h-96">
              {filteredMaps.map(({ id, name }) => (
                <AriaRadio key={id} value={id + ''} className="block">
                  {({ isSelected }) => (
                    <button
                      type="button"
                      className={clsx(
                        'w-full p-2 text-left rounded transition ease-in-out duration-75',
                        isSelected ? 'bg-fg text-bg' : 'bg-bg-1 hover:bg-bg-hover'
                      )}
                    >
                      {name}
                    </button>
                  )}
                </AriaRadio>
              ))}
            </ul>
          </RadioGroup>
        </div>

        <div>
          <h4 className="leading-none uppercase fugaz text-fg-1/40">Settings</h4>
          <div className="flex gap-8">
            <div className="gap-4 mt-2 space-y-4">
              <div>
                <label htmlFor="vehicleName">Vehicle name</label>
                <Input id="vehicleName" name="vehicleName" required />
              </div>
              <div>
                <label htmlFor="racers">Number of racers ({maxRacers} max)</label>
                <Input type="number" id="racers" name="racers" defaultValue={1} min={1} max={maxRacers} required />
              </div>
              <div>
                <label htmlFor="duration">Duration (seconds)</label>
                <Input type="number" id="duration" name="duration" defaultValue={120} min={0} required />
              </div>
              <div>
                <label htmlFor="countdown">Countdown time (seconds)</label>
                <Input type="number" id="countdown" name="countdown" defaultValue={60} min={0} required />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <TextArea
                  id="description"
                  name="description"
                  placeholder="Description..."
                  className="block resize-none bg-bg-1"
                  cols={50}
                  rows={4}
                />
              </div>
              <div className="space-x-2">
                <Checkbox id="ghosting" name="ghosting">
                  Enable phasing/ghosting (no collision)
                </Checkbox>
              </div>
            </div>
            <div className="mt-2 space-y-4">
              <RadioGroup name="type" defaultValue="byLaps" className="w-full space-y-2">
                {({ state: { selectedValue } }) => (
                  <>
                    <Label className="uppercase fugaz">Type</Label>
                    <div className="flex justify-between">
                      <Radio value="byLaps" className="w-max">
                        By laps
                      </Radio>
                      <Input
                        type="number"
                        defaultValue={1}
                        min={1}
                        name="laps"
                        className="w-32 ml-5"
                        disabled={selectedValue !== 'byLaps'}
                        required
                      />
                    </div>
                    <Radio value="pointToPoint">Point to point</Radio>
                  </>
                )}
              </RadioGroup>

              <RadioGroup name="time" defaultValue="earlyMorning" className="w-full space-y-2">
                {({ state }) => (
                  <>
                    <Label className="uppercase fugaz">Time</Label>
                    <Radio value="earlyMorning">Early morning</Radio>
                    <Radio value="midday">Mid-day</Radio>
                    <Radio value="night">Night</Radio>
                    <div className="flex justify-between">
                      <Radio value="exactTime" className="w-max">
                        Exact time
                      </Radio>
                      <Input
                        type="time"
                        name="exactTime"
                        className="w-32 ml-5"
                        disabled={state.selectedValue !== 'exactTime'}
                        defaultValue="08:00"
                        required
                      />
                    </div>
                  </>
                )}
              </RadioGroup>
              <RadioGroup name="weather" defaultValue="clear" className="w-full space-y-2">
                <Label className="uppercase fugaz">Weather</Label>
                <Radio value="rainy">Rainy</Radio>
                <Radio value="clear">Clear</Radio>
                <Radio value="foggy">Foggy</Radio>
              </RadioGroup>
            </div>
          </div>
          <Button variant="primary" className="block mt-8 ml-auto uppercase fugaz">
            Host race
          </Button>
        </div>
      </form>
    </div>
  );
}

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  const dto: Record<string, string | number | boolean> = {
    ...data,
    mapId: Number(data.mapId),
    racers: Number(data.racers),
    ghosting: data.ghosting === 'on',
    duration: Number(data.duration),
    countdown: Number(data.countdown),
  };
  if (dto.laps) {
    dto.laps = Number(dto.laps);
  }
  alt.emit('race-host:submit', dto);
}

function handleMapChange(mapId: string) {
  alt.emit('race-host:getMaxRacers', Number(mapId));
}
