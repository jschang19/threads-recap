/**
 * Validate and sanitize a URL to prevent protocol-based XSS attacks
 * Only allows https:// protocol URLs
 *
 * @param baseUrl - The trusted base URL (e.g., 'https://threads.com/')
 * @param userInput - The user-provided path segment to append
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(baseUrl: string, userInput: string): string {
  // Check baseUrl validity & protocol
  let parsedBase: URL;
  try {
    parsedBase = new URL(baseUrl);
    if (parsedBase.protocol !== 'https:') return '';
  }
  catch {
    return '';
  }

  if (typeof userInput !== 'string' || !userInput) return '';

  // Sanitize input: Allow only alphanum, _, -, .
  let sanitizedInput = userInput.replace(/[^\w.-]/g, '').replace(/\.{2,}/g, '.');
  if (!sanitizedInput) return '';

  // Ensure there's exactly one slash between base and input
  const base = parsedBase.toString().replace(/\/+$/, '');
  sanitizedInput = sanitizedInput.replace(/^\/+/, '');

  const combinedUrl = `${base}/${sanitizedInput}`;

  try {
    const parsedFinal = new URL(combinedUrl);
    if (parsedFinal.protocol !== 'https:') return '';
    return parsedFinal.toString();
  }
  catch {
    return '';
  }
}
