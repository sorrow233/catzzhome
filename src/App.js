import { HERO_CONFIG } from './config/HeroConfig.js';
import { createHeroView } from './components/HeroView.js';
import { BookmarkComponent } from './components/BookmarkComponent.js';
import { ClockWeather } from './components/ClockWeather.js';
import { CommandCenter } from './components/CommandCenter.js';
import { QuoteWidget } from './components/QuoteWidget.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { WallpaperGallery } from './components/WallpaperGallery.js';
import { AssetStore } from './lib/AssetStore.js';
import { createBackup, downloadJson } from './lib/dataTransfer.js';
import { IconCache } from './lib/IconCache.js';
import { IconResolver } from './lib/IconResolver.js';
import { i18n } from './lib/I18n.js';
import { PwaInstaller } from './lib/PwaInstaller.js';
import { RainAnimation } from './lib/RainAnimation.js';
import { regionalSearchEngine } from './lib/RegionalSearch.js';
import { SiteMetadata } from './lib/SiteMetadata.js';
import { readSettings, resetSettings, writeSettings } from './lib/storage.js';
import { sanitizeBookmarks } from './lib/bookmarkValidation.js';
import { SyncManager } from './lib/SyncManager.js';
import { WallpaperController } from './lib/WallpaperController.js';

export class App {
  constructor(root) {
    this.root = root;
    this.settings = readSettings(HERO_CONFIG.defaultBookmarks);
    this.settings.bookmarks = sanitizeBookmarks(this.settings.bookmarks, HERO_CONFIG.defaultBookmarks);
    if (!this.settings.search.regionInitialized && !this.settings.search.userSelected) {
      const country = document.querySelector('meta[name="catzz-country"]')?.content || '';
      this.settings.search = { ...this.settings.search, engine: regionalSearchEngine({ country, language: navigator.language }), regionInitialized: true };
      writeSettings(this.settings, { touch: false });
    }
    this.assetStore = new AssetStore();
  }

  async mount() {
    i18n.applyDocumentLanguage();
    await this.reconcileLocalWallpaper();
    this.view = createHeroView(this.settings);
    this.root.replaceChildren(this.view);
    this.status = this.view.querySelector('[data-status]');

    this.wallpaper = new WallpaperController({
      element: this.view.querySelector('[data-wallpaper]'), gradient: this.view.querySelector('[data-gradient]'), wallpapers: HERO_CONFIG.wallpapers,
      urls: HERO_CONFIG.wallpaperUrls, selectedId: this.settings.bgId, cinematicPrefs: this.settings.cinematicPrefs,
      assetStore: this.assetStore, customWallpaper: this.settings.customWallpaper
    });
    await this.wallpaper.mount(this.settings.preferences.sceneMode);

    this.iconCache = new IconCache();
    this.metadata = new SiteMetadata();
    this.bookmarks = new BookmarkComponent({
      container: this.view.querySelector('[data-bookmarks]'), groupsElement: this.view.querySelector('[data-bookmark-groups]'),
      dialogElement: this.view.querySelector('[data-bookmark-dialog]'), iconResolver: new IconResolver(this.iconCache, this.metadata), metadataService: this.metadata,
      bookmarks: this.settings.bookmarks, groups: this.settings.bookmarkGroups, activeGroup: this.settings.activeBookmarkGroup,
      onChange: (partial) => this.update(partial), announce: (message) => this.announce(message)
    });
    this.bookmarks.mount();

    this.clockWeather = new ClockWeather({ root: this.view, settings: this.settings, onChange: (partial) => this.update(partial), announce: (message) => this.announce(message) });
    this.clockWeather.start();
    this.installer = new PwaInstaller();
    this.settingsPanel = new SettingsPanel({
      root: this.view, settings: this.settings, bookmarks: this.bookmarks, installer: this.installer,
      onChange: (partial) => this.update(partial), onRestore: (settings) => this.applySettings(settings), onDeleteLocal: () => this.deleteLocal(),
      onDeleteCloud: () => this.sync.deleteCloud(), announce: (message) => this.announce(message)
    });
    this.settingsPanel.mount();
    this.wallpaperGallery = new WallpaperGallery({
      root: this.view, settings: this.settings, wallpapers: HERO_CONFIG.wallpapers, controller: this.wallpaper, assetStore: this.assetStore,
      onChange: (partial) => this.update(partial), announce: (message) => this.announce(message)
    });
    this.wallpaperGallery.mount();

    this.command = new CommandCenter({
      root: this.view, getBookmarks: () => this.bookmarks.getAll(), getEngine: () => this.settings.search.engine,
      openInNewTab: () => this.settings.search.openInNewTab, announce: (message) => this.announce(message),
      commands: {
        weather: () => this.clockWeather.handleClick(), settings: () => this.settingsPanel.open(),
        export: () => downloadJson(`catzz-backup-${new Date().toISOString().slice(0, 10)}.json`, createBackup(this.settings))
      }
    });
    this.command.mount();

    this.quotes = new QuoteWidget(this.view.querySelector('[data-quote]')); this.quotes.start();
    this.rain = new RainAnimation(this.view.querySelector('[data-rain]')); this.rain.start();
    this.sync = new SyncManager({ button: this.view.querySelector('[data-sync]'), getSettings: () => this.cloudSettings(), applySettings: (settings) => this.applySettings(settings), announce: (message) => this.announce(message) });
  }

  update(partial) {
    Object.assign(this.settings, partial);
    this.settings.updatedAt = writeSettings(this.settings);
    this.sync?.scheduleSave();
  }

  async applySettings(remote) {
    const current = readSettings(HERO_CONFIG.defaultBookmarks);
    const merged = {
      ...current, ...remote,
      search: { ...current.search, ...remote.search }, weather: { ...current.weather, ...remote.weather },
      preferences: { ...current.preferences, ...remote.preferences }, customWallpaper: current.customWallpaper,
      bookmarks: sanitizeBookmarks(remote.bookmarks, current.bookmarks), updatedAt: Number(remote.updatedAt) || Date.now()
    };
    if (merged.customWallpaper.enabled && !(await this.hasCustomWallpaper())) merged.customWallpaper = { enabled: false, name: '' };
    Object.assign(this.settings, merged);
    writeSettings(this.settings, { touch: false });
    await this.wallpaper.select(this.settings.bgId);
    this.wallpaper.cinematicPrefs = this.settings.cinematicPrefs; this.wallpaper.applyTheme();
    this.bookmarks.setData(this.settings); this.settingsPanel.syncControls(); this.wallpaperGallery.syncControls();
  }

  async hasCustomWallpaper() { try { return Boolean(await this.assetStore.get('custom-wallpaper')); } catch { return false; } }
  async reconcileLocalWallpaper() {
    if (!this.settings.customWallpaper.enabled || await this.hasCustomWallpaper()) return;
    this.settings.customWallpaper = { enabled: false, name: '' };
    writeSettings(this.settings, { touch: false });
  }
  cloudSettings() { const settings = structuredClone(this.settings); settings.customWallpaper = { enabled: false, name: '' }; return settings; }
  async deleteLocal() { resetSettings(); await this.assetStore.clear(); location.reload(); }
  announce(message) {
    this.status.textContent = message; this.status.classList.add('is-visible'); window.clearTimeout(this.statusTimer);
    this.statusTimer = window.setTimeout(() => this.status.classList.remove('is-visible'), 3200);
  }
}
