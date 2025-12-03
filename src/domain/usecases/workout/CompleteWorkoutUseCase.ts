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

            // Calculate total volume (simplified for now, ideally aggregated from sets)
            // For now, we just update status and endTime
            const updateData = {
                status: WorkoutStatus.COMPLETED,
                endTime: new Date().toISOString(),
                notes: notes || session.notes,
            };

            await this.workoutSessionRepository.update(sessionId, updateData);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to complete workout'));
        }
    }
}
