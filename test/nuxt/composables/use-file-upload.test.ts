import { describe, it, expect, beforeEach } from 'vitest';
import { useFileUpload } from '~/composables/use-file-upload';

describe('useFileUpload', () => {
  beforeEach(() => {
    // Reset state before each test
    const { reset } = useFileUpload();
    reset();
  });

  it('should have initial state', () => {
    const {
      files,
      validationResult,
      isLoading,
      error,
      uploadError,
      uploadedFolderName,
      isValidFolderName,
    } = useFileUpload();

    expect(files.value).toEqual({});
    expect(validationResult.value).toBeNull();
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(uploadError.value).toBeNull();
    expect(uploadedFolderName.value).toBeNull();
    expect(isValidFolderName.value).toBe(true);
  });

  it('should reset state correctly', () => {
    const {
      files,
      validationResult,
      isLoading,
      error,
      uploadError,
      uploadedFolderName,
      isValidFolderName,
      reset,
    } = useFileUpload();

    // After reset
    reset();

    expect(files.value).toEqual({});
    expect(validationResult.value).toBeNull();
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(uploadError.value).toBeNull();
    expect(uploadedFolderName.value).toBeNull();
    expect(isValidFolderName.value).toBe(true);
  });

  it('should have parseAllFiles function', () => {
    const { parseAllFiles } = useFileUpload();
    
    expect(typeof parseAllFiles).toBe('function');
  });

  it('should expose isFileSystemAccessSupported computed', () => {
    const { isFileSystemAccessSupported } = useFileUpload();
    
    expect(typeof isFileSystemAccessSupported.value).toBe('boolean');
  });
});
