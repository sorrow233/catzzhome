import './input.css';
import './styles/animations.css';
import { App } from './App.js';

const root = document.querySelector('#app');
const app = new App(root);
app.mount().catch((error) => {
  console.error('Catzz failed to start', error);
  root.textContent = 'Catzz could not start. Please refresh the page.';
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch((error) => console.warn('Service worker registration failed', error)));
}
