export class PwaInstaller {
  constructor() {
    this.promptEvent = null;
    addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); this.promptEvent = event; });
  }

  isInstalled() { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }
  async install() {
    if (this.isInstalled()) return 'installed';
    if (!this.promptEvent) return 'unavailable';
    await this.promptEvent.prompt();
    const result = await this.promptEvent.userChoice;
    this.promptEvent = null;
    return result.outcome;
  }
}
