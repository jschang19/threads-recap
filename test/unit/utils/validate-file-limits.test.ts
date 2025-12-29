import { describe, it, expect } from 'vitest';
import {
  validateFileLimits,
  isFileCountExceeded,
  createFileCountError,
} from '~/utils/validate-file-limits';
import { FILE_SIZE_LIMIT, MAX_FILE_COUNT } from '~/constants';

describe('validateFileLimits', () => {
  it('should return null for valid file list', () => {
    const files = [
      new File(['content'], 'file1.json', { type: 'application/json' }),
      new File(['content'], 'file2.json', { type: 'application/json' }),
    ];
    expect(validateFileLimits(files)).toBeNull();
  });

  it('should return error when file count exceeds limit', () => {
    const files = Array.from({ length: MAX_FILE_COUNT + 1 }, (_, i) =>
      new File(['content'], `file${i}.json`, { type: 'application/json' }),
    );
    const error = validateFileLimits(files);
    expect(error).not.toBeNull();
    expect(error?.type).toBe('too_many_files');
    expect(error?.details?.currentCount).toBe(MAX_FILE_COUNT + 1);
    expect(error?.details?.maxCount).toBe(MAX_FILE_COUNT);
  });

  it('should return error when total size exceeds limit', () => {
    // Create files that together exceed the size limit
    // Use smaller chunks to avoid memory issues
    const chunkSize = 10 * 1024 * 1024; // 10MB chunks
    const numChunks = Math.ceil(FILE_SIZE_LIMIT / chunkSize) + 1;
    const chunk = new Array(chunkSize).fill('a').join('');
    const files = Array.from({ length: numChunks }, (_, i) =>
      new File([chunk], `file${i}.json`, { type: 'application/json' }),
    );
    
    const error = validateFileLimits(files);
    expect(error).not.toBeNull();
    expect(error?.type).toBe('file_too_large');
    expect(error?.details?.currentSize).toBeGreaterThan(FILE_SIZE_LIMIT);
    expect(error?.details?.maxSize).toBe(FILE_SIZE_LIMIT);
  });

  it('should handle empty file list', () => {
    expect(validateFileLimits([])).toBeNull();
  });

  it('should calculate total size correctly from multiple files', () => {
    // Create 3 smaller files to test total size calculation
    const content = new Array(1024 * 1024).fill('a').join(''); // ~1MB each
    const files = [
      new File([content], 'file1.json', { type: 'application/json' }),
      new File([content], 'file2.json', { type: 'application/json' }),
      new File([content], 'file3.json', { type: 'application/json' }),
    ];
    // Total ~3MB, well under the 150MB limit
    const error = validateFileLimits(files);
    expect(error).toBeNull();
  });
});

describe('isFileCountExceeded', () => {
  it('should return true when count exceeds limit', () => {
    expect(isFileCountExceeded(MAX_FILE_COUNT + 1)).toBe(true);
    expect(isFileCountExceeded(MAX_FILE_COUNT + 100)).toBe(true);
  });

  it('should return false when count is at or below limit', () => {
    expect(isFileCountExceeded(MAX_FILE_COUNT)).toBe(false);
    expect(isFileCountExceeded(MAX_FILE_COUNT - 1)).toBe(false);
    expect(isFileCountExceeded(0)).toBe(false);
  });
});

describe('createFileCountError', () => {
  it('should create error with correct structure', () => {
    const count = MAX_FILE_COUNT + 10;
    const error = createFileCountError(count);
    expect(error.type).toBe('too_many_files');
    expect(error.message).toContain(MAX_FILE_COUNT.toString());
    expect(error.details?.currentCount).toBe(count);
    expect(error.details?.maxCount).toBe(MAX_FILE_COUNT);
  });
});
