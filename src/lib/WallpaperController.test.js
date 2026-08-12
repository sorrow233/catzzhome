// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { WallpaperController } from './WallpaperController.js';

function controller(selectedId, cinematicPrefs = {}) {
  return new WallpaperController({
    element: document.createElement('div'),
    gradient: document.createElement('div'),
    wallpapers: [{ id: selectedId, theme: {} }],
    urls: { [selectedId]: 'https://example.com/wallpaper.webp' },
    selectedId,
    cinematicPrefs
  });
}

describe('壁纸电影模式默认值', () => {
  it.each(['rainy_window', 'sunset_balcony', 'night_view'])('%s 保留原始明暗层次', (id) => {
    expect(controller(id).getCinematic()).toBe(false);
  });

  it('其他壁纸默认启用底部文字对比渐变', () => {
    expect(controller('flower_window').getCinematic()).toBe(true);
  });

  it('尊重用户手动设置', () => {
    expect(controller('night_view', { night_view: true }).getCinematic()).toBe(true);
  });
});
