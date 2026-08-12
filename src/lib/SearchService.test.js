import { describe, expect, it } from 'vitest';
import { classifyInput, searchBookmarks } from './SearchService.js';

describe('统一搜索', () => {
  it('识别网址、搜索、站点命令和应用命令', () => {
    expect(classifyInput('example.com').url).toBe('https://example.com/');
    expect(classifyInput('rain night', 'bing').url).toContain('bing.com/search');
    expect(classifyInput('@yt jazz').url).toContain('youtube.com/results');
    expect(classifyInput('/focus 50')).toMatchObject({ type: 'command', command: 'focus', argument: '50' });
  });
  it('优先返回计算结果', () => expect(classifyInput('6 * 7')).toEqual({ type: 'calculation', value: 42 }));
  it('搜索已有书签', () => expect(searchBookmarks([{ name: 'GitHub', url: 'https://github.com' }], 'git')).toHaveLength(1));
});
