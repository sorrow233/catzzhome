export default class HeroSection {
    constructor() {
        this.prefixes = ["清凉雨夜", "脆弱雨伞", "街边电话", "路旁雨滩"];
        this.suffixes = ["温暖过谁的心", "保护了谁前行", "少女心伤忧郁", "天空触手可及"];
        this.currentIndex = 0;

        const defaultBookmarks = [
            { name: "GitHub", url: "https://github.com" },
            { name: "Bilibili", url: "https://www.bilibili.com" },
            { name: "DeepSeek", url: "https://chat.deepseek.com" },
            { name: "YouTube", url: "https://www.youtube.com" },
            { name: "Twitter", url: "https://x.com" },
            { name: "Gmail", url: "https://mail.google.com" },
            { name: "Figma", url: "https://www.figma.com" },
            { name: "Notion", url: "https://www.notion.so" },
            { name: "Vercel", url: "https://vercel.com" },
            { name: "Claude", url: "https://claude.ai" }
        ];

        try {
            const saved = localStorage.getItem('catzz_bookmarks');
            this.bookmarks = saved ? JSON.parse(saved) : defaultBookmarks;
        } catch (e) {
            this.bookmarks = defaultBookmarks;
        }

        // Mapping for Simple Icons
        this.simpleIconsMap = {
            'x.com': 'x', 'twitter.com': 'twitter',
            'mail.google.com': 'gmail', 'chatgpt.com': 'openai',
            'claude.ai': 'anthropic', 'dribbble.com': 'dribbble',
            'figma.com': 'figma', 'notion.so': 'notion', 'vercel.com': 'vercel',
            'bluesky.app': 'bluesky'
        };
    }

    render() {
        this.element = document.createElement('section');
        this.element.className = 'w-full h-screen flex flex-col items-center justify-start pt-32 md:pt-48 bg-slate-900 relative overflow-hidden font-serif';

        const style = document.createElement('style');
        style.textContent = `
            .hero-font-sc { font-family: 'Noto Serif SC', serif; }
            @keyframes softFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes softFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-5px); blur(1px); } }
            .text-prefix-in { animation: softFadeIn 1.2s ease-out forwards; } .text-quotes-in { animation: softFadeIn 1.2s ease-out 0.3s forwards; } .text-out { animation: softFadeOut 1.2s ease-in forwards; }
            
            /* Glass Container for ALL Icons */
            .unified-icon-container .glass-box {
                width: 48px; height: 48px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05); /* Very subtle glass */
                border: 1px solid rgba(255, 255, 255, 0.05);
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .unified-icon-container:hover .glass-box {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-4px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
            }

            /* THE SILVER FILTER STRATEGY */
            .icon-bitmap { 
                width: 28px; height: 28px; /* Slightly smaller inside the glass box */
                object-fit: contain; 
                /* TURN EVERYTHING TO SILVER */
                filter: grayscale(100%) brightness(1.5) contrast(1.1);
                opacity: 0.85;
                transition: all 0.3s ease;
            }
            
            .unified-icon-container:hover .icon-bitmap { 
                /* Brighten on hover */
                filter: grayscale(100%) brightness(2) contrast(1);
                opacity: 1;
                drop-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }

            /* Fallback Text */
            .text-icon {
                font-family: 'Noto Serif SC', serif;
                font-weight: 300; font-size: 20px; color: rgba(255, 255, 255, 0.8);
            }

            .add-btn { width: 48px; height: 48px; border-radius: 12px; border: 1px dashed rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.4); transition: all 0.3s ease; cursor: pointer; }
            .add-btn:hover { border-color: rgba(255, 255, 255, 0.6); color: rgba(255, 255, 255, 0.8); background: rgba(255, 255, 255, 0.1); }
            .glass-modal { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); }

            .preview-container .glass-box { width: 80px; height: 80px; border-radius: 20px; }
            .preview-container .icon-bitmap { width: 48px; height: 48px; }
            .preview-container .text-icon { font-size: 32px; }
        `;
        this.element.appendChild(style);

        this.element.innerHTML += `
            <canvas id="rain-canvas" class="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-40"></canvas>
            <div class="relative z-10 flex flex-col items-center justify-start w-full max-w-4xl px-4 text-center">
                <h1 class="text-5xl md:text-7xl font-extralight tracking-[0.2em] mb-8 text-white hero-font-sc opacity-90 drop-shadow-2xl">Catzz</h1>
                <div class="h-8 flex items-center justify-center text-sm md:text-base text-gray-400 font-light tracking-[0.4em] hero-font-sc">
                    <span class="prefix inline-block mr-4 opacity-0"></span>
                    <span class="typed-quotes inline-block opacity-0"></span>
                </div>
                <div class="mt-20 w-full max-w-3xl">
                     <div id="bookmark-grid" class="flex flex-wrap justify-center gap-y-12 gap-x-8 md:gap-x-12 px-4 opacity-0 animate-[softFadeIn_1s_ease-out_0.8s_forwards]"></div>
                </div>
            </div>
            
            <div id="add-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="glass-modal w-full max-w-md p-10 rounded-[2rem] transform scale-95 transition-transform duration-300">
                    <h3 class="text-2xl text-white font-light mb-8 hero-font-sc tracking-wider text-center">Add Shortcut</h3>
                    <div class="flex flex-col items-center justify-center mb-8 h-24">
                        <div id="preview-icon-container" class="preview-container relative w-full flex items-center justify-center">
                            <!-- Preview Injected Here -->
                            <div class="glass-box">
                                <span class="text-gray-600 text-[10px] uppercase tracking-widest">Preview</span>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-6">
                         <div class="relative">
                            <input type="url" id="bm-url" class="w-full bg-slate-800/80 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 transition-all placeholder-gray-500 text-sm font-light" placeholder="https://chat.deepseek.com">
                            <label class="absolute -top-2.5 left-3 bg-slate-900 px-2 text-[10px] text-gray-400 uppercase tracking-widest">Target URL</label>
                        </div>
                        <div class="relative">
                            <input type="text" id="bm-name" class="w-full bg-slate-800/80 border border-gray-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-400 transition-all placeholder-gray-500 text-sm font-light" placeholder="Site Name">
                            <label class="absolute -top-2.5 left-3 bg-slate-900 px-2 text-[10px] text-gray-400 uppercase tracking-widest">Name</label>
                        </div>
                    </div>
                    <div class="flex gap-4 mt-10">
                        <button id="close-modal" class="flex-1 py-4 bg-transparent border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 transition-colors font-light tracking-widest text-[10px] uppercase">Cancel</button>
                        <button id="save-bookmark" class="flex-1 py-4 bg-blue-500 text-white rounded-xl transition-all hover:bg-blue-600 shadow-lg font-light tracking-widest text-[10px] uppercase">Keep Shortcut</button>
                    </div>
                </div>
            </div>
        `;
        return this.element;
    }

    mount() {
        this.initRain();
        this.initTypewriter();
        this.renderGrid();
        this.initModal();
        // Remove scroll listener as we are single page now
    }

    // ==========================================
    // SIMPLIFIED ICON FETCHING LOGIC 
    // ==========================================

    // Helper to get Simple Icons slug
    getSimpleIconSlug(name, url) {
        let domain = "";
        try { domain = new URL(url).hostname.replace('www.', ''); } catch (e) { }
        if (this.simpleIconsMap[domain]) return this.simpleIconsMap[domain];
        let slug = name.toLowerCase().replace(/\\s+/g, '');
        if (slug.includes('deepseek')) return 'deepseek';
        return slug;
    }

    // Surgical Fetch: Simple Icons -> Google -> Text
    fetchIcon(name, url, container) {
        container.innerHTML = '';

        // Create the Glass Box container
        const glassBox = document.createElement('div');
        glassBox.className = 'glass-box';
        container.appendChild(glassBox);

        // Calculate Candidates
        const slug = this.getSimpleIconSlug(name, url);
        let domain = "";
        try { domain = new URL(url).hostname; } catch (e) { }

        const sources = [
            // 1. Simple Icons (SVG)
            `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`,
            // 2. Google Favicon API (The "God" API)
            `https://www.google.com/s2/favicons?sz=128&domain=${domain}`
        ];

        let attempt = 0;

        const showText = () => {
            glassBox.innerHTML = '';
            const textEl = document.createElement('div');
            textEl.className = 'text-icon';
            textEl.textContent = (name || 'S').charAt(0).toUpperCase();
            glassBox.appendChild(textEl);
        };

        const tryNext = () => {
            if (attempt >= sources.length) {
                showText();
                return;
            }
            const src = sources[attempt];
            attempt++;

            const img = new Image();
            img.src = src;
            img.onload = () => {
                // Ignore tiny pixels (Google sometimes returns 1x1 GIF for errors)
                if (img.width < 5) {
                    tryNext();
                } else {
                    // Success! Application of the Silver Filter happens via CSS class
                    const realImg = document.createElement('img');
                    realImg.className = 'icon-bitmap';
                    realImg.src = src;
                    glassBox.innerHTML = ''; // Clear loading/text
                    glassBox.appendChild(realImg);
                }
            };
            img.onerror = () => tryNext();
        };

        tryNext();
    }

    renderGrid() {
        const grid = this.element.querySelector('#bookmark-grid');
        grid.innerHTML = '';
        this.bookmarks.forEach((site, index) => {
            const item = document.createElement('div');
            item.className = 'unified-icon-container flex flex-col items-center gap-4 group w-24 cursor-pointer relative';
            const iconRoot = document.createElement('div');
            iconRoot.className = 'relative w-[48px] h-[48px] flex items-center justify-center'; // Wrapper for sizing

            const link = document.createElement('a');
            link.href = site.url; link.target = "_blank"; link.rel = "noopener noreferrer";
            link.className = "flex flex-col items-center gap-3 w-full";

            this.fetchIcon(site.name, site.url, iconRoot);

            link.appendChild(iconRoot);
            const label = document.createElement('span');
            label.className = "text-[10px] tracking-widest text-gray-500 uppercase font-light group-hover:text-gray-300 transition-colors duration-300 text-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full";
            label.textContent = site.name;
            link.appendChild(label);
            item.appendChild(link);

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = "absolute -top-1 -right-1 bg-white/10 hover:bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md";
            deleteBtn.innerHTML = "&times;";
            deleteBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.deleteBookmark(index); });
            item.appendChild(deleteBtn);

            grid.appendChild(item);
        });

        const addBtn = document.createElement('div');
        addBtn.className = 'flex flex-col items-center gap-4 group w-24 cursor-pointer';
        addBtn.innerHTML = `<div class="add-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg></div><span class="text-[10px] tracking-widest text-gray-600 uppercase font-light group-hover:text-gray-400 transition-colors">Add</span>`;
        addBtn.addEventListener('click', () => this.openModal());
        grid.appendChild(addBtn);
    }

    extractNameFromUrl(url) {
        try {
            const hostname = new URL(url).hostname;
            const parts = hostname.split('.');
            const ignored = ['www', 'chat', 'app', 'web', 'login', 'docs'];
            const usefulParts = parts.filter(p => !ignored.includes(p));
            if (usefulParts.length === 0) return 'Site';
            let name = usefulParts[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        } catch (e) { return ''; }
    }

    initModal() {
        const modal = this.element.querySelector('#add-modal');
        const modalContent = modal.querySelector('.glass-modal');
        const closeBtn = this.element.querySelector('#close-modal');
        const saveBtn = this.element.querySelector('#save-bookmark');
        const nameInput = this.element.querySelector('#bm-name');
        const urlInput = this.element.querySelector('#bm-url');
        const previewContainer = this.element.querySelector('#preview-icon-container');

        this.openModal = () => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95'); modalContent.classList.add('scale-100');
            urlInput.focus();
        };

        const closeModal = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95'); modalContent.classList.remove('scale-100');
            nameInput.value = ''; urlInput.value = '';
            // Reset Preview
            previewContainer.innerHTML = '<div class="glass-box"><span class="text-gray-600 text-[10px] uppercase tracking-widest">Preview</span></div>';
        };

        let debounceTimer;
        const updatePreview = () => {
            const val = urlInput.value.trim();
            if (!val) return;
            let url = val.startsWith('http') ? val : 'https://' + val;

            if (nameInput.value.trim() === '') {
                const name = this.extractNameFromUrl(url);
                if (name) nameInput.value = name;
            }
            const nameForIcon = nameInput.value.trim() || 'Site';
            this.fetchIcon(nameForIcon, url, previewContainer);
        };

        urlInput.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(updatePreview, 600); });
        nameInput.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(updatePreview, 600); });

        const saveBookmark = () => {
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            if (!name || !url) return;
            if (!url.startsWith('http')) url = 'https://' + url;
            this.bookmarks.push({ name, url });
            this.saveBookmarks();
            this.renderGrid();
            closeModal();
        };

        closeBtn.addEventListener('click', closeModal);
        saveBtn.addEventListener('click', saveBookmark);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    saveBookmarks() { localStorage.setItem('catzz_bookmarks', JSON.stringify(this.bookmarks)); }
    deleteBookmark(index) { if (confirm('Remove shortcut?')) { this.bookmarks.splice(index, 1); this.saveBookmarks(); this.renderGrid(); } }

    initTypewriter() {
        const prefix = this.element.querySelector('.prefix'); const typedQuotes = this.element.querySelector('.typed-quotes');
        prefix.textContent = this.prefixes[0]; typedQuotes.textContent = this.suffixes[0];
        prefix.classList.add('text-prefix-in'); typedQuotes.classList.add('text-quotes-in');
        const updateQuote = () => {
            prefix.classList.remove('text-prefix-in'); typedQuotes.classList.remove('text-quotes-in');
            prefix.classList.add('text-out'); typedQuotes.classList.add('text-out');
            setTimeout(() => {
                this.currentIndex = (this.currentIndex + 1) % this.prefixes.length;
                prefix.textContent = this.prefixes[this.currentIndex]; typedQuotes.textContent = this.suffixes[this.currentIndex];
                prefix.classList.remove('text-out'); typedQuotes.classList.remove('text-out');
                prefix.classList.add('text-prefix-in'); typedQuotes.classList.add('text-quotes-in');
            }, 1200);
        };
        this.quoteInterval = setInterval(updateQuote, 5000);
    }

    initRain() {
        const canvas = this.element.querySelector('#rain-canvas'); if (!canvas) return; const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1; let width = window.innerWidth; let height = window.innerHeight;
        const resize = () => { width = window.innerWidth; height = window.innerHeight; canvas.width = width * dpr; canvas.height = height * dpr; ctx.scale(dpr, dpr); canvas.style.width = width + 'px'; canvas.style.height = height + 'px'; };
        resize();
        const raindrops = []; const count = 80;
        class Raindrop { constructor() { this.reset(); this.y = Math.random() * height; } reset() { this.x = Math.random() * width; this.y = -20; this.length = Math.random() * 15 + 5; this.speed = Math.random() * 3 + 4; this.opacity = Math.random() * 0.3 + 0.1; } draw() { ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + this.length); ctx.strokeStyle = `rgba(168, 183, 204, ${this.opacity})`; ctx.lineWidth = 1.5; ctx.stroke(); } update() { this.y += this.speed; if (this.y > height) this.reset(); } }
        for (let i = 0; i < count; i++) raindrops.push(new Raindrop());
        const animate = () => { ctx.clearRect(0, 0, width, height); raindrops.forEach(drop => { drop.update(); drop.draw(); }); this.rainAnimationId = requestAnimationFrame(animate); };
        animate(); window.addEventListener('resize', resize);
    }
}
