import HeroSection from './components/HeroSection.js';
import CarouselSection from './components/CarouselSection.js';

document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');

    // Initialize components
    const hero = new HeroSection();
    const carousel = new CarouselSection();

    // Render components
    app.appendChild(hero.render());
    app.appendChild(carousel.render());

    // Mount/Hydrate components (animations, events)
    if (hero.mount) hero.mount();
    if (carousel.mount) carousel.mount();
});
