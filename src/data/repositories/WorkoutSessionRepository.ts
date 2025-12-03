import { BaseRepository } from './BaseRepository';
import { IWorkoutSessionRepository } from '../../domain/repositories';
import { WorkoutSession, ExerciseSession, WorkoutSet } from '../../domain/entities';

export class WorkoutSessionRepository extends BaseRepository<WorkoutSession> implements IWorkoutSessionRepository {
    protected tableName = 'WorkoutSession';

    async getHistory(limit: number = 20, offset: number = 0): Promise<WorkoutSession[]> {
        const result = await this.execute(`SELECT * FROM ${this.tableName} ORDER BY date DESC LIMIT ? OFFSET ?`, [limit, offset]);
        return result.rows?._array || [];
    }

    async createExerciseSession(session: ExerciseSession): Promise<void> {
        const keys = Object.keys(session);
        const values = Object.values(session);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        await this.execute(`INSERT INTO ExerciseSession (${columns}) VALUES (${placeholders})`, values);
    }

    async getExerciseSessions(workoutSessionId: string): Promise<ExerciseSession[]> {
        const result = await this.execute(`SELECT * FROM ExerciseSession WHERE workoutSessionId = ? ORDER BY sequenceOrder ASC`, [workoutSessionId]);
        return result.rows?._array || [];
    }

    async createSet(set: WorkoutSet): Promise<void> {
        const keys = Object.keys(set);
        const values = Object.values(set);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        await this.execute(`INSERT INTO WorkoutSet (${columns}) VALUES (${placeholders})`, values);
    }

    async getSetsForExerciseSession(exerciseSessionId: string): Promise<WorkoutSet[]> {
        const result = await this.execute(`SELECT * FROM WorkoutSet WHERE exerciseSessionId = ? ORDER BY setNumber ASC`, [exerciseSessionId]);
        return result.rows?._array || [];
    }

    async getSetsForExercise(exerciseId: string): Promise<WorkoutSet[]> {
        // Join WorkoutSet -> ExerciseSession -> TrainingDayExercise -> ExerciseTemplate (to match exerciseId)
        // Or more simply, if we have exerciseId in TrainingDayExercise
        const query = `
            SELECT ws.* 
            FROM WorkoutSet ws
            JOIN ExerciseSession es ON ws.exerciseSessionId = es.id
            JOIN TrainingDayExercise tde ON es.trainingDayExerciseId = tde.id
            WHERE tde.exerciseId = ?
            ORDER BY ws.createdAt DESC
        `;
        const result = await this.execute(query, [exerciseId]);
        return result.rows?._array || [];
    }
}
