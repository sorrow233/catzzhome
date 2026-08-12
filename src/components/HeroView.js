import { i18n, LOCALES } from '../lib/I18n.js';
import { SEARCH_ENGINES } from '../lib/SearchService.js';

const icons = {
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-10A5 5 0 0 0 6.1 11.1 4 4 0 0 0 3 15Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'
};

export function createHeroView(settings) {
  const root = document.createElement('section');
  root.className = 'hero';
  root.innerHTML = `
    <div class="hero__backdrop" data-wallpaper aria-hidden="true"></div>
    <div class="hero__gradient" data-gradient aria-hidden="true"></div>
    <canvas class="hero__rain" data-rain aria-hidden="true"></canvas>
    <header class="topbar">
      <button class="wordmark" type="button" data-open-settings aria-label="${i18n.t('theme_hint')}">${i18n.t('title')}</button>
      <div class="topbar__actions">
        <button class="weather-pill" type="button" data-weather hidden></button>
        <button class="icon-button" type="button" data-sync aria-label="${i18n.t('sync')}" aria-live="polite"><span data-sync-icon>${icons.cloud}</span><span class="sr-only" data-sync-label>${i18n.t('sync_idle')}</span></button>
        <button class="icon-button" type="button" data-open-settings aria-label="${i18n.t('settings')}">${icons.settings}</button>
      </div>
    </header>
    <div class="hero__content">
      <section class="now" aria-label="${i18n.t('today')}">
        <time class="clock" data-clock></time>
        <p class="date" data-date></p>
        <p class="quote" data-quote aria-live="polite"><span data-prefix></span><span data-suffix></span></p>
      </section>
      <section class="command" data-command>
        <form class="command__form" data-command-form role="search">
          <span class="command__icon">${icons.search}</span>
          <input data-command-input autocomplete="off" spellcheck="false" aria-label="${i18n.t('search_placeholder')}" placeholder="${i18n.t('search_placeholder')}" />
          <kbd>⌘ K</kbd>
        </form>
        <div class="command__results" data-command-results hidden></div>
        <p class="command__hint">${i18n.t('search_hint')}</p>
      </section>
      <section class="shortcut-area">
        <div class="group-tabs" data-bookmark-groups></div>
        <nav class="bookmarks" id="bookmark-grid" data-bookmarks aria-label="${i18n.t('bookmark_actions')}"></nav>
      </section>
    </div>
    <nav class="utility-dock" aria-label="${i18n.t('today')}">
      <button type="button" data-workspace-tab="today"><span>✓</span>${i18n.t('today')}</button>
      <button type="button" data-workspace-tab="focus"><span>◷</span>${i18n.t('focus')}</button>
      <button type="button" data-workspace-tab="notes"><span>✎</span>${i18n.t('notes')}</button>
      <button type="button" data-workspace-tab="calendar"><span>◇</span>${i18n.t('calendar')}</button>
    </nav>
    ${workspaceView()}
    <p class="status-toast" data-status role="status" aria-live="polite"></p>
    ${settingsDialog(settings)}
    ${bookmarkDialog()}
    ${onboardingDialog(settings)}`;
  return root;
}

function workspaceView() {
  return `<aside class="workspace" data-workspace aria-label="${i18n.t('today')}" hidden>
    <header class="workspace__header"><p class="eyebrow">CATZZ DAY</p><h2 data-workspace-title>${i18n.t('today')}</h2><button class="icon-button" type="button" data-workspace-close aria-label="${i18n.t('close')}">×</button></header>
    <section data-panel="today"><form class="inline-entry" data-task-form><input maxlength="80" placeholder="${i18n.t('new_task')}"/><button type="submit">＋</button></form><div class="task-list" data-task-list></div></section>
    <section data-panel="focus" hidden><div class="focus-clock"><button class="focus-ring" type="button" data-focus-toggle><strong data-focus-time>25:00</strong><span data-focus-action>${i18n.t('start')}</span></button><p><span data-focus-sessions>0</span> ${i18n.t('sessions')}</p></div><div class="focus-controls"><button type="button" data-focus-minutes="25">25</button><button type="button" data-focus-minutes="50">50</button><button type="button" data-focus-reset>${i18n.t('reset')}</button></div><div class="ambient-control"><label>${i18n.t('ambient')}<select data-ambient><option value="off">Off</option><option value="rain">Rain</option><option value="brown">Brown noise</option><option value="fire">Fireplace</option></select></label><input data-ambient-volume type="range" min="0" max="1" step="0.05" aria-label="${i18n.t('ambient')}" /></div></section>
    <section data-panel="notes" hidden><form class="note-entry" data-note-form><textarea maxlength="500" placeholder="${i18n.t('new_note')}"></textarea><button class="button" type="submit">${i18n.t('save')}</button></form><div class="note-list" data-note-list></div></section>
    <section data-panel="calendar" hidden><p class="next-event" data-next-event></p><div class="event-list" data-event-list></div><label class="file-button">${i18n.t('import_calendar')}<input type="file" accept=".ics,text/calendar" data-calendar-import hidden /></label></section>
  </aside>`;
}

function settingsDialog(settings) {
  const localeOptions = LOCALES.map((locale) => `<option value="${locale}" ${locale === i18n.getLocale() ? 'selected' : ''}>${localeLabel(locale)}</option>`).join('');
  const engineOptions = Object.entries(SEARCH_ENGINES).map(([id, engine]) => `<option value="${id}" ${id === settings.search.engine ? 'selected' : ''}>${engine.name}</option>`).join('');
  return `<div class="dialog" data-settings-dialog role="dialog" aria-modal="true" aria-labelledby="settings-title" hidden>
    <section class="dialog__panel dialog__panel--settings" data-dialog-panel>
      <header class="dialog__header"><div><p class="eyebrow">CATZZ 2.7 BETA</p><h2 id="settings-title">${i18n.t('settings')}</h2></div><button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header>
      <div class="settings-layout">
        <nav class="settings-nav"><button class="active" data-settings-tab="general">${i18n.t('settings')}</button><button data-settings-tab="appearance">${i18n.t('appearance')}</button><button data-settings-tab="data">${i18n.t('data_privacy')}</button></nav>
        <div class="settings-pages">
          <section data-settings-page="general">
            <label class="setting-row"><span>${i18n.t('language')}</span><select data-language>${localeOptions}</select></label>
            <label class="setting-row"><span>${i18n.t('search_engine')}</span><select data-search-engine>${engineOptions}</select></label>
            <label class="setting-row"><span>${i18n.t('open_new_tab')}</span><input data-search-new-tab type="checkbox" ${settings.search.openInNewTab ? 'checked' : ''}/></label>
            <button class="setting-action" type="button" data-enable-weather>${i18n.t('enable_weather')}</button>
            <button class="setting-action" type="button" data-install-app>${i18n.t('install_app')}</button>
          </section>
          <section data-settings-page="appearance" hidden>
            <label class="setting-row"><span>${i18n.t('cinematic')}</span><input data-cinematic type="checkbox" role="switch" /></label>
            <label class="setting-row"><span>${i18n.t('scene_mode')}</span><input data-scene-mode type="checkbox" ${settings.preferences.sceneMode === 'time' ? 'checked' : ''}/></label>
            <label class="setting-row"><span>${i18n.t('density')}</span><input data-density type="checkbox" ${settings.preferences.density === 'compact' ? 'checked' : ''}/></label>
            <div class="wallpaper-grid" data-wallpaper-grid></div>
            <div class="setting-actions"><label class="file-button">${i18n.t('custom_wallpaper')}<input type="file" accept="image/jpeg,image/png,image/webp" data-wallpaper-upload hidden /></label><button class="button button--secondary" type="button" data-wallpaper-remove>${i18n.t('remove_wallpaper')}</button></div>
          </section>
          <section data-settings-page="data" hidden>
            <div class="setting-actions setting-actions--stack"><label class="file-button">${i18n.t('import_bookmarks')}<input type="file" accept="text/html,.html" data-bookmark-import hidden /></label><button class="setting-action" type="button" data-export>${i18n.t('export_data')}</button><label class="file-button">${i18n.t('import_data')}<input type="file" accept="application/json,.json" data-import hidden /></label><button class="setting-action danger" type="button" data-delete-cloud>${i18n.t('delete_cloud')}</button><button class="setting-action danger" type="button" data-delete-local>${i18n.t('delete_local')}</button></div>
          </section>
        </div>
      </div>
    </section>
  </div>`;
}

function bookmarkDialog() {
  return `<div class="dialog" data-bookmark-dialog role="dialog" aria-modal="true" aria-labelledby="bookmark-dialog-title" hidden><form class="dialog__panel bookmark-form" data-dialog-panel data-bookmark-form novalidate><header class="dialog__header"><div><p class="eyebrow">SHORTCUT</p><h2 id="bookmark-dialog-title" data-bookmark-title>${i18n.t('add_title')}</h2></div><button class="icon-button dialog__close" type="button" data-dialog-close aria-label="${i18n.t('close')}">×</button></header><div class="icon-preview" data-preview aria-label="${i18n.t('preview')}">${i18n.t('empty_icon')}</div><label class="field"><span>${i18n.t('url')}</span><input name="url" type="url" inputmode="url" autocomplete="url" required maxlength="2048" /></label><label class="field"><span>${i18n.t('name')}</span><input name="name" type="text" required maxlength="40" /></label><label class="field"><span>${i18n.t('groups')}</span><select name="group"></select></label><p class="form-error" data-form-error role="alert"></p><footer class="dialog__actions"><button class="button button--secondary" type="button" data-dialog-close>${i18n.t('cancel')}</button><button class="button" type="submit">${i18n.t('save')}</button></footer></form></div>`;
}

function onboardingDialog(settings) {
  return `<div class="dialog onboarding" data-onboarding role="dialog" aria-modal="true" aria-labelledby="onboarding-title" ${settings.onboardingComplete ? 'hidden' : ''}><section class="dialog__panel onboarding__panel" data-dialog-panel><p class="eyebrow">WELCOME TO CATZZ</p><h2 id="onboarding-title">${i18n.t('onboarding_title')}</h2><p>${i18n.t('onboarding_body')}</p><div class="onboarding__choices"><label>${i18n.t('search_engine')}<select data-onboarding-engine>${Object.entries(SEARCH_ENGINES).map(([id, engine]) => `<option value="${id}">${engine.name}</option>`).join('')}</select></label><label class="choice"><input data-onboarding-weather type="checkbox"/><span>${i18n.t('enable_weather')}</span></label></div><div class="dialog__actions"><button class="button button--secondary" type="button" data-onboarding-later>${i18n.t('later')}</button><button class="button" type="button" data-onboarding-complete>${i18n.t('continue')}</button></div></section></div>`;
}

function localeLabel(locale) { return { zh: '简体中文', 'zh-TW': '繁體中文', en: 'English', ja: '日本語', ko: '한국어' }[locale]; }
