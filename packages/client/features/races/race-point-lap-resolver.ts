import { RaceType } from '@repo/shared';
import type { RacePointResolver } from './common/race-point-resolver';
import { RacePointResolverInput } from './common/race-point-resolver-input';
import { RacePointResolverOutput } from './common/race-point-resolver-output';

class RacePointLapResolver implements RacePointResolver {
    public get supportedRaceType(): RaceType {
        return RaceType.Laps;
    }

    public resolve(input: RacePointResolverInput): RacePointResolverOutput {
        const output = new RacePointResolverOutput();
        output.lap = input.lap;
        output.index = input.index;

        if (output.index === 0) {
            if (output.lap === input.totalLaps) {
                output.finished = true;
                return output;
            }
            ++output.lap;
        }

        output.index = (output.index + 1) % input.totalPoints;

        // Not the final point
        if (output.index !== 0 || output.lap !== input.totalLaps) {
            output.nextIndex = (output.index + 1) % input.totalPoints;
        }

        return output;
    }
}

export const createRacePointLapResolver = () => {
    return new RacePointLapResolver();
};
