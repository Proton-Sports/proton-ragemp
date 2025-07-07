import type { RaceType } from '@repo/shared';
import { RacePointResolverInput } from './race-point-resolver-input';
import { RacePointResolverOutput } from './race-point-resolver-output';

export interface RacePointResolver {
    readonly supportedRaceType: RaceType;
    resolve(input: RacePointResolverInput): RacePointResolverOutput;
}
