import { RaceStatus } from '@repo/shared';
import { EventEmitter } from 'events';
import type { Race, RaceParticipant, RaceService, RaceServiceEvents } from './common/types';

class RageMpRaceService implements RaceService {
    #races: Race[] = [];
    #playerRace = new Map<PlayerMp, Race>();
    #emitter = new EventEmitter();

    public get races(): Race[] {
        return this.#races;
    }

    public on<K extends keyof RaceServiceEvents>(eventName: K, listener: RaceServiceEvents[K]): () => void {
        this.#emitter.on(eventName, listener);
        return () => {
            this.#emitter.off(eventName, listener);
        };
    }

    public addRace(race: Race): void {
        this.#races.push(race);
        this.#emitter.emit('raceCreated', race);
    }

    public removeRace(race: Race): boolean {
        const index = this.#races.indexOf(race);
        if (index === -1) {
            return false;
        }
        this.#races.splice(index, 1);
        return true;
    }

    public destroyRace(race: Race): boolean {
        const ret = this.removeRace(race);
        const cloned = [...race.participants];
        race.participants = [];
        for (const participant of cloned) {
            this.#playerRace.delete(participant.player);
            participant.vehicle?.destroy();
            this.#emitter.emit('participantLeft', race, participant.player);
        }
        this.#emitter.emit('raceDestroyed', race);
        return ret;
    }

    public tryGetRaceByParticipant(participant: PlayerMp): Race | undefined {
        return this.#playerRace.get(participant);
    }

    public addParticipant(raceId: number, participant: RaceParticipant): boolean {
        const race = this.#races.find((x) => x.id === raceId);
        if (!race) {
            return false;
        }

        race.participants.push(participant);
        this.#playerRace.set(participant.player, race);
        this.#emitter.emit('participantJoined', race, participant);

        return true;
    }

    public removeParticipant(participant: RaceParticipant): boolean {
        const race = this.#playerRace.get(participant.player);
        if (!race) {
            return false;
        }

        this.#playerRace.delete(participant.player);
        const index = race.participants.indexOf(participant);
        if (index === -1) {
            return false;
        }
        race.participants.splice(index, 1);
        participant.vehicle?.destroy();
        this.#emitter.emit('participantLeft', race, participant.player);

        return true;
    }

    public removeParticipantByPlayer(player: PlayerMp): boolean {
        const race = this.#playerRace.get(player);
        if (!race) {
            return false;
        }

        this.#playerRace.delete(player);
        const index = race.participants.findIndex((p) => p.player === player);
        if (index === -1) {
            return false;
        }
        const participant = race.participants[index];
        race.participants.splice(index, 1);
        participant.vehicle?.destroy();
        this.#emitter.emit('participantLeft', race, player);

        return true;
    }

    public prepare(race: Race): void {
        race.status = RaceStatus.Preparing;
        this.#emitter.emit('racePrepared', race);
    }

    public start(race: Race): void {
        race.status = RaceStatus.Started;
        this.#emitter.emit('raceStarted', race);
    }

    public finish(participantOrRace: RaceParticipant | Race): void {
        if ('player' in participantOrRace) {
            this.#emitter.emit('participantFinished', participantOrRace);
        } else {
            this.#emitter.emit('raceFinished', participantOrRace);
        }
    }

    public countdown(race: Race, countDelay: number): void {
        this.#emitter.emit('raceCountdown', race, countDelay);
    }
}

export const createRageMpRaceService = () => {
    return new RageMpRaceService();
};
