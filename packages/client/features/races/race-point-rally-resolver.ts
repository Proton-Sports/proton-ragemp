import { RaceType } from '@repo/shared/race';
import type { IRacePointResolver } from './common/race-point-resolver';
import { RacePointResolverInput } from './common/race-point-resolver-input';
import { RacePointResolverOutput } from './common/race-point-resolver-output';

export class RacePointRallyResolver implements IRacePointResolver {
    public get supportedRaceType(): RaceType {
        return RaceType.PointToPoint;
    }

    public resolve(input: RacePointResolverInput): RacePointResolverOutput {
        const output = new RacePointResolverOutput();
        output.lap = input.lap;
        output.index = input.index;

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
