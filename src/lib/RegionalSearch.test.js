import { describe, expect, it } from 'vitest';
import { regionalSearchEngine } from './RegionalSearch.js';

describe('区域默认搜索引擎', () => {
  it('中国地区默认百度', () => expect(regionalSearchEngine({ country: 'CN', language: 'en-US' })).toBe('baidu'));
  it('其他地区默认 Google', () => expect(regionalSearchEngine({ country: 'JP', language: 'zh-CN' })).toBe('google'));
  it('本地开发没有地区信息时用语言兜底', () => {
    expect(regionalSearchEngine({ language: 'zh-CN' })).toBe('baidu');
    expect(regionalSearchEngine({ language: 'ja-JP' })).toBe('google');
  });
});
