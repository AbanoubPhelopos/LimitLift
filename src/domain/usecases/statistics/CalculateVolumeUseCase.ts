import { WorkoutSet } from '../../entities';
import { Result } from '../../../core/utils/ResultWrapper';

export class CalculateVolumeUseCase {
    execute(sets: WorkoutSet[]): Result<number> {
        try {
            const totalVolume = sets.reduce((acc, set) => {
                if (set.isCompleted) {
                    return acc + (set.volume || (set.weight * set.reps));
                }
                return acc;
            }, 0);
            return Result.ok(totalVolume);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to calculate volume'));
        }
    }
}
