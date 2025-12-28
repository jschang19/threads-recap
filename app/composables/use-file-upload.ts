import type {
  FileValidationResult,
  UploadedFiles,
  ThreadsAndRepliesResponse,
  ThreadFollowersResponse,
  ThreadFollowingResponse,
  ThreadLikesResponse,
  ThreadSavedPostsResponse,
  ParsedThreadsData,
} from '~/types/threads';
import { REQUIRED_FILES } from '~/constants';
import { completeSingleMedia } from '~/utils/complete-single-media';
import {
  validateFileLimits,
  isFileCountExceeded,
  createFileCountError,
  type UploadError,
} from '~/utils/validate-file-limits';
import {
  isFileSystemAccessSupported as checkFileSystemAccessSupported,
  selectFolderWithAPI,
  selectFolderWithInput,
  processFileSystemEntry,
  extractFolderName,
  isValidThreadsFolderName,
  validateRequiredFiles,
  parseJsonFile,
} from '~/utils/file-upload';

// Shared state (singleton pattern) - all instances share the same refs
const files = ref<UploadedFiles>({});
const validationResult = ref<FileValidationResult | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const uploadError = ref<UploadError | null>(null);
const uploadedFolderName = ref<string | null>(null);
const isValidFolderName = ref<boolean>(true);
// Track if operation was cancelled to ignore pending results
let operationCancelled = false;

export function useFileUpload() {
  /**
   * Check if File System Access API is supported
   */
  const isFileSystemAccessSupported = computed(() => checkFileSystemAccessSupported());

  /**
   * Reset state before starting a new operation
   */
  function resetState() {
    isLoading.value = true;
    error.value = null;
    uploadError.value = null;
    validationResult.value = null;
    uploadedFolderName.value = null;
    isValidFolderName.value = true;
    operationCancelled = false;
  }

  /**
   * Create a cancelled result
   */
  function createCancelledResult(): FileValidationResult {
    return {
      isValid: false,
      missingFiles: [],
      foundFiles: [],
      errors: [],
    };
  }

  /**
   * Create an error result
   */
  function createErrorResult(errorMessage: string): FileValidationResult {
    return {
      isValid: false,
      missingFiles: [...REQUIRED_FILES],
      foundFiles: [],
      errors: [errorMessage],
    };
  }

  /**
   * Update folder name state from file list
   */
  function updateFolderNameState(fileList: File[]) {
    const folderName = extractFolderName(fileList);
    uploadedFolderName.value = folderName ?? null;
    isValidFolderName.value = folderName ? isValidThreadsFolderName(folderName) : true;
  }

  /**
   * Handle file limit validation errors
   */
  function handleLimitError(limitError: UploadError): FileValidationResult {
    uploadError.value = limitError;
    error.value = limitError.message;
    return {
      isValid: false,
      missingFiles: [],
      foundFiles: [],
      errors: [limitError.message],
    };
  }

  /**
   * Process and validate file list
   */
  function processFileList(fileList: File[]): FileValidationResult {
    // Check file limits before processing
    const limitError = validateFileLimits(fileList);
    if (limitError) {
      return handleLimitError(limitError);
    }

    const { result, files: extractedFiles } = validateRequiredFiles(fileList);
    files.value = extractedFiles;
    validationResult.value = result;

    if (!result.isValid) {
      error.value = result.errors.join('\n');
    }

    return result;
  }

  /**
   * Main function to select and validate folder
   */
  async function selectFolder(): Promise<FileValidationResult> {
    resetState();

    try {
      let fileList: File[];

      if (isFileSystemAccessSupported.value) {
        try {
          fileList = await selectFolderWithAPI();
        }
        catch (e) {
          // Fallback to input if API fails
          if ((e as Error).name === 'AbortError') {
            throw new Error('已取消選擇');
          }
          fileList = await selectFolderWithInput();
        }
      }
      else {
        fileList = await selectFolderWithInput();
      }

      // Check if operation was cancelled while waiting
      if (operationCancelled) {
        return createCancelledResult();
      }

      // Extract folder name early for error display
      updateFolderNameState(fileList);

      return processFileList(fileList);
    }
    catch (e) {
      // Don't set error if operation was cancelled
      if (operationCancelled) {
        return createCancelledResult();
      }

      const errorMessage = e instanceof Error ? e.message : '發生未知錯誤';
      error.value = errorMessage;
      return createErrorResult(errorMessage);
    }
    finally {
      if (!operationCancelled) {
        isLoading.value = false;
      }
    }
  }

  /**
   * Handle files dropped via drag and drop
   */
  async function handleDroppedFiles(items: DataTransferItemList): Promise<FileValidationResult> {
    resetState();

    try {
      const fileList: File[] = [];

      // Process dropped items
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry?.();
          if (entry) {
            await processFileSystemEntry(entry, fileList);
          }
        }

        // Check if operation was cancelled during processing
        if (operationCancelled) {
          return createCancelledResult();
        }

        // Extract folder name early for error display (do this as we process)
        if (fileList.length > 0 && !uploadedFolderName.value) {
          updateFolderNameState(fileList);
        }

        // Early check during processing to prevent freezing
        if (isFileCountExceeded(fileList.length)) {
          const limitError = createFileCountError(fileList.length);
          return handleLimitError(limitError);
        }
      }

      // Check if operation was cancelled while waiting
      if (operationCancelled) {
        return createCancelledResult();
      }

      // Extract folder name if not yet extracted
      if (!uploadedFolderName.value && fileList.length > 0) {
        updateFolderNameState(fileList);
      }

      return processFileList(fileList);
    }
    catch (e) {
      // Don't set error if operation was cancelled
      if (operationCancelled) {
        return createCancelledResult();
      }

      const errorMessage = e instanceof Error ? e.message : '發生未知錯誤';
      error.value = errorMessage;
      return createErrorResult(errorMessage);
    }
    finally {
      if (!operationCancelled) {
        isLoading.value = false;
      }
    }
  }

  /**
   * Parse all uploaded files and return structured data
   */
  async function parseAllFiles(): Promise<ParsedThreadsData> {
    if (!files.value.threadsAndReplies) {
      throw new Error('缺少討論串資料檔案');
    }

    const [threadsData, followersData, followingData, likesData, savedData] = await Promise.all([
      parseJsonFile<ThreadsAndRepliesResponse>(files.value.threadsAndReplies!),
      files.value.followers
        ? parseJsonFile<ThreadFollowersResponse>(files.value.followers)
        : Promise.resolve({ text_post_app_text_post_app_followers: [] }),
      files.value.following
        ? parseJsonFile<ThreadFollowingResponse>(files.value.following)
        : Promise.resolve({ text_post_app_text_post_app_following: [] }),
      files.value.likedThreads
        ? parseJsonFile<ThreadLikesResponse>(files.value.likedThreads)
        : Promise.resolve({ text_post_app_media_likes: [] }),
      files.value.savedThreads
        ? parseJsonFile<ThreadSavedPostsResponse>(files.value.savedThreads)
        : Promise.resolve({ text_post_app_text_post_app_saved_posts: [] }),
    ]);

    const handledSingleMediaPosts = threadsData.text_post_app_text_posts.map(post => completeSingleMedia(post));

    return {
      posts: handledSingleMediaPosts || [],
      followers: followersData.text_post_app_text_post_app_followers || [],
      following: followingData.text_post_app_text_post_app_following || [],
      likes: likesData.text_post_app_media_likes || [],
      savedPosts: savedData.text_post_app_text_post_app_saved_posts || [],
    };
  }

  /**
   * Reset all state and cancel any ongoing operations
   */
  function reset() {
    operationCancelled = true;
    files.value = {};
    validationResult.value = null;
    isLoading.value = false;
    error.value = null;
    uploadError.value = null;
    uploadedFolderName.value = null;
    isValidFolderName.value = true;
  }

  return {
    files: readonly(files),
    validationResult: readonly(validationResult),
    isLoading: readonly(isLoading),
    error: readonly(error),
    uploadError: readonly(uploadError),
    uploadedFolderName: readonly(uploadedFolderName),
    isValidFolderName: readonly(isValidFolderName),
    isFileSystemAccessSupported,
    selectFolder,
    handleDroppedFiles,
    parseAllFiles,
    reset,
  };
}
