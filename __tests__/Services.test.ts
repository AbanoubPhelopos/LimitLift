import { GetExerciseStatsUseCase } from '../src/domain/usecases/statistics/GetExerciseStatsUseCase';
import { CompleteWorkoutUseCase } from '../src/domain/usecases/workout/CompleteWorkoutUseCase';
import { RotateExerciseVariationUseCase } from '../src/domain/usecases/workout/RotateExerciseVariationUseCase';
import { IWorkoutSessionRepository, IExerciseRepository } from '../src/domain/repositories';
import { WorkoutStatus } from '../src/core/types/enums';

// Mock Repositories
const mockWorkoutSessionRepository = {
    getSetsForExercise: jest.fn(),
    getExerciseSessions: jest.fn(),
    getSetsForExerciseSession: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
} as unknown as IWorkoutSessionRepository;

const mockExerciseRepository = {
    getRotationTracker: jest.fn(),
    getVariationsForExercise: jest.fn(),
    updateRotationTracker: jest.fn(),
} as unknown as IExerciseRepository;

describe('LimitLift Services', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GetExerciseStatsUseCase', () => {
        it('should calculate stats correctly', async () => {
            const useCase = new GetExerciseStatsUseCase(mockWorkoutSessionRepository);
            const mockSets = [
                { weight: 100, volume: 1000, isCompleted: true },
                { weight: 120, volume: 1200, isCompleted: true },
                { weight: 110, volume: 1100, isCompleted: true },
            ];
            (mockWorkoutSessionRepository.getSetsForExercise as jest.Mock).mockResolvedValue(mockSets);

            const result = await useCase.execute('ex-1');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual({
                    maxWeight: 120,
                    totalVolume: 3300,
                    totalSets: 3
                });
            }
        });
    });

    describe('CompleteWorkoutUseCase', () => {
        it('should calculate total volume and complete workout', async () => {
            const useCase = new CompleteWorkoutUseCase(mockWorkoutSessionRepository);
            const sessionId = 'session-1';

            (mockWorkoutSessionRepository.findById as jest.Mock).mockResolvedValue({ id: sessionId, notes: 'Old notes' });
            (mockWorkoutSessionRepository.getExerciseSessions as jest.Mock).mockResolvedValue([{ id: 'es-1' }, { id: 'es-2' }]);

            (mockWorkoutSessionRepository.getSetsForExerciseSession as jest.Mock)
                .mockImplementation((id) => {
                    if (id === 'es-1') return Promise.resolve([{ volume: 100, isCompleted: true }, { volume: 50, isCompleted: false }]); // 100 valid
                    if (id === 'es-2') return Promise.resolve([{ volume: 200, isCompleted: true }]); // 200 valid
                    return Promise.resolve([]);
                });

            const result = await useCase.execute(sessionId, 'Good workout');

            expect(result.success).toBe(true);
            expect(mockWorkoutSessionRepository.update).toHaveBeenCalledWith(sessionId, expect.objectContaining({
                status: WorkoutStatus.COMPLETED,
                notes: 'Good workout',
                totalVolume: 300 // 100 + 200
            }));
        });
    });

    describe('RotateExerciseVariationUseCase', () => {
        it('should rotate to next variation', async () => {
            const useCase = new RotateExerciseVariationUseCase(mockExerciseRepository);
            const tracker = { id: 't-1', currentVariationId: 'v-A', rotationCycle: 1 };
            const variations = [
                { id: 'v-A', sequenceNumber: 1 },
                { id: 'v-B', sequenceNumber: 2 },
                { id: 'v-C', sequenceNumber: 3 }
            ];

            (mockExerciseRepository.getRotationTracker as jest.Mock).mockResolvedValue(tracker);
            (mockExerciseRepository.getVariationsForExercise as jest.Mock).mockResolvedValue(variations);

            const result = await useCase.execute('tde-1', 'ex-1');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.currentVariationId).toBe('v-B');
                expect(mockExerciseRepository.updateRotationTracker).toHaveBeenCalledWith('t-1', expect.objectContaining({
                    currentVariationId: 'v-B',
                    lastUsedVariationId: 'v-A'
                }));
            }
        });

        it('should loop back to first variation', async () => {
            const useCase = new RotateExerciseVariationUseCase(mockExerciseRepository);
            const tracker = { id: 't-1', currentVariationId: 'v-C', rotationCycle: 1 };
            const variations = [
                { id: 'v-A', sequenceNumber: 1 },
                { id: 'v-B', sequenceNumber: 2 },
                { id: 'v-C', sequenceNumber: 3 }
            ];

            (mockExerciseRepository.getRotationTracker as jest.Mock).mockResolvedValue(tracker);
            (mockExerciseRepository.getVariationsForExercise as jest.Mock).mockResolvedValue(variations);

            const result = await useCase.execute('tde-1', 'ex-1');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.currentVariationId).toBe('v-A');
                expect(result.data.rotationCycle).toBe(2);
            }
        });
    });
});
