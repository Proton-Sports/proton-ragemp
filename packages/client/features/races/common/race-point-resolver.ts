import { RaceType } from '@repo/shared/race';
import { RacePointResolverInput } from './race-point-resolver-input';
import { RacePointResolverOutput } from './race-point-resolver-output';

export interface IRacePointResolver {
    readonly supportedRaceType: RaceType;
    resolve(input: RacePointResolverInput): RacePointResolverOutput;
}
