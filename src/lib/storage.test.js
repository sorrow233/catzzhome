// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { getDefaultSettings, readSettings, STORAGE_KEY, writeSettings } from './storage.js';

describe('2.7 settings storage', () => {
  beforeEach(() => localStorage.clear());

  it('migrates legacy bookmarks into the favorites group', () => {
    localStorage.setItem('catzz_bookmarks', JSON.stringify([{ name: 'Example', url: 'https://example.com' }]));
    const settings = readSettings([]);
    expect(settings.schemaVersion).toBe(27);
    expect(settings.bookmarks[0].groupId).toBe('favorites');
  });

  it('recovers safe collection types from corrupted imported data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: 'broken', notes: null, search: 'bad', updatedAt: '12' }));
    const settings = readSettings([]);
    expect(settings.tasks).toEqual([]);
    expect(settings.notes).toEqual([]);
    expect(settings.search).toEqual(getDefaultSettings().search);
    expect(settings.updatedAt).toBe(12);
  });

  it('caps synced collections before persisting', () => {
    const settings = getDefaultSettings();
    settings.tasks = Array.from({ length: 30 }, (_, id) => ({ id }));
    writeSettings(settings);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).tasks).toHaveLength(20);
  });
});
