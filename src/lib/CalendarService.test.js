import { describe, expect, it } from 'vitest';
import { parseIcs } from './CalendarService.js';

describe('ICS 日历导入', () => {
  it('读取事件并按时间排序', () => {
    const result = parseIcs('BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:20260813T090000Z\nSUMMARY:Morning\\, focus\nEND:VEVENT\nEND:VCALENDAR');
    expect(result[0]).toMatchObject({ title: 'Morning, focus', start: '2026-08-13T09:00:00.000Z' });
  });
  it('忽略不完整事件', () => expect(parseIcs('BEGIN:VEVENT\nSUMMARY:No date\nEND:VEVENT')).toEqual([]));
});
