/**
 * File selection utilities for folder uploads
 * Supports both File System Access API and fallback input element
 */

// Extend Window interface for File System Access API
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

/**
 * Check if File System Access API is supported in the current browser
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

/**
 * Select folder using File System Access API (modern browsers)
 */
export async function selectFolderWithAPI(): Promise<File[]> {
  if (!window.showDirectoryPicker) {
    throw new Error('您的瀏覽器不支援資料夾選擇功能');
  }

  const dirHandle = await window.showDirectoryPicker();
  const files: File[] = [];
  // Use the selected folder's name as the root path (mimics webkitRelativePath behavior)
  const rootFolderName = dirHandle.name;

  async function getFilesRecursively(
    handle: FileSystemDirectoryHandle,
    path: string,
  ): Promise<void> {
    // Iterate directory entries using values() - cast needed for older TS types
    const entries = (handle as unknown as { values(): AsyncIterable<FileSystemHandle> }).values();
    for await (const entry of entries) {
      const entryPath = `${path}/${entry.name}`;
      if (entry.kind === 'file') {
        const file = await (entry as FileSystemFileHandle).getFile();
        // Add webkitRelativePath-like property
        Object.defineProperty(file, 'webkitRelativePath', {
          value: entryPath,
          writable: false,
        });
        files.push(file);
      }
      else if (entry.kind === 'directory') {
        await getFilesRecursively(entry as FileSystemDirectoryHandle, entryPath);
      }
    }
  }

  await getFilesRecursively(dirHandle, rootFolderName);

  return files;
}

/**
 * Select folder using input element fallback (wider browser support)
 */
export async function selectFolderWithInput(): Promise<File[]> {
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
      }
      else {
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
 * Recursively process file system entries from drag and drop
 */
export async function processFileSystemEntry(
  entry: FileSystemEntry,
  fileList: File[],
  path = '',
): Promise<void> {
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
  }
  else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    const newPath = path ? `${path}/${entry.name}` : entry.name;
    for (const childEntry of entries) {
      await processFileSystemEntry(childEntry, fileList, newPath);
    }
  }
}
