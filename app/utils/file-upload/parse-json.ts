/**
 * JSON parsing utilities for Threads data export
 */

import { fixMojibake } from './mojibake';

/**
 * Read and parse a JSON file with mojibake fix
 * Handles the encoding issues common in Threads exports
 */
export async function parseJsonFile<T>(file: File): Promise<T> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  return fixMojibake(parsed) as T;
}
