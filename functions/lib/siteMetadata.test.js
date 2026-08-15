import { describe, expect, it, vi } from 'vitest';
import { fetchRemote, parseManifestIcons, parseSiteMetadata, safeRemoteUrl } from './siteMetadata.js';

describe('站点元数据边缘解析', () => {
  it('提取名称、页面图标与 Manifest', () => {
    const html = '<head><meta property="og:site_name" content="Catzz"><link rel="apple-touch-icon" href="/apple.png"><link rel="manifest" href="/site.webmanifest"></head>';
    expect(parseSiteMetadata(html, 'https://catzz.work/path')).toEqual({
      name: 'Catzz',
      icons: ['https://catzz.work/apple.png'],
      manifestUrl: 'https://catzz.work/site.webmanifest'
    });
    expect(parseManifestIcons('{"icons":[{"src":"icon-192.png"}]}', 'https://catzz.work/site.webmanifest')).toEqual(['https://catzz.work/icon-192.png']);
  });

  it('拒绝私网、鉴权网址与非 HTTP 协议', () => {
    expect(safeRemoteUrl('http://127.0.0.1/admin')).toBeNull();
    expect(safeRemoteUrl('http://192.168.1.2')).toBeNull();
    expect(safeRemoteUrl('https://user:pass@example.com')).toBeNull();
    expect(safeRemoteUrl('file:///etc/passwd')).toBeNull();
  });

  it('重定向后再次执行安全校验', async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 302, headers: { Location: 'http://127.0.0.1/private' } }));
    await expect(fetchRemote('https://example.com', { fetcher })).rejects.toMatchObject({ message: 'unsafe_redirect', status: 400 });
  });
});
