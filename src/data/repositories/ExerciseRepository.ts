import { BaseRepository } from './BaseRepository';
import { IExerciseRepository } from '../../domain/repositories';
import { ExerciseTemplate, ExerciseVariation, VariationRotationTracker } from '../../domain/entities';

export class ExerciseRepository extends BaseRepository<ExerciseTemplate> implements IExerciseRepository {
    protected tableName = 'ExerciseTemplate';

    async createTemplate(template: ExerciseTemplate): Promise<void> {
        return this.create(template);
    }

    async findAllTemplates(): Promise<ExerciseTemplate[]> {
        return this.findAll();
    }

    async createVariation(variation: ExerciseVariation): Promise<void> {
        const keys = Object.keys(variation);
        const values = Object.values(variation);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        await this.execute(`INSERT INTO ExerciseVariation (${columns}) VALUES (${placeholders})`, values);
    }

    async getVariationsForExercise(exerciseId: string): Promise<ExerciseVariation[]> {
        const result = await this.execute(`SELECT * FROM ExerciseVariation WHERE exerciseId = ? ORDER BY sequenceNumber ASC`, [exerciseId]);
        return result.rows?._array || [];
    }

    async getRotationTracker(trainingDayExerciseId: string): Promise<VariationRotationTracker | null> {
        const result = await this.execute(`SELECT * FROM VariationRotationTracker WHERE trainingDayExerciseId = ?`, [trainingDayExerciseId]);
        const rows = result.rows?._array;
        return rows && rows.length > 0 ? rows[0] : null;
    }

    async createRotationTracker(tracker: VariationRotationTracker): Promise<void> {
        const keys = Object.keys(tracker);
        const values = Object.values(tracker);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        await this.execute(`INSERT INTO VariationRotationTracker (${columns}) VALUES (${placeholders})`, values);
    }

    async updateRotationTracker(id: string, tracker: Partial<VariationRotationTracker>): Promise<void> {
        const keys = Object.keys(tracker);
        const values = Object.values(tracker);
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        await this.execute(`UPDATE VariationRotationTracker SET ${setClause} WHERE id = ?`, [...values, id]);
    }
}
