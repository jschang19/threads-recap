/**
 * JSON parsing utilities for Threads data export
 */

import { fixMojibake } from './mojibake';

/**
 * Read and parse a JSON file with mojibake fix
 * Handles the encoding issues common in Threads exports
 */
export async function parseJsonFile<T>(file: File): Promise<T> {
  if (!file) {
    throw new Error('File is null or undefined');
  }

  let text: string;
  try {
    text = await file.text();
  }
  catch (e) {
    throw new Error(`Failed to read file content: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  if (!text || text.trim().length === 0) {
    throw new Error('File is empty');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  }
  catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(`Invalid JSON syntax: ${e.message}`);
    }
    throw new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  try {
    return fixMojibake(parsed) as T;
  }
  catch (e) {
    throw new Error(`Failed to fix encoding: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}
