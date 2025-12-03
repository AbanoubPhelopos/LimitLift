import { BaseRepository } from './BaseRepository';
import { ITrainingDayRepository } from '../../domain/repositories';
import { TrainingDay, TrainingDayExercise } from '../../domain/entities';

export class TrainingDayRepository extends BaseRepository<TrainingDay> implements ITrainingDayRepository {
    protected tableName = 'TrainingDay';

    async findBySplitId(splitId: string): Promise<TrainingDay[]> {
        const result = await this.execute(`SELECT * FROM ${this.tableName} WHERE splitId = ? ORDER BY dayOfWeek ASC`, [splitId]);
        return result.rows?._array || [];
    }

    async getExercisesForDay(dayId: string): Promise<TrainingDayExercise[]> {
        const result = await this.execute(`SELECT * FROM TrainingDayExercise WHERE trainingDayId = ? ORDER BY sequenceOrder ASC`, [dayId]);
        return result.rows?._array || [];
    }
}
