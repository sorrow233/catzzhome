// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { detectLocale } from './I18n.js';

describe('语言检测', () => {
  it('URL 参数优先于已保存语言和浏览器语言', () => {
    expect(detectLocale({ search: '?lang=ko', saved: 'ja', browser: 'en-US' })).toBe('ko');
  });

  it('保留繁体中文区域代码', () => {
    expect(detectLocale({ browser: 'zh-TW' })).toBe('zh-TW');
  });

  it('未知语言回退到简体中文', () => {
    expect(detectLocale({ browser: 'fr-FR' })).toBe('zh');
  });
});
