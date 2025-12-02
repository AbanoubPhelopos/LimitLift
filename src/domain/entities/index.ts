import { DayType, MuscleGroup, Equipment, WorkoutStatus } from '../../core/types/enums';

export interface WorkoutSplit {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
}

export interface TrainingDay {
    id: string;
    splitId: string;
    name: string;
    dayType: DayType;
    dayOfWeek: number;
    targetMuscleGroups: MuscleGroup[];
    createdAt: string;
}

export interface ExerciseTemplate {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    equipment: Equipment;
    imageUrl?: string;
    description?: string;
    createdAt: string;
}

export interface TrainingDayExercise {
    id: string;
    trainingDayId: string;
    exerciseId: string;
    setCount: number;
    sequenceOrder: number;
    isActive: boolean;
    createdAt: string;
}

export interface ExerciseVariation {
    id: string;
    exerciseId: string;
    variationLabel: string;
    exerciseName: string;
    description?: string;
    imageUrl?: string;
    sequenceNumber: number;
    createdAt: string;
}

export interface VariationRotationTracker {
    id: string;
    trainingDayExerciseId: string;
    currentVariationId: string;
    lastUsedVariationId?: string;
    rotationCycle: number;
    lastRotatedAt?: string;
    updatedAt: string;
}

export interface WorkoutSession {
    id: string;
    trainingDayId: string;
    date: string;
    startTime: string;
    endTime?: string;
    status: WorkoutStatus;
    notes?: string;
    totalVolume?: number;
    createdAt: string;
}

export interface ExerciseSession {
    id: string;
    workoutSessionId: string;
    trainingDayExerciseId: string;
    currentVariationId: string;
    completedSetCount: number;
    sequenceOrder: number;
    notes?: string;
    createdAt: string;
}

export interface WorkoutSet {
    id: string;
    exerciseSessionId: string;
    setNumber: number;
    weight: number;
    reps: number;
    volume: number;
    isCompleted: boolean;
    notes?: string;
    createdAt: string;
}
