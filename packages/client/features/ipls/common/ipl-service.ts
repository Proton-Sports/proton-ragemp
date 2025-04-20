import { attempt, when, type Attempt } from '@repo/shared';
import type { TimeoutError } from '@repo/shared/models/error';

export interface IplService {
    isLoaded(name: string): boolean;
    loadAsync(name: string): Promise<Attempt<never, TimeoutError>>;
    unloadAsync(name: string): Promise<Attempt<never, TimeoutError>>;
}

export const createRageMpIplService = ()=> {
    return new RageMpIplService();
};

class RageMpIplService implements IplService {
    isLoaded(name: string) {
        return mp.game.streaming.isIplActive(name);
    }

    async loadAsync(name: string) {
        mp.game.streaming.requestIpl(name);

        if (mp.game.streaming.isIplActive(name)) {
            return attempt.ok(undefined as never);
        }

        return await when(() => mp.game.streaming.isIplActive(name));
    }

    async unloadAsync(name: string) {
        mp.game.streaming.requestIpl(name);

        if (!mp.game.streaming.isIplActive(name)) {
            return attempt.ok(undefined as never);
        }

        return when(() => !mp.game.streaming.isIplActive(name));
    }
}
