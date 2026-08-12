export class Dialog {
  constructor(element, { onClose } = {}) {
    this.element = element;
    this.onClose = onClose;
    this.panel = element.querySelector('[data-dialog-panel]');
    this.previousFocus = null;
    this.handleKeydown = this.handleKeydown.bind(this);
    element.addEventListener('mousedown', (event) => {
      if (event.target === element) this.close();
    });
    element.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => this.close()));
  }

  open(focusTarget) {
    this.previousFocus = document.activeElement;
    this.element.hidden = false;
    requestAnimationFrame(() => this.element.classList.add('is-open'));
    document.body.classList.add('dialog-open');
    document.addEventListener('keydown', this.handleKeydown);
    (focusTarget || this.firstFocusable())?.focus();
  }

  close() {
    if (this.element.hidden) return;
    this.element.classList.remove('is-open');
    document.body.classList.remove('dialog-open');
    document.removeEventListener('keydown', this.handleKeydown);
    this.element.hidden = true;
    this.onClose?.();
    this.previousFocus?.focus();
  }

  firstFocusable() { return this.element.querySelector('button, input, select, [tabindex="0"]'); }
  handleKeydown(event) {
    if (event.key === 'Escape') return this.close();
    if (event.key !== 'Tab') return;
    const focusable = [...this.element.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}
