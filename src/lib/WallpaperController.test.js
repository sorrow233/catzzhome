import { describe, expect, it } from 'vitest';
import { sceneForHour } from './WallpaperController.js';

describe('时间场景', () => {
  it('根据时间选择早晨、白天、黄昏和夜晚', () => {
    expect(sceneForHour(7)).toBe('flower_window');
    expect(sceneForHour(12)).toBe('white_shirt_girl');
    expect(sceneForHour(18)).toBe('sunset_balcony');
    expect(sceneForHour(23)).toBe('night_view');
  });
});
