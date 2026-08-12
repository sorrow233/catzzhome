import { describe, expect, it } from 'vitest';
import { createBackup, parseBackup } from './dataTransfer.js';

describe('数据备份', () => {
  it('生成带版本的备份', () => expect(createBackup({ bgId: 'night_view' })).toMatchObject({ product: 'catzzhome', version: 27 }));
  it('拒绝未知备份', () => expect(() => parseBackup('{"product":"other"}')).toThrow('invalid_backup'));
});
