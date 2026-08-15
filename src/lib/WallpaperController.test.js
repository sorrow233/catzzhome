import { describe, expect, it } from 'vitest';
import { resolveFocalPosition, sceneForHour } from './WallpaperController.js';

describe('时间场景', () => {
  it('根据时间选择早晨、白天、黄昏和夜晚', () => {
    expect(sceneForHour(7)).toBe('flower_window');
    expect(sceneForHour(12)).toBe('white_shirt_girl');
    expect(sceneForHour(18)).toBe('sunset_balcony');
    expect(sceneForHour(23)).toBe('night_view');
  });
});

describe('移动端人物焦点裁切', () => {
  it('横图在竖屏中把人物焦点放到视觉中心', () => {
    expect(resolveFocalPosition({ width: 2000, height: 1000, containerWidth: 400, containerHeight: 800, focus: { x: 0.25, y: 0.5 } })).toBe('16.7% 50%');
    expect(resolveFocalPosition({ width: 2000, height: 1000, containerWidth: 400, containerHeight: 800, focus: { x: 0.75, y: 0.5 } })).toBe('83.3% 50%');
  });

  it('竖图在横屏中根据纵向焦点裁切', () => {
    expect(resolveFocalPosition({ width: 1000, height: 2000, containerWidth: 800, containerHeight: 400, focus: { x: 0.5, y: 0.25 } })).toBe('50% 16.7%');
  });

  it('尺寸不可用时安全回退到居中', () => {
    expect(resolveFocalPosition({ width: 0, height: 0, containerWidth: 400, containerHeight: 800 })).toBe('50% 50%');
  });
});
