// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { MAX_BOOKMARKS, normalizeBookmark, sanitizeBookmarks } from './bookmarkValidation.js';

describe('书签校验', () => {
  it('自动补全 https 协议并清理空格', () => {
    expect(normalizeBookmark({ name: ' Example ', url: 'example.com' })).toEqual({
      ok: true,
      value: { name: 'Example', url: 'https://example.com/' }
    });
  });

  it('拒绝可执行和非网页协议', () => {
    expect(normalizeBookmark({ name: 'Bad', url: 'javascript:alert(1)' }).error).toBe('invalid_url');
    expect(normalizeBookmark({ name: 'File', url: 'file:///tmp/a' }).error).toBe('invalid_url');
  });

  it('去重并限制最大数量', () => {
    const items = Array.from({ length: MAX_BOOKMARKS + 5 }, (_, index) => ({ name: `Site ${index}`, url: `https://example.com/${index}` }));
    items.unshift(items[0]);
    expect(sanitizeBookmarks(items)).toHaveLength(MAX_BOOKMARKS - 1);
  });
});
