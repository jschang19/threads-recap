import { describe, it, expect, vi } from 'vitest';
import { parseJsonFile } from '~/utils/file-upload/parse-json';

describe('parseJsonFile', () => {
  it('should parse valid JSON file', async () => {
    const data = { name: 'test', value: 123 };
    const content = JSON.stringify(data);
    const file = new File([content], 'test.json', { type: 'application/json' });

    const result = await parseJsonFile(file);
    expect(result).toBeDefined();
  });

  it('should handle empty JSON object', async () => {
    const content = JSON.stringify({});
    const file = new File([content], 'empty.json', { type: 'application/json' });

    const result = await parseJsonFile(file);
    expect(result).toEqual({});
  });

  it('should handle JSON arrays', async () => {
    const data = [1, 2, 3, 4, 5];
    const content = JSON.stringify(data);
    const file = new File([content], 'array.json', { type: 'application/json' });

    const result = await parseJsonFile(file);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should throw error for invalid JSON', async () => {
    const content = 'not valid json {';
    const file = new File([content], 'invalid.json', { type: 'application/json' });

    await expect(parseJsonFile(file)).rejects.toThrow();
  });

  it('should handle nested JSON structures', async () => {
    const data = {
      user: {
        name: 'John',
        posts: [
          { id: 1, content: 'Post 1' },
          { id: 2, content: 'Post 2' },
        ],
      },
    };
    const content = JSON.stringify(data);
    const file = new File([content], 'nested.json', { type: 'application/json' });

    const result = await parseJsonFile<typeof data>(file);
    expect(result).toHaveProperty('user');
    expect(result.user).toHaveProperty('name');
    expect(result.user).toHaveProperty('posts');
  });
});
