import HeroSection from './components/HeroSection.js';

document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');

    // Initialize components
    const hero = new HeroSection();

    // Render components
    app.appendChild(hero.render());

    // Mount/Hydrate components (animations, events)
    if (hero.mount) hero.mount();
});
