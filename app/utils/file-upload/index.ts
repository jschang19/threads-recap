/**
 * File upload utilities for Threads data export
 */

// Encoding fix
export { fixMojibake } from './mojibake';

// Folder validation
export {
  isValidThreadsFolderName,
  extractFolderName,
} from './folder-validation';

// File selection
export {
  isFileSystemAccessSupported,
  selectFolderWithAPI,
  selectFolderWithInput,
  processFileSystemEntry,
} from './file-selection';

// File validation
export {
  validateRequiredFiles,
  type FileValidationOutput,
} from './file-validation';

// JSON parsing
export { parseJsonFile } from './parse-json';

// Error result creators
export {
  createCancelledResult,
  createErrorResult,
  createLimitErrorResult,
} from './create-errors';
