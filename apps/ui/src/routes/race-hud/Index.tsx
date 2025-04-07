import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { formatRelativeTimeParts } from '../../lib/utils/format';

type Data = {
  localId: number;
  maxLaps: number;
  participants: Participant[];
  startTime: number;
};

type TickData = {
  participants: Participant[];
};

type Participant = {
  id: number;
  name: string;
  distance: number;
  lap: number;
  speedPerHour: number;
  partialDistance: number;
};

type Status = 'running' | 'finished';

export default function Index() {
  const [localId, setLocalId] = useState<number>(3);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [maxLaps, setMaxLaps] = useState<number>(1);
  const [startTime, setStartTime] = useState<number>(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>('running');
  const lap = useMemo(() => participants.find((x) => x.id === localId)?.lap ?? 1, [localId, participants]);

  useEffect(() => {
    function onGetData(data: Data) {
      setLocalId(data.localId ?? 1);
      setMaxLaps(data.maxLaps);
      setParticipants(data.participants);
      setStartTime(data.startTime);
    }

    function onTick(data: TickData) {
      setParticipants((p) =>
        p
          .map((a) => {
            if (a.id === 100) {
              return Object.assign(a, { distance: a.distance + (10 / 1000) * 128 });
            }
            for (let i = 0; i !== data.participants.length; ++i) {
              if (a.id === data.participants[i].id) {
                return Object.assign(a, data.participants.splice(i, 1)[0]);
              }
            }
            return a;
          })
          .sort((a, b) => b.distance + b.partialDistance - (a.distance + a.partialDistance))
      );
    }

    function onStartTime(startTime: number) {
      setStartTime(startTime);
    }

    function onLapTime(timestamp: number) {
      setLapTimes((v) => [...v, timestamp]);
    }

    function onStatus(status: Status) {
      setStatus(status);
    }

    alt.on('race-hud:getData', onGetData);
    alt.on('race-hud:tick', onTick);
    alt.on('race-hud:startTime', onStartTime);
    alt.on('race-hud:lapTime', onLapTime);
    alt.on('race-hud:status', onStatus);
    return () => {
      alt.off('race-hud:getData', onGetData);
      alt.off('race-hud:tick', onTick);
      alt.off('race-hud:startTime', onStartTime);
      alt.off('race-hud:lapTime', onLapTime);
      alt.off('race-hud:status', onStatus);
    };
  }, []);

  return (
    <>
      <Left localId={localId} participants={participants} />
      <Right lap={lap} maxLaps={maxLaps} startTime={startTime} lapTimes={lapTimes} status={status} />
    </>
  );
}

function Left({ localId, participants }: { localId: number; participants: Participant[] }) {
  const index = useMemo(() => participants.findIndex((x) => x.id === localId), [localId, participants]);
  if (index === -1) {
    return null;
  }
  const currentTotalDistance = participants[index].distance + participants[index].partialDistance;

  return (
    <div className="fixed left-4 top-4">
      <div className="flex items-center font-bold text-lg rounded-md">
        <div className="relative">
          <div className="absolute rounded-l-md inset-0 bg-bg/90" />
          <div className="bg-primary/90 px-4 py-2 -mr-2 rounded-l-md fugaz [clip-path:polygon(0_0,_100%_0,_75%_100%,_0%_100%)]">
            {index + 1}
          </div>
        </div>
        <span className="p-2 rounded-r-md bg-bg/90 uppercase fugaz">Position</span>
      </div>
      <ol className="mt-8 space-y-2">
        {participants.map(({ id, name, distance, partialDistance, speedPerHour }, i) => {
          speedPerHour ||= 1;
          const relativeSeconds = (currentTotalDistance - distance - partialDistance) / speedPerHour;
          const [sign, minutes, seconds, milliseconds] = formatRelativeTimeParts(relativeSeconds * 1000);
          return (
            <li key={id} className="flex w-full relative">
              <span
                className={clsx(
                  "w-8 px-2 py-1 text-right rounded-l-md font-['Chakra_Petch'] font-bold",
                  i === index ? 'bg-primary/90' : 'text-fg-3 bg-bg-3/90'
                )}
              >
                {i + 1}.
              </span>
              <div className="flex px-2 py-1 justify-between items-center bg-bg/90 w-full rounded-r-md min-w-60 font-['Chakra_Petch'] font-medium">
                <span className={clsx(i !== index && 'text-fg-3')}>{name}</span>
                {i !== index && (
                  <div className="text-center">
                    <span
                      className={clsx('inline-block w-4 font-black', sign === '-' ? 'text-red-500' : 'text-green-500')}
                    >
                      {sign}
                    </span>
                    {Array.from(minutes).map((digit, i) => (
                      <span key={i} className="inline-block w-[0.6rem]">
                        {digit}
                      </span>
                    ))}
                    <span className="inline-block w-1">:</span>
                    {Array.from(seconds).map((digit, i) => (
                      <span key={i} className="inline-block w-[0.6rem]">
                        {digit}
                      </span>
                    ))}
                    <span className="inline-block w-1">.</span>
                    {Array.from(milliseconds).map((digit, i) => (
                      <span key={i} className="inline-block w-[0.6rem]">
                        {digit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Right({
  lap,
  maxLaps,
  startTime,
  lapTimes,
  status,
}: {
  lap: number;
  maxLaps: number;
  startTime: number;
  lapTimes: number[];
  status: Status;
}) {
  const [relativeMs, setRelativeMs] = useState(0);
  const lapRelativeMs = useMemo(() => {
    const length = lapTimes.length;
    if (length === 0) return 0;
    return lapTimes[length - 1] - (lapTimes[length - 2] ?? startTime);
  }, [lapTimes, startTime]);
  const bestRelativeMs = useMemo(() => {
    if (lapTimes.length === 0) return 0;

    let best: number = Number.POSITIVE_INFINITY;
    let cur: number = 0;
    for (const [i, v] of lapTimes.entries()) {
      cur = v - (i === 0 ? startTime : lapTimes[i - 1]);
      if (cur < best) best = cur;
    }
    return best;
  }, [lapTimes, startTime]);

  useEffect(() => {
    if (status !== 'running' || startTime === 0) {
      return;
    }
    const interval = setInterval(() => {
      setRelativeMs(Date.now() - startTime);
    }, 60);
    return () => {
      clearInterval(interval);
    };
  }, [status, startTime, setRelativeMs]);

  return (
    <div className="fixed right-4 top-4 font-['Chakra_Petch']">
      <div className="flex items-center justify-end font-bold text-lg rounded-md">
        <div className="relative">
          <div className="absolute rounded-l-md inset-0 bg-bg/90" />
          <div className="bg-primary/90 p-2 pr-4 -mr-2 rounded-l-md [clip-path:polygon(0_0,_100%_0,_75%_100%,_0%_100%)] uppercase">
            Lap
          </div>
        </div>
        <span className="p-2 rounded-r-md bg-bg/90 uppercase">
          {lap}/{maxLaps}
        </span>
      </div>
      <div className="mt-8 space-y-2">
        <div className="flex w-full min-w-72">
          <span className="w-20 px-2 py-1 text-center rounded-l-md font-bold bg-primary/90 uppercase">Time</span>
          <RelativeTimeParts
            relativeMs={startTime <= 0 ? 0 : relativeMs}
            className="px-2 py-1 grow text-right bg-bg/90 rounded-r-md"
          />
        </div>
        <div className="flex w-full">
          <span className="w-20 px-2 py-1 text-center rounded-l-md font-bold bg-primary/90 uppercase">Lap</span>
          <RelativeTimeParts relativeMs={lapRelativeMs} className="px-2 py-1 grow text-right bg-bg/90 rounded-r-md" />
        </div>
        <div className="flex w-full">
          <span className="w-20 px-2 py-1 text-center rounded-l-md font-bold bg-primary/90 uppercase">Best</span>
          <RelativeTimeParts relativeMs={bestRelativeMs} className="px-2 py-1 grow text-right bg-bg/90 rounded-r-md" />
        </div>
      </div>
    </div>
  );
}

function RelativeTimeParts({ relativeMs, className }: { relativeMs: number; className?: string }) {
  const [_, minutes, seconds, milliseconds] = formatRelativeTimeParts(relativeMs);
  return (
    <div className={clsx('text-center font-medium', className)}>
      {Array.from(minutes).map((digit, i) => (
        <span key={i} className="inline-block w-[0.6rem]">
          {digit}
        </span>
      ))}
      <span className="inline-block w-1">:</span>
      {Array.from(seconds).map((digit, i) => (
        <span key={i} className="inline-block w-[0.6rem]">
          {digit}
        </span>
      ))}
      <span className="inline-block w-1">.</span>
      {Array.from(milliseconds).map((digit, i) => (
        <span key={i} className="inline-block w-[0.6rem]">
          {digit}
        </span>
      ))}
    </div>
  );
}
