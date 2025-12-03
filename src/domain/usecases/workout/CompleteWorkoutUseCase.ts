import { IWorkoutSessionRepository } from '../../repositories';
import { WorkoutStatus } from '../../../core/types/enums';
import { Result } from '../../../core/utils/ResultWrapper';

export class CompleteWorkoutUseCase {
    constructor(private workoutSessionRepository: IWorkoutSessionRepository) { }

    async execute(sessionId: string, notes?: string): Promise<Result<void>> {
        try {
            const session = await this.workoutSessionRepository.findById(sessionId);
            if (!session) {
                return Result.fail(new Error('Workout session not found'));
            }

            // Calculate total volume
            let totalVolume = 0;
            const exerciseSessions = await this.workoutSessionRepository.getExerciseSessions(sessionId);

            for (const exerciseSession of exerciseSessions) {
                const sets = await this.workoutSessionRepository.getSetsForExerciseSession(exerciseSession.id);
                for (const set of sets) {
                    if (set.isCompleted) {
                        totalVolume += set.volume;
                    }
                }
            }

            const updateData = {
                status: WorkoutStatus.COMPLETED,
                endTime: new Date().toISOString(),
                notes: notes || session.notes,
                totalVolume: totalVolume
            };

            await this.workoutSessionRepository.update(sessionId, updateData);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to complete workout'));
        }
    }
}
