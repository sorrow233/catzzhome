import { describe, expect, it } from 'vitest';
import { calculate } from './calculator.js';

describe('安全计算器', () => {
  it('遵循运算优先级', () => expect(calculate('12 + 3 * 4')).toBe(24));
  it('支持括号与小数', () => expect(calculate('(2.5 + 1.5) / 2')).toBe(2));
  it('拒绝代码和除零', () => { expect(calculate('alert(1)')).toBeNull(); expect(calculate('1 / 0')).toBeNull(); });
});
