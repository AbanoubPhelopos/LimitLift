import { IWorkoutSessionRepository } from '../../repositories';
import { WorkoutSet } from '../../entities';
import { generateId } from '../../../core/utils/IdGenerator';
import { Result } from '../../../core/utils/ResultWrapper';
import { ValidationService } from '../../../infrastructure/services/ValidationService';

export class LogSetUseCase {
    constructor(private workoutSessionRepository: IWorkoutSessionRepository) { }

    async execute(
        exerciseSessionId: string,
        setNumber: number,
        weight: number,
        reps: number,
        rpe?: number,
        isWarmup: boolean = false
    ): Promise<Result<WorkoutSet>> {
        const weightValidation = ValidationService.validateNonNegativeNumber(weight, 'Weight');
        if (!weightValidation.success) return Result.fail(new Error(weightValidation.error));

        const repsValidation = ValidationService.validatePositiveNumber(reps, 'Reps');
        if (!repsValidation.success) return Result.fail(new Error(repsValidation.error));

        try {
            const newSet: WorkoutSet = {
                id: generateId(),
                exerciseSessionId,
                setNumber,
                weight,
                reps,
                volume: weight * reps,
                isCompleted: true,
                isWarmup, // Added usage
                createdAt: new Date().toISOString(),
            };

            await this.workoutSessionRepository.createSet(newSet);
            return Result.ok(newSet);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to log set'));
        }
    }
}
