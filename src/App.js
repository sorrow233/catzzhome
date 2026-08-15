import { HERO_CONFIG } from './config/HeroConfig.js';
import { createHeroView } from './components/HeroView.js';
import { BookmarkComponent } from './components/BookmarkComponent.js';
import { BrandInteraction } from './components/BrandInteraction.js';
import { DateTime } from './components/DateTime.js';
import { WallpaperPicker } from './components/WallpaperPicker.js';
import { QuoteWidget } from './components/QuoteWidget.js';
import { IconCache } from './lib/IconCache.js';
import { IconResolver } from './lib/IconResolver.js';
import { i18n } from './lib/I18n.js';
import { RainAnimation } from './lib/RainAnimation.js';
import { SiteMetadata } from './lib/SiteMetadata.js';
import { readSettings, writeSettings } from './lib/storage.js';
import { sanitizeBookmarks } from './lib/bookmarkValidation.js';
import { SyncManager } from './lib/SyncManager.js';
import { WallpaperController } from './lib/WallpaperController.js';

export class App {
  constructor(root) {
    this.root = root;
    this.settings = readSettings(HERO_CONFIG.defaultBookmarks, 'flower_window');
    this.settings.bookmarks = sanitizeBookmarks(this.settings.bookmarks, HERO_CONFIG.defaultBookmarks);
  }

  mount() {
    i18n.applyDocumentLanguage();
    this.view = createHeroView();
    this.root.replaceChildren(this.view);
    this.status = this.view.querySelector('[data-status]');

    this.wallpaper = new WallpaperController({
      element: this.view.querySelector('[data-wallpaper]'),
      gradient: this.view.querySelector('[data-gradient]'),
      wallpapers: HERO_CONFIG.wallpapers,
      urls: HERO_CONFIG.wallpaperUrls,
      selectedId: this.settings.bgId,
      cinematicPrefs: this.settings.cinematicPrefs
    });
    this.wallpaper.mount();

    this.iconCache = new IconCache();
    this.metadata = new SiteMetadata();
    this.bookmarks = new BookmarkComponent({
      container: this.view.querySelector('[data-bookmarks]'),
      dialogElement: this.view.querySelector('[data-bookmark-dialog]'),
      iconResolver: new IconResolver(this.iconCache, this.metadata),
      metadataService: this.metadata,
      bookmarks: this.settings.bookmarks,
      onChange: (bookmarks) => this.update({ bookmarks }),
      announce: (message) => this.announce(message)
    });
    this.bookmarks.mount();

    this.picker = new WallpaperPicker({
      root: this.view,
      wallpapers: HERO_CONFIG.wallpapers,
      activeId: this.wallpaper.selectedId,
      cinematic: this.wallpaper.getCinematic(),
      onWallpaper: (id) => this.changeWallpaper(id),
      onCinematic: (value) => this.changeCinematic(value)
    });
    this.brandInteraction = new BrandInteraction({ root: this.view, openWallpapers: () => this.picker.open() });
    this.brandInteraction.mount();
    this.dateTime = new DateTime(this.view);
    this.dateTime.start();

    this.quotes = new QuoteWidget(this.view.querySelector('[data-quote]'));
    this.quotes.start();
    this.rain = new RainAnimation(this.view.querySelector('[data-rain]'));
    this.rain.start();
    this.sync = new SyncManager({
      button: this.view.querySelector('[data-sync]'),
      getSettings: () => ({ ...this.settings }),
      applySettings: (settings) => this.applyRemote(settings),
      announce: (message) => this.announce(message)
    });
  }

  async changeWallpaper(id) {
    const changed = await this.wallpaper.select(id);
    if (!changed) return false;
    this.picker.setCinematic(this.wallpaper.getCinematic());
    this.update({ bgId: id, cinematicPrefs: this.wallpaper.cinematicPrefs });
    return true;
  }

  changeCinematic(value) {
    this.wallpaper.setCinematic(value);
    this.update({ cinematicPrefs: this.wallpaper.cinematicPrefs });
  }

  update(partial) {
    Object.assign(this.settings, partial);
    this.settings.updatedAt = writeSettings(this.settings);
    this.sync?.scheduleSave();
  }

  async applyRemote(remote) {
    const validWallpaper = HERO_CONFIG.wallpapers.some((item) => item.id === remote.bgId) ? remote.bgId : this.settings.bgId;
    this.settings = {
      bgId: validWallpaper,
      cinematicPrefs: remote.cinematicPrefs && typeof remote.cinematicPrefs === 'object' ? remote.cinematicPrefs : {},
      bookmarks: sanitizeBookmarks(remote.bookmarks, this.settings.bookmarks),
      updatedAt: Number(remote.updatedAt) || Date.now()
    };
    writeSettings(this.settings, { touch: false });
    await this.wallpaper.select(validWallpaper);
    this.wallpaper.cinematicPrefs = this.settings.cinematicPrefs;
    this.wallpaper.applyTheme();
    this.picker.setActive(validWallpaper);
    this.picker.setCinematic(this.wallpaper.getCinematic());
    this.bookmarks.setBookmarks(this.settings.bookmarks);
  }

  announce(message) {
    this.status.textContent = message;
    this.status.classList.add('is-visible');
    window.clearTimeout(this.statusTimer);
    this.statusTimer = window.setTimeout(() => this.status.classList.remove('is-visible'), 3200);
  }
}
