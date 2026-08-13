import { i18n, LOCALES } from '../lib/I18n.js';
import { SEARCH_ENGINES } from '../lib/SearchService.js';

const icons = {
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-10A5 5 0 0 0 6.1 11.1 4 4 0 0 0 3 15Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  weather: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 18h10a4 4 0 0 0 .1-8 5 5 0 0 0-9.7 1.2A3.5 3.5 0 0 0 6.5 18Z"/></svg>'
};

export function createHeroView(settings) {
  const root = document.createElement('section');
  root.className = 'hero';
  root.innerHTML = `
    <div class="hero__backdrop" data-wallpaper aria-hidden="true"></div>
    <div class="hero__gradient" data-gradient aria-hidden="true"></div>
    <div class="hero__vignette" aria-hidden="true"></div>
    <canvas class="hero__rain" data-rain aria-hidden="true"></canvas>
    <header class="topbar">
      <span></span>
      <div class="topbar__actions">
        <button class="icon-button weather-button" type="button" data-weather aria-label="${i18n.t('enable_weather')}">${icons.weather}</button>
        <button class="icon-button" type="button" data-sync aria-label="${i18n.t('sync')}" aria-live="polite"><span data-sync-icon>${icons.cloud}</span><span class="sr-only" data-sync-label>${i18n.t('sync_idle')}</span></button>
        <button class="icon-button" type="button" data-open-settings aria-label="${i18n.t('settings')}">${icons.settings}</button>
      </div>
    </header>
    <div class="hero__content">
      <section class="now">
        <button class="brand-button" type="button" data-open-wallpapers aria-label="${i18n.t('theme_hint')}">
          <span class="brand">${i18n.t('title')}</span>
          <span class="subtitle">${i18n.t('subtitle')}</span>
        </button>
        <p class="date-line"><span data-date></span><span aria-hidden="true">·</span><time data-clock></time></p>
        <p class="quote" data-quote aria-live="polite"><span data-prefix></span><i aria-hidden="true"></i><span data-suffix></span></p>
      </section>
      <section class="command" data-command>
        <form class="command__form" data-command-form role="search">
          <span class="command__icon">${icons.search}</span>
          <input data-command-input autocomplete="off" spellcheck="false" aria-label="${i18n.t('search_placeholder')}" placeholder="${i18n.t('search_simple')}" />
          <kbd>⌘ K</kbd>
        </form>
        <div class="command__results" data-command-results hidden></div>
      </section>
      <section class="shortcut-area">
        <div class="group-tabs" data-bookmark-groups></div>
        <div class="bookmark-rail"><nav class="bookmarks" id="bookmark-grid" data-bookmarks aria-label="${i18n.t('bookmark_actions')}"></nav></div>
      </section>
    </div>
    <p class="status-toast" data-status role="status" aria-live="polite"></p>
    ${wallpaperDialog()}
    ${settingsDialog(settings)}
    ${bookmarkDialog()}`;
  return root;
}

function wallpaperDialog() {
  return `<div class="dialog wallpaper-dialog" data-wallpaper-dialog role="dialog" aria-modal="true" aria-labelledby="wallpaper-title" hidden>
    <section class="dialog__panel wallpaper-panel" data-dialog-panel>
      <header class="dialog__header"><div><p class="eyebrow">CATZZ ATMOSPHERE</p><h2 id="wallpaper-title">${i18n.t('theme')}</h2></div><button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header>
      <div class="wallpaper-gallery" data-wallpaper-gallery></div>
      <footer class="wallpaper-tools"><label><span>${i18n.t('cinematic')}</span><input data-gallery-cinematic type="checkbox" role="switch" /></label><label><span>${i18n.t('scene_mode')}</span><input data-gallery-scene type="checkbox" /></label><label class="file-button">${i18n.t('custom_wallpaper')}<input type="file" accept="image/jpeg,image/png,image/webp" data-gallery-upload hidden /></label><button class="button button--secondary" type="button" data-gallery-remove>${i18n.t('remove_wallpaper')}</button></footer>
    </section>
  </div>`;
}

function settingsDialog(settings) {
  const localeOptions = LOCALES.map((locale) => `<option value="${locale}" ${locale === i18n.getLocale() ? 'selected' : ''}>${localeLabel(locale)}</option>`).join('');
  const engineOptions = Object.entries(SEARCH_ENGINES).map(([id, engine]) => `<option value="${id}" ${id === settings.search.engine ? 'selected' : ''}>${engine.name}</option>`).join('');
  return `<div class="dialog" data-settings-dialog role="dialog" aria-modal="true" aria-labelledby="settings-title" hidden>
    <section class="dialog__panel dialog__panel--settings" data-dialog-panel>
      <header class="dialog__header"><div><p class="eyebrow">CATZZ 2.7 BETA</p><h2 id="settings-title">${i18n.t('settings')}</h2></div><button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header>
      <div class="settings-layout">
        <nav class="settings-nav"><button class="active" data-settings-tab="general">${i18n.t('settings')}</button><button data-settings-tab="data">${i18n.t('data_privacy')}</button></nav>
        <div class="settings-pages">
          <section data-settings-page="general"><label class="setting-row"><span>${i18n.t('language')}</span><select data-language>${localeOptions}</select></label><label class="setting-row"><span>${i18n.t('search_engine')}</span><select data-search-engine>${engineOptions}</select></label><label class="setting-row"><span>${i18n.t('open_new_tab')}</span><input data-search-new-tab type="checkbox" ${settings.search.openInNewTab ? 'checked' : ''}/></label><button class="setting-action" type="button" data-install-app>${i18n.t('install_app')}</button></section>
          <section data-settings-page="data" hidden><div class="setting-actions setting-actions--stack"><label class="file-button">${i18n.t('import_bookmarks')}<input type="file" accept="text/html,.html" data-bookmark-import hidden /></label><button class="setting-action" type="button" data-export>${i18n.t('export_data')}</button><label class="file-button">${i18n.t('import_data')}<input type="file" accept="application/json,.json" data-import hidden /></label><button class="setting-action danger" type="button" data-delete-cloud>${i18n.t('delete_cloud')}</button><button class="setting-action danger" type="button" data-delete-local>${i18n.t('delete_local')}</button></div></section>
        </div>
      </div>
    </section>
  </div>`;
}

function bookmarkDialog() {
  return `<div class="dialog" data-bookmark-dialog role="dialog" aria-modal="true" aria-labelledby="bookmark-dialog-title" hidden><form class="dialog__panel bookmark-form" data-dialog-panel data-bookmark-form novalidate><header class="dialog__header"><div><p class="eyebrow">SHORTCUT</p><h2 id="bookmark-dialog-title" data-bookmark-title>${i18n.t('add_title')}</h2></div><button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header><div class="icon-preview" data-preview aria-label="${i18n.t('preview')}">${i18n.t('empty_icon')}</div><p class="metadata-status" data-metadata-status aria-live="polite"></p><label class="field"><span>${i18n.t('url')}</span><input name="url" type="url" inputmode="url" autocomplete="url" required maxlength="2048" /></label><label class="field"><span>${i18n.t('name')}</span><input name="name" type="text" required maxlength="40" /></label><label class="field"><span>${i18n.t('groups')}</span><select name="group"></select></label><p class="form-error" data-form-error role="alert"></p><footer class="dialog__actions"><button class="button button--secondary" type="button" data-dialog-close>${i18n.t('cancel')}</button><button class="button" type="submit">${i18n.t('save')}</button></footer></form></div>`;
}

function localeLabel(locale) { return { zh: '简体中文', 'zh-TW': '繁體中文', en: 'English', ja: '日本語', ko: '한국어' }[locale]; }
