import { createScript } from '@kernel/script';
import { users } from '@repo/db/schema';
import { inArray, sql } from 'drizzle-orm';

interface NotificationDto {
    icon: string;
    title: string;
    secondaryTitle: string;
    body: string;
}

export default createScript({
    name: 'online-reward',
    fn: ({ logger, messenger, db }) => {
        // Map to track player minutes
        const playerMinutes = new Map<PlayerMp, number>();
        let intervalId: NodeJS.Timeout | null = null;

        // Start the reward timer
        intervalId = setInterval(() => {
            timerTickAsync();
        }, 60000); // 1 minute interval

        // Clean up function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            playerMinutes.clear();
        };

        async function timerTickAsync(): Promise<void> {
            const rewardingPlayers: PlayerMp[] = [];

            // Process all players
            for (const player of mp.players.toArray()) {
                // Skip players that don't have a valid protonId
                const protonId = player.getVariable('protonId');
                if (typeof protonId !== 'number' || protonId === -1) {
                    continue;
                }

                // Update or initialize minutes counter
                let minutes = playerMinutes.get(player) || 0;
                minutes += 1;
                playerMinutes.set(player, minutes);

                // Check if player reached 30 minutes
                if (minutes >= 30) {
                    rewardingPlayers.push(player);
                    playerMinutes.set(player, 0); // Reset counter
                }
            }

            // No players to reward
            if (rewardingPlayers.length === 0) {
                return;
            }

            // Prepare notification
            const notification: NotificationDto = {
                icon: 'CHAR_BANK_MAZE',
                title: 'Money rewards',
                secondaryTitle: 'Online Rewards',
                body: "You've received 50$ for playing every 30 minutes.",
            };

            // Send notification to all rewarded players
            messenger.publish(rewardingPlayers, 'player.sendNotification', notification);

            // Update money in database
            try {
                const protonIds = rewardingPlayers.map((p) => p.getVariable('protonId') as number);

                // Update all matched users with a single query
                await db
                    .update(users)
                    .set({ money: sql`${users.money} + 50` })
                    .where(inArray(users.id, protonIds));

                logger.info(`Rewarded ${rewardingPlayers.length} players with $50 for playing time.`);
            } catch (error) {
                logger.error('Failed to update player money:', error);
            }
        }
    },
});
