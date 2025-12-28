/**
 * Folder name validation utilities for Threads data export
 */

// File type with optional webkitRelativePath property
type FileWithRelativePath = File & { webkitRelativePath?: string };

/**
 * Valid folder name patterns for Threads data export:
 * - Starting with "instagram-" (e.g., "instagram-{username}-...")
 * - Full match "your_instagram_activity"
 * - Full match "threads"
 */
export function isValidThreadsFolderName(folderName: string): boolean {
  if (!folderName) return false;

  return (
    folderName.startsWith('instagram-')
    || folderName === 'your_instagram_activity'
    || folderName === 'threads'
  );
}

/**
 * Extract the root folder name from file paths
 * Uses webkitRelativePath to determine the folder structure
 */
export function extractFolderName(fileList: File[]): string | undefined {
  for (const file of fileList) {
    const relativePath = (file as FileWithRelativePath).webkitRelativePath || '';
    if (relativePath) {
      const parts = relativePath.split('/');
      if (parts.length > 0 && parts[0]) {
        return parts[0];
      }
    }
  }
  return undefined;
}

