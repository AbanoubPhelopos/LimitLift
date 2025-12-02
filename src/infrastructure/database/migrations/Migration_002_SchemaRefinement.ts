import { Migration } from '../../../core/types/database';

export const Migration_002_SchemaRefinement: Migration = {
    name: '002_Schema_Refinement',
    up: async (db: any) => {
        await db.execute(`
      CREATE TABLE IF NOT EXISTS VariationRotationTracker (
        id TEXT PRIMARY KEY,
        trainingDayExerciseId TEXT NOT NULL,
        currentVariationId TEXT NOT NULL,
        lastUsedVariationId TEXT,
        rotationCycle INTEGER DEFAULT 1,
        lastRotatedAt TEXT,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (trainingDayExerciseId) REFERENCES TrainingDayExercise(id) ON DELETE CASCADE,
        FOREIGN KEY (currentVariationId) REFERENCES ExerciseVariation(id) ON DELETE CASCADE,
        FOREIGN KEY (lastUsedVariationId) REFERENCES ExerciseVariation(id) ON DELETE SET NULL
      );
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS ExerciseSession (
        id TEXT PRIMARY KEY,
        workoutSessionId TEXT NOT NULL,
        trainingDayExerciseId TEXT NOT NULL,
        currentVariationId TEXT NOT NULL,
        completedSetCount INTEGER DEFAULT 0,
        sequenceOrder INTEGER NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (workoutSessionId) REFERENCES WorkoutSession(id) ON DELETE CASCADE,
        FOREIGN KEY (trainingDayExerciseId) REFERENCES TrainingDayExercise(id) ON DELETE CASCADE,
        FOREIGN KEY (currentVariationId) REFERENCES ExerciseVariation(id) ON DELETE CASCADE
      );
    `);

        
        await db.execute(`
      CREATE TABLE IF NOT EXISTS WorkoutSet (
        id TEXT PRIMARY KEY,
        exerciseSessionId TEXT NOT NULL,
        setNumber INTEGER NOT NULL,
        weight REAL,
        reps INTEGER,
        volume REAL, -- weight * reps
        isCompleted INTEGER DEFAULT 0,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (exerciseSessionId) REFERENCES ExerciseSession(id) ON DELETE CASCADE
      );
    `);

        try {
            await db.execute('ALTER TABLE WorkoutSession ADD COLUMN totalVolume REAL DEFAULT 0;');
        } catch {  }
    },
    down: async (db: any) => {
        await db.execute('DROP TABLE IF EXISTS WorkoutSet');
        await db.execute('DROP TABLE IF EXISTS ExerciseSession');
        await db.execute('DROP TABLE IF EXISTS VariationRotationTracker');
    },
};
