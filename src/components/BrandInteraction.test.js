// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrandInteraction } from './BrandInteraction.js';

function fixture() {
  document.body.innerHTML = `
    <button data-brand-trigger aria-expanded="false"></button>
    <section data-quick-search hidden><form data-quick-search-form><input data-quick-search-input /></form></section>`;
  const openWallpapers = vi.fn();
  const navigate = vi.fn();
  const interaction = new BrandInteraction({ root: document.body, openWallpapers, navigate });
  interaction.mount();
  return { interaction, openWallpapers, navigate };
}

describe('Catzz 品牌交互', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it('单击等待双击窗口后显示并聚焦输入框', () => {
    fixture();
    document.querySelector('[data-brand-trigger]').click();
    expect(document.querySelector('[data-quick-search]').hidden).toBe(true);
    vi.advanceTimersByTime(280);
    expect(document.querySelector('[data-quick-search]').hidden).toBe(false);
    expect(document.activeElement).toBe(document.querySelector('[data-quick-search-input]'));
  });

  it('连续两次点击取消搜索并只打开一次壁纸', () => {
    const { openWallpapers } = fixture();
    const brand = document.querySelector('[data-brand-trigger]');
    brand.click();
    brand.click();
    vi.advanceTimersByTime(300);
    expect(openWallpapers).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-quick-search]').hidden).toBe(true);
  });

  it('提交时读取国家代码并执行对应搜索', () => {
    const { navigate } = fixture();
    document.head.innerHTML = '<meta name="catzz-country" content="CN">';
    document.querySelector('[data-quick-search-input]').value = 'Catzz 壁纸';
    document.querySelector('[data-quick-search-form]').requestSubmit();
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining('baidu.com'));
  });
});
