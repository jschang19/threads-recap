/**
 * Mojibake (encoding corruption) fix utility
 * Threads exports have encoding issues where UTF-8 text is incorrectly decoded as Latin-1
 */

/**
 * Fix mojibake in parsed JSON data
 * Recursively processes strings, arrays, and objects to decode Latin-1 to UTF-8
 */
export function fixMojibake(obj: unknown): unknown {
  if (typeof obj === 'string') {
    try {
      // Try to decode Latin-1 to UTF-8
      const bytes = new Uint8Array(obj.split('').map(c => c.charCodeAt(0)));
      return new TextDecoder('utf-8').decode(bytes);
    }
    catch {
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
