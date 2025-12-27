import { FILE_SIZE_LIMIT, MAX_FILE_COUNT } from '~/constants';

// Error types for specific upload issues
export type UploadErrorType = 'file_too_large' | 'too_many_files' | 'validation_failed' | 'general';

export interface UploadError {
  type: UploadErrorType;
  message: string;
  details?: {
    currentSize?: number;
    maxSize?: number;
    currentCount?: number;
    maxCount?: number;
  };
}

/**
 * Validate file count and total size before processing
 * Returns null if validation passes, or an UploadError if it fails
 */
export function validateFileLimits(fileList: File[]): UploadError | null {
  // Check file count first (quick check)
  if (fileList.length > MAX_FILE_COUNT) {
    return {
      type: 'too_many_files',
      message: `資料夾包含太多檔案（${fileList.length} 個），超過上限 ${MAX_FILE_COUNT} 個`,
      details: {
        currentCount: fileList.length,
        maxCount: MAX_FILE_COUNT,
      },
    };
  }

  // Calculate total size
  const totalSize = fileList.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > FILE_SIZE_LIMIT) {
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
    const limitMB = (FILE_SIZE_LIMIT / (1024 * 1024)).toFixed(0);
    return {
      type: 'file_too_large',
      message: `資料夾總大小 ${sizeMB} MB 超過上限 ${limitMB} MB`,
      details: {
        currentSize: totalSize,
        maxSize: FILE_SIZE_LIMIT,
      },
    };
  }

  return null;
}

/**
 * Check if file count exceeds the limit
 * Useful for early termination during file processing
 */
export function isFileCountExceeded(count: number): boolean {
  return count > MAX_FILE_COUNT;
}

/**
 * Create an upload error for exceeded file count
 */
export function createFileCountError(count: number): UploadError {
  return {
    type: 'too_many_files',
    message: `資料夾包含太多檔案，超過上限 ${MAX_FILE_COUNT} 個`,
    details: {
      currentCount: count,
      maxCount: MAX_FILE_COUNT,
    },
  };
}
