import { describe, expect, it } from 'vitest';
import { parseManifestIcons, parseSiteMetadata, safeRemoteUrl } from './lib/siteMetadata.js';

describe('Cloudflare 站点元数据解析', () => {
  it('解析任意属性顺序的站点名、图标和 manifest', () => {
    const html = `<html><head><meta content="Example Studio" property="og:site_name"><title>Fallback</title><link href="/touch.png" rel="apple-touch-icon"><link rel="icon" href="icons/favicon.svg"><link href="/site.webmanifest" rel="manifest"></head></html>`;
    expect(parseSiteMetadata(html, 'https://example.com/path')).toEqual({ name: 'Example Studio', icons: ['https://example.com/touch.png', 'https://example.com/icons/favicon.svg'], manifestUrl: 'https://example.com/site.webmanifest' });
  });
  it('解析 manifest 相对图标', () => expect(parseManifestIcons('{"icons":[{"src":"icon-192.png"}]}', 'https://example.com/app/manifest.json')).toEqual(['https://example.com/app/icon-192.png']));
  it.each(['http://127.0.0.1', 'http://10.0.0.1', 'http://192.168.1.2', 'http://[::1]', 'http://service.internal', 'file:///tmp/a'])('阻止私网或非网页目标 %s', (url) => expect(safeRemoteUrl(url)).toBeNull());
  it('允许普通公网 HTTPS 地址', () => expect(safeRemoteUrl('https://example.com/path')?.href).toBe('https://example.com/path'));
});
