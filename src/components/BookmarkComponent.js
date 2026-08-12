import { i18n } from '../lib/I18n.js';
import { Dialog } from './Dialog.js';
import { deriveName, MAX_BOOKMARKS, normalizeBookmark, sanitizeBookmarks } from '../lib/bookmarkValidation.js';
import { createId } from '../lib/id.js';

export class BookmarkComponent {
  constructor({ container, groupsElement, dialogElement, iconResolver, bookmarks, groups, activeGroup, onChange }) {
    this.container = container;
    this.groupsElement = groupsElement;
    this.iconResolver = iconResolver;
    this.groups = Array.isArray(groups) && groups.length ? groups : [{ id: 'favorites', name: 'Favorites' }];
    this.activeGroup = this.groups.some((group) => group.id === activeGroup) ? activeGroup : this.groups[0].id;
    this.bookmarks = sanitizeBookmarks(bookmarks).map((bookmark) => ({ ...bookmark, groupId: this.groups.some((group) => group.id === bookmark.groupId) ? bookmark.groupId : this.activeGroup }));
    this.onChange = onChange;
    this.form = dialogElement.querySelector('[data-bookmark-form]');
    this.title = dialogElement.querySelector('[data-bookmark-title]');
    this.error = dialogElement.querySelector('[data-form-error]');
    this.preview = dialogElement.querySelector('[data-preview]');
    this.dialog = new Dialog(dialogElement, { onClose: () => this.resetForm() });
    this.editingId = null;
    this.bindForm();
  }

  mount() { this.render(); }
  getAll() { return this.bookmarks; }

  setData({ bookmarks, bookmarkGroups, activeBookmarkGroup }) {
    if (bookmarkGroups?.length) this.groups = bookmarkGroups;
    if (activeBookmarkGroup && this.groups.some((group) => group.id === activeBookmarkGroup)) this.activeGroup = activeBookmarkGroup;
    this.bookmarks = sanitizeBookmarks(bookmarks, this.bookmarks);
    this.render();
  }

  mergeImported({ bookmarks, groups }) {
    const groupMap = new Map(this.groups.map((group) => [group.id, group]));
    groups.forEach((group) => groupMap.set(group.id, group));
    this.groups = [...groupMap.values()].slice(0, 12);
    this.bookmarks = sanitizeBookmarks([...this.bookmarks, ...bookmarks], this.bookmarks);
    this.emit(); this.render();
  }

  render() { this.renderGroups(); this.renderBookmarks(); this.updateGroupSelect(); }

  renderGroups() {
    this.groupsElement.replaceChildren();
    this.groups.forEach((group) => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = group.name; button.className = 'group-tab';
      button.setAttribute('aria-pressed', String(group.id === this.activeGroup));
      button.addEventListener('click', () => { this.activeGroup = group.id; this.emit(); this.render(); });
      button.addEventListener('dblclick', () => this.renameGroup(group));
      this.groupsElement.append(button);
    });
    if (this.groups.length < 12) {
      const add = document.createElement('button'); add.type = 'button'; add.className = 'group-tab group-tab--add'; add.textContent = '＋'; add.setAttribute('aria-label', i18n.t('new_group'));
      add.addEventListener('click', () => this.addGroup()); this.groupsElement.append(add);
    }
  }

  renderBookmarks() {
    this.container.replaceChildren();
    const visible = this.bookmarks.filter((bookmark) => bookmark.groupId === this.activeGroup);
    const fragment = document.createDocumentFragment();
    visible.forEach((bookmark) => fragment.append(this.createItem(bookmark)));
    if (this.bookmarks.length < MAX_BOOKMARKS) fragment.append(this.createAddButton());
    this.container.append(fragment);
  }

  createItem(bookmark) {
    const item = document.createElement('article'); item.className = 'bookmark'; item.draggable = true; item.dataset.id = bookmark.id;
    item.addEventListener('dragstart', (event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', bookmark.id); item.classList.add('is-dragging'); });
    item.addEventListener('dragend', () => item.classList.remove('is-dragging'));
    item.addEventListener('dragover', (event) => { event.preventDefault(); item.classList.add('is-drop-target'); });
    item.addEventListener('dragleave', () => item.classList.remove('is-drop-target'));
    item.addEventListener('drop', (event) => { event.preventDefault(); item.classList.remove('is-drop-target'); this.move(event.dataTransfer.getData('text/plain'), bookmark.id); });
    const link = document.createElement('a'); link.href = bookmark.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'bookmark__link'; link.setAttribute('aria-label', bookmark.name);
    const icon = document.createElement('span'); icon.className = 'bookmark__icon'; icon.textContent = bookmark.name.charAt(0).toUpperCase();
    const label = document.createElement('span'); label.className = 'bookmark__label'; label.textContent = bookmark.name; link.append(icon, label); item.append(link);
    const actions = document.createElement('div'); actions.className = 'bookmark__actions';
    actions.append(this.actionButton('edit', i18n.t('edit'), () => this.open(bookmark.id)), this.actionButton('remove', i18n.t('remove'), () => this.remove(bookmark.id))); item.append(actions);
    this.paintIcon(bookmark, icon); return item;
  }

  actionButton(kind, label, callback) {
    const button = document.createElement('button'); button.type = 'button'; button.className = `bookmark__action bookmark__action--${kind}`; button.setAttribute('aria-label', label); button.textContent = kind === 'edit' ? '✎' : '×'; button.addEventListener('click', callback); return button;
  }

  createAddButton() {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'bookmark bookmark--add'; button.innerHTML = '<span class="bookmark__icon">＋</span>';
    const label = document.createElement('span'); label.className = 'bookmark__label'; label.textContent = i18n.t('add'); button.append(label); button.addEventListener('click', () => this.open()); return button;
  }

  async paintIcon(bookmark, target) {
    const result = await this.iconResolver.resolve(bookmark); if (!target.isConnected) return; target.replaceChildren();
    if (result.type === 'text') { target.textContent = result.text; return; }
    if (result.mask) { const mask = document.createElement('span'); mask.className = 'bookmark__mask'; mask.style.maskImage = `url("${result.src}")`; mask.style.webkitMaskImage = `url("${result.src}")`; target.append(mask); }
    else { const image = document.createElement('img'); image.src = result.src; image.alt = ''; image.loading = 'lazy'; target.append(image); }
  }

  bindForm() {
    const urlInput = this.form.elements.url; const nameInput = this.form.elements.name;
    urlInput.addEventListener('blur', () => { const candidate = normalizeBookmark({ url: urlInput.value, name: nameInput.value || 'Site' }); if (!nameInput.value && candidate.ok) nameInput.value = deriveName(candidate.value.url); this.updatePreview(); });
    nameInput.addEventListener('input', () => this.updatePreview());
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const existing = this.bookmarks.find((bookmark) => bookmark.id === this.editingId);
      const result = normalizeBookmark({ id: existing?.id, url: urlInput.value, name: nameInput.value, groupId: this.form.elements.group.value });
      if (!result.ok) { this.error.textContent = i18n.t(result.error); return; }
      if (!existing && this.bookmarks.length >= MAX_BOOKMARKS) { this.error.textContent = i18n.t('limit'); return; }
      if (existing) Object.assign(existing, result.value); else this.bookmarks.push(result.value);
      this.activeGroup = result.value.groupId; this.emit(); this.render(); this.dialog.close();
    });
  }

  open(id = null) {
    this.editingId = id; const bookmark = this.bookmarks.find((item) => item.id === id);
    this.title.textContent = i18n.t(bookmark ? 'edit_title' : 'add_title'); this.form.elements.url.value = bookmark?.url || ''; this.form.elements.name.value = bookmark?.name || ''; this.form.elements.group.value = bookmark?.groupId || this.activeGroup; this.updatePreview(); this.dialog.open(this.form.elements.url);
  }

  remove(id) { this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id); this.emit(); this.renderBookmarks(); }
  move(sourceId, targetId) {
    if (!sourceId || sourceId === targetId) return;
    const sourceIndex = this.bookmarks.findIndex((item) => item.id === sourceId); const targetIndex = this.bookmarks.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [source] = this.bookmarks.splice(sourceIndex, 1); const nextTarget = this.bookmarks.findIndex((item) => item.id === targetId); this.bookmarks.splice(nextTarget, 0, source); this.emit(); this.renderBookmarks();
  }

  addGroup() {
    const name = prompt(i18n.t('new_group'))?.trim(); if (!name) return;
    const group = { id: createId('group'), name: name.slice(0, 30) }; this.groups.push(group); this.activeGroup = group.id; this.emit(); this.render();
  }
  renameGroup(group) { const name = prompt(i18n.t('new_group'), group.name)?.trim(); if (!name) return; group.name = name.slice(0, 30); this.emit(); this.render(); }
  updateGroupSelect() { const select = this.form.elements.group; select.replaceChildren(...this.groups.map((group) => new Option(group.name, group.id))); }
  updatePreview() { this.preview.textContent = this.form.elements.name.value.trim().charAt(0).toUpperCase() || i18n.t('empty_icon'); }
  resetForm() { this.form.reset(); this.error.textContent = ''; this.editingId = null; }
  emit() { this.onChange({ bookmarks: this.bookmarks, bookmarkGroups: this.groups, activeBookmarkGroup: this.activeGroup }); }
}
