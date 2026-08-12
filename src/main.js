import './input.css';
import './styles/animations.css';
import { App } from './App.js';

const root = document.querySelector('#app');
const app = new App(root);
app.mount();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch((error) => console.warn('Service worker registration failed', error)));
}
