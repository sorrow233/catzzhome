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

        this.bgImages = [
            "https://blog.catzz.work/file/1766242722856_image.png",
            "https://blog.catzz.work/file/1766242726260_image.png",
            "https://blog.catzz.work/file/1766241278914_78375860_p0.png",
            "https://blog.catzz.work/file/1766241276169_100669875_p0.jpg",
            "https://blog.catzz.work/file/1766241276149_113793915_p0.png",
            "https://blog.catzz.work/file/1766241281738_116302432_p0.png",
            "https://blog.catzz.work/file/1766241284787_72055179_p0.jpg",
            "https://blog.catzz.work/file/1766241306259_68686407_p0.jpg"
        ];

        // Load Saved Data
        try {
            const saved = localStorage.getItem('catzz_bookmarks');
            this.bookmarks = saved ? JSON.parse(saved) : defaultBookmarks;

            // Background
            this.currentBg = localStorage.getItem('catzz_bg') || ""; // Default empty (gradient)
        } catch (e) {
            this.bookmarks = defaultBookmarks;
            this.currentBg = "";
        }

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
        // Base classes
        this.element.className = 'w-full h-screen flex flex-col items-center justify-start pt-32 md:pt-48 relative overflow-hidden font-serif transition-all duration-700 ease-in-out bg-cover bg-center';

        // Initial Background State
        if (this.currentBg) {
            this.element.style.backgroundImage = `url('${this.currentBg}')`;
        } else {
            // Fallback gradient if no image selected
            this.element.classList.add('bg-gradient-to-b', 'from-[#fdfbf7]', 'via-[#f4f7fb]', 'to-[#eef2f6]');
        }

        const style = document.createElement('style');
        style.textContent = `
            .hero-font-sc { font-family: 'Noto Serif SC', serif; }
            @keyframes softFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes softFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-5px); blur(1px); } }
            .text-prefix-in { animation: softFadeIn 1.2s ease-out forwards; } .text-quotes-in { animation: softFadeIn 1.2s ease-out 0.3s forwards; } .text-out { animation: softFadeOut 1.2s ease-in forwards; }
            
            /* Glass Container - Cleaner Light Mode Version */
            .unified-icon-container .glass-box {
                width: 48px; height: 48px;
                border-radius: 12px;
                background: transparent;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            
            .unified-icon-container:hover .glass-box {
                background: rgba(255, 255, 255, 0.6); /* Milky white hover */
                transform: translateY(-4px);
                box-shadow: 0 10px 20px -5px rgba(100, 116, 139, 0.15); /* Soft blue-grey shadow */
            }

            /* 1. SVG ICONS: Cool Slate Grey */
            .icon-wrapper .icon-mask { 
                width: 32px; height: 32px; 
                background-color: #64748b; /* Slate-500: Perfect soft grey */
                -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;
                mask-size: contain; mask-repeat: no-repeat; mask-position: center;
                transition: all 0.3s ease;
            }
            .unified-icon-container:hover .icon-mask { 
                background-color: #334155; /* Darker Slate on hover */
            }

            /* 2. BITMAP ICONS: The "Multiply" Magic */
            .icon-bitmap { 
                width: 36px; height: 36px;
                object-fit: contain; 
                filter: grayscale(100%) contrast(1.1) opacity(0.85);
                mix-blend-mode: multiply; 
                transition: all 0.3s ease;
            }
            
            .unified-icon-container:hover .icon-bitmap { 
                filter: grayscale(100%) contrast(1.2) opacity(1);
                transform: scale(1.05);
            }

            .text-icon {
                font-family: 'Noto Serif SC', serif;
                font-weight: 300; font-size: 20px; color: #475569; /* Slate-600 */
                border: 1px solid #cbd5e1;
                border-radius: 8px;
            }

            .add-btn { width: 48px; height: 48px; border-radius: 12px; border: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.3s ease; cursor: pointer; }
            .add-btn:hover { border-color: #64748b; color: #64748b; background: rgba(255,255,255,0.5); }
            
            /* Modal Light Theme */
            .glass-modal { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 30px 60px -15px rgba(100, 116, 139, 0.25); }
            
            .bg-thumb { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; border: 2px solid transparent; }
            .bg-thumb:hover { transform: scale(1.05); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
            .bg-thumb.active { border-color: #64748b; transform: scale(0.95); }

            .preview-container .glass-box { width: 80px; height: 80px; }
            .preview-container .icon-bitmap { width: 48px; height: 48px; }
            .preview-container .icon-mask { width: 48px; height: 48px; background-color: #475569; }

        `;
        this.element.appendChild(style);

        this.element.innerHTML += `
            <canvas id="rain-canvas" class="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-60"></canvas>
            <div class="relative z-10 flex flex-col items-center justify-start w-full max-w-4xl px-4 text-center">
                <!-- CLICKABLE TITLE -->
                <h1 id="hero-title" class="text-5xl md:text-7xl font-light tracking-[0.2em] mb-8 text-slate-700 hero-font-sc opacity-90 cursor-pointer hover:opacity-75 transition-opacity" title="Change Theme">Catzz</h1>
                <div class="h-8 flex items-center justify-center text-sm md:text-base text-slate-500 font-light tracking-[0.4em] hero-font-sc rounded-full">
                    <span class="prefix inline-block mr-4 opacity-0"></span>
                    <span class="typed-quotes inline-block opacity-0"></span>
                </div>
                <div class="mt-20 w-full max-w-3xl">
                     <div id="bookmark-grid" class="flex flex-wrap justify-center gap-y-12 gap-x-8 md:gap-x-12 px-4 opacity-0 animate-[softFadeIn_1s_ease-out_0.8s_forwards]"></div>
                </div>
            </div>
            
            <!-- ADD BOOKMARK MODAL -->
            <div id="add-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="glass-modal w-full max-w-md p-10 rounded-[2rem] transform scale-95 transition-transform duration-300">
                    <h3 class="text-2xl text-slate-700 font-light mb-8 hero-font-sc tracking-wider text-center">New Shortcut</h3>
                    <div class="flex flex-col items-center justify-center mb-8 h-24">
                        <div id="preview-icon-container" class="preview-container relative w-full flex items-center justify-center">
                            <div class="glass-box">
                                <span class="text-slate-400 text-[10px] uppercase tracking-widest">Preview</span>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-6">
                         <div class="relative">
                            <input type="url" id="bm-url" class="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 text-sm font-light" placeholder="https://site.com">
                            <label class="absolute -top-2.5 left-3 bg-white/80 px-2 text-[10px] text-slate-400 uppercase tracking-widest backdrop-blur-sm rounded">URL</label>
                        </div>
                        <div class="relative">
                            <input type="text" id="bm-name" class="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400 text-sm font-light" placeholder="Name">
                            <label class="absolute -top-2.5 left-3 bg-white/80 px-2 text-[10px] text-slate-400 uppercase tracking-widest backdrop-blur-sm rounded">Name</label>
                        </div>
                    </div>
                    <div class="flex gap-4 mt-10">
                        <button id="close-modal" class="flex-1 py-4 bg-transparent border border-slate-300 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors font-light tracking-widest text-[10px] uppercase">Cancel</button>
                        <button id="save-bookmark" class="flex-1 py-4 bg-slate-700 text-white rounded-xl transition-all hover:bg-slate-800 shadow-lg font-light tracking-widest text-[10px] uppercase">Save</button>
                    </div>
                </div>
            </div>

            <!-- BACKGROUND PICKER MODAL -->
            <div id="bg-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="glass-modal w-full max-w-4xl p-8 rounded-[2rem] transform scale-95 transition-transform duration-300 relative">
                     <button id="close-bg-modal" class="absolute top-6 right-8 text-slate-400 hover:text-slate-700 text-2xl transition-colors">&times;</button>
                     <h3 class="text-2xl text-slate-700 font-light mb-8 hero-font-sc tracking-wider text-center">Select Theme</h3>
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto px-2 pb-4 scrollbar-hide">
                        <!-- BG Images Injected Here -->
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
        this.initBgPicker();
    }

    initBgPicker() {
        const title = this.element.querySelector('#hero-title');
        const modal = this.element.querySelector('#bg-modal');
        const modalContent = modal.querySelector('.glass-modal');
        const closeBtn = this.element.querySelector('#close-bg-modal');
        const grid = modal.querySelector('.grid');

        // Populate Grid
        this.bgImages.forEach(src => {
            const thumb = document.createElement('div');
            thumb.className = `bg-thumb w-full h-32 rounded-xl bg-cover bg-center ${this.currentBg === src ? 'active' : ''}`;
            thumb.style.backgroundImage = `url('${src}')`;
            thumb.addEventListener('click', () => {
                this.currentBg = src;
                this.element.style.backgroundImage = `url('${src}')`;
                this.element.classList.remove('bg-gradient-to-b');

                localStorage.setItem('catzz_bg', src);
                closeModal();

                // Update Active State
                modal.querySelectorAll('.bg-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            grid.appendChild(thumb);
        });

        const openModal = () => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95'); modalContent.classList.add('scale-100');
        };

        const closeModal = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95'); modalContent.classList.remove('scale-100');
        };

        title.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    getSimpleIconSlug(name, url) {
        let domain = "";
        try { domain = new URL(url).hostname.replace('www.', ''); } catch (e) { }
        if (this.simpleIconsMap[domain]) return this.simpleIconsMap[domain];
        let slug = name.toLowerCase().replace(/\\s+/g, '');
        if (slug.includes('deepseek')) return 'deepseek';
        return slug;
    }

    fetchIcon(name, url, container) {
        container.innerHTML = '';
        const glassBox = document.createElement('div');
        glassBox.className = 'glass-box';
        container.appendChild(glassBox);

        const slug = this.getSimpleIconSlug(name, url);
        let domain = "";
        try { domain = new URL(url).hostname; } catch (e) { }

        const sources = [
            `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`,
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
            if (attempt >= sources.length) { showText(); return; }
            const src = sources[attempt];
            attempt++;

            const img = new Image();
            img.src = src;
            img.onload = () => {
                if (img.width < 5) { tryNext(); }
                else {
                    const realImg = document.createElement('img');
                    realImg.className = 'icon-bitmap';
                    realImg.src = src;
                    glassBox.innerHTML = '';
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
            iconRoot.className = 'relative w-[48px] h-[48px] flex items-center justify-center'; // Wrapper

            const link = document.createElement('a');
            link.href = site.url; link.target = "_blank"; link.rel = "noopener noreferrer";
            link.className = "flex flex-col items-center gap-3 w-full";

            this.fetchIcon(site.name, site.url, iconRoot);

            link.appendChild(iconRoot);
            const label = document.createElement('span');
            // Simplified label: Font Sans, Slate Color for Light Theme
            label.className = "text-[10px] text-slate-400 font-sans tracking-wider mt-3 group-hover:text-slate-600 transition-colors duration-300 text-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full";
            label.textContent = site.name;
            link.appendChild(label);
            item.appendChild(link);

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
        class Raindrop { constructor() { this.reset(); this.y = Math.random() * height; } reset() { this.x = Math.random() * width; this.y = -20; this.length = Math.random() * 15 + 5; this.speed = Math.random() * 3 + 4; this.opacity = Math.random() * 0.3 + 0.1; } draw() { ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + this.length); ctx.strokeStyle = `rgba(148, 163, 184, ${this.opacity})`; ctx.lineWidth = 1.5; ctx.stroke(); } update() { this.y += this.speed; if (this.y > height) this.reset(); } }
        for (let i = 0; i < count; i++) raindrops.push(new Raindrop());
        const animate = () => { ctx.clearRect(0, 0, width, height); raindrops.forEach(drop => { drop.update(); drop.draw(); }); this.rainAnimationId = requestAnimationFrame(animate); };
        animate(); window.addEventListener('resize', resize);
    }
}
