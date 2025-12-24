import { HERO_CONFIG } from '../config/HeroConfig.js';

export class BookmarkManager {
    constructor(parent) {
        this.parent = parent; // HeroSection instance
        this.iconCache = parent.iconCache;
        this.simpleIconsMap = HERO_CONFIG.simpleIconsMap;
    }

    getSimpleIconSlug(name, url) {
        let domain = "";
        try { domain = new URL(url).hostname.replace('www.', ''); } catch (e) { }
        if (this.simpleIconsMap[domain]) return this.simpleIconsMap[domain];
        let slug = name.toLowerCase().replace(/\s+/g, '');
        if (slug.includes('deepseek')) return 'deepseek';
        return slug;
    }

    async fetchIcon(name, url, container, theme) {
        container.innerHTML = '';
        const glassBox = document.createElement('div');
        const glassClass = theme && theme.glassColor ? theme.glassColor : 'bg-white/40';
        const borderClass = theme && theme.glassBorder ? theme.glassBorder : '';

        glassBox.className = `glass-box ${glassClass} ${borderClass} border backdrop-blur-md`;
        container.appendChild(glassBox);

        const cached = await this.iconCache.get(url);
        if (cached) {
            this.renderIcon(cached, glassBox);
            return;
        }

        const slug = this.getSimpleIconSlug(name, url);
        let domain = "";
        try { domain = new URL(url).hostname; } catch (e) { }

        const sources = [
            `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`,
            `https://www.google.com/s2/favicons?sz=128&domain=${domain}`
        ];

        this.tryLoadIcon(sources, 0, glassBox, url, name, container);
    }

    renderIcon(data, container, isSVG = false) {
        if (data.iconType === 'bitmap') {
            if (isSVG) {
                const iconWrapper = document.createElement('div');
                iconWrapper.className = 'icon-wrapper';
                const iconMask = document.createElement('div');
                iconMask.className = 'icon-mask';
                iconMask.style.webkitMaskImage = `url('${data.iconSrc}')`;
                iconMask.style.maskImage = `url('${data.iconSrc}')`;
                iconWrapper.appendChild(iconMask);
                container.appendChild(iconWrapper);
            } else {
                const img = document.createElement('img');
                img.className = 'icon-bitmap';
                img.src = data.iconSrc;
                container.appendChild(img);
            }
        } else if (data.iconType === 'text') {
            const textEl = document.createElement('div');
            textEl.className = 'text-icon';
            textEl.textContent = data.textFallback;
            container.appendChild(textEl);
        }
    }

    tryLoadIcon(sources, attempt, glassBox, url, name, container) {
        if (attempt >= sources.length) {
            const textFallback = (name || 'S').charAt(0).toUpperCase();
            this.renderIcon({ iconType: 'text', textFallback }, glassBox);
            this.iconCache.set(url, { iconType: 'text', textFallback }).catch(() => { });
            return;
        }

        const src = sources[attempt];
        const isSVG = attempt === 0;
        const img = new Image();
        img.src = src;
        img.onload = () => {
            if (img.width < 5) {
                this.tryLoadIcon(sources, attempt + 1, glassBox, url, name, container);
            } else {
                glassBox.innerHTML = '';
                this.renderIcon({ iconSrc: src, iconType: 'bitmap' }, glassBox, isSVG);
                container.dataset.iconLoaded = 'true';
                this.iconCache.set(url, { iconSrc: src, iconType: 'bitmap' }).catch(() => { });
            }
        };
        img.onerror = () => this.tryLoadIcon(sources, attempt + 1, glassBox, url, name, container);
    }

    extractNameFromUrl(url) {
        try {
            const hostname = new URL(url).hostname;
            const parts = hostname.split('.');
            const doubleTlds = ['co', 'com', 'org', 'net', 'edu', 'gov', 'mil', 'ac'];
            let tldParts = 1;

            if (parts.length > 2) {
                const last = parts[parts.length - 1];
                const secondLast = parts[parts.length - 2];
                if (last.length === 2 && doubleTlds.includes(secondLast)) {
                    tldParts = 2;
                }
            }

            if (parts.length <= tldParts) return 'Site';
            const brandIndex = parts.length - tldParts - 1;
            let name = parts[brandIndex];
            return name.charAt(0).toUpperCase() + name.slice(1);
        } catch (e) { return ''; }
    }
}
