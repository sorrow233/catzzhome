// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanName, SiteMetadata } from './SiteMetadata.js';

describe('站点元数据识别', () => {
  beforeEach(() => localStorage.clear());

  it('清理常见标题后缀并保留站点名', () => {
    expect(cleanName('GitHub · Build software better', 'https://github.com')).toBe('GitHub');
    expect(cleanName('', 'https://mail.google.com')).toBe('Mail');
  });

  it('合并相同站点的并发请求并缓存结果', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ url: 'https://example.com/', name: 'Example | Home', icons: ['https://example.com/icon.png'] }), { status: 200 }));
    const service = new SiteMetadata({ fetcher });
    const [first, second] = await Promise.all([service.resolve('https://example.com/a'), service.resolve('https://example.com/b')]);
    expect(first.name).toBe('Example');
    expect(second.icons).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
    await service.resolve('https://example.com/again');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('失败后重试一次', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(new Response(JSON.stringify({ url: 'https://example.com/', name: 'Example', icons: [] }), { status: 200 }));
    await expect(new SiteMetadata({ fetcher }).resolve('https://example.com')).resolves.toMatchObject({ name: 'Example' });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
