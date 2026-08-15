import { describe, expect, it } from 'vitest';
import { resolveSearchTarget } from './SearchNavigation.js';

describe('轻量搜索导航', () => {
  it('直接打开完整网址与无协议网址', () => {
    expect(resolveSearchTarget('https://catzz.work/path')).toBe('https://catzz.work/path');
    expect(resolveSearchTarget('example.com/docs')).toBe('https://example.com/docs');
  });

  it('中国大陆使用百度，其余地区使用 Google', () => {
    expect(resolveSearchTarget('雨夜壁纸', 'CN')).toBe(`https://www.baidu.com/s?wd=${encodeURIComponent('雨夜壁纸')}`);
    expect(resolveSearchTarget('rain wallpaper', 'JP')).toBe('https://www.google.com/search?q=rain%20wallpaper');
  });

  it('忽略空输入且不把危险协议当作网址打开', () => {
    expect(resolveSearchTarget('   ')).toBeNull();
    expect(resolveSearchTarget('javascript:alert(1)', 'CN')).toContain('baidu.com');
  });
});
