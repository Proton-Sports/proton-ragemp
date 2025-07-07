import { createScript } from '@kernel/script';
import type { Race, RaceParticipant } from '../common/types';
import { RaceStatus } from '@repo/shared';
import { getVehicleModelDisplayName } from '~/kernel/utils';

export default createScript({
    name: 'race-countdown',
    fn: ({ db, raceService, messenger }) => {
        const countdownTimers = new Map<Race, NodeJS.Timeout>();

        const onParticipantJoined = async (race: Race, participant: RaceParticipant) => {
            // TODO: Get map details and owned vehicles
            // This will require access to map cache and player vehicle data
            // For now, we'll send a simplified event
            const player = participant.player;
            if (!player || race.status !== RaceStatus.Open) return;

            const mapName = 'Unknown Map'; // Placeholder
            const countdownSeconds = race.countdownSeconds;
            const vehicles = race.vehicleModels.map((a) => ({
                model: a,
                displayName: getVehicleModelDisplayName(a),
            }));
            const ownedVehicles = await db.query.playerVehicles.findMany({
                where: (pv, { and, eq, inArray }) =>
                    and(eq(pv.playerId, player.id), inArray(pv.model, race.vehicleModels)),
                columns: {
                    id: true,
                    model: true,
                },
            });
            const participants = race.participants.map((a) => ({
                id: a.player.id,
                name: a.player.name ?? 'Unknown',
                isHost: race.host === a.player,
                isReady: a.ready,
                vehicle: {
                    id: a.playerVehicleId,
                    model: a.vehicleModel,
                },
            }));

            messenger.publish(player, 'race-countdown.mount', {
                id: player.id,
                mapName,
                durationSeconds: countdownSeconds,
                vehicles,
                ownedVehicles,
                participants,
                maxParticipants: race.maxParticipants,
            });

            const otherParticipants = race.participants.filter((a) => a.player !== player).map((a) => a.player);
            messenger.publish(otherParticipants, 'race-countdown.participants.add', {
                id: player.id,
                name: player.name,
                isHost: false,
                isReady: false,
                vehicle: {
                    id: participant.playerVehicleId,
                    model: String(participant.vehicleModel),
                },
            });
        };

        const onParticipantLeft = (race: Race, player: PlayerMp) => {
            messenger.publish(player, 'race-countdown.unmount');
            messenger.publish(
                race.participants.map((a) => a.player),
                'race-countdown.participants.remove',
                player.id,
            );
        };

        const onRacePrepared = (race: Race) => {
            if (race.participants.length === 0) {
                raceService.removeRace(race);
                return;
            }
            messenger.publish(
                race.participants.map((a) => a.player),
                'race-countdown.unmount',
            );
        };

        const onPlayerReadyChange = (player: PlayerMp, ready: boolean) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const participant = race.participants.find((a) => a.player === player);
            if (!participant) return;

            const otherParticipants = race.participants.filter((a) => a.player !== player).map((a) => a.player);
            messenger.publish(otherParticipants, 'race-countdown.ready.change', player.id, ready);

            participant.ready = ready;

            const readyCount = race.participants.filter((p) => p.ready).length;
            const thresholdCount = race.participants.length * 0.75;

            if (ready && readyCount >= thresholdCount) {
                if (race.lobbyCountingDown) return;
                race.lobbyCountingDown = true;
                const participants = race.participants.map((a) => a.player);
                messenger.publish(participants, 'race-countdown.countdown:set', race.countdownSeconds);

                const timer = setTimeout(() => {
                    onCountdownFinished(race);
                }, race.countdownSeconds * 1000);
                countdownTimers.set(race, timer);
            } else if (!ready && readyCount < thresholdCount) {
                if (!race.lobbyCountingDown) return;
                const timer = countdownTimers.get(race);
                if (timer) {
                    clearTimeout(timer);
                    countdownTimers.delete(race);
                }
                race.lobbyCountingDown = false;
                messenger.publish(
                    race.participants.map((a) => a.player),
                    'race-countdown.countdown:set',
                    0,
                );
            }
        };

        const onCountdownFinished = (race: Race) => {
            const timer = countdownTimers.get(race);
            if (timer) {
                clearTimeout(timer);
                countdownTimers.delete(race);
            }

            race.participants
                .filter((a) => !a.ready)
                .forEach((a) => {
                    raceService.removeParticipant(a);
                });

            raceService.prepare(race);
        };

        const onRaceDestroyed = (race: Race) => {
            const timer = countdownTimers.get(race);
            if (timer) {
                clearTimeout(timer);
                countdownTimers.delete(race);
            }
        };

        const onPlayerVehicleChange = (
            player: PlayerMp,
            vehicle: { id: number; model: number; displayName: string },
        ) => {
            const race = raceService.tryGetRaceByParticipant(player);
            if (!race) return;

            const participant = race.participants.find((a) => a.player === player);
            if (!participant) return;

            // TODO: Validate vehicle model
            participant.playerVehicleId = vehicle.id;
            participant.vehicleModel = vehicle.model;

            const otherParticipants = race.participants.filter((a) => a.player !== player).map((a) => a.player);
            messenger.publish(otherParticipants, 'race-countdown.vehicle.change', player.id, vehicle);
        };

        // Register events
        // These would be registered with the raceService, which is not fully defined here
        raceService.on('participantJoined', onParticipantJoined);
        raceService.on('participantLeft', onParticipantLeft);
        raceService.on('racePrepared', onRacePrepared);
        raceService.on('raceDestroyed', onRaceDestroyed);

        mp.events.add('race-countdown.ready.change', onPlayerReadyChange);
        mp.events.add('race-countdown.vehicle.change', onPlayerVehicleChange);
    },
});
