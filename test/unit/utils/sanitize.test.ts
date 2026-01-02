import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeUrl } from '~/utils/sanitize';

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('&')).toBe('&amp;');
    expect(escapeHtml('"')).toBe('&quot;');
    expect(escapeHtml('\'')).toBe('&#x27;');
  });

  it('should escape all dangerous characters in a string', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle strings with mixed content', () => {
    const input = 'Hello <b>World</b> & "Friends"';
    const expected = 'Hello &lt;b&gt;World&lt;/b&gt; &amp; &quot;Friends&quot;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should return empty string for null/undefined/empty input', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null as unknown as string)).toBe('');
    expect(escapeHtml(undefined as unknown as string)).toBe('');
  });

  it('should return non-string inputs as empty string', () => {
    expect(escapeHtml(123 as unknown as string)).toBe('');
    expect(escapeHtml({} as unknown as string)).toBe('');
    expect(escapeHtml([] as unknown as string)).toBe('');
  });

  it('should leave safe strings unchanged', () => {
    expect(escapeHtml('hello_world')).toBe('hello_world');
    expect(escapeHtml('user.name123')).toBe('user.name123');
    expect(escapeHtml('正常的中文字')).toBe('正常的中文字');
  });

  it('should handle event handler injection attempts', () => {
    const input = 'onclick="malicious()"';
    const expected = 'onclick=&quot;malicious()&quot;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle nested script attempts', () => {
    const input = '<<script>script>';
    const expected = '&lt;&lt;script&gt;script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });
});

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
    // If somehow a non-https base URL is used, it should fail validation
    expect(sanitizeUrl('http://threads.com/', 'user')).toBe('');
    expect(sanitizeUrl('ftp://threads.com/', 'user')).toBe('');
  });
});

