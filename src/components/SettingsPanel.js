import { Dialog } from './Dialog.js';
import { i18n } from '../lib/I18n.js';
import { createBackup, downloadJson, parseBackup } from '../lib/dataTransfer.js';
import { importBookmarkHtml } from '../lib/bookmarkValidation.js';

export class SettingsPanel {
  constructor({ root, settings, bookmarks, installer, onRestore, onDeleteLocal, onDeleteCloud, announce }) {
    this.root = root;
    this.settings = settings;
    this.bookmarks = bookmarks;
    this.installer = installer;
    this.onRestore = onRestore;
    this.onDeleteLocal = onDeleteLocal;
    this.onDeleteCloud = onDeleteCloud;
    this.announce = announce;
    this.element = root.querySelector('[data-settings-dialog]');
    this.dialog = new Dialog(this.element);
  }

  mount() {
    this.root.querySelectorAll('[data-open-settings]').forEach((button) => button.addEventListener('click', () => this.open()));
    this.bindTabs(); this.bindGeneral(); this.bindData();
  }

  open(page = 'general') { this.showPage(page); this.dialog.open(this.element.querySelector(`[data-settings-tab="${page}"]`)); }
  bindTabs() { this.element.querySelectorAll('[data-settings-tab]').forEach((button) => button.addEventListener('click', () => this.showPage(button.dataset.settingsTab))); }
  showPage(page) {
    this.element.querySelectorAll('[data-settings-tab]').forEach((button) => button.classList.toggle('active', button.dataset.settingsTab === page));
    this.element.querySelectorAll('[data-settings-page]').forEach((section) => { section.hidden = section.dataset.settingsPage !== page; });
  }

  bindGeneral() {
    this.element.querySelector('[data-language]').addEventListener('change', (event) => {
      i18n.setLanguage(event.target.value); const url = new URL(location.href); url.searchParams.set('lang', event.target.value); location.assign(url);
    });
    this.element.querySelector('[data-install-app]').addEventListener('click', async (event) => {
      const result = await this.installer.install();
      if (result === 'installed' || this.installer.isInstalled()) event.currentTarget.textContent = i18n.t('installed');
      else if (result === 'unavailable') this.announce(i18n.t('install_unavailable'));
    });
  }

  bindData() {
    this.element.querySelector('[data-bookmark-import]').addEventListener('change', async (event) => { const file = event.target.files[0]; if (!file) return; this.bookmarks.mergeImported(importBookmarkHtml(await file.text())); this.announce(i18n.t('imported')); });
    this.element.querySelector('[data-export]').addEventListener('click', () => downloadJson(`catzz-backup-${new Date().toISOString().slice(0, 10)}.json`, createBackup(this.settings)));
    this.element.querySelector('[data-import]').addEventListener('change', async (event) => {
      try { const settings = parseBackup(await event.target.files[0].text()); this.onRestore(settings); this.announce(i18n.t('imported')); }
      catch { this.announce(i18n.t('backup_invalid')); }
    });
    this.element.querySelector('[data-delete-local]').addEventListener('click', () => { if (confirm(i18n.t('delete_confirm'))) this.onDeleteLocal(); });
    this.element.querySelector('[data-delete-cloud]').addEventListener('click', () => { if (confirm(i18n.t('delete_confirm'))) this.onDeleteCloud(); });
  }
}
