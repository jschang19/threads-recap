import { describe, it, expect } from 'vitest';
import { fixMojibake } from '~/utils/file-upload/mojibake';

describe('fixMojibake', () => {
  it('should fix mojibake in simple strings', () => {
    // Test with a simple ASCII string
    const result = fixMojibake('hello');
    expect(result).toBe('hello');
  });

  it('should handle strings correctly', () => {
    const input = 'Test String';
    const result = fixMojibake(input);
    expect(typeof result).toBe('string');
  });

  it('should recursively fix arrays', () => {
    const input = ['string1', 'string2', 'string3'];
    const result = fixMojibake(input);
    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBe(3);
  });

  it('should recursively fix objects', () => {
    const input = {
      key1: 'value1',
      key2: 'value2',
      nested: {
        key3: 'value3',
      },
    };
    const result = fixMojibake(input);
    expect(result).toHaveProperty('key1');
    expect(result).toHaveProperty('key2');
    expect(result).toHaveProperty('nested');
  });

  it('should handle nested structures', () => {
    const input = {
      users: ['user1', 'user2'],
      data: {
        name: 'test',
        values: [1, 2, 3],
      },
    };
    const result = fixMojibake(input);
    expect(result).toHaveProperty('users');
    expect(result).toHaveProperty('data');
  });

  it('should handle non-string primitives', () => {
    expect(fixMojibake(123)).toBe(123);
    expect(fixMojibake(true)).toBe(true);
    expect(fixMojibake(null)).toBe(null);
    expect(fixMojibake(undefined)).toBe(undefined);
  });

  it('should handle empty structures', () => {
    expect(fixMojibake([])).toEqual([]);
    expect(fixMojibake({})).toEqual({});
    expect(fixMojibake('')).toBe('');
  });

  it('should fix latin-1 encoded Chinese characters (mojibake)', () => {
    // This is the mojibake version of Chinese text (latin-1 misencoded UTF-8)
    const mojibakeString = '\u00e5\u00a4\u00a7\u00e9\u00a0\u00ad\u00e8\u00b2\u00bc\u00e7\u0085\u00a7';
    const result = fixMojibake(mojibakeString);
    
    // After fixing, it should be proper Chinese characters
    expect(result).toBe('大頭貼照');
  });

  it('should fix latin-1 encoded strings in objects', () => {
    const input = {
      name: '\u00e5\u00a4\u00a7\u00e9\u00a0\u00ad\u00e8\u00b2\u00bc\u00e7\u0085\u00a7',
      description: '\u00e6\u00b8\u00ac\u00e8\u00a9\u00a6',
    };
    const result = fixMojibake(input) as { name: string; description: string };
    
    expect(result.name).toBe('大頭貼照');
    expect(result.description).toBe('測試');
  });

  it('should fix latin-1 encoded strings in arrays', () => {
    const input = [
      '\u00e5\u00a4\u00a7\u00e9\u00a0\u00ad\u00e8\u00b2\u00bc\u00e7\u0085\u00a7',
      '\u00e6\u00b8\u00ac\u00e8\u00a9\u00a6',
    ];
    const result = fixMojibake(input) as string[];
    
    expect(result[0]).toBe('大頭貼照');
    expect(result[1]).toBe('測試');
  });
});
