import { IWorkoutSessionRepository } from '../../repositories';
import { Result } from '../../../core/utils/ResultWrapper';

export interface ExerciseStats {
    maxWeight: number;
    totalVolume: number;
    totalSets: number;
}

export class GetExerciseStatsUseCase {
    constructor(private workoutSessionRepository: IWorkoutSessionRepository) { }

    // This is a simplified version. In a real app, we'd likely have a dedicated stats repository 
    // or more complex queries. For now, we'll fetch recent history and aggregate.
    // Ideally, we should have a method in Repository to get all sets for an exercise across sessions.
    // I'll assume we might add a method to IWorkoutSessionRepository or IExerciseRepository later for this.
    // For this MVP step, I'll create a placeholder implementation that would need a new repository method.

    async execute(exerciseId: string): Promise<Result<ExerciseStats>> {
        try {
            const sets = await this.workoutSessionRepository.getSetsForExercise(exerciseId);

            let maxWeight = 0;
            let totalVolume = 0;
            let totalSets = 0;

            for (const set of sets) {
                if (set.weight > maxWeight) {
                    maxWeight = set.weight;
                }
                totalVolume += set.volume;
                totalSets++;
            }

            return Result.ok({
                maxWeight,
                totalVolume,
                totalSets
            });
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get exercise stats'));
        }
    }
}
