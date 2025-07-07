import { RaceType } from '@repo/shared';
import type { RacePointResolver, RacePointResolverInput, RacePointResolverOutput } from './common/types';

export class RacePointLapResolver implements RacePointResolver {
    public readonly supportedRaceType = RaceType.Laps;

    public resolve(input: RacePointResolverInput): RacePointResolverOutput {
        const output: RacePointResolverOutput = { lap: input.lap, index: input.index, finished: false };
        if (output.index === 0) {
            if (output.lap === input.totalLaps) {
                output.finished = true;
                return output;
            }
            ++output.lap;
        }
        output.index = (output.index + 1) % input.totalPoints;

        if (output.index !== 0 || output.lap !== input.totalLaps) {
            output.nextIndex = (output.index + 1) % input.totalPoints;
        }
        return output;
    }
}

export class RacePointRallyResolver implements RacePointResolver {
    public readonly supportedRaceType = RaceType.PointToPoint;

    public resolve(input: RacePointResolverInput): RacePointResolverOutput {
        const output: RacePointResolverOutput = { lap: input.lap, index: input.index, finished: false };

        if (output.index === input.totalPoints - 1) {
            output.finished = true;
            return output;
        }

        ++output.index;
        if (output.index !== input.totalPoints - 1) {
            output.nextIndex = output.index + 1;
        }
        return output;
    }
}
