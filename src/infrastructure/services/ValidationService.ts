import { Result } from '../../core/utils/ResultWrapper';

export class ValidationService {
    static validatePositiveNumber(value: number, fieldName: string): Result<void, string> {
        if (value <= 0) {
            return Result.fail(`${fieldName} must be greater than 0`);
        }
        return Result.ok(undefined);
    }

    static validateNonNegativeNumber(value: number, fieldName: string): Result<void, string> {
        if (value < 0) {
            return Result.fail(`${fieldName} must be non-negative`);
        }
        return Result.ok(undefined);
    }

    static validateString(value: string, fieldName: string): Result<void, string> {
        if (!value || value.trim().length === 0) {
            return Result.fail(`${fieldName} cannot be empty`);
        }
        return Result.ok(undefined);
    }
}
