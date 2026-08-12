import { calculate } from './calculator.js';

export const SEARCH_ENGINES = {
  google: { name: 'Google', url: 'https://www.google.com/search?q=' },
  bing: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=' }
};

const bangs = {
  g: SEARCH_ENGINES.google.url,
  b: SEARCH_ENGINES.bing.url,
  d: SEARCH_ENGINES.duckduckgo.url,
  bd: SEARCH_ENGINES.baidu.url,
  yt: 'https://www.youtube.com/results?search_query=',
  gh: 'https://github.com/search?q=',
  bi: 'https://search.bilibili.com/all?keyword='
};

export function classifyInput(raw, engine = 'google') {
  const input = raw.trim();
  if (!input) return { type: 'empty' };
  const calculation = calculate(input);
  if (calculation !== null) return { type: 'calculation', value: calculation };
  if (input.startsWith('/')) {
    const [command, ...parts] = input.slice(1).split(/\s+/);
    return { type: 'command', command: command.toLowerCase(), argument: parts.join(' ') };
  }
  const bangMatch = input.match(/^@([a-z]+)\s+(.+)$/i);
  if (bangMatch && bangs[bangMatch[1].toLowerCase()]) return { type: 'url', url: `${bangs[bangMatch[1].toLowerCase()]}${encodeURIComponent(bangMatch[2])}` };
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : /^(localhost|[\w-]+(?:\.[\w-]+)+)(?:[/:?#]|$)/i.test(input) ? `https://${input}` : null;
  if (candidate) {
    try {
      const url = new URL(candidate);
      if (['http:', 'https:'].includes(url.protocol)) return { type: 'url', url: url.href };
    } catch { /* Search instead. */ }
  }
  const selected = SEARCH_ENGINES[engine] || SEARCH_ENGINES.google;
  return { type: 'url', url: `${selected.url}${encodeURIComponent(input)}` };
}

export function searchBookmarks(bookmarks, query, limit = 5) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  return bookmarks
    .filter((bookmark) => `${bookmark.name} ${bookmark.url}`.toLocaleLowerCase().includes(needle))
    .slice(0, limit);
}

export const COMMANDS = [
  { name: 'focus', hint: '/focus 25' },
  { name: 'note', hint: '/note …' },
  { name: 'weather', hint: '/weather' },
  { name: 'settings', hint: '/settings' },
  { name: 'export', hint: '/export' }
];
