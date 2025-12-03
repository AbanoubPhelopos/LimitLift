import { IWorkoutSessionRepository } from '../../repositories';
import { WorkoutSession } from '../../entities';
import { WorkoutStatus } from '../../../core/types/enums';
import { generateId } from '../../../core/utils/IdGenerator';
import { Result } from '../../../core/utils/ResultWrapper';

export class StartWorkoutUseCase {
    constructor(private workoutSessionRepository: IWorkoutSessionRepository) { }

    async execute(trainingDayId: string): Promise<Result<WorkoutSession>> {
        try {
            const newSession: WorkoutSession = {
                id: generateId(),
                trainingDayId,
                date: new Date().toISOString(),
                startTime: new Date().toISOString(),
                status: WorkoutStatus.STARTED,
                createdAt: new Date().toISOString(),
            };

            await this.workoutSessionRepository.create(newSession);
            return Result.ok(newSession);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to start workout'));
        }
    }
}
