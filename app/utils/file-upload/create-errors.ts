import type { FileValidationResult } from '~/types/threads';
import { ANALYZING_FILES } from '~/constants';

/**
 * Create a result for cancelled operations
 */
export function createCancelledResult(): FileValidationResult {
  return {
    isValid: false,
    missingFiles: [],
    foundFiles: [],
    errors: [],
  };
}

/**
 * Create an error result when exception occurs
 */
export function createErrorResult(errorMessage: string): FileValidationResult {
  const requiredFileNames = ANALYZING_FILES
    .filter(f => f.isRequired)
    .map(f => f.filename);

  return {
    isValid: false,
    missingFiles: requiredFileNames,
    foundFiles: [],
    errors: [errorMessage],
  };
}

/**
 * Create an error result for file limit violations
 */
export function createLimitErrorResult(message: string): FileValidationResult {
  return {
    isValid: false,
    missingFiles: [],
    foundFiles: [],
    errors: [message],
  };
}
