import { describe, it, expect } from 'vitest';
import { isValidThreadsFolderName, extractFolderName } from '~/utils/file-upload/folder-validation';

describe('isValidThreadsFolderName', () => {
  it('should accept folder names starting with "instagram-"', () => {
    expect(isValidThreadsFolderName('instagram-john_doe-2025')).toBe(true);
    expect(isValidThreadsFolderName('instagram-user123')).toBe(true);
    expect(isValidThreadsFolderName('instagram-')).toBe(true);
  });

  it('should accept "your_instagram_activity"', () => {
    expect(isValidThreadsFolderName('your_instagram_activity')).toBe(true);
  });

  it('should accept "threads"', () => {
    expect(isValidThreadsFolderName('threads')).toBe(true);
  });

  it('should reject invalid folder names', () => {
    expect(isValidThreadsFolderName('random_folder')).toBe(false);
    expect(isValidThreadsFolderName('my-instagram')).toBe(false);
    expect(isValidThreadsFolderName('thread')).toBe(false);
    expect(isValidThreadsFolderName('instagram')).toBe(false);
  });

  it('should reject empty strings', () => {
    expect(isValidThreadsFolderName('')).toBe(false);
  });
});

describe('extractFolderName', () => {
  it('should extract folder name from webkitRelativePath', () => {
    const files = [
      Object.assign(new File([], 'test.json'), {
        webkitRelativePath: 'instagram-user/threads/test.json',
      }),
    ];
    expect(extractFolderName(files)).toBe('instagram-user');
  });

  it('should return the root folder from multiple files', () => {
    const files = [
      Object.assign(new File([], 'file1.json'), {
        webkitRelativePath: 'my-folder/subfolder/file1.json',
      }),
      Object.assign(new File([], 'file2.json'), {
        webkitRelativePath: 'my-folder/file2.json',
      }),
    ];
    expect(extractFolderName(files)).toBe('my-folder');
  });

  it('should return undefined if no webkitRelativePath', () => {
    const files = [new File([], 'test.json')];
    expect(extractFolderName(files)).toBeUndefined();
  });

  it('should return undefined for empty file list', () => {
    expect(extractFolderName([])).toBeUndefined();
  });

  it('should handle single-level paths', () => {
    const files = [
      Object.assign(new File([], 'test.json'), {
        webkitRelativePath: 'threads/test.json',
      }),
    ];
    expect(extractFolderName(files)).toBe('threads');
  });
});
