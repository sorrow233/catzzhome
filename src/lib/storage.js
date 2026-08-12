const keys = {
  wallpaper: 'catzz_bg_id', cinematic: 'catzz_cinematic_prefs', bookmarks: 'catzz_bookmarks', updatedAt: 'catzz_updated_at', guide: 'catzz_guide_seen'
};

export function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readSettings(defaultBookmarks, defaultWallpaper) {
  try {
    return {
      bgId: localStorage.getItem(keys.wallpaper) || defaultWallpaper,
      cinematicPrefs: readJson(keys.cinematic, {}),
      bookmarks: readJson(keys.bookmarks, defaultBookmarks),
      updatedAt: Number(localStorage.getItem(keys.updatedAt)) || 0
    };
  } catch {
    return { bgId: defaultWallpaper, cinematicPrefs: {}, bookmarks: defaultBookmarks, updatedAt: 0 };
  }
}

export function writeSettings(settings, { touch = true } = {}) {
  localStorage.setItem(keys.wallpaper, settings.bgId);
  writeJson(keys.cinematic, settings.cinematicPrefs);
  writeJson(keys.bookmarks, settings.bookmarks);
  const updatedAt = touch ? Date.now() : Number(settings.updatedAt) || Date.now();
  localStorage.setItem(keys.updatedAt, String(updatedAt));
  return updatedAt;
}

export { keys as storageKeys };
