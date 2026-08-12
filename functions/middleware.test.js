import { describe, expect, it } from 'vitest';
import { resolveLocale } from './_middleware.js';

describe('边缘多语言解析', () => {
  it('优先使用合法查询参数', () => expect(resolveLocale('https://ame.catzz.work/?lang=en', 'ja')).toBe('en'));
  it('能识别 Accept-Language 中的地区语言', () => expect(resolveLocale('https://ame.catzz.work/', 'zh-TW,zh;q=0.9')).toBe('zh-TW'));
  it('无法识别时回退到默认语言', () => expect(resolveLocale('https://ame.catzz.work/', 'fr-FR')).toBe('zh'));
});
