import { i18n } from '../lib/I18n.js';
import { Dialog } from './Dialog.js';
import { deriveName, MAX_BOOKMARKS, normalizeBookmark, sanitizeBookmarks } from '../lib/bookmarkValidation.js';

export class BookmarkComponent {
  constructor({ container, dialogElement, iconResolver, bookmarks, onChange, announce }) {
    this.container = container;
    this.iconResolver = iconResolver;
    this.bookmarks = sanitizeBookmarks(bookmarks);
    this.onChange = onChange;
    this.announce = announce;
    this.form = dialogElement.querySelector('[data-bookmark-form]');
    this.title = dialogElement.querySelector('[data-bookmark-title]');
    this.error = dialogElement.querySelector('[data-form-error]');
    this.preview = dialogElement.querySelector('[data-preview]');
    this.dialog = new Dialog(dialogElement, { onClose: () => this.resetForm() });
    this.editingIndex = -1;
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
    const result = await this.iconResolver.resolve(bookmark);
    if (!target.isConnected) return;
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
      target.append(image);
    }
  }

  bindForm() {
    const urlInput = this.form.elements.url;
    const nameInput = this.form.elements.name;
    urlInput.addEventListener('blur', () => {
      const candidate = normalizeBookmark({ url: urlInput.value, name: nameInput.value || 'Site' });
      if (!nameInput.value && candidate.ok) nameInput.value = deriveName(candidate.value.url);
      this.updatePreview();
    });
    nameInput.addEventListener('input', () => this.updatePreview());
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = normalizeBookmark({ url: urlInput.value, name: nameInput.value });
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

  updatePreview() { this.preview.textContent = this.form.elements.name.value.trim().charAt(0).toUpperCase() || i18n.t('empty_icon'); }
  resetForm() { this.form.reset(); this.error.textContent = ''; this.editingIndex = -1; }
}
