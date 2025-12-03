import { WorkoutSplit, TrainingDay, ExerciseTemplate, ExerciseVariation, VariationRotationTracker, WorkoutSession, ExerciseSession, WorkoutSet, TrainingDayExercise } from '../entities';

export interface IWorkoutSplitRepository {
    create(split: WorkoutSplit): Promise<void>;
    findAll(): Promise<WorkoutSplit[]>;
    findById(id: string): Promise<WorkoutSplit | null>;
    update(id: string, split: Partial<WorkoutSplit>): Promise<void>;
    delete(id: string): Promise<void>;
    getActiveSplit(): Promise<WorkoutSplit | null>;
}

export interface ITrainingDayRepository {
    create(day: TrainingDay): Promise<void>;
    findBySplitId(splitId: string): Promise<TrainingDay[]>;
    findById(id: string): Promise<TrainingDay | null>;
    update(id: string, day: Partial<TrainingDay>): Promise<void>;
    delete(id: string): Promise<void>;
    getExercisesForDay(dayId: string): Promise<TrainingDayExercise[]>;
}

export interface IExerciseRepository {
    createTemplate(template: ExerciseTemplate): Promise<void>;
    findAllTemplates(): Promise<ExerciseTemplate[]>;
    findById(id: string): Promise<ExerciseTemplate | null>;

    createVariation(variation: ExerciseVariation): Promise<void>;
    getVariationsForExercise(exerciseId: string): Promise<ExerciseVariation[]>;

    getRotationTracker(trainingDayExerciseId: string): Promise<VariationRotationTracker | null>;
    createRotationTracker(tracker: VariationRotationTracker): Promise<void>;
    updateRotationTracker(id: string, tracker: Partial<VariationRotationTracker>): Promise<void>;
}

export interface IWorkoutSessionRepository {
    create(session: WorkoutSession): Promise<void>;
    findById(id: string): Promise<WorkoutSession | null>;
    update(id: string, session: Partial<WorkoutSession>): Promise<void>;
    getHistory(limit?: number, offset?: number): Promise<WorkoutSession[]>;

    createExerciseSession(session: ExerciseSession): Promise<void>;
    getExerciseSessions(workoutSessionId: string): Promise<ExerciseSession[]>;

    createSet(set: WorkoutSet): Promise<void>;
    getSetsForExerciseSession(exerciseSessionId: string): Promise<WorkoutSet[]>;
}
