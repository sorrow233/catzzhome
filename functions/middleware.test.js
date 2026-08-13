import { describe, expect, it } from 'vitest';
import { isPrivatePath, resolveCountry, resolveLocale } from './_middleware.js';

describe('边缘多语言解析', () => {
  it('读取 Cloudflare 国家代码', () => expect(resolveCountry(new Request('https://ame.catzz.work', { headers: { 'CF-IPCountry': 'cn' } }))).toBe('CN'));
  it('优先使用合法查询参数', () => expect(resolveLocale('https://ame.catzz.work/?lang=en', 'ja')).toBe('en'));
  it('能识别 Accept-Language 中的地区语言', () => expect(resolveLocale('https://ame.catzz.work/', 'zh-TW,zh;q=0.9')).toBe('zh-TW'));
  it('无法识别时回退到默认语言', () => expect(resolveLocale('https://ame.catzz.work/', 'fr-FR')).toBe('zh'));
});

describe('私有发布路径保护', () => {
  it.each([
    '/package.json',
    '/package-lock.json',
    '/migration_script.py',
    '/src/main.js',
    '/functions/_middleware.js',
    '/legacy_backup/index.html',
    '/firestore.rules',
    '/README.md'
  ])('拒绝访问 %s', (pathname) => expect(isPrivatePath(pathname)).toBe(true));

  it.each(['/assets/app.js', '/sw.js', '/robots.txt', '/sitemap.xml'])('允许访问生产资源 %s', (pathname) => expect(isPrivatePath(pathname)).toBe(false));
});
