import { i18n, LOCALES } from '../lib/I18n.js';

const cloudIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-10A5 5 0 0 0 6.1 11.1 4 4 0 0 0 3 15Z"/></svg>';

export function createHeroView() {
  const root = document.createElement('section');
  root.className = 'hero';
  root.innerHTML = `
    <div class="hero__backdrop" data-wallpaper aria-hidden="true"></div>
    <div class="hero__gradient" data-gradient aria-hidden="true"></div>
    <canvas class="hero__rain" data-rain aria-hidden="true"></canvas>
    <button class="icon-button sync-button" type="button" data-sync aria-label="${i18n.t('sync')}" aria-live="polite">
      <span data-sync-icon>${cloudIcon}</span><span class="sr-only" data-sync-label>${i18n.t('sync_idle')}</span>
    </button>
    <div class="hero__content">
      <button class="brand-button" type="button" data-open-wallpapers aria-label="${i18n.t('theme_hint')}">
        <span class="brand">${i18n.t('title')}</span>
        <span class="subtitle">${i18n.t('subtitle')}</span>
      </button>
      <p class="quote" data-quote aria-live="polite"><span data-prefix></span><span data-suffix></span></p>
      <nav class="bookmarks" id="bookmark-grid" data-bookmarks aria-label="${i18n.t('bookmark_actions')}"></nav>
    </div>
    <p class="status-toast" data-status role="status" aria-live="polite"></p>
    ${wallpaperDialog()}
    ${bookmarkDialog()}`;
  return root;
}

function wallpaperDialog() {
  const localeOptions = LOCALES.map((locale) => `<option value="${locale}" ${locale === i18n.getLocale() ? 'selected' : ''}>${localeLabel(locale)}</option>`).join('');
  return `<div class="dialog" data-wallpaper-dialog role="dialog" aria-modal="true" aria-labelledby="wallpaper-title" hidden>
    <section class="dialog__panel dialog__panel--wide" data-dialog-panel>
      <header class="dialog__header"><div><p class="eyebrow">CATZZ ATMOSPHERE</p><h2 id="wallpaper-title">${i18n.t('theme')}</h2></div>
        <button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header>
      <div class="setting-row">
        <label for="language-select">${i18n.t('language')}</label>
        <select id="language-select" data-language>${localeOptions}</select>
      </div>
      <label class="setting-row" for="cinematic-toggle"><span>${i18n.t('cinematic')}</span>
        <input id="cinematic-toggle" data-cinematic type="checkbox" role="switch" /></label>
      <div class="wallpaper-grid" data-wallpaper-grid></div>
    </section>
  </div>`;
}

function bookmarkDialog() {
  return `<div class="dialog" data-bookmark-dialog role="dialog" aria-modal="true" aria-labelledby="bookmark-dialog-title" hidden>
    <form class="dialog__panel bookmark-form" data-dialog-panel data-bookmark-form novalidate>
      <header class="dialog__header"><div><p class="eyebrow">SHORTCUT</p><h2 id="bookmark-dialog-title" data-bookmark-title>${i18n.t('add_title')}</h2></div>
        <button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header>
      <div class="icon-preview" data-preview aria-label="${i18n.t('preview')}"><span>${i18n.t('empty_icon')}</span></div>
      <label class="field"><span>${i18n.t('url')}</span><input name="url" type="url" inputmode="url" autocomplete="url" placeholder="https://example.com" required maxlength="2048" /></label>
      <label class="field"><span>${i18n.t('name')}</span><input name="name" type="text" autocomplete="off" required maxlength="40" /></label>
      <p class="form-error" data-form-error role="alert"></p>
      <footer class="dialog__actions"><button class="button button--secondary" type="button" data-dialog-close>${i18n.t('cancel')}</button><button class="button" type="submit">${i18n.t('save')}</button></footer>
    </form>
  </div>`;
}

function localeLabel(locale) {
  return { zh: '简体中文', 'zh-TW': '繁體中文', en: 'English', ja: '日本語', ko: '한국어' }[locale];
}

export function userAvatar(photoURL) {
  if (!photoURL) return cloudIcon;
  const image = document.createElement('img');
  image.src = photoURL;
  image.alt = '';
  image.referrerPolicy = 'no-referrer';
  return image;
}
