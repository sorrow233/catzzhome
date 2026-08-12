import { createId } from './id.js';

export function parseIcs(text) {
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  const blocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
  return blocks.flatMap((block) => {
    const summary = valueFor(block, 'SUMMARY');
    const rawStart = valueFor(block, 'DTSTART');
    if (!summary || !rawStart) return [];
    const start = parseIcsDate(rawStart);
    if (!start || Number.isNaN(start.getTime())) return [];
    return [{ id: createId('event'), title: unescapeIcs(summary).slice(0, 120), start: start.toISOString() }];
  }).sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 50);
}

function valueFor(block, key) {
  const match = block.match(new RegExp(`^${key}(?:;[^:]*)?:(.+)$`, 'm'));
  return match?.[1]?.trim();
}

function parseIcsDate(value) {
  if (/^\d{8}$/.test(value)) return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00:00`);
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second, utc] = match;
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${utc}`;
  return new Date(iso);
}

function unescapeIcs(value) { return value.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1'); }
