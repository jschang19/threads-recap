import { describe, it, expect } from 'vitest';
import { validateRequiredFiles } from '~/utils/file-upload/file-validation';
import type { FileValidationOutput } from '~/utils/file-upload/file-validation';

describe('validateRequiredFiles', () => {
  it('should validate when all required files are present', () => {
    const files = [
      Object.assign(new File(['{}'], 'threads_and_replies.json'), {
        webkitRelativePath: 'instagram-user/threads/threads_and_replies.json',
      }),
      Object.assign(new File(['[]'], 'followers.json'), {
        webkitRelativePath: 'instagram-user/threads/followers.json',
      }),
      Object.assign(new File(['[]'], 'following.json'), {
        webkitRelativePath: 'instagram-user/threads/following.json',
      }),
      Object.assign(new File(['[]'], 'liked_threads.json'), {
        webkitRelativePath: 'instagram-user/threads/liked_threads.json',
      }),
    ];

    const output: FileValidationOutput = validateRequiredFiles(files);

    expect(output.result.isValid).toBe(true);
    expect(output.result.missingFiles).toHaveLength(0);
    expect(output.result.foundFiles).toContain('threads_and_replies.json');
    expect(output.result.foundFiles).toContain('followers.json');
    expect(output.result.foundFiles).toContain('following.json');
    expect(output.result.foundFiles).toContain('liked_threads.json');
    expect(output.files.threadsAndReplies).toBeDefined();
    expect(output.files.followers).toBeDefined();
    expect(output.files.following).toBeDefined();
    expect(output.files.likedThreads).toBeDefined();
  });

  it('should detect missing required files', () => {
    const files = [
      Object.assign(new File(['{}'], 'threads_and_replies.json'), {
        webkitRelativePath: 'instagram-user/threads/threads_and_replies.json',
      }),
      Object.assign(new File(['[]'], 'followers.json'), {
        webkitRelativePath: 'instagram-user/threads/followers.json',
      }),
    ];

    const output: FileValidationOutput = validateRequiredFiles(files);

    expect(output.result.isValid).toBe(false);
    expect(output.result.missingFiles.length).toBeGreaterThan(0);
    expect(output.result.missingFiles).toContain('following.json');
    expect(output.result.missingFiles).toContain('liked_threads.json');
    expect(output.result.errors.length).toBeGreaterThan(0);
  });

  it('should handle optional files (saved_threads.json)', () => {
    const files = [
      Object.assign(new File(['{}'], 'threads_and_replies.json'), {
        webkitRelativePath: 'instagram-user/threads/threads_and_replies.json',
      }),
      Object.assign(new File(['[]'], 'followers.json'), {
        webkitRelativePath: 'instagram-user/threads/followers.json',
      }),
      Object.assign(new File(['[]'], 'following.json'), {
        webkitRelativePath: 'instagram-user/threads/following.json',
      }),
      Object.assign(new File(['[]'], 'liked_threads.json'), {
        webkitRelativePath: 'instagram-user/threads/liked_threads.json',
      }),
      Object.assign(new File(['[]'], 'saved_threads.json'), {
        webkitRelativePath: 'instagram-user/threads/saved_threads.json',
      }),
    ];

    const output: FileValidationOutput = validateRequiredFiles(files);

    expect(output.result.isValid).toBe(true);
    expect(output.result.foundFiles).toContain('saved_threads.json');
    expect(output.files.savedThreads).toBeDefined();
  });

  it('should not fail validation when optional file is missing', () => {
    const files = [
      Object.assign(new File(['{}'], 'threads_and_replies.json'), {
        webkitRelativePath: 'instagram-user/threads/threads_and_replies.json',
      }),
      Object.assign(new File(['[]'], 'followers.json'), {
        webkitRelativePath: 'instagram-user/threads/followers.json',
      }),
      Object.assign(new File(['[]'], 'following.json'), {
        webkitRelativePath: 'instagram-user/threads/following.json',
      }),
      Object.assign(new File(['[]'], 'liked_threads.json'), {
        webkitRelativePath: 'instagram-user/threads/liked_threads.json',
      }),
    ];

    const output: FileValidationOutput = validateRequiredFiles(files);

    expect(output.result.isValid).toBe(true);
    expect(output.result.foundFiles).not.toContain('saved_threads.json');
    expect(output.files.savedThreads).toBeUndefined();
  });

  it('should extract folder name correctly', () => {
    const files = [
      Object.assign(new File(['{}'], 'threads_and_replies.json'), {
        webkitRelativePath: 'instagram-johndoe/threads/threads_and_replies.json',
      }),
      Object.assign(new File(['[]'], 'followers.json'), {
        webkitRelativePath: 'instagram-johndoe/threads/followers.json',
      }),
      Object.assign(new File(['[]'], 'following.json'), {
        webkitRelativePath: 'instagram-johndoe/threads/following.json',
      }),
      Object.assign(new File(['[]'], 'liked_threads.json'), {
        webkitRelativePath: 'instagram-johndoe/threads/liked_threads.json',
      }),
    ];

    const output: FileValidationOutput = validateRequiredFiles(files);

    expect(output.result.uploadedFolderName).toBe('instagram-johndoe');
    expect(output.result.isValidFolderName).toBe(true);
  });

  it('should handle flat structure (no subfolder)', () => {
    const files = [
      Object.assign(new File(['{}'], 'threads_and_replies.json'), {
        webkitRelativePath: 'instagram-user/threads_and_replies.json',
      }),
      Object.assign(new File(['[]'], 'followers.json'), {
        webkitRelativePath: 'instagram-user/followers.json',
      }),
      Object.assign(new File(['[]'], 'following.json'), {
        webkitRelativePath: 'instagram-user/following.json',
      }),
      Object.assign(new File(['[]'], 'liked_threads.json'), {
        webkitRelativePath: 'instagram-user/liked_threads.json',
      }),
    ];

    const output: FileValidationOutput = validateRequiredFiles(files);

    expect(output.result.isValid).toBe(true);
    expect(output.files.threadsAndReplies).toBeDefined();
  });

  it('should handle empty file list', () => {
    const output: FileValidationOutput = validateRequiredFiles([]);

    expect(output.result.isValid).toBe(false);
    expect(output.result.missingFiles.length).toBeGreaterThan(0);
    expect(output.result.errors.length).toBeGreaterThan(0);
  });
});
