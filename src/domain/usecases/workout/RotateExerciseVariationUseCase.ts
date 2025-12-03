import { IExerciseRepository } from '../../repositories';
import { VariationRotationTracker } from '../../entities';
import { Result } from '../../../core/utils/ResultWrapper';

export class RotateExerciseVariationUseCase {
    constructor(private exerciseRepository: IExerciseRepository) { }

    async execute(trainingDayExerciseId: string, exerciseId: string): Promise<Result<VariationRotationTracker>> {
        try {
            // 1. Get current tracker
            let tracker = await this.exerciseRepository.getRotationTracker(trainingDayExerciseId);

            // 2. Get all variations for this exercise
            const variations = await this.exerciseRepository.getVariationsForExercise(exerciseId);

            if (variations.length === 0) {
                return Result.fail(new Error('No variations found for this exercise'));
            }

            if (!tracker) {
                // Initialize if not exists (default to first variation)
                // This logic might usually happen when adding exercise to day, but safe to have here.
                return Result.fail(new Error('Rotation tracker not found. Should be initialized when exercise added to day.'));
            }

            // 3. Find current index and next index
            const currentIndex = variations.findIndex(v => v.id === tracker!.currentVariationId);
            if (currentIndex === -1) {
                // Current variation might have been deleted, reset to 0
                const nextVariation = variations[0];
                await this.updateTracker(tracker, nextVariation.id);
                return Result.ok({ ...tracker, currentVariationId: nextVariation.id });
            }

            const nextIndex = (currentIndex + 1) % variations.length;
            const nextVariation = variations[nextIndex];

            // 4. Update tracker
            const updatedTracker = {
                ...tracker,
                lastUsedVariationId: tracker.currentVariationId,
                currentVariationId: nextVariation.id,
                lastRotatedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                rotationCycle: nextIndex === 0 ? tracker.rotationCycle + 1 : tracker.rotationCycle
            };

            await this.exerciseRepository.updateRotationTracker(tracker.id, {
                lastUsedVariationId: updatedTracker.lastUsedVariationId,
                currentVariationId: updatedTracker.currentVariationId,
                lastRotatedAt: updatedTracker.lastRotatedAt,
                updatedAt: updatedTracker.updatedAt,
                rotationCycle: updatedTracker.rotationCycle
            });

            return Result.ok(updatedTracker);

        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to rotate variation'));
        }
    }

    private async updateTracker(tracker: VariationRotationTracker, nextVariationId: string) {
        await this.exerciseRepository.updateRotationTracker(tracker.id, {
            currentVariationId: nextVariationId,
            updatedAt: new Date().toISOString()
        });
    }
}
