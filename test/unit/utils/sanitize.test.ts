import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from '~/utils/sanitize';

describe('sanitizeUrl', () => {
  const THREADS_BASE = 'https://threads.com/';

  it('should construct valid URLs for normal usernames', () => {
    expect(sanitizeUrl(THREADS_BASE, 'john_doe')).toBe('https://threads.com/john_doe');
    expect(sanitizeUrl(THREADS_BASE, 'user.name')).toBe('https://threads.com/user.name');
    expect(sanitizeUrl(THREADS_BASE, 'user123')).toBe('https://threads.com/user123');
  });

  it('should strip dangerous characters from usernames', () => {
    // Remove slashes that could be used for path traversal
    // After removing slashes: 'user....etc' -> collapses to 'user.etc'
    expect(sanitizeUrl(THREADS_BASE, 'user/../../etc')).toBe('https://threads.com/user.etc');
    // Remove special URL characters
    expect(sanitizeUrl(THREADS_BASE, 'user?query=1')).toBe('https://threads.com/userquery1');
    expect(sanitizeUrl(THREADS_BASE, 'user#anchor')).toBe('https://threads.com/useranchor');
  });

  it('should reject javascript: protocol attempts', () => {
    // Even if someone tries to inject a protocol, it should be stripped
    expect(sanitizeUrl(THREADS_BASE, 'javascript:alert(1)')).toBe('https://threads.com/javascriptalert1');
  });

  it('should handle empty/invalid inputs', () => {
    expect(sanitizeUrl(THREADS_BASE, '')).toBe('');
    expect(sanitizeUrl(THREADS_BASE, null as unknown as string)).toBe('');
    expect(sanitizeUrl(THREADS_BASE, undefined as unknown as string)).toBe('');
  });

  it('should collapse multiple dots to prevent path issues', () => {
    expect(sanitizeUrl(THREADS_BASE, 'user...name')).toBe('https://threads.com/user.name');
    expect(sanitizeUrl(THREADS_BASE, '..hidden')).toBe('https://threads.com/.hidden');
  });

  it('should handle HTML encoded injection attempts', () => {
    // These characters should be stripped anyway
    const result = sanitizeUrl(THREADS_BASE, '<script>alert(1)</script>');
    expect(result).toBe('https://threads.com/scriptalert1script');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should handle unicode characters', () => {
    // Non-alphanumeric unicode should be stripped for safety
    const result = sanitizeUrl(THREADS_BASE, 'user名前');
    expect(result).toBe('https://threads.com/user');
  });

  it('should return empty string for input that becomes empty after sanitization', () => {
    expect(sanitizeUrl(THREADS_BASE, '////')).toBe('');
    expect(sanitizeUrl(THREADS_BASE, '????')).toBe('');
    expect(sanitizeUrl(THREADS_BASE, '<><>')).toBe('');
  });

  it('should work with different base URLs', () => {
    expect(sanitizeUrl('https://example.com/', 'path')).toBe('https://example.com/path');
  });

  it('should reject non-https base URLs', () => {
    // sanitizeUrl must reject any non-HTTPS base URL and return an empty string

    expect(sanitizeUrl('http://threads.com/', 'user')).toBe('');
    expect(sanitizeUrl('ftp://threads.com/', 'user')).toBe('');
  });
});
