import type { FileValidationResult, UploadedFiles } from '~/types/threads';
import type { UploadError } from '~/utils/validate-file-limits';
import {
  validateFileLimits,
  isFileCountExceeded,
  createFileCountError,
} from '~/utils/validate-file-limits';
import {
  isFileSystemAccessSupported as checkFileSystemAccessSupported,
  selectFolderWithAPI,
  selectFolderWithInput,
  processFileSystemEntry,
  extractFolderName,
  isValidThreadsFolderName,
  validateRequiredFiles,
  createCancelledResult,
  createErrorResult,
  createLimitErrorResult,
} from '~/utils/file-upload';
import { useFileParser } from './use-file-parser';

// ============================================
// Shared State (Singleton Pattern)
// ============================================
const files = ref<UploadedFiles>({});
const validationResult = ref<FileValidationResult | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const uploadError = ref<UploadError | null>(null);
const uploadedFolderName = ref<string | null>(null);
const isValidFolderName = ref<boolean>(true);

let operationCancelled = false;

// ============================================
// Composable
// ============================================
export function useFileUpload() {
  const { parseAllFiles: parseFiles } = useFileParser();
  const isFileSystemAccessSupported = computed(() => checkFileSystemAccessSupported());

  // --- State Management ---
  function resetState() {
    isLoading.value = true;
    error.value = null;
    uploadError.value = null;
    validationResult.value = null;
    uploadedFolderName.value = null;
    isValidFolderName.value = true;
    operationCancelled = false;
  }

  function updateFolderNameState(fileList: File[]) {
    const folderName = extractFolderName(fileList);
    uploadedFolderName.value = folderName ?? null;
    isValidFolderName.value = folderName ? isValidThreadsFolderName(folderName) : true;
  }

  // --- Validation ---
  function handleLimitError(limitError: UploadError): FileValidationResult {
    uploadError.value = limitError;
    error.value = limitError.message;
    return createLimitErrorResult(limitError.message);
  }

  function processFileList(fileList: File[]): FileValidationResult {
    const limitError = validateFileLimits(fileList);
    if (limitError) return handleLimitError(limitError);

    const { result, files: extractedFiles } = validateRequiredFiles(fileList);
    files.value = extractedFiles;
    validationResult.value = result;

    if (!result.isValid) {
      error.value = result.errors.join('\n');
    }
    return result;
  }

  // --- File Selection Helpers ---
  async function getFileListFromSelection(): Promise<File[]> {
    if (!isFileSystemAccessSupported.value) {
      return selectFolderWithInput();
    }

    try {
      return await selectFolderWithAPI();
    }
    catch (e) {
      if ((e as Error).name === 'AbortError') {
        throw new Error('已取消選擇');
      }
      return selectFolderWithInput();
    }
  }

  async function collectDroppedFiles(items: DataTransferItemList): Promise<File[]> {
    const fileList: File[] = [];

    for (const item of items) {
      if (item.kind !== 'file') continue;

      const entry = item.webkitGetAsEntry?.();
      if (entry) await processFileSystemEntry(entry, fileList);

      if (operationCancelled) break;

      // Update folder name as we process
      if (fileList.length > 0 && !uploadedFolderName.value) {
        updateFolderNameState(fileList);
      }

      // Early exit if too many files
      if (isFileCountExceeded(fileList.length)) {
        throw createFileCountError(fileList.length);
      }
    }

    return fileList;
  }

  // --- Unified Error Handling ---
  async function withErrorHandling(
    operation: () => Promise<FileValidationResult>,
  ): Promise<FileValidationResult> {
    try {
      return await operation();
    }
    catch (e) {
      if (operationCancelled) return createCancelledResult();

      const errorMessage = e instanceof Error ? e.message : '發生未知錯誤';
      error.value = errorMessage;
      return createErrorResult(errorMessage);
    }
    finally {
      if (!operationCancelled) isLoading.value = false;
    }
  }

  // --- Public Methods ---
  async function selectFolder(): Promise<FileValidationResult> {
    resetState();

    return withErrorHandling(async () => {
      const fileList = await getFileListFromSelection();
      if (operationCancelled) return createCancelledResult();

      updateFolderNameState(fileList);
      return processFileList(fileList);
    });
  }

  async function handleDroppedFiles(items: DataTransferItemList): Promise<FileValidationResult> {
    resetState();

    return withErrorHandling(async () => {
      const fileList = await collectDroppedFiles(items);
      if (operationCancelled) return createCancelledResult();

      if (!uploadedFolderName.value && fileList.length > 0) {
        updateFolderNameState(fileList);
      }
      return processFileList(fileList);
    });
  }

  async function parseAllFiles() {
    return parseFiles(files.value);
  }

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
