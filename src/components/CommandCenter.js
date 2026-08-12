import { i18n } from '../lib/I18n.js';
import { classifyInput, COMMANDS, searchBookmarks } from '../lib/SearchService.js';

export class CommandCenter {
  constructor({ root, getBookmarks, getEngine, openInNewTab, commands, announce }) {
    this.root = root.querySelector('[data-command]');
    this.form = this.root.querySelector('[data-command-form]');
    this.input = this.root.querySelector('[data-command-input]');
    this.results = this.root.querySelector('[data-command-results]');
    this.getBookmarks = getBookmarks;
    this.getEngine = getEngine;
    this.openInNewTab = openInNewTab;
    this.commands = commands;
    this.announce = announce;
    this.activeIndex = -1;
  }

  mount() {
    this.form.addEventListener('submit', (event) => { event.preventDefault(); this.execute(); });
    this.input.addEventListener('input', () => this.renderResults());
    this.input.addEventListener('keydown', (event) => this.onKeydown(event));
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); this.focus(); }
      if (event.key === '/' && !isTextInput(document.activeElement)) { event.preventDefault(); this.focus('/'); }
    });
    document.addEventListener('click', (event) => { if (!this.root.contains(event.target)) this.hideResults(); });
  }

  focus(value) { this.input.focus(); if (value && !this.input.value) { this.input.value = value; this.renderResults(); } }

  renderResults() {
    const value = this.input.value;
    const items = value.startsWith('/')
      ? COMMANDS.filter((command) => command.name.startsWith(value.slice(1).toLowerCase())).map((command) => ({ label: command.hint, value: `/${command.name} `, kind: 'fill' }))
      : searchBookmarks(this.getBookmarks(), value).map((bookmark) => ({ label: bookmark.name, detail: new URL(bookmark.url).hostname, value: bookmark.url, kind: 'open' }));
    const classified = classifyInput(value, this.getEngine());
    if (classified.type === 'calculation') items.unshift({ label: String(classified.value), detail: value, value: String(classified.value), kind: 'calculation' });
    this.results.replaceChildren();
    this.activeIndex = items.length ? 0 : -1;
    items.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'command-result';
      button.dataset.active = String(index === this.activeIndex);
      button.innerHTML = `<span>${escapeText(item.label)}</span>${item.detail ? `<small>${escapeText(item.detail)}</small>` : ''}`;
      button.addEventListener('click', () => this.select(item));
      button.dataset.kind = item.kind;
      button.dataset.value = item.value;
      this.results.append(button);
    });
    this.results.hidden = !items.length;
  }

  onKeydown(event) {
    const buttons = [...this.results.querySelectorAll('button')];
    if (event.key === 'Escape') { this.hideResults(); this.input.blur(); return; }
    if (!buttons.length || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    this.activeIndex = (this.activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons.forEach((button, index) => { button.dataset.active = String(index === this.activeIndex); });
  }

  execute() {
    const active = this.results.querySelector('[data-active="true"]');
    if (active && !this.results.hidden) return this.select({ kind: active.dataset.kind, value: active.dataset.value });
    const result = classifyInput(this.input.value, this.getEngine());
    if (result.type === 'command') {
      const handler = this.commands[result.command];
      if (handler) handler(result.argument);
      else this.announce(i18n.t('command_unknown'));
    } else if (result.type === 'url') this.open(result.url);
    else if (result.type === 'calculation') this.input.value = String(result.value);
    this.hideResults();
  }

  select(item) {
    if (item.kind === 'fill') { this.input.value = item.value; this.input.focus(); this.renderResults(); return; }
    if (item.kind === 'calculation') { this.input.value = item.value; navigator.clipboard?.writeText(item.value); this.hideResults(); return; }
    if (item.kind === 'open') this.open(item.value);
  }

  open(url) { this.openInNewTab() ? window.open(url, '_blank', 'noopener') : location.assign(url); }
  hideResults() { this.results.hidden = true; this.activeIndex = -1; }
}

function isTextInput(element) { return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element?.tagName); }
function escapeText(value) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
