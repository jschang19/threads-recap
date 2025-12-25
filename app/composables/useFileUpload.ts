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
import { REQUIRED_FILES } from '~/types/threads';
import { completeSingleMedia } from '~/utils/completeSingleMedia';

// Extend Window interface for File System Access API
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

// Shared state (singleton pattern) - all instances share the same refs
const files = ref<UploadedFiles>({});
const validationResult = ref<FileValidationResult | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useFileUpload() {

  /**
   * Check if File System Access API is supported
   */
  const isFileSystemAccessSupported = computed(() => {
    return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  });

  /**
   * Decode UTF-8 encoded content (handles mojibake from Threads export)
   */
  function decodeUtf8Content(content: string): string {
    try {
      // The JSON files from Threads export have double-encoded UTF-8
      // First parse as JSON, then decode the string values
      return content;
    } catch {
      return content;
    }
  }

  /**
   * Fix mojibake in parsed JSON (Threads exports have encoding issues)
   */
  function fixMojibake(obj: unknown): unknown {
    if (typeof obj === 'string') {
      try {
        // Try to decode Latin-1 to UTF-8
        const bytes = new Uint8Array(obj.split('').map(c => c.charCodeAt(0)));
        return new TextDecoder('utf-8').decode(bytes);
      } catch {
        return obj;
      }
    }
    if (Array.isArray(obj)) {
      return obj.map(fixMojibake);
    }
    if (obj && typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        const fixedKey = typeof key === 'string' ? fixMojibake(key) as string : key;
        result[fixedKey] = fixMojibake(value);
      }
      return result;
    }
    return obj;
  }

  /**
   * Read and parse a JSON file
   */
  async function parseJsonFile<T>(file: File): Promise<T> {
    const text = await file.text();
    const parsed = JSON.parse(text);
    return fixMojibake(parsed) as T;
  }

  /**
   * Validate that all required files exist in the uploaded folder
   */
  function validateFiles(fileList: File[]): FileValidationResult {
    const foundFiles: string[] = [];
    const missingFiles: string[] = [];
    const errors: string[] = [];

    // Create a map of file names to files
    const fileMap = new Map<string, File>();
    for (const file of fileList) {
      // Handle both flat structure and nested structure
      const fileName = file.name;
      const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || '';
      
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
      } else {
        missingFiles.push(requiredFile);
      }
    }

    // Store files in ref
    files.value = {
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
      isValid,
      missingFiles,
      foundFiles,
      errors,
    };
  }

  /**
   * Handle folder selection using File System Access API
   */
  async function selectFolderWithAPI(): Promise<File[]> {
    if (!window.showDirectoryPicker) {
      throw new Error('您的瀏覽器不支援資料夾選擇功能');
    }

    const dirHandle = await window.showDirectoryPicker();
    const files: File[] = [];

    async function getFilesRecursively(
      handle: FileSystemDirectoryHandle,
      path = ''
    ): Promise<void> {
      // Iterate directory entries using values() - cast needed for older TS types
      const entries = (handle as unknown as { values(): AsyncIterable<FileSystemHandle> }).values();
      for await (const entry of entries) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        if (entry.kind === 'file') {
          const file = await (entry as FileSystemFileHandle).getFile();
          // Add webkitRelativePath-like property
          Object.defineProperty(file, 'webkitRelativePath', {
            value: entryPath,
            writable: false,
          });
          files.push(file);
        } else if (entry.kind === 'directory') {
          await getFilesRecursively(entry as FileSystemDirectoryHandle, entryPath);
        }
      }
    }

    await getFilesRecursively(dirHandle);

    return files;
  }

  /**
   * Handle folder selection using input element fallback
   */
  async function selectFolderWithInput(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      // @ts-expect-error - directory is non-standard but supported
      input.directory = true;
      input.multiple = true;

      input.onchange = () => {
        if (input.files && input.files.length > 0) {
          resolve(Array.from(input.files));
        } else {
          reject(new Error('未選擇任何檔案'));
        }
      };

      input.oncancel = () => {
        reject(new Error('已取消選擇'));
      };

      input.click();
    });
  }

  /**
   * Main function to select and validate folder
   */
  async function selectFolder(): Promise<FileValidationResult> {
    isLoading.value = true;
    error.value = null;
    validationResult.value = null;

    try {
      let fileList: File[];

      if (isFileSystemAccessSupported.value) {
        try {
          fileList = await selectFolderWithAPI();
        } catch (e) {
          // Fallback to input if API fails
          if ((e as Error).name === 'AbortError') {
            throw new Error('已取消選擇');
          }
          fileList = await selectFolderWithInput();
        }
      } else {
        fileList = await selectFolderWithInput();
      }

      const result = validateFiles(fileList);
      validationResult.value = result;

      if (!result.isValid) {
        error.value = result.errors.join('\n');
      }

      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '發生未知錯誤';
      error.value = errorMessage;
      return {
        isValid: false,
        missingFiles: [...REQUIRED_FILES],
        foundFiles: [],
        errors: [errorMessage],
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Handle files dropped via drag and drop
   */
  async function handleDroppedFiles(items: DataTransferItemList): Promise<FileValidationResult> {
    isLoading.value = true;
    error.value = null;
    validationResult.value = null;

    try {
      const fileList: File[] = [];

      // Process dropped items
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry?.();
          if (entry) {
            await processEntry(entry, fileList);
          }
        }
      }

      const result = validateFiles(fileList);
      validationResult.value = result;

      if (!result.isValid) {
        error.value = result.errors.join('\n');
      }

      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '發生未知錯誤';
      error.value = errorMessage;
      return {
        isValid: false,
        missingFiles: [...REQUIRED_FILES],
        foundFiles: [],
        errors: [errorMessage],
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Recursively process file system entries
   */
  async function processEntry(entry: FileSystemEntry, fileList: File[], path = ''): Promise<void> {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      const file = await new Promise<File>((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });
      const fullPath = path ? `${path}/${entry.name}` : entry.name;
      Object.defineProperty(file, 'webkitRelativePath', {
        value: fullPath,
        writable: false,
      });
      fileList.push(file);
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const reader = dirEntry.createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });
      const newPath = path ? `${path}/${entry.name}` : entry.name;
      for (const childEntry of entries) {
        await processEntry(childEntry, fileList, newPath);
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
   * Reset all state
   */
  function reset() {
    files.value = {};
    validationResult.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return {
    files: readonly(files),
    validationResult: readonly(validationResult),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isFileSystemAccessSupported,
    selectFolder,
    handleDroppedFiles,
    parseAllFiles,
    reset,
  };
}

