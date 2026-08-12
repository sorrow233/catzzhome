const STORAGE_KEY = 'catzz_settings_v27';
const LEGACY_KEYS = {
  wallpaper: 'catzz_bg_id',
  cinematic: 'catzz_cinematic_prefs',
  bookmarks: 'catzz_bookmarks',
  updatedAt: 'catzz_updated_at'
};

const defaultSettings = {
  schemaVersion: 27,
  bgId: 'flower_window',
  cinematicPrefs: {},
  bookmarks: [],
  bookmarkGroups: [{ id: 'favorites', name: 'Favorites' }],
  activeBookmarkGroup: 'favorites',
  search: { engine: 'google', openInNewTab: false },
  weather: { enabled: false, latitude: null, longitude: null, label: '' },
  focus: { minutes: 25, remainingSeconds: 1500, running: false, endsAt: null, sessionsToday: 0, sessionDate: '' },
  tasks: [],
  notes: [],
  calendarEvents: [],
  preferences: { sceneMode: 'manual', density: 'calm', ambient: 'rain', ambientVolume: 0.28 },
  customWallpaper: { enabled: false, name: '' },
  onboardingComplete: false,
  updatedAt: 0
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}

function migrateLegacy(defaultBookmarks) {
  const bookmarks = readJson(LEGACY_KEYS.bookmarks, defaultBookmarks).map((bookmark) => ({ ...bookmark, groupId: bookmark.groupId || 'favorites' }));
  return {
    ...structuredClone(defaultSettings),
    bgId: localStorage.getItem(LEGACY_KEYS.wallpaper) || defaultSettings.bgId,
    cinematicPrefs: readJson(LEGACY_KEYS.cinematic, {}),
    bookmarks,
    updatedAt: Number(localStorage.getItem(LEGACY_KEYS.updatedAt)) || 0
  };
}

function mergeSettings(source, defaults = defaultSettings) {
  const candidate = isRecord(source) ? source : {};
  return {
    ...structuredClone(defaults),
    ...candidate,
    schemaVersion: 27,
    bgId: typeof candidate.bgId === 'string' ? candidate.bgId : defaults.bgId,
    cinematicPrefs: isRecord(candidate.cinematicPrefs) ? candidate.cinematicPrefs : structuredClone(defaults.cinematicPrefs),
    bookmarks: arrayOr(candidate.bookmarks, defaults.bookmarks, 24),
    bookmarkGroups: arrayOr(candidate.bookmarkGroups, defaults.bookmarkGroups, 12),
    activeBookmarkGroup: typeof candidate.activeBookmarkGroup === 'string' ? candidate.activeBookmarkGroup : defaults.activeBookmarkGroup,
    search: mergeRecord(defaults.search, candidate.search),
    weather: mergeRecord(defaults.weather, candidate.weather),
    focus: mergeRecord(defaults.focus, candidate.focus),
    tasks: arrayOr(candidate.tasks, defaults.tasks, 20),
    notes: arrayOr(candidate.notes, defaults.notes, 30),
    calendarEvents: arrayOr(candidate.calendarEvents, defaults.calendarEvents, 50),
    preferences: mergeRecord(defaults.preferences, candidate.preferences),
    customWallpaper: mergeRecord(defaults.customWallpaper, candidate.customWallpaper),
    onboardingComplete: typeof candidate.onboardingComplete === 'boolean' ? candidate.onboardingComplete : defaults.onboardingComplete,
    updatedAt: Number.isFinite(Number(candidate.updatedAt)) ? Number(candidate.updatedAt) : 0
  };
}

function isRecord(value) { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function mergeRecord(defaults, value) { return { ...defaults, ...(isRecord(value) ? value : {}) }; }
function arrayOr(value, fallback, limit) { return (Array.isArray(value) ? value : fallback).slice(0, limit); }

export function readSettings(defaultBookmarks = []) {
  try {
    const stored = readJson(STORAGE_KEY, null);
    return stored ? mergeSettings(stored) : migrateLegacy(defaultBookmarks);
  } catch { return mergeSettings({ bookmarks: defaultBookmarks }); }
}

export function writeSettings(settings, { touch = true } = {}) {
  const normalized = mergeSettings(settings);
  normalized.schemaVersion = 27;
  normalized.updatedAt = touch ? Date.now() : Number(settings.updatedAt) || Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized.updatedAt;
}

export function resetSettings() {
  localStorage.removeItem(STORAGE_KEY);
  Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getDefaultSettings() { return structuredClone(defaultSettings); }
export { STORAGE_KEY };
