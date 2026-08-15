import { i18n } from '../lib/I18n.js';
import { Dialog } from './Dialog.js';
import { deriveName, MAX_BOOKMARKS, normalizeBookmark, sanitizeBookmarks } from '../lib/bookmarkValidation.js';

export class BookmarkComponent {
  constructor({ container, dialogElement, iconResolver, metadataService, bookmarks, onChange, announce }) {
    this.container = container;
    this.iconResolver = iconResolver;
    this.metadataService = metadataService;
    this.bookmarks = sanitizeBookmarks(bookmarks);
    this.onChange = onChange;
    this.announce = announce;
    this.form = dialogElement.querySelector('[data-bookmark-form]');
    this.title = dialogElement.querySelector('[data-bookmark-title]');
    this.error = dialogElement.querySelector('[data-form-error]');
    this.preview = dialogElement.querySelector('[data-preview]');
    this.metadataStatus = dialogElement.querySelector('[data-metadata-status]');
    this.dialog = new Dialog(dialogElement, { onClose: () => this.resetForm() });
    this.editingIndex = -1;
    this.nameEdited = false;
    this.detected = null;
    this.bindForm();
  }

  mount() { this.render(); }

  setBookmarks(bookmarks, { emit = false } = {}) {
    this.bookmarks = sanitizeBookmarks(bookmarks, this.bookmarks);
    this.render();
    if (emit) this.onChange(this.bookmarks);
  }

  render() {
    this.container.replaceChildren();
    const fragment = document.createDocumentFragment();
    this.bookmarks.forEach((bookmark, index) => fragment.append(this.createItem(bookmark, index)));
    if (this.bookmarks.length < MAX_BOOKMARKS) fragment.append(this.createAddButton());
    this.container.append(fragment);
  }

  createItem(bookmark, index) {
    const item = document.createElement('article');
    item.className = 'bookmark';
    const link = document.createElement('a');
    link.href = bookmark.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'bookmark__link';
    link.setAttribute('aria-label', bookmark.name);
    const icon = document.createElement('span');
    icon.className = 'bookmark__icon';
    icon.textContent = bookmark.name.charAt(0).toUpperCase();
    const label = document.createElement('span');
    label.className = 'bookmark__label';
    label.textContent = bookmark.name;
    link.append(icon, label);
    item.append(link);

    const actions = document.createElement('div');
    actions.className = 'bookmark__actions';
    actions.append(this.actionButton('edit', i18n.t('edit'), () => this.open(index)), this.actionButton('remove', i18n.t('remove'), () => this.remove(index)));
    item.append(actions);
    this.paintIcon(bookmark, icon);
    return item;
  }

  actionButton(kind, label, callback) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `bookmark__action bookmark__action--${kind}`;
    button.setAttribute('aria-label', label);
    button.textContent = kind === 'edit' ? '✎' : '×';
    button.addEventListener('click', callback);
    return button;
  }

  createAddButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'bookmark bookmark--add';
    button.innerHTML = '<span class="bookmark__icon">＋</span>';
    const label = document.createElement('span');
    label.className = 'bookmark__label';
    label.textContent = i18n.t('add');
    button.append(label);
    button.addEventListener('click', () => this.open());
    return button;
  }

  async paintIcon(bookmark, target) {
    const requestKey = `${bookmark.url}:${bookmark.iconUrl || ''}`;
    target.dataset.iconRequest = requestKey;
    const result = await this.iconResolver.resolve(bookmark);
    if (!target.isConnected || target.dataset.iconRequest !== requestKey) return;
    target.replaceChildren();
    if (result.type === 'text') { target.textContent = result.text; return; }
    if (result.mask) {
      const mask = document.createElement('span');
      mask.className = 'bookmark__mask';
      mask.style.maskImage = `url("${result.src}")`;
      mask.style.webkitMaskImage = `url("${result.src}")`;
      target.append(mask);
    } else {
      const image = document.createElement('img');
      image.src = result.src;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        if (target.isConnected) target.textContent = bookmark.name.charAt(0).toUpperCase() || '?';
      }, { once: true });
      target.append(image);
    }
  }

  bindForm() {
    const urlInput = this.form.elements.url;
    const nameInput = this.form.elements.name;
    urlInput.addEventListener('input', () => {
      window.clearTimeout(this.metadataTimer);
      this.detected = null;
      this.metadataStatus.textContent = '';
      this.metadataTimer = window.setTimeout(() => this.lookupMetadata(), 450);
    });
    urlInput.addEventListener('blur', () => this.lookupMetadata());
    nameInput.addEventListener('input', () => {
      this.nameEdited = true;
      this.updatePreview();
    });
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      window.clearTimeout(this.metadataTimer);
      if (this.metadataPromise) await this.metadataPromise.catch(() => null);
      else if (!this.detected) await this.lookupMetadata().catch(() => null);
      const candidate = normalizeBookmark({ url: urlInput.value, name: nameInput.value || deriveNameWithProtocol(urlInput.value) || 'Site' });
      const detectedIcon = candidate.ok && this.detected?.requestedUrl === candidate.value.url ? this.detected.icons?.[0] : '';
      const existing = this.bookmarks[this.editingIndex];
      const result = normalizeBookmark({
        url: urlInput.value,
        name: nameInput.value || deriveName(candidate.value?.url),
        iconUrl: detectedIcon || (existing?.url === candidate.value?.url ? existing.iconUrl : '')
      });
      if (!result.ok) { this.error.textContent = i18n.t(result.error); return; }
      if (this.editingIndex < 0 && this.bookmarks.length >= MAX_BOOKMARKS) { this.error.textContent = i18n.t('limit'); return; }
      if (this.editingIndex >= 0) this.bookmarks[this.editingIndex] = result.value;
      else this.bookmarks.push(result.value);
      this.render();
      this.onChange(this.bookmarks);
      this.dialog.close();
    });
  }

  open(index = -1) {
    this.editingIndex = index;
    const bookmark = this.bookmarks[index];
    this.nameEdited = Boolean(bookmark);
    this.detected = bookmark ? { requestedUrl: bookmark.url, url: bookmark.url, name: bookmark.name, icons: bookmark.iconUrl ? [bookmark.iconUrl] : [] } : null;
    this.title.textContent = i18n.t(bookmark ? 'edit_title' : 'add_title');
    this.form.elements.url.value = bookmark?.url || '';
    this.form.elements.name.value = bookmark?.name || '';
    this.updatePreview();
    this.dialog.open(this.form.elements.url);
  }

  remove(index) {
    this.bookmarks.splice(index, 1);
    this.render();
    this.onChange(this.bookmarks);
  }

  async lookupMetadata() {
    window.clearTimeout(this.metadataTimer);
    const candidate = normalizeBookmark({ url: this.form.elements.url.value, name: 'Site' });
    if (!candidate.ok || !this.metadataService) {
      this.metadataStatus.textContent = '';
      this.updatePreview();
      return null;
    }
    const requestUrl = candidate.value.url;
    this.metadataAbort?.abort();
    const controller = new AbortController();
    this.metadataAbort = controller;
    this.metadataStatus.textContent = i18n.t('detecting_site');
    const promise = this.metadataService.resolve(requestUrl, { signal: controller.signal });
    this.metadataPromise = promise;
    try {
      const metadata = await promise;
      const current = normalizeBookmark({ url: this.form.elements.url.value, name: 'Site' });
      if (controller.signal.aborted || !current.ok || current.value.url !== requestUrl) return null;
      this.detected = { ...metadata, requestedUrl: requestUrl };
      if (!this.nameEdited && metadata?.name) this.form.elements.name.value = metadata.name;
      if (!this.form.elements.name.value) this.form.elements.name.value = deriveName(requestUrl);
      this.metadataStatus.textContent = i18n.t('site_detected');
      await this.updatePreview();
      return metadata;
    } catch (error) {
      if (error.name === 'AbortError') return null;
      if (!this.nameEdited && !this.form.elements.name.value) this.form.elements.name.value = deriveName(requestUrl);
      this.metadataStatus.textContent = i18n.t('site_detect_fallback');
      this.updatePreview();
      return null;
    } finally {
      if (this.metadataPromise === promise) this.metadataPromise = null;
    }
  }

  async updatePreview() {
    const name = this.form.elements.name.value.trim();
    const candidate = normalizeBookmark({ url: this.form.elements.url.value, name: name || 'Site' });
    const iconUrl = candidate.ok && this.detected?.requestedUrl === candidate.value.url ? this.detected.icons?.[0] : '';
    if (candidate.ok && iconUrl) {
      await this.paintIcon({ name: name || deriveName(candidate.value.url), url: candidate.value.url, iconUrl }, this.preview);
      return;
    }
    this.preview.removeAttribute('data-icon-request');
    this.preview.textContent = name.charAt(0).toUpperCase() || i18n.t('empty_icon');
  }

  resetForm() {
    window.clearTimeout(this.metadataTimer);
    this.metadataAbort?.abort();
    this.form.reset();
    this.error.textContent = '';
    this.metadataStatus.textContent = '';
    this.editingIndex = -1;
    this.nameEdited = false;
    this.detected = null;
    this.metadataPromise = null;
  }
}

function deriveNameWithProtocol(value) {
  const url = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
  return deriveName(url);
}
