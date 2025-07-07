import { createScript } from '@kernel/script';
import { users } from '@repo/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { RaceParticipant } from '../common/types';

export default createScript({
    name: 'race-reward',
    fn: ({ db, raceService, messenger }) => {
        const onParticipantFinished = async (participant: RaceParticipant) => {
            if (!participant.player.protonId) {
                return;
            }

            const race = raceService.tryGetRaceByParticipant(participant.player);
            if (!race) {
                return;
            }

            const total = race.participants.length;
            const finished = race.participants.filter((p) => p.finishTime !== 0).length;
            const totalMin = Math.min(total, 4);
            const splits = ((totalMin * (1 + totalMin)) >> 1) + Math.max(total - 4, 0);
            participant.prizePercent = (1 / splits) * (Math.max(Math.min(total, 4) - finished, 0) + 1);
            const money = Math.round(participant.prizePercent * race.prizePool);

            messenger.publish(participant.player, 'notification.send', {
                icon: 'CHAR_BANK_MAZE',
                title: 'Money rewards',
                secondaryTitle: 'Race completed',
                body: `You have received ${money}$ for being the ${
                    finished === 1 ? '1st' : finished === 2 ? '2nd' : finished === 3 ? '3rd' : `${finished}th`
                } racer to complete.`,
            });

            await db
                .update(users)
                .set({ money: sql`${users.money} + ${money}` })
                .where(eq(users.id, participant.player.protonId));
        };

        raceService.on('participantFinished', onParticipantFinished);
    },
});
