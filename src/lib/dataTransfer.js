import { getDefaultSettings, writeSettings } from './storage.js';

export function downloadJson(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function createBackup(settings) {
  return { product: 'catzzhome', version: 27, exportedAt: new Date().toISOString(), settings };
}

export function parseBackup(text) {
  const parsed = JSON.parse(text);
  if (parsed?.product !== 'catzzhome' || parsed?.version !== 27 || !parsed.settings) throw new Error('invalid_backup');
  const merged = { ...getDefaultSettings(), ...parsed.settings, schemaVersion: 27, updatedAt: Date.now() };
  writeSettings(merged, { touch: false });
  return merged;
}
