import { BaseRepository } from './BaseRepository';
import { IWorkoutSplitRepository } from '../../domain/repositories';
import { WorkoutSplit } from '../../domain/entities';

export class WorkoutSplitRepository extends BaseRepository<WorkoutSplit> implements IWorkoutSplitRepository {
    protected tableName = 'WorkoutSplit';

    async getActiveSplit(): Promise<WorkoutSplit | null> {
        const result = await this.execute(`SELECT * FROM ${this.tableName} WHERE isActive = 1`);
        const rows = result.rows?._array;
        return rows && rows.length > 0 ? rows[0] : null;
    }
}
