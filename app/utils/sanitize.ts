/**
 * HTML entity mapping for escaping dangerous characters
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;',
};

/**
 * Escape HTML special characters to prevent XSS injection
 * Converts <, >, &, ", ' to their HTML entity equivalents
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str.replace(/[&<>"']/g, char => HTML_ENTITIES[char] || char);
}

/**
 * Validate and sanitize a URL to prevent protocol-based XSS attacks
 * Only allows https:// protocol URLs
 *
 * @param baseUrl - The trusted base URL (e.g., 'https://threads.com/')
 * @param userInput - The user-provided path segment to append
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(baseUrl: string, userInput: string): string {
  if (!userInput || typeof userInput !== 'string') {
    return '';
  }

  // Remove any protocol attempts or path traversal from user input
  const sanitizedInput = userInput
    .replace(/[^\w.-]/g, '') // Only allow alphanumeric, dots, underscores, hyphens
    .replace(/\.{2,}/g, '.'); // Prevent multiple consecutive dots

  if (!sanitizedInput) {
    return '';
  }

  // Construct URL with trusted base
  const url = `${baseUrl}${sanitizedInput}`;

  // Validate final URL starts with https://
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return '';
    }
    return url;
  }
  catch {
    return '';
  }
}
