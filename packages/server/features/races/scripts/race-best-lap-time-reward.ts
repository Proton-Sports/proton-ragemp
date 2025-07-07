import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';
import { users } from '@repo/db/schema';
import { eq, sql } from 'drizzle-orm';

export default createScript({
    name: 'race-best-lap-time-reward',
    fn: ({ raceService, db, messenger }) => {
        const onRaceFinished = async (race: Race) => {
            let bestLapMs = Number.MAX_VALUE;
            let bestLapParticipant: RaceParticipant | undefined;

            for (const participant of race.participants.filter((p) => p.finishTime !== 0)) {
                const pointLogsByLap = new Map<number, { time: number }[]>();
                for (const log of participant.pointLogs) {
                    if (!pointLogsByLap.has(log.lap)) {
                        pointLogsByLap.set(log.lap, []);
                    }
                    pointLogsByLap.get(log.lap)!.push(log);
                }

                for (const [lap, points] of pointLogsByLap.entries()) {
                    if (lap === 0 || points.length === 0) continue;

                    const startTime = lap === 1 || points.length === 1 ? race.startTime : points[0].time;
                    const endTime = points[points.length - 1].time;
                    const lapMs = endTime - startTime;

                    if (lapMs < bestLapMs) {
                        bestLapMs = lapMs;
                        bestLapParticipant = participant;
                    }
                }
            }

            if (!bestLapParticipant) return;

            const player = bestLapParticipant.player;
            if (!player) return;

            messenger.publish(player, 'notification.send', {
                icon: 'CHAR_BANK_MAZE',
                title: 'Money rewards',
                secondaryTitle: 'Best lap time',
                body: 'You have received 100$ for making best lap time in the race.',
            });

            await db
                .update(users)
                .set({
                    money: sql`${users.money} + 100`,
                })
                .where(eq(users.id, player.id));
        };

        raceService.on('raceFinished', onRaceFinished);
    },
});
