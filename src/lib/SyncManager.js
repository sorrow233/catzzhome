import { i18n } from './I18n.js';

export class SyncManager {
  constructor({ button, getSettings, applySettings, announce }) {
    this.button = button;
    this.getSettings = getSettings;
    this.applySettings = applySettings;
    this.announce = announce;
    this.user = null;
    this.firebase = null;
    this.unsubscribe = null;
    this.saveTimer = null;
    this.loading = null;
    this.button.addEventListener('click', () => this.handleClick());
    addEventListener('online', () => this.user && this.flush());
    addEventListener('offline', () => this.setStatus('offline'));
    if (localStorage.getItem('catzz_sync_enabled') === 'true') this.start();
  }

  async load() {
    if (!this.loading) this.loading = import('./firebase.js').then((module) => { this.firebase = module; return module; });
    return this.loading;
  }

  async start() {
    this.setStatus('sync_loading');
    try {
      const firebase = await this.load();
      if (!this.unsubscribe) this.unsubscribe = firebase.observeAuth((user) => this.onAuth(user));
    } catch (error) {
      console.error('Firebase initialization failed', error);
      this.setStatus('sync_error');
    }
  }

  async onAuth(user) {
    this.user = user;
    if (!user) {
      localStorage.removeItem('catzz_sync_enabled');
      this.renderUser();
      this.setStatus('sync_idle');
      return;
    }
    localStorage.setItem('catzz_sync_enabled', 'true');
    this.renderUser();
    try {
      const remote = await retry(() => this.firebase.fetchSettings(user.uid));
      const local = this.getSettings();
      if (remote && Number(remote.updatedAt) > Number(local.updatedAt)) this.applySettings(remote);
      else await retry(() => this.firebase.saveSettings(user.uid, local));
      this.setStatus('sync_success');
    } catch (error) {
      console.error('Settings synchronization failed', error);
      this.setStatus('sync_error');
    }
  }

  scheduleSave() {
    if (!this.user) return;
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flush(), 700);
  }

  async flush() {
    if (!this.user || !navigator.onLine) return;
    try {
      await retry(() => this.firebase.saveSettings(this.user.uid, this.getSettings()));
      this.setStatus('sync_success');
    } catch (error) {
      console.error('Settings upload failed', error);
      this.setStatus('sync_error');
    }
  }

  async deleteCloud() {
    if (!this.user) { await this.handleClick(); return false; }
    try {
      await retry(() => this.firebase.deleteSettings(this.user.uid));
      this.setStatus('sync_success');
      return true;
    } catch (error) {
      console.error('Cloud data deletion failed', error);
      this.setStatus('sync_error');
      return false;
    }
  }

  async handleClick() {
    try {
      await this.start();
      if (this.user) {
        if (confirm(i18n.t('logout_confirm'))) await this.firebase.logout();
      } else {
        await this.firebase.login();
      }
    } catch (error) {
      console.error('Authentication failed', error);
      this.announce(i18n.t('login_failed'));
      this.setStatus('sync_error');
    }
  }

  renderUser() {
    const icon = this.button.querySelector('[data-sync-icon]');
    if (!this.user?.photoURL) {
      icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-10A5 5 0 0 0 6.1 11.1 4 4 0 0 0 3 15Z"/></svg>';
      return;
    }
    icon.replaceChildren();
    const image = document.createElement('img');
    image.src = this.user.photoURL;
    image.alt = '';
    image.referrerPolicy = 'no-referrer';
    icon.append(image);
  }

  setStatus(key) {
    const label = i18n.t(key);
    this.button.dataset.state = key;
    this.button.title = label;
    this.button.querySelector('[data-sync-label]').textContent = label;
    if (key === 'sync_error' || key === 'offline') this.announce(label);
  }
}

async function retry(operation, attempts = 3) {
  let lastError;
  for (let index = 0; index < attempts; index += 1) {
    try { return await operation(); } catch (error) {
      lastError = error;
      if (index < attempts - 1) await new Promise((resolve) => window.setTimeout(resolve, 400 * 2 ** index));
    }
  }
  throw lastError;
}
