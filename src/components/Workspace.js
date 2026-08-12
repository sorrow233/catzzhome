import { i18n } from '../lib/I18n.js';
import { AmbientAudio } from '../lib/AmbientAudio.js';
import { parseIcs } from '../lib/CalendarService.js';
import { createId } from '../lib/id.js';

export class Workspace {
  constructor({ root, settings, onChange, announce }) {
    this.root = root;
    this.element = root.querySelector('[data-workspace]');
    this.settings = settings;
    this.onChange = onChange;
    this.announce = announce;
    this.audio = new AmbientAudio();
    this.activeTab = 'today';
    this.tick = this.tick.bind(this);
  }

  mount() {
    this.normalizeDailyState();
    this.bindTabs();
    this.bindTasks();
    this.bindFocus();
    this.bindNotes();
    this.bindCalendar();
    this.renderAll();
    if (this.settings.focus.running) this.resumeTimer();
  }

  bindTabs() {
    this.root.querySelectorAll('[data-workspace-tab]').forEach((button) => button.addEventListener('click', () => this.open(button.dataset.workspaceTab)));
    this.root.querySelector('[data-workspace-close]').addEventListener('click', () => this.close());
  }

  open(tab = 'today') {
    this.activeTab = tab;
    this.element.hidden = false;
    requestAnimationFrame(() => this.element.classList.add('is-open'));
    this.root.querySelectorAll('[data-workspace-tab]').forEach((button) => button.classList.toggle('active', button.dataset.workspaceTab === tab));
    this.element.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== tab; });
    this.element.querySelector('[data-workspace-title]').textContent = i18n.t(tab);
  }

  close() {
    this.element.classList.remove('is-open');
    this.element.hidden = true;
    this.root.querySelectorAll('[data-workspace-tab]').forEach((button) => button.classList.remove('active'));
  }

  bindTasks() {
    const form = this.element.querySelector('[data-task-form]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      const text = input.value.trim();
      const active = this.settings.tasks.filter((task) => !task.done);
      if (!text || active.length >= 3) return;
      this.settings.tasks.push({ id: createId('task'), text: text.slice(0, 80), done: false, createdAt: Date.now() });
      input.value = '';
      this.persist('tasks');
      this.renderTasks();
    });
  }

  renderTasks() {
    const list = this.element.querySelector('[data-task-list]');
    list.replaceChildren();
    this.settings.tasks.slice(-8).forEach((task) => {
      const row = document.createElement('label');
      row.className = `task${task.done ? ' done' : ''}`;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => { task.done = checkbox.checked; this.persist('tasks'); this.renderTasks(); });
      const text = document.createElement('span'); text.textContent = task.text;
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', i18n.t('remove'));
      remove.addEventListener('click', (event) => { event.preventDefault(); this.settings.tasks = this.settings.tasks.filter((item) => item.id !== task.id); this.persist('tasks'); this.renderTasks(); });
      row.append(checkbox, text, remove); list.append(row);
    });
  }

  bindFocus() {
    this.element.querySelector('[data-focus-toggle]').addEventListener('click', () => this.settings.focus.running ? this.pauseFocus() : this.startFocus());
    this.element.querySelectorAll('[data-focus-minutes]').forEach((button) => button.addEventListener('click', () => this.setFocusMinutes(Number(button.dataset.focusMinutes))));
    this.element.querySelector('[data-focus-reset]').addEventListener('click', () => this.resetFocus());
    const ambient = this.element.querySelector('[data-ambient]');
    const volume = this.element.querySelector('[data-ambient-volume]');
    ambient.value = this.settings.preferences.ambient;
    volume.value = this.settings.preferences.ambientVolume;
    ambient.addEventListener('change', () => {
      this.settings.preferences.ambient = ambient.value;
      this.persist('preferences');
      if (this.settings.focus.running) this.audio.play(ambient.value, volume.value);
    });
    volume.addEventListener('input', () => { this.settings.preferences.ambientVolume = Number(volume.value); this.audio.setVolume(volume.value); this.persist('preferences'); });
  }

  setFocusMinutes(minutes) {
    if (this.settings.focus.running) return;
    this.settings.focus.minutes = minutes;
    this.settings.focus.remainingSeconds = minutes * 60;
    this.persist('focus'); this.renderFocus();
  }

  startFocus(minutes) {
    if (Number.isFinite(minutes)) this.setFocusMinutes(Math.max(1, Math.min(180, minutes)));
    const remaining = this.settings.focus.remainingSeconds || this.settings.focus.minutes * 60;
    this.settings.focus.running = true;
    this.settings.focus.endsAt = Date.now() + remaining * 1000;
    this.persist('focus');
    this.resumeTimer();
    void this.audio.play(this.settings.preferences.ambient, this.settings.preferences.ambientVolume);
    this.open('focus');
  }

  pauseFocus() {
    this.settings.focus.remainingSeconds = Math.max(0, Math.ceil((this.settings.focus.endsAt - Date.now()) / 1000));
    this.settings.focus.running = false;
    this.settings.focus.endsAt = null;
    window.clearInterval(this.timer);
    this.audio.stop();
    this.persist('focus'); this.renderFocus();
  }

  resetFocus() {
    window.clearInterval(this.timer); this.audio.stop();
    Object.assign(this.settings.focus, { running: false, endsAt: null, remainingSeconds: this.settings.focus.minutes * 60 });
    this.persist('focus'); this.renderFocus();
  }

  resumeTimer() { window.clearInterval(this.timer); this.timer = window.setInterval(this.tick, 1000); this.tick(); }
  tick() {
    const remaining = Math.max(0, Math.ceil((this.settings.focus.endsAt - Date.now()) / 1000));
    this.settings.focus.remainingSeconds = remaining;
    this.renderFocus();
    if (remaining > 0) return;
    window.clearInterval(this.timer); this.audio.stop();
    this.settings.focus.running = false;
    this.settings.focus.endsAt = null;
    this.settings.focus.sessionsToday += 1;
    this.settings.focus.remainingSeconds = this.settings.focus.minutes * 60;
    this.persist('focus');
    this.announce(`${i18n.t('focus')} · ${i18n.t('done')}`);
    if (Notification.permission === 'granted') new Notification('Catzz', { body: `${i18n.t('focus')} · ${i18n.t('done')}` });
  }

  renderFocus() {
    const seconds = this.settings.focus.running ? Math.max(0, Math.ceil((this.settings.focus.endsAt - Date.now()) / 1000)) : this.settings.focus.remainingSeconds;
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainder = (seconds % 60).toString().padStart(2, '0');
    this.element.querySelector('[data-focus-time]').textContent = `${minutes}:${remainder}`;
    this.element.querySelector('[data-focus-action]').textContent = i18n.t(this.settings.focus.running ? 'pause' : 'start');
    this.element.querySelector('[data-focus-sessions]').textContent = this.settings.focus.sessionsToday;
    const progress = 1 - seconds / (this.settings.focus.minutes * 60 || 1);
    this.element.querySelector('[data-focus-toggle]').style.setProperty('--progress', `${Math.max(0, progress) * 360}deg`);
  }

  bindNotes() {
    const form = this.element.querySelector('[data-note-form]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('textarea'); const text = input.value.trim();
      if (!text) return;
      this.addNote(text); input.value = '';
    });
  }

  addNote(text) {
    this.settings.notes.unshift({ id: createId('note'), text: text.slice(0, 500), createdAt: Date.now() });
    this.settings.notes = this.settings.notes.slice(0, 30);
    this.persist('notes'); this.renderNotes(); this.open('notes');
  }

  renderNotes() {
    const list = this.element.querySelector('[data-note-list]'); list.replaceChildren();
    this.settings.notes.forEach((note) => {
      const article = document.createElement('article'); article.className = 'note';
      const text = document.createElement('p'); text.textContent = note.text;
      const time = document.createElement('time'); time.dateTime = new Date(note.createdAt).toISOString(); time.textContent = new Intl.DateTimeFormat(i18n.getLocale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(note.createdAt);
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.addEventListener('click', () => { this.settings.notes = this.settings.notes.filter((item) => item.id !== note.id); this.persist('notes'); this.renderNotes(); });
      article.append(text, time, remove); list.append(article);
    });
  }

  bindCalendar() {
    this.element.querySelector('[data-calendar-import]').addEventListener('change', async (event) => {
      const file = event.target.files[0]; if (!file) return;
      this.settings.calendarEvents = parseIcs(await file.text());
      this.persist('calendarEvents'); this.renderCalendar(); this.announce(i18n.t('imported'));
    });
  }

  renderCalendar() {
    const now = Date.now(); const until = now + 7 * 86400000;
    const events = this.settings.calendarEvents.filter((event) => new Date(event.start).getTime() >= now && new Date(event.start).getTime() <= until);
    this.element.querySelector('[data-next-event]').textContent = events[0] ? `${i18n.t('next_event')} · ${events[0].title}` : i18n.t('no_events');
    const list = this.element.querySelector('[data-event-list]'); list.replaceChildren();
    events.forEach((event) => {
      const row = document.createElement('div'); row.className = 'event';
      const time = document.createElement('time'); time.textContent = new Intl.DateTimeFormat(i18n.getLocale(), { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(event.start));
      const title = document.createElement('span'); title.textContent = event.title;
      row.append(time, title); list.append(row);
    });
  }

  normalizeDailyState() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.settings.focus.sessionDate !== today) Object.assign(this.settings.focus, { sessionDate: today, sessionsToday: 0 });
  }
  renderAll() { this.renderTasks(); this.renderFocus(); this.renderNotes(); this.renderCalendar(); }
  persist(key) { this.onChange({ [key]: this.settings[key] }); }
}
