/**
 * File validation utilities for Threads data export
 * Validates that all required files exist in the uploaded folder
 */

import type { FileValidationResult, UploadedFiles } from '~/types/threads';
import { REQUIRED_FILES } from '~/constants';
import { extractFolderName, isValidThreadsFolderName } from './folder-validation';

// File type with optional webkitRelativePath property
type FileWithRelativePath = File & { webkitRelativePath?: string };

export interface FileValidationOutput {
  result: FileValidationResult;
  files: UploadedFiles;
}

/**
 * Validate that all required files exist in the uploaded folder
 * Returns validation result and extracted files
 */
export function validateRequiredFiles(fileList: File[]): FileValidationOutput {
  const foundFiles: string[] = [];
  const missingFiles: string[] = [];
  const errors: string[] = [];

  // Extract the uploaded folder name
  const detectedFolderName = extractFolderName(fileList);
  const validFolderName = detectedFolderName
    ? isValidThreadsFolderName(detectedFolderName)
    : true;

  // Create a map of file names to files
  const fileMap = new Map<string, File>();
  for (const file of fileList) {
    // Handle both flat structure and nested structure
    const fileName = file.name;
    const relativePath = (file as FileWithRelativePath).webkitRelativePath || '';

    // Check if file is in the threads subfolder or root
    if (REQUIRED_FILES.includes(fileName as typeof REQUIRED_FILES[number])) {
      if (relativePath.includes('/threads/') || relativePath.split('/').length <= 2) {
        fileMap.set(fileName, file);
      }
    }
  }

  for (const requiredFile of REQUIRED_FILES) {
    if (fileMap.has(requiredFile)) {
      foundFiles.push(requiredFile);
    }
    else {
      missingFiles.push(requiredFile);
    }
  }

  // Build the files object
  const files: UploadedFiles = {
    threadsAndReplies: fileMap.get('threads_and_replies.json'),
    followers: fileMap.get('followers.json'),
    following: fileMap.get('following.json'),
    likedThreads: fileMap.get('liked_threads.json'),
    savedThreads: fileMap.get('saved_threads.json'),
  };

  const isValid = missingFiles.length === 0;

  if (!isValid) {
    errors.push(`缺少必要檔案：${missingFiles.join(', ')}`);
    errors.push('請確認您上傳的是 Threads 匯出資料夾');
  }

  return {
    result: {
      isValid,
      missingFiles,
      foundFiles,
      errors,
      uploadedFolderName: detectedFolderName,
      isValidFolderName: validFolderName,
    },
    files,
  };
}
