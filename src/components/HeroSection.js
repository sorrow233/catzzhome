import { login, logout, saveSettings, listenSettings, auth } from '../lib/firebase.js';

export default class HeroSection {
    constructor() {
        this.prefixes = ["清凉雨夜", "脆弱雨伞", "街边电话", "路旁雨滩"];
        this.suffixes = ["温暖过谁的心", "保护了谁前行", "少女心伤忧郁", "天空触手可及"];
        this.currentIndex = 0;

        const defaultBookmarks = [
            { name: "GitHub", url: "https://github.com" },
            { name: "Bilibili", url: "https://www.bilibili.com" },
            { name: "YouTube", url: "https://www.youtube.com" },
            { name: "Twitter", url: "https://x.com" },
            { name: "Gmail", url: "https://mail.google.com" },
            { name: "Notion", url: "https://www.notion.so" }
        ];

        this.wallpapers = [
            {
                id: 'rainy_window',
                name: 'Rainy Window',
                url: "https://blog.catzz.work/file/1766242722856_image.png",
                theme: {
                    textColor: "text-cyan-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(34,211,238,0.3)]",
                    glassColor: "bg-cyan-950/40",
                    glassBorder: "border-cyan-200/20",
                    iconColor: "#a5f3fc", // Cyan-200
                    iconHoverColor: "#22d3ee", // Cyan-400 (Neon)
                    glowColor: "rgba(34, 211, 238, 0.4)",
                    quoteColor: "text-cyan-100/80"
                }
            },
            {
                id: 'wet_street',
                name: 'Wet Street',
                url: "https://blog.catzz.work/file/1766242726260_image.png",
                theme: {
                    textColor: "text-indigo-50",
                    textShadow: "drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]",
                    glassColor: "bg-slate-900/70", // Deep dark for contrast
                    glassBorder: "border-indigo-200/10",
                    iconColor: "#e0e7ff", // Indigo-100
                    iconHoverColor: "#818cf8", // Indigo-400
                    glowColor: "rgba(129, 140, 248, 0.4)",
                    quoteColor: "text-indigo-100/80"
                }
            },
            {
                id: 'city_bed',
                name: 'City Bed',
                url: "https://blog.catzz.work/file/1766241278914_78375860_p0.png",
                theme: {
                    textColor: "text-amber-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(251,191,36,0.3)]",
                    glassColor: "bg-neutral-900/60",
                    glassBorder: "border-amber-500/20",
                    iconColor: "#fcd34d", // Amber-300
                    iconHoverColor: "#fbbf24", // Amber-400 (Lamp light)
                    glowColor: "rgba(251, 191, 36, 0.4)",
                    quoteColor: "text-amber-100/90"
                }
            },
            {
                id: 'umbrella_street',
                name: 'Umbrella Street',
                url: "https://blog.catzz.work/file/1766241276169_100669875_p0.jpg",
                theme: {
                    textColor: "text-fuchsia-50",
                    textShadow: "drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]",
                    glassColor: "bg-gray-900/40",
                    glassBorder: "border-fuchsia-200/10",
                    iconColor: "#e879f9", // Fuchsia-400
                    iconHoverColor: "#d946ef", // Fuchsia-500
                    glowColor: "rgba(217, 70, 239, 0.4)",
                    quoteColor: "text-fuchsia-100/90"
                }
            },
            {
                id: 'flower_window',
                name: 'Flower Window',
                url: "https://blog.catzz.work/file/1766241276149_113793915_p0.png",
                theme: {
                    textColor: "text-emerald-50",
                    textShadow: "drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]",
                    glassColor: "bg-emerald-950/40",
                    glassBorder: "border-emerald-200/15",
                    iconColor: "#6ee7b7", // Emerald-300
                    iconHoverColor: "#34d399", // Emerald-400
                    glowColor: "rgba(52, 211, 153, 0.4)",
                    quoteColor: "text-emerald-100/90"
                }
            },
            {
                id: 'white_shirt_girl',
                name: 'White Shirt Girl',
                url: "https://blog.catzz.work/file/1766241281738_116302432_p0.png",
                theme: {
                    textColor: "text-slate-50",
                    textShadow: "drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]",
                    glassColor: "bg-slate-800/30",
                    glassBorder: "border-slate-200/20",
                    iconColor: "#cbd5e1", // Slate-300
                    iconHoverColor: "#ffffff",
                    glowColor: "rgba(255, 255, 255, 0.4)",
                    quoteColor: "text-slate-200/80"
                }
            },
            {
                id: 'sunset_balcony',
                name: 'Sunset Balcony',
                url: "https://blog.catzz.work/file/1766241284787_72055179_p0.jpg",
                theme: {
                    textColor: "text-orange-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(251,146,60,0.4)]",
                    glassColor: "bg-orange-950/40",
                    glassBorder: "border-orange-200/20",
                    iconColor: "#fdba74", // Orange-300
                    iconHoverColor: "#fb923c", // Orange-400
                    glowColor: "rgba(251, 146, 60, 0.5)",
                    quoteColor: "text-orange-100"
                }
            },
            {
                id: 'night_view',
                name: 'Night View',
                url: "https://blog.catzz.work/file/1766241306259_68686407_p0.jpg",
                theme: {
                    textColor: "text-blue-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(96,165,250,0.5)]",
                    glassColor: "bg-blue-950/50",
                    glassBorder: "border-blue-400/20",
                    iconColor: "#93c5fd", // Blue-300
                    iconHoverColor: "#60a5fa", // Blue-400
                    glowColor: "rgba(96, 165, 250, 0.6)", // Strong blue glow
                    quoteColor: "text-blue-100/90"
                }
            }
        ];

        // Load Saved Data
        try {
            const saved = localStorage.getItem('catzz_bookmarks');
            this.bookmarks = saved ? JSON.parse(saved) : defaultBookmarks;

            // Background
            this.currentBg = localStorage.getItem('catzz_bg') || this.wallpapers[3].url;

            // Current Cinematic Prefs (Map: URL -> Boolean)
            try {
                this.cinematicPrefs = JSON.parse(localStorage.getItem('catzz_cinematic_prefs')) || {};
            } catch {
                this.cinematicPrefs = {};
            }
        } catch (e) {
            this.bookmarks = defaultBookmarks;
            this.currentBg = this.wallpapers[3].url;
            this.cinematicPrefs = {};
        }

        this.simpleIconsMap = {
            'x.com': 'x', 'twitter.com': 'twitter',
            'mail.google.com': 'gmail', 'chatgpt.com': 'openai',
            'claude.ai': 'anthropic', 'dribbble.com': 'dribbble',
            'figma.com': 'figma', 'notion.so': 'notion', 'vercel.com': 'vercel',
            'bluesky.app': 'bluesky'
        };
    }

    getCurrentTheme() {
        const wp = this.wallpapers.find(w => w.url === this.currentBg);
        return wp ? wp.theme : {
            textColor: "text-slate-700",
            textShadow: "",
            glassColor: "bg-white/40",
            glassBorder: "border-white/40",
            iconColor: "#64748b",
            iconHoverColor: "#334155",
            glowColor: "rgba(0, 0, 0, 0.1)",
            quoteColor: "text-slate-500"
        };
    }

    getCinematicState() {
        // Default to true if not set
        return this.cinematicPrefs[this.currentBg] !== false;
    }

    getCinematicState() {
        // Default to true if not set
        return this.cinematicPrefs[this.currentBg] !== false;
    }

    render() {
        const theme = this.getCurrentTheme();
        const isDark = theme === 'dark';

        this.element = document.createElement('section');
        this.element.className = 'w-full h-screen flex flex-col items-center justify-start pt-16 md:pt-36 relative overflow-hidden font-serif transition-opacity duration-700 ease-in-out bg-cover bg-center';

        // Initial Background State
        if (this.currentBg) {
            this.element.style.backgroundImage = `url('${this.currentBg}')`;
        } else {
            this.element.classList.add('bg-gradient-to-b', 'from-[#fdfbf7]', 'via-[#f4f7fb]', 'to-[#eef2f6]');
        }

        // Cinematic Gradient Overlay for Dark Mode
        if (isDark && this.cinematicMode) {
            this.element.innerHTML += `<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0"></div>`;
        }

        const style = document.createElement('style');
        this.styleElement = style;
        this.updateDynamicStyles(theme);
        this.element.appendChild(style);

        this.element.innerHTML += `
            <canvas id="rain-canvas" class="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-60"></canvas>
            <div class="relative z-10 flex flex-col items-center justify-start w-full max-w-4xl px-4 text-center">
                <!-- CLICKABLE TITLE -->
                <h1 id="hero-title" class="text-4xl md:text-7xl mb-6 md:mb-8 hero-font-sc opacity-90 cursor-pointer hover:opacity-75 transition-colors duration-500 ${theme.textColor} ${theme.textShadow}" title="Change Theme">Catzz</h1>
                
                <!-- CLOUD BUTTON -->
                <div id="cloud-btn" class="absolute top-4 right-4 md:top-8 md:right-8 z-30 w-10 h-10 rounded-full glass-box flex items-center justify-center cursor-pointer hover:bg-white/40 transition-all text-slate-400 hover:text-slate-600" title="Sync Settings">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                </div>

                <!-- GUIDE TOOLTIP -->
                <div id="theme-guide" class="hidden absolute top-12 md:top-24 z-20 transition-opacity duration-700 opacity-0 pointer-events-none">
                    <div class="glass-box px-6 py-2 rounded-full text-slate-500 text-xs font-light tracking-widest animate-bounce border border-white/40 shadow-sm bg-white/40 backdrop-blur-md">
                        Click 'Catzz' to switch theme
                    </div>
                </div>

                <div class="h-8 flex items-center justify-center text-sm md:text-base hero-font-sc rounded-full transition-colors duration-500 quote-container ${theme.quoteColor}">
                    <span class="prefix inline-block mr-4 opacity-0"></span>
                    <span class="typed-quotes inline-block opacity-0"></span>
                </div>
                <div class="mt-12 md:mt-20 w-full max-w-3xl">
                     <div id="bookmark-grid" class="flex flex-wrap justify-center gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-12 px-4"></div>
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
                     <h3 class="text-2xl text-slate-700 font-light mb-2 hero-font-sc tracking-wider text-center">Select Theme</h3>
                     
                     <!-- TOGGLE SWITCH -->
                     <div class="flex items-center justify-center gap-3 mb-8">
                        <span class="text-xs text-slate-500 font-light tracking-widest uppercase">Cinematic</span>
                        <button id="cinematic-toggle" class="w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none bg-slate-700">
                            <div class="w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 left-6 shadow-sm"></div>
                        </button>
                     </div>

                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto px-2 pb-4 scrollbar-hide">
                        <!-- BG Images Injected Here -->
                     </div>
                </div>
            </div>
        `;

        setTimeout(() => this.applyThemeToElements(theme), 0);
        return this.element;
    }

    updateDynamicStyles(theme) {
        if (!this.styleElement) return;

        this.styleElement.textContent = `
            .hero-font-sc { font-family: 'Noto Serif SC', serif; }
            @keyframes softFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes softFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-5px); blur(1px); } }
            .text-prefix-in { animation: softFadeIn 1.2s ease-out forwards; } .text-quotes-in { animation: softFadeIn 1.2s ease-out 0.3s forwards; } .text-out { animation: softFadeOut 1.2s ease-in forwards; }
            
            /* Glass Container - Dynamic */
            .unified-icon-container .glass-box {
                width: 48px; height: 48px;
                border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            
            .unified-icon-container:hover .glass-box {
                transform: translateY(-4px);
                box-shadow: 0 10px 25px -5px \${theme.glowColor || 'rgba(0,0,0,0.15)'}, 
                            0 0 15px -2px \${theme.glowColor || 'rgba(0,0,0,0.1)'} inset;
                border-color: \${theme.iconHoverColor}40;
            }

            /* 1. SVG ICONS: Dynamic Color */
            .icon-wrapper .icon-mask { 
                width: 32px; height: 32px; 
                background-color: \${theme.iconColor || '#64748b'};
                -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;
                mask-size: contain; mask-repeat: no-repeat; mask-position: center;
                transition: all 0.3s ease;
            }
            .unified-icon-container:hover .icon-mask { 
                background-color: \${theme.iconHoverColor || '#334155'};
            }

            /* 2. BITMAP ICONS */
            .icon-bitmap { 
                width: 36px; height: 36px;
                object-fit: contain; 
                filter: grayscale(100%) contrast(1.1) opacity(0.85);
                mix-blend-mode: multiply; 
                transition: all 0.3s ease;
            }
            
            .unified-icon-container:hover .icon-bitmap { 
                filter: grayscale(0%) contrast(1.1) opacity(1);
                transform: scale(1.05);
                mix-blend-mode: normal;
            }

            .text-icon {
                font-family: 'Noto Serif SC', serif;
                font-weight: 300; font-size: 20px; 
                color: \${theme.iconColor || '#64748b'};
                border: 1px solid \${theme.iconColor ? theme.iconColor + '40' : '#cbd5e1'};
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

            /* Delayed Delete Button */
            .delayed-delete-btn { opacity: 0; transition: opacity 0.3s ease 0s; pointer-events: none; }
            .unified-icon-container:hover .delayed-delete-btn { opacity: 1; transition-delay: 2s; pointer-events: auto; }
        `;
    }

    applyThemeToElements(theme) {
        const title = this.element.querySelector('#hero-title');
        if (title) {
            title.className = `text-4xl md:text-7xl mb-6 md:mb-8 hero-font-sc opacity-90 cursor-pointer hover:opacity-75 transition-colors duration-500 \${theme.textColor} \${theme.textShadow || ''}`;
        }

        const quoteContainer = this.element.querySelector('.quote-container');
        if (quoteContainer) {
            quoteContainer.className = `h-8 flex items-center justify-center text-sm md:text-base hero-font-sc rounded-full transition-colors duration-500 quote-container \${theme.quoteColor || 'text-slate-500'}`;
        }
        this.renderGrid();
    }

    mount() {
        this.initRain();
        this.initTypewriter();
        this.renderGrid();
        this.initModal();
        this.initBgPicker();
        this.initGuide();
        this.initAuth();
    }

    initAuth() {
        const btn = this.element.querySelector('#cloud-btn');
        let currentUser = null;

        // Listen for Auth Changes
        auth.onAuthStateChanged(user => {
            currentUser = user;
            if (user) {
                btn.innerHTML = `<img src="${user.photoURL}" class="w-full h-full rounded-full opacity-80" alt="User">`;
                btn.title = `Logged in as ${user.displayName}`;

                // Start Listening to Settings
                listenSettings(user.uid, (data) => {
                    if (data) {
                        let changed = false;
                        if (data.bg && data.bg !== this.currentBg) {
                            this.currentBg = data.bg;
                            this.element.style.backgroundImage = `url('${data.bg}')`;
                            this.element.classList.remove('bg-gradient-to-b');
                            localStorage.setItem('catzz_bg', data.bg);

                            if (data.cinematicPrefs) {
                                this.cinematicPrefs = data.cinematicPrefs;
                                localStorage.setItem('catzz_cinematic_prefs', JSON.stringify(this.cinematicPrefs));
                            } else if (data.cinematicMode !== undefined) {
                                // Backward compatibility migration
                                this.cinematicPrefs[this.currentBg] = data.cinematicMode;
                                localStorage.setItem('catzz_cinematic_prefs', JSON.stringify(this.cinematicPrefs));
                            }

                            const theme = this.getCurrentTheme();
                            this.updateDynamicStyles(theme);
                            this.applyThemeToElements(theme);

                            // Toggle gradient based on cinematicMode for CURRENT bg
                            this.toggleGradient(this.getCinematicState());

                            changed = true;
                        }
                        if (data.bookmarks && JSON.stringify(data.bookmarks) !== JSON.stringify(this.bookmarks)) {
                            this.bookmarks = data.bookmarks;
                            localStorage.setItem('catzz_bookmarks', JSON.stringify(data.bookmarks));
                            this.renderGrid();
                            changed = true;
                        }
                    }
                });
            } else {
                btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`;
                btn.title = "Sync Settings";
            }
        });

        btn.addEventListener('click', async () => {
            if (currentUser) {
                if (confirm('Logout?')) logout();
            } else {
                try {
                    await login();
                } catch (e) { alert('Login failed'); }
            }
        });
    }

    initGuide() {
        // Check if guide has been seen
        if (!localStorage.getItem('catzz_guide_seen')) {
            const guide = this.element.querySelector('#theme-guide');
            if (guide) {
                guide.classList.remove('hidden');
                // Small delay for entrance
                setTimeout(() => {
                    guide.classList.remove('opacity-0');
                }, 1000);
            }
        }
    }

    initBgPicker() {
        const title = this.element.querySelector('#hero-title');
        const modal = this.element.querySelector('#bg-modal');
        const modalContent = modal.querySelector('.glass-modal');
        const closeBtn = this.element.querySelector('#close-bg-modal');
        const grid = modal.querySelector('.grid');

        const toggleBtn = modal.querySelector('#cinematic-toggle');
        const toggleKnob = toggleBtn.querySelector('div');

        const updateToggleUI = () => {
            if (this.cinematicMode) {
                toggleBtn.classList.remove('bg-slate-300'); toggleBtn.classList.add('bg-slate-700');
                toggleKnob.classList.remove('left-1'); toggleKnob.classList.add('left-6');
            } else {
                toggleBtn.classList.remove('bg-slate-700'); toggleBtn.classList.add('bg-slate-300');
                toggleKnob.classList.remove('left-6'); toggleKnob.classList.add('left-1');
            }
        };

        toggleBtn.addEventListener('click', () => {
            this.cinematicMode = !this.cinematicMode;
            localStorage.setItem('catzz_cinematic', this.cinematicMode);
            updateToggleUI();

            // Apply immediately
            const theme = this.getCurrentTheme();
            this.toggleGradient(this.cinematicMode);

            if (auth.currentUser) saveSettings(auth.currentUser.uid, { cinematicMode: this.cinematicMode });
        });

        // Populate Grid
        this.wallpapers.forEach(wp => {
            const thumb = document.createElement('div');
            thumb.className = `bg-thumb w-full h-32 rounded-xl bg-cover bg-center ${this.currentBg === wp.url ? 'active' : ''}`;
            thumb.style.backgroundImage = `url('${wp.url}')`;
            thumb.title = wp.name || wp.id;
            thumb.addEventListener('click', () => {
                this.currentBg = wp.url;
                this.element.style.backgroundImage = `url('${wp.url}')`;
                this.element.classList.remove('bg-gradient-to-b');

                // Apply Theme
                const theme = this.getCurrentTheme();
                this.updateDynamicStyles(theme);
                this.applyThemeToElements(theme);

                localStorage.setItem('catzz_bg', wp.url);
                if (auth.currentUser) saveSettings(auth.currentUser.uid, { bg: wp.url, cinematicMode: this.cinematicMode });
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

        title.addEventListener('click', () => {
            // Dismiss Guide on First Click
            if (!localStorage.getItem('catzz_guide_seen')) {
                localStorage.setItem('catzz_guide_seen', 'true');
                const guide = this.element.querySelector('#theme-guide');
                if (guide) guide.classList.add('opacity-0');
            }
            openModal();
        });
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

    fetchIcon(name, url, container, theme) {
        container.innerHTML = '';
        const glassBox = document.createElement('div');
        // Apply Dynamic Theme Classes
        const glassClass = theme && theme.glassColor ? theme.glassColor : 'bg-white/40';
        const borderClass = theme && theme.glassBorder ? theme.glassBorder : '';

        glassBox.className = `glass-box ${glassClass} ${borderClass} border backdrop-blur-md`;
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
        /* istanbul ignore next */
        if (!grid) return;

        const theme = this.getCurrentTheme();
        grid.innerHTML = '';
        this.bookmarks.forEach((site, index) => {
            const item = document.createElement('div');
            item.className = 'unified-icon-container flex flex-col items-center gap-4 group w-20 md:w-24 cursor-pointer relative';
            const iconRoot = document.createElement('div');
            iconRoot.className = 'relative w-[48px] h-[48px] flex items-center justify-center'; // Wrapper

            const link = document.createElement('a');
            link.href = site.url; link.target = "_blank"; link.rel = "noopener noreferrer";
            link.className = "flex flex-col items-center gap-3 w-full";

            this.fetchIcon(site.name, site.url, iconRoot, theme);

            link.appendChild(iconRoot);
            const label = document.createElement('span');

            const labelColor = theme && theme.quoteColor ? theme.quoteColor : "text-slate-400";

            label.className = `text-[10px] font-sans tracking-wider mt-3 group-hover:text-opacity-100 text-opacity-80 transition-colors duration-300 text-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${labelColor}`;
            label.textContent = site.name;
            link.appendChild(label);
            item.appendChild(link);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = "absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] backdrop-blur-md delayed-delete-btn shadow-sm";
            deleteBtn.innerHTML = "&times;";
            deleteBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.deleteBookmark(index); });
            item.appendChild(deleteBtn);

            grid.appendChild(item);
        });

        const addBtn = document.createElement('div');
        addBtn.className = 'flex flex-col items-center gap-4 group w-20 md:w-24 cursor-pointer';
        addBtn.innerHTML = `<div class="add-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg></div><span class="text-[10px] tracking-widest text-gray-600 uppercase font-light group-hover:text-gray-400 transition-colors">Add</span>`;
        addBtn.addEventListener('click', () => this.openModal());
        grid.appendChild(addBtn);
    }

    toggleGradient(show) {
        // Remove existing
        const existing = this.element.querySelector('.cinematic-gradient');
        if (existing) existing.remove();

        if (show) {
            const grad = document.createElement('div');
            grad.className = 'cinematic-gradient absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0';
            // Insert after rain canvas
            const rain = this.element.querySelector('#rain-canvas');
            if (rain && rain.nextSibling) {
                this.element.insertBefore(grad, rain.nextSibling);
            } else {
                this.element.appendChild(grad);
            }
        }
    }

    extractNameFromUrl(url) {
        try {
            const hostname = new URL(url).hostname;
            const parts = hostname.split('.');

            // Heuristic for TLD (Top Level Domain)
            // Handle common double-extensions like .co.uk, .com.cn
            const doubleTlds = ['co', 'com', 'org', 'net', 'edu', 'gov', 'mil', 'ac'];
            let tldParts = 1;

            if (parts.length > 2) {
                const last = parts[parts.length - 1];
                const secondLast = parts[parts.length - 2];
                // If last is 2 chars (e.g. uk, cn) and second last is generic (e.g. co), treat as 2-part TLD
                if (last.length === 2 && doubleTlds.includes(secondLast)) {
                    tldParts = 2;
                }
            }

            // The 'Brand' is usually the part immediately before the TLD
            // e.g. [console, gmicloud, ai] (1 part TLD) -> index 1 (gmicloud)
            // e.g. [www, google, co, jp] (2 part TLD) -> index 1 (google)
            if (parts.length <= tldParts) return 'Site'; // Fallback for 'localhost' or 'ai'

            const brandIndex = parts.length - tldParts - 1;
            let name = parts[brandIndex];

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

    saveBookmarks() {
        localStorage.setItem('catzz_bookmarks', JSON.stringify(this.bookmarks));
        if (auth.currentUser) saveSettings(auth.currentUser.uid, { bookmarks: this.bookmarks });
    }
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
