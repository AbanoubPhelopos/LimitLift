import { Migration } from '../../../core/types/database';

export const Migration_001_Initial: Migration = {
  name: '001_Initial_Schema',
  up: async (db: any) => {

    await db.execute(`
      CREATE TABLE IF NOT EXISTS WorkoutSplit (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        isActive INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS TrainingDay (
        id TEXT PRIMARY KEY,
        splitId TEXT NOT NULL,
        name TEXT NOT NULL,
        dayType TEXT NOT NULL,
        dayOfWeek INTEGER NOT NULL,
        targetMuscleGroups TEXT NOT NULL, -- JSON array
        createdAt TEXT NOT NULL,
        FOREIGN KEY (splitId) REFERENCES WorkoutSplit(id) ON DELETE CASCADE
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS ExerciseTemplate (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        muscleGroup TEXT NOT NULL,
        equipment TEXT,
        imageUrl TEXT,
        description TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS TrainingDayExercise (
        id TEXT PRIMARY KEY,
        trainingDayId TEXT NOT NULL,
        exerciseId TEXT NOT NULL,
        setCount INTEGER DEFAULT 3,
        sequenceOrder INTEGER NOT NULL,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (trainingDayId) REFERENCES TrainingDay(id) ON DELETE CASCADE,
        FOREIGN KEY (exerciseId) REFERENCES ExerciseTemplate(id) ON DELETE CASCADE
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS ExerciseVariation (
        id TEXT PRIMARY KEY,
        exerciseId TEXT NOT NULL,
        variationLabel TEXT NOT NULL, -- "A", "B", "C"
        exerciseName TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        sequenceNumber INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (exerciseId) REFERENCES ExerciseTemplate(id) ON DELETE CASCADE
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS WorkoutSession (
        id TEXT PRIMARY KEY,
        trainingDayId TEXT NOT NULL,
        date TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        status TEXT NOT NULL, -- "IN_PROGRESS", "COMPLETED", "CANCELLED"
        note TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (trainingDayId) REFERENCES TrainingDay(id) ON DELETE CASCADE
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS SetRecord (
        id TEXT PRIMARY KEY,
        workoutSessionId TEXT NOT NULL,
        exerciseId TEXT NOT NULL,
        setNumber INTEGER NOT NULL,
        weight REAL,
        reps INTEGER,
        rpe REAL,
        isWarmup INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (workoutSessionId) REFERENCES WorkoutSession(id) ON DELETE CASCADE,
        FOREIGN KEY (exerciseId) REFERENCES ExerciseTemplate(id) ON DELETE CASCADE
      );
    `);

  },
  down: async (db: any) => {
    await db.execute('DROP TABLE IF EXISTS SetRecord');
    await db.execute('DROP TABLE IF EXISTS WorkoutSession');
    await db.execute('DROP TABLE IF EXISTS ExerciseVariation');
    await db.execute('DROP TABLE IF EXISTS TrainingDayExercise');
    await db.execute('DROP TABLE IF EXISTS ExerciseTemplate');
    await db.execute('DROP TABLE IF EXISTS TrainingDay');
    await db.execute('DROP TABLE IF EXISTS WorkoutSplit');
  },
};
