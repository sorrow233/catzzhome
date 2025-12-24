// 移除顶层 Firebase 导入，改为动态按需加载 (~40MB 内存节省)
// import { login, logout, saveSettings, listenSettings, auth } from '../lib/firebase.js';

export default class HeroSection {
    constructor() {
        this.prefixes = ["清凉雨夜", "脆弱雨伞", "街边电话", "路旁雨滩"];
        this.suffixes = ["温暖过谁的心", "保护了谁前行", "少女心伤忧郁", "天空触手可及"];
        this.currentIndex = 0;

        const defaultBookmarks = [
            { name: "Bilibili", url: "https://www.bilibili.com" },
            { name: "YouTube", url: "https://www.youtube.com" },
            { name: "Twitter", url: "https://x.com" },
            { name: "Gmail", url: "https://mail.google.com" },
            { name: "Notion", url: "https://www.notion.so" },
            { name: "GitHub", url: "https://github.com" },
            { name: "Pixiv", url: "https://www.pixiv.net" },
            { name: "Gemini", url: "https://gemini.google.com" },
            { name: "元宝", url: "https://yuanbao.tencent.com" },
            { name: "Google Maps", url: "https://maps.google.com" },
            { name: "Netflix", url: "https://www.netflix.com" }
        ];

        // 壁纸数据: 移除原图URL以节省内存 (~90MB)
        // 原图URL将按需动态构建
        this.wallpapers = [
            {
                id: 'rainy_window',
                name: 'Rainy Window',
                thumbUrl: "https://blog.catzz.work/file/1766577198544_rainy_window_thumb.webp",
                theme: {
                    textColor: "text-cyan-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(34,211,238,0.3)]",
                    glassColor: "bg-cyan-950/40",
                    glassBorder: "border-cyan-200/20",
                    iconColor: "#a5f3fc",
                    iconHoverColor: "#22d3ee",
                    glowColor: "rgba(34, 211, 238, 0.4)",
                    quoteColor: "text-cyan-100/80"
                }
            },
            {
                id: 'wet_street',
                name: 'Wet Street',
                thumbUrl: "https://blog.catzz.work/file/1766577191010_wet_street_thumb.webp",
                theme: {
                    textColor: "text-indigo-50",
                    textShadow: "drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]",
                    glassColor: "bg-slate-900/70",
                    glassBorder: "border-indigo-200/10",
                    iconColor: "#e0e7ff",
                    iconHoverColor: "#818cf8",
                    glowColor: "rgba(129, 140, 248, 0.4)",
                    quoteColor: "text-indigo-100/80"
                }
            },
            {
                id: 'city_bed',
                name: 'City Bed',
                thumbUrl: "https://blog.catzz.work/file/1766577198695_city_bed_thumb.webp",
                theme: {
                    textColor: "text-amber-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(251,191,36,0.3)]",
                    glassColor: "bg-neutral-900/60",
                    glassBorder: "border-amber-500/20",
                    iconColor: "#fcd34d",
                    iconHoverColor: "#fbbf24",
                    glowColor: "rgba(251, 191, 36, 0.4)",
                    quoteColor: "text-amber-100/90"
                }
            },
            {
                id: 'umbrella_street',
                name: 'Umbrella Street',
                thumbUrl: "https://blog.catzz.work/file/1766577195392_umbrella_street_thumb.webp",
                theme: {
                    textColor: "text-fuchsia-50",
                    textShadow: "drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]",
                    glassColor: "bg-gray-900/40",
                    glassBorder: "border-fuchsia-200/10",
                    iconColor: "#e879f9",
                    iconHoverColor: "#d946ef",
                    glowColor: "rgba(217, 70, 239, 0.4)",
                    quoteColor: "text-fuchsia-100/90"
                }
            },
            {
                id: 'flower_window',
                name: 'Flower Window',
                thumbUrl: "https://blog.catzz.work/file/1766577189209_flower_window_thumb.webp",
                theme: {
                    textColor: "text-emerald-50",
                    textShadow: "drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]",
                    glassColor: "bg-emerald-950/40",
                    glassBorder: "border-emerald-200/15",
                    iconColor: "#6ee7b7",
                    iconHoverColor: "#34d399",
                    glowColor: "rgba(52, 211, 153, 0.4)",
                    quoteColor: "text-emerald-100/90"
                }
            },
            {
                id: 'white_shirt_girl',
                name: 'White Shirt Girl',
                thumbUrl: "https://blog.catzz.work/file/1766577195255_white_shirt_girl_thumb.webp",
                theme: {
                    textColor: "text-slate-50",
                    textShadow: "drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]",
                    glassColor: "bg-slate-800/30",
                    glassBorder: "border-slate-200/20",
                    iconColor: "#cbd5e1",
                    iconHoverColor: "#ffffff",
                    glowColor: "rgba(255, 255, 255, 0.4)",
                    quoteColor: "text-slate-200/80"
                }
            },
            {
                id: 'sunset_balcony',
                name: 'Sunset Balcony',
                thumbUrl: "https://blog.catzz.work/file/1766577196361_sunset_balcony_thumb.webp",
                theme: {
                    textColor: "text-orange-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(251,146,60,0.4)]",
                    glassColor: "bg-orange-950/40",
                    glassBorder: "border-orange-200/20",
                    iconColor: "#fdba74",
                    iconHoverColor: "#fb923c",
                    glowColor: "rgba(251, 146, 60, 0.5)",
                    quoteColor: "text-orange-100"
                }
            },
            {
                id: 'night_view',
                name: 'Night View',
                thumbUrl: "https://blog.catzz.work/file/1766577191962_night_view_thumb.webp",
                theme: {
                    textColor: "text-blue-50",
                    textShadow: "drop-shadow-[0_2px_15px_rgba(96,165,250,0.5)]",
                    glassColor: "bg-blue-950/50",
                    glassBorder: "border-blue-400/20",
                    iconColor: "#93c5fd",
                    iconHoverColor: "#60a5fa",
                    glowColor: "rgba(96, 165, 250, 0.6)",
                    quoteColor: "text-blue-100/90"
                }
            }
        ];

        // 原图URL映射表（按需加载）
        this.wallpaperUrls = {
            'rainy_window': "https://blog.catzz.work/file/1766242722856_image.png",
            'wet_street': "https://blog.catzz.work/file/1766242726260_image.png",
            'city_bed': "https://blog.catzz.work/file/1766241278914_78375860_p0.png",
            'umbrella_street': "https://blog.catzz.work/file/1766241276169_100669875_p0.jpg",
            'flower_window': "https://blog.catzz.work/file/1766241276149_113793915_p0.png",
            'white_shirt_girl': "https://blog.catzz.work/file/1766241281738_116302432_p0.png",
            'sunset_balcony': "https://blog.catzz.work/file/1766241284787_72055179_p0.jpg",
            'night_view': "https://blog.catzz.work/file/1766241306259_68686407_p0.jpg"
        };

        // Load Saved Data
        try {
            const saved = localStorage.getItem('catzz_bookmarks');
            this.bookmarks = saved ? JSON.parse(saved) : defaultBookmarks;

            // Background: 使用ID而非URL（节省内存）
            this.currentBgId = localStorage.getItem('catzz_bg_id') || 'flower_window';

            // Current Cinematic Prefs (Map: ID -> Boolean)
            try {
                this.cinematicPrefs = JSON.parse(localStorage.getItem('catzz_cinematic_prefs')) || {};
            } catch {
                this.cinematicPrefs = {};
            }
        } catch (e) {
            this.bookmarks = defaultBookmarks;
            this.currentBgId = 'umbrella_street';
            this.cinematicPrefs = {};
        }

        this.simpleIconsMap = {
            'x.com': 'x', 'twitter.com': 'twitter',
            'mail.google.com': 'gmail', 'chatgpt.com': 'openai',
            'claude.ai': 'anthropic', 'dribbble.com': 'dribbble',
            'figma.com': 'figma', 'notion.so': 'notion', 'vercel.com': 'vercel',
            'bluesky.app': 'bluesky',
            // Custom icon mappings
            'github.com': 'github',
            'pixiv.net': 'pixiv',
            'gemini.google.com': 'googlegemini',
            'yuanbao.tencent.com': 'tencentqq',
            'maps.google.com': 'googlemaps',
            'netflix.com': 'netflix'
        };

        // Icon cache: Map<url, {iconSrc, iconType, textFallback}>
        this.iconCache = new Map();

        // 不活动检测 (极致内存优化)
        this.lastInteractionTime = Date.now();
        this.startInactivityTimer();
    }

    // 更新最后交互时间
    updateInteraction() {
        this.lastInteractionTime = Date.now();
    }

    // 启动不活动检测定时器
    startInactivityTimer() {
        setInterval(() => {
            const fiveMinutes = 5 * 60 * 1000;
            if (Date.now() - this.lastInteractionTime > fiveMinutes) {
                this.purgeMemory();
            }
        }, 60000); // 每分钟检查一次
    }

    // 极致内存优化：强制清理缓存
    async purgeMemory() {
        if (this.iconCache.size === 0 && !this.firebaseActive) return;

        console.log('Aggressive Memory Purge: Cleaning up inactivity cache and Firebase...');
        this.iconCache.clear();

        // 强行杀掉 Firebase 运行内存
        if (this.firebaseModule && this.firebaseActive) {
            await this.firebaseModule.terminateFirebase();
            this.firebaseActive = false; // 标记为非活跃
            this.firebaseModule = null; // 释放引用，尽管内存不一定立即释放，但提示浏览器清理
        }

        // 重新渲染一次不带图标的 Grid（强制释放旧图片引用）
        this.renderGrid();
    }

    // 辅助方法：获取壁纸原图URL
    getWallpaperUrl(id) {
        return this.wallpaperUrls[id] || '';
    }

    // 辅助方法：获取壁纸缩略图URL
    getWallpaperThumbUrl(id) {
        const wp = this.wallpapers.find(w => w.id === id);
        return wp ? wp.thumbUrl : '';
    }

    // 辅助方法：通过ID查找壁纸
    findWallpaperById(id) {
        return this.wallpapers.find(w => w.id === id);
    }

    // 极致内存优化：清除旧壁纸的内存引用
    clearPreviousWallpaper() {
        // 清除背景图引用，强制浏览器释放图片内存
        this.element.style.backgroundImage = 'none';

        // 强制垃圾回收提示（微任务队列）
        setTimeout(() => {
            // 浏览器会在下一帧清理未引用的图片资源
        }, 0);
    }

    getCurrentTheme() {
        const wp = this.findWallpaperById(this.currentBgId);
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
        if (this.cinematicPrefs[this.currentBgId] !== undefined) {
            return this.cinematicPrefs[this.currentBgId];
        }
        // Defaults: WP1 (Rainy Window), WP7 (Sunset), WP8 (Night) -> OFF
        // Others -> ON
        const defaultsOff = ['rainy_window', 'sunset_balcony', 'night_view'];
        return !defaultsOff.includes(this.currentBgId);
    }

    render() {
        const theme = this.getCurrentTheme();
        const isDark = theme === 'dark';

        this.element = document.createElement('section');
        this.element.className = 'w-full h-screen flex flex-col items-center justify-start pt-16 md:pt-36 relative overflow-hidden font-serif transition-opacity duration-700 ease-in-out bg-cover bg-center';

        // Initial Background State: 当前壁纸使用原图（清晰），只有1张~3MB
        if (this.currentBgId) {
            const originalUrl = this.getWallpaperUrl(this.currentBgId);
            this.element.style.backgroundImage = `url('${originalUrl}')`;
            // 记录当前加载的壁纸ID（用于后续清理）
            this.currentLoadedBgId = this.currentBgId;
        } else {
            this.element.classList.add('bg-gradient-to-b', 'from-[#fdfbf7]', 'via-[#f4f7fb]', 'to-[#eef2f6]');
        }

        // Cinematic Gradient Overlay
        if (this.getCinematicState()) {
            this.element.innerHTML += `<div class="cinematic-gradient absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0"></div>`;
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

            .avatar-themed {
                filter: grayscale(100%) brightness(1.1) opacity(0.8);
                mix-blend-mode: luminosity;
                transition: all 0.5s ease;
            }
            
            #cloud-btn:hover .avatar-themed {
                filter: grayscale(0%) brightness(1) opacity(1);
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
            quoteContainer.className = `h-8 flex items-center justify-center text-sm md:text-base hero-font-sc rounded-full transition-colors duration-500 quote-container ${theme.quoteColor || 'text-slate-500'}`;
        }

        const cloudBtn = this.element.querySelector('#cloud-btn');
        if (cloudBtn) {
            const glassClass = theme.glassColor || 'bg-white/40';
            const borderClass = theme.glassBorder || 'border-white/20';
            cloudBtn.className = `absolute top-4 right-4 md:top-8 md:right-8 z-30 w-10 h-10 rounded-full glass-box flex items-center justify-center cursor-pointer transition-all ${glassClass} ${borderClass} border backdrop-blur-md`;

            const svg = cloudBtn.querySelector('svg');
            if (svg) {
                svg.style.color = theme.iconColor || '#64748b';
            }
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

    // 动态加载 Firebase SDK
    async loadFirebase() {
        if (!this.firebaseModule) {
            try {
                this.firebaseModule = await import('../lib/firebase.js');
                this.firebaseActive = true;
            } catch (e) {
                console.error("Failed to load Firebase:", e);
                return null;
            }
        }
        return this.firebaseModule;
    }

    initAuth() {
        const btn = this.element.querySelector('#cloud-btn');
        let currentUser = null;

        const handleUserData = (data) => {
            if (!data) return;
            if (data.bgId && data.bgId !== this.currentBgId) {
                if (this.currentLoadedBgId && this.currentLoadedBgId !== data.bgId) {
                    this.clearPreviousWallpaper();
                }
                this.currentBgId = data.bgId;
                const originalUrl = this.getWallpaperUrl(data.bgId);
                this.element.style.backgroundImage = `url('${originalUrl}')`;
                this.element.classList.remove('bg-gradient-to-b');
                localStorage.setItem('catzz_bg_id', data.bgId);
                this.currentLoadedBgId = data.bgId;

                if (data.cinematicPrefs) {
                    this.cinematicPrefs = data.cinematicPrefs;
                    localStorage.setItem('catzz_cinematic_prefs', JSON.stringify(this.cinematicPrefs));
                } else if (data.cinematicMode !== undefined) {
                    // Backward compatibility migration
                    this.cinematicPrefs[this.currentBgId] = data.cinematicMode;
                    localStorage.setItem('catzz_cinematic_prefs', JSON.stringify(this.cinematicPrefs));
                }

                const theme = this.getCurrentTheme();
                this.updateDynamicStyles(theme);
                this.applyThemeToElements(theme);
                this.toggleGradient(this.getCinematicState());
            }
            if (data.bookmarks && JSON.stringify(data.bookmarks) !== JSON.stringify(this.bookmarks)) {
                this.bookmarks = data.bookmarks;
                localStorage.setItem('catzz_bookmarks', JSON.stringify(data.bookmarks));
                this.renderGrid();
            }
        };

        const setupAuthListener = (fb) => {
            fb.auth.onAuthStateChanged(async user => {
                currentUser = user;
                if (user) {
                    localStorage.setItem('catzz_is_logged_in', 'true');
                    btn.innerHTML = `<img src="${user.photoURL}" class="w-full h-full rounded-full avatar-themed" alt="User">`;
                    btn.title = `Logged in as ${user.displayName}`;

                    // 按需同步：登录时拉取一次数据
                    const data = await fb.fetchSettings(user.uid);
                    if (data) handleUserData(data);
                } else {
                    localStorage.removeItem('catzz_is_logged_in');
                    btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`;
                    btn.title = "Sync Settings";
                }
            });
        };

        // 如果上次已登录，则静默加载以同步
        if (localStorage.getItem('catzz_is_logged_in')) {
            this.loadFirebase().then(fb => {
                if (fb) setupAuthListener(fb);
            });
        }

        btn.addEventListener('click', async () => {
            // 点击时显示加载状态并确保加载完成
            const icon = btn.innerHTML;
            if (!this.firebaseModule) btn.innerHTML = '<span class="animate-spin">⏳</span>';

            const fb = await this.loadFirebase();
            if (!fb) {
                btn.innerHTML = icon;
                return;
            }

            // 如果还没设置监听器，现在设置
            if (!currentUser && !localStorage.getItem('catzz_is_logged_in')) {
                setupAuthListener(fb);
            }

            if (currentUser) {
                if (confirm('Logout?')) fb.logout();
            } else {
                try {
                    await fb.login();
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
            const isOn = this.getCinematicState();
            if (isOn) {
                toggleBtn.classList.remove('bg-slate-300'); toggleBtn.classList.add('bg-slate-700');
                toggleKnob.classList.remove('left-1'); toggleKnob.classList.add('left-6');
            } else {
                toggleBtn.classList.remove('bg-slate-700'); toggleBtn.classList.add('bg-slate-300');
                toggleKnob.classList.remove('left-6'); toggleKnob.classList.add('left-1');
            }
        };

        // Initialize UI State
        updateToggleUI();

        toggleBtn.addEventListener('click', () => {
            const newState = !this.getCinematicState();
            this.cinematicPrefs[this.currentBgId] = newState;
            localStorage.setItem('catzz_cinematic_prefs', JSON.stringify(this.cinematicPrefs));
            updateToggleUI();

            // Apply immediately
            this.toggleGradient(newState);

            if (auth.currentUser) saveSettings(auth.currentUser.uid, { cinematicPrefs: this.cinematicPrefs });
        });

        // Populate Grid (选择器预览用缩略图，节省内存)
        this.wallpapers.forEach(wp => {
            const thumb = document.createElement('div');
            thumb.className = `bg-thumb w-full h-32 rounded-xl bg-cover bg-center ${this.currentBgId === wp.id ? 'active' : ''}`;
            // 选择器预览用缩略图
            thumb.dataset.bgUrl = wp.thumbUrl;
            thumb.title = wp.name || wp.id;
            thumb.addEventListener('click', () => {
                this.updateInteraction(); // 用户点击壁纸
                // 极致优化：清除旧壁纸内存
                if (this.currentLoadedBgId && this.currentLoadedBgId !== wp.id) {
                    this.clearPreviousWallpaper();
                }

                this.currentBgId = wp.id;
                // 当前壁纸使用原图（清晰）
                const originalUrl = this.getWallpaperUrl(wp.id);
                this.element.style.backgroundImage = `url('${originalUrl}')`;
                this.element.classList.remove('bg-gradient-to-b');
                this.currentLoadedBgId = wp.id; // 记录新加载的壁纸

                // Apply Theme
                const theme = this.getCurrentTheme();
                this.updateDynamicStyles(theme);
                this.applyThemeToElements(theme);

                localStorage.setItem('catzz_bg_id', wp.id);
                if (this.firebaseModule) this.firebaseModule.saveSettings(this.firebaseModule.auth.currentUser.uid, { bgId: wp.id, cinematicPrefs: this.cinematicPrefs });

                // Update Toggle & Gradient for New Wallpaper
                updateToggleUI();
                this.toggleGradient(this.getCinematicState());

                closeModal();

                // Update Active State
                modal.querySelectorAll('.bg-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            grid.appendChild(thumb);
        });

        const openModal = () => {
            // Lazy load thumbnails on first open
            if (!this.thumbnailsLoaded) {
                modal.querySelectorAll('.bg-thumb').forEach(thumb => {
                    const bgUrl = thumb.dataset.bgUrl;
                    if (bgUrl) {
                        thumb.style.backgroundImage = `url('${bgUrl}')`;
                    }
                });
                this.thumbnailsLoaded = true;
            }
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

        // Check cache first
        const cached = this.iconCache.get(url);
        if (cached) {
            if (cached.iconType === 'bitmap') {
                const img = document.createElement('img');
                img.className = 'icon-bitmap';
                img.src = cached.iconSrc;
                glassBox.appendChild(img);
            } else if (cached.iconType === 'text') {
                const textEl = document.createElement('div');
                textEl.className = 'text-icon';
                textEl.textContent = cached.textFallback;
                glassBox.appendChild(textEl);
            }
            return;
        }

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
            const textFallback = (name || 'S').charAt(0).toUpperCase();
            textEl.textContent = textFallback;
            glassBox.appendChild(textEl);

            // Cache text fallback
            this.iconCache.set(url, {
                iconType: 'text',
                textFallback: textFallback
            });
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

                    // Cache successful icon
                    this.iconCache.set(url, {
                        iconSrc: src,
                        iconType: 'bitmap'
                    });
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

        // Use DocumentFragment to batch DOM operations and prevent layout thrashing
        const fragment = document.createDocumentFragment();

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

            // Right-click to edit
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.openModal(index, site);
            });

            fragment.appendChild(item);
        });

        const addBtn = document.createElement('div');
        addBtn.className = 'flex flex-col items-center gap-4 group w-20 md:w-24 cursor-pointer';
        addBtn.innerHTML = `<div class="add-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg></div><span class="text-[10px] tracking-widest text-gray-600 uppercase font-light group-hover:text-gray-400 transition-colors">Add</span>`;
        addBtn.addEventListener('click', () => this.openModal());
        fragment.appendChild(addBtn);

        // Single DOM insertion instead of N+1 insertions
        grid.appendChild(fragment);
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

        this.openModal = (index = -1, bookmark = null) => {
            this.editingIndex = index;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95'); modalContent.classList.add('scale-100');

            if (index >= 0 && bookmark) {
                nameInput.value = bookmark.name;
                urlInput.value = bookmark.url;
                updatePreview(); // Show preview for existing item
                modal.querySelector('h3').textContent = "Edit Shortcut";
            } else {
                nameInput.value = ''; urlInput.value = '';
                previewContainer.innerHTML = '<div class="glass-box"><span class="text-gray-600 text-[10px] uppercase tracking-widest">Preview</span></div>';
                modal.querySelector('h3').textContent = "Add Shortcut";
            }
            urlInput.focus();
        };

        const closeModal = () => {
            this.editingIndex = -1;
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95'); modalContent.classList.remove('scale-100');
            // Delay clearing so transition doesn't look jarring
            setTimeout(() => {
                nameInput.value = ''; urlInput.value = '';
            }, 300);
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

            if (this.editingIndex >= 0) {
                // Edit existing - invalidate cache for the old URL
                const oldUrl = this.bookmarks[this.editingIndex].url;
                this.iconCache.delete(oldUrl);
                this.bookmarks[this.editingIndex] = { name, url };
            } else {
                // Add new
                this.bookmarks.push({ name, url });
            }

            this.saveBookmarks();
            this.renderGrid();
            closeModal();
        };

        saveBtn.addEventListener('click', saveBookmark);
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    saveBookmarks() {
        this.updateInteraction(); // 保存书签
        localStorage.setItem('catzz_bookmarks', JSON.stringify(this.bookmarks));
        if (this.firebaseModule) this.firebaseModule.saveSettings(this.firebaseModule.auth.currentUser.uid, { bookmarks: this.bookmarks });
    }
    deleteBookmark(index) {
        this.bookmarks.splice(index, 1);
        this.saveBookmarks();
        this.renderGrid();
    }

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
        const canvas = this.element.querySelector('#rain-canvas'); if (!canvas) return;
        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true // 性能优化：允许Canvas异步渲染
        });

        // 极致优化：DPR降低到1.0（节省约15MB内存）
        const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
        let width = window.innerWidth; let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        };
        resize();

        const raindrops = [];
        // 极致优化：雨滴数量减少到40（节省约2MB内存）
        const count = 40;

        class Raindrop {
            constructor() { this.reset(); this.y = Math.random() * height; }
            reset() {
                this.x = Math.random() * width;
                this.y = -20;
                this.length = Math.random() * 15 + 5;
                this.speed = Math.random() * 3 + 4;
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.strokeStyle = `rgba(148, 163, 184, ${this.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            update() {
                this.y += this.speed;
                if (this.y > height) this.reset();
            }
        }

        for (let i = 0; i < count; i++) raindrops.push(new Raindrop());

        // Page Visibility API: Pause animation when tab is hidden
        let isAnimating = false;
        const animate = () => {
            if (!isAnimating) return; // Stop if paused
            ctx.clearRect(0, 0, width, height);
            raindrops.forEach(drop => { drop.update(); drop.draw(); });
            this.rainAnimationId = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (isAnimating) return;
            isAnimating = true;
            animate();
        };

        const stopAnimation = () => {
            isAnimating = false;
            if (this.rainAnimationId) {
                cancelAnimationFrame(this.rainAnimationId);
                this.rainAnimationId = null;
            }
        };

        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        // Start animation if page is visible
        if (!document.hidden) {
            startAnimation();
        }

        window.addEventListener('resize', resize);
    }
}
