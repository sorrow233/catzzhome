import { HERO_CONFIG } from '../config/HeroConfig.js';
import { IconCache } from '../lib/IconCache.js';
import { RainAnimation } from '../lib/RainAnimation.js';
import { BookmarkManager } from '../lib/BookmarkManager.js';
import { WallpaperPicker } from './WallpaperPicker.js';

export default class HeroSection {
    constructor() {
        this.prefixes = HERO_CONFIG.prefixes;
        this.suffixes = HERO_CONFIG.suffixes;
        this.currentIndex = 0;
        this.wallpapers = HERO_CONFIG.wallpapers;
        this.wallpaperUrls = HERO_CONFIG.wallpaperUrls;

        // Load Saved Data
        try {
            const saved = localStorage.getItem('catzz_bookmarks');
            this.bookmarks = saved ? JSON.parse(saved) : HERO_CONFIG.defaultBookmarks;
            this.currentBgId = localStorage.getItem('catzz_bg_id') || 'flower_window';
            this.cinematicPrefs = JSON.parse(localStorage.getItem('catzz_cinematic_prefs')) || {};
        } catch (e) {
            this.bookmarks = HERO_CONFIG.defaultBookmarks;
            this.currentBgId = 'umbrella_street';
            this.cinematicPrefs = {};
        }

        this.iconCache = new IconCache();
        this.iconCache.init().catch(() => { });

        this.bookmarkManager = new BookmarkManager(this);
        this.wallpaperPicker = new WallpaperPicker(this);

        this.lastWallpaperChange = Date.now();
        this.startWallpaperInactivityTimer();
    }

    updateWallpaperChange() { this.lastWallpaperChange = Date.now(); }

    startWallpaperInactivityTimer() {
        setInterval(() => {
            if (Date.now() - this.lastWallpaperChange > 60000) this.purgeMemory();
        }, 30000);
    }

    async purgeMemory() {
        await this.iconCache.cleanup();

        // 清理壁纸选择器中的未选中预览图
        if (this.wallpaperPicker) this.wallpaperPicker.clearThumbnails();

        if (this.firebaseModule && this.firebaseActive) {
            await this.firebaseModule.terminateFirebase();
            this.firebaseActive = false;
            this.firebaseModule = null;
        }
    }

    getWallpaperUrl(id) { return this.wallpaperUrls[id] || ''; }
    getWallpaperThumbUrl(id) {
        const wp = this.wallpapers.find(w => w.id === id);
        return wp ? wp.thumbUrl : '';
    }
    findWallpaperById(id) { return this.wallpapers.find(w => w.id === id); }

    clearPreviousWallpaper() {
        this.element.style.backgroundImage = 'none';
    }

    async switchBackground(id) {
        if (id === this.currentBgId && this.element.style.backgroundImage !== 'none') return;

        const originalUrl = this.getWallpaperUrl(id);
        const thumbUrl = this.getWallpaperThumbUrl(id);
        if (!originalUrl) return;

        // 1. 创建“知觉层” (模糊的缩略图占位)
        const overlay = document.createElement('div');
        overlay.className = 'bg-overlay bg-blur';
        overlay.style.backgroundImage = `url('${thumbUrl}')`;
        this.element.appendChild(overlay);

        // 强行刷新布局以触发 transition
        overlay.offsetHeight;
        overlay.style.opacity = '1';

        // 设定最小动画时间（为了优雅，不让过快）
        const startTime = Date.now();
        const minAnimTime = 800;

        // 2. 预加载新原图
        const img = new Image();
        img.src = originalUrl;

        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                setTimeout(resolve, 8000); // 宽松超时
            });
        } catch (e) {
            console.warn("Wallpaper original load failed");
        }

        // 3. 计算剩余需要等待的时间
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minAnimTime - elapsedTime);
        if (remainingTime > 0) await new Promise(r => setTimeout(r, remainingTime));

        // 4. 正式替换主背景并淡入
        this.currentBgId = id;
        const theme = this.getCurrentTheme();
        this.element.style.backgroundImage = `url('${originalUrl}')`;
        this.element.classList.remove('bg-gradient-to-b');
        this.currentLoadedBgId = id;
        localStorage.setItem('catzz_bg_id', id);

        // 同步 UI 状态
        this.updateDynamicStyles(this.getCurrentTheme());
        this.applyThemeToElements(this.getCurrentTheme());
        this.toggleGradient(this.getCinematicState());

        if (this.firebaseModule && this.firebaseModule.auth.currentUser) {
            this.firebaseModule.saveSettings(this.firebaseModule.auth.currentUser.uid, {
                bgId: id,
                cinematicPrefs: this.cinematicPrefs
            });
        }

        // 5. 移除“知觉层”：逐渐揭开清晰图
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000); // 等待淡出完成后移除
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
        if (this.cinematicPrefs[this.currentBgId] !== undefined) return this.cinematicPrefs[this.currentBgId];
        return !['rainy_window', 'sunset_balcony', 'night_view'].includes(this.currentBgId);
    }

    render() {
        const theme = this.getCurrentTheme();
        this.element = document.createElement('section');
        this.element.className = 'w-full h-screen flex flex-col items-center justify-start pt-16 md:pt-36 relative overflow-hidden font-serif transition-opacity duration-700 ease-in-out bg-cover bg-center';

        if (this.currentBgId) {
            this.element.style.backgroundImage = `url('${this.getWallpaperUrl(this.currentBgId)}')`;
            this.currentLoadedBgId = this.currentBgId;
        } else {
            this.element.classList.add('bg-gradient-to-b', 'from-[#fdfbf7]', 'via-[#f4f7fb]', 'to-[#eef2f6]');
        }

        if (this.getCinematicState()) {
            this.element.innerHTML += `<div class="cinematic-gradient absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0"></div>`;
        }

        this.styleElement = document.createElement('style');
        this.updateDynamicStyles(theme);
        this.element.appendChild(this.styleElement);

        this.element.innerHTML += `
            <canvas id="rain-canvas" class="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-60"></canvas>
            <div class="relative z-10 flex flex-col items-center justify-start w-full max-w-4xl px-4 text-center">
                <h1 id="hero-title" class="text-4xl md:text-7xl mb-6 md:mb-8 hero-font-sc opacity-90 cursor-pointer hover:opacity-75 transition-colors duration-500 ${theme.textColor} ${theme.textShadow}" title="Change Theme">Catzz</h1>
                <div id="cloud-btn" class="absolute top-4 right-4 md:top-8 md:right-8 z-30 w-10 h-10 rounded-full glass-box flex items-center justify-center cursor-pointer hover:bg-white/40 transition-all text-slate-400 hover:text-slate-600" title="Sync Settings">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                </div>
                <div id="theme-guide" class="hidden absolute top-12 md:top-24 z-20 transition-opacity duration-700 opacity-0 pointer-events-none">
                    <div class="glass-box px-6 py-2 rounded-full text-slate-500 text-xs font-light tracking-widest animate-bounce border border-white/40 shadow-sm bg-white/40 backdrop-blur-md">Click 'Catzz' to switch theme</div>
                </div>
                <div class="h-8 flex items-center justify-center text-sm md:text-base hero-font-sc rounded-full transition-colors duration-500 quote-container ${theme.quoteColor}">
                    <span class="prefix inline-block mr-4 opacity-0"></span>
                    <span class="typed-quotes inline-block opacity-0"></span>
                </div>
                <div class="mt-12 md:mt-20 w-full max-w-3xl">
                     <div id="bookmark-grid" class="flex flex-wrap justify-center gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-12 px-4"></div>
                </div>
            </div>
            
            <div id="add-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="glass-modal w-full max-w-md p-10 rounded-[2rem] transform scale-95 transition-transform duration-300">
                    <h3 class="text-2xl text-slate-700 font-light mb-8 hero-font-sc tracking-wider text-center">New Shortcut</h3>
                    <div class="flex flex-col items-center justify-center mb-8 h-24">
                        <div id="preview-icon-container" class="preview-container relative w-full flex items-center justify-center">
                            <div class="glass-box"><span class="text-slate-400 text-[10px] uppercase tracking-widest">Preview</span></div>
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

            <div id="bg-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="glass-modal w-full max-w-4xl p-8 rounded-[2rem] transform scale-95 transition-transform duration-300 relative">
                     <button id="close-bg-modal" class="absolute top-6 right-8 text-slate-400 hover:text-slate-700 text-2xl transition-colors">&times;</button>
                     <h3 class="text-2xl text-slate-700 font-light mb-2 hero-font-sc tracking-wider text-center">Select Theme</h3>
                     <div class="flex items-center justify-center gap-3 mb-8">
                        <span class="text-xs text-slate-500 font-light tracking-widest uppercase">Cinematic</span>
                        <button id="cinematic-toggle" class="w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none bg-slate-700">
                            <div class="w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm"></div>
                        </button>
                     </div>
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto px-2 pb-4 scrollbar-hide"></div>
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
            .unified-icon-container .glass-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
            .unified-icon-container:hover .glass-box { transform: translateY(-4px); box-shadow: 0 10px 25px -5px ${theme.glowColor || 'rgba(0,0,0,0.15)'}, 0 0 15px -2px ${theme.glowColor || 'rgba(0,0,0,0.1)'} inset; border-color: ${theme.iconHoverColor}40; }
            .icon-wrapper .icon-mask { width: 32px; height: 32px; background-color: ${theme.iconColor || '#64748b'}; -webkit-mask-size: contain; mask-size: contain; transition: all 0.3s ease; }
            .unified-icon-container:hover .icon-mask { background-color: ${theme.iconHoverColor || '#334155'}; }
            .icon-bitmap { width: 36px; height: 36px; object-fit: contain; filter: grayscale(100%) contrast(1.1) opacity(0.85); mix-blend-mode: multiply; transition: all 0.3s ease; }
            .unified-icon-container:hover .icon-bitmap { filter: grayscale(0%) contrast(1.1) opacity(1); transform: scale(1.05); mix-blend-mode: normal; }
            .avatar-themed { filter: grayscale(100%) brightness(1.1) opacity(0.8); mix-blend-mode: luminosity; transition: all 0.5s ease; }
            #cloud-btn:hover .avatar-themed { filter: grayscale(0%) brightness(1) opacity(1); mix-blend-mode: normal; }
            .text-icon { font-family: 'Noto Serif SC', serif; font-weight: 300; font-size: 20px; color: ${theme.iconColor || '#64748b'}; border: 1px solid ${theme.iconColor ? theme.iconColor + '40' : '#cbd5e1'}; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
            .add-btn { width: 48px; height: 48px; border-radius: 12px; border: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.3s ease; cursor: pointer; }
            .add-btn:hover { border-color: #64748b; color: #64748b; background: rgba(255,255,255,0.5); }
            .glass-modal { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 30px 60px -15px rgba(100, 116, 139, 0.25); }
            .bg-thumb { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; border: 2px solid transparent; }
            .bg-thumb:hover { transform: scale(1.05); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
            .bg-thumb.active { border-color: #64748b; transform: scale(0.95); }
            .preview-container .glass-box { width: 80px; height: 80px; }
            .delayed-delete-btn { opacity: 0; transition: opacity 0.3s ease 0s; pointer-events: none; }
            .unified-icon-container:hover .delayed-delete-btn { opacity: 1; transition-delay: 2s; pointer-events: auto; }
            
            /* 新增壁纸切换动效样式 */
            .bg-overlay { 
                position: absolute; inset: 0; z-index: -1; 
                background-size: cover; background-position: center; 
                opacity: 0; transition: opacity 0.8s ease-in-out;
            }
            .bg-blur { filter: blur(20px) scale(1.1); }
        `;
    }

    applyThemeToElements(theme) {
        const title = this.element.querySelector('#hero-title');
        if (title) title.className = `text-4xl md:text-7xl mb-6 md:mb-8 hero-font-sc opacity-90 cursor-pointer hover:opacity-75 transition-colors duration-500 ${theme.textColor} ${theme.textShadow || ''}`;
        const quoteContainer = this.element.querySelector('.quote-container');
        if (quoteContainer) quoteContainer.className = `h-8 flex items-center justify-center text-sm md:text-base hero-font-sc rounded-full transition-colors duration-500 quote-container ${theme.quoteColor || 'text-slate-500'}`;
        const cloudBtn = this.element.querySelector('#cloud-btn');
        if (cloudBtn) {
            cloudBtn.className = `absolute top-4 right-4 md:top-8 md:right-8 z-30 w-10 h-10 rounded-full glass-box flex items-center justify-center cursor-pointer transition-all ${theme.glassColor || 'bg-white/40'} ${theme.glassBorder || 'border-white/20'} border backdrop-blur-md`;
            const svg = cloudBtn.querySelector('svg');
            if (svg) svg.style.color = theme.iconColor || '#64748b';
        }
        this.renderGrid();
    }

    mount() {
        new RainAnimation(this.element.querySelector('#rain-canvas')).start();
        this.initTypewriter();
        this.renderGrid();
        this.initModal();
        this.wallpaperPicker.init();
        this.initGuide();
        this.initAuth();
    }

    async loadFirebase() {
        if (!this.firebaseModule) {
            try { this.firebaseModule = await import('../lib/firebase.js'); this.firebaseActive = true; }
            catch (e) { console.error("Firebase load failed", e); return null; }
        }
        return this.firebaseModule;
    }

    initAuth() {
        const btn = this.element.querySelector('#cloud-btn');
        let currentUser = null;
        const handleUserData = (data) => {
            if (!data) return;
            if (data.bgId && data.bgId !== this.currentBgId) {
                if (this.currentLoadedBgId && this.currentLoadedBgId !== data.bgId) this.clearPreviousWallpaper();
                this.currentBgId = data.bgId;
                this.element.style.backgroundImage = `url('${this.getWallpaperUrl(data.bgId)}')`;
                this.element.classList.remove('bg-gradient-to-b');
                localStorage.setItem('catzz_bg_id', data.bgId);
                this.currentLoadedBgId = data.bgId;
                if (data.cinematicPrefs) {
                    this.cinematicPrefs = data.cinematicPrefs;
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
                    const data = await fb.fetchSettings(user.uid);
                    if (data) handleUserData(data);
                } else {
                    localStorage.removeItem('catzz_is_logged_in');
                    btn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`;
                }
            });
        };

        if (localStorage.getItem('catzz_is_logged_in')) this.loadFirebase().then(fb => fb && setupAuthListener(fb));

        btn.addEventListener('click', async () => {
            const fb = await this.loadFirebase();
            if (!fb) return;
            if (!currentUser && !localStorage.getItem('catzz_is_logged_in')) setupAuthListener(fb);
            if (currentUser) { if (confirm('Logout?')) fb.logout(); }
            else { try { await fb.login(); } catch (e) { alert('Login failed'); } }
        });
    }

    initGuide() {
        if (!localStorage.getItem('catzz_guide_seen')) {
            const guide = this.element.querySelector('#theme-guide');
            if (guide) {
                guide.classList.remove('hidden');
                setTimeout(() => guide.classList.remove('opacity-0'), 1000);
            }
        }
    }

    renderGrid() {
        const grid = this.element.querySelector('#bookmark-grid');
        if (!grid) return;
        const theme = this.getCurrentTheme();
        grid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        this.bookmarks.forEach((site, index) => {
            const item = document.createElement('div');
            item.className = 'unified-icon-container flex flex-col items-center gap-4 group w-20 md:w-24 cursor-pointer relative';
            const iconRoot = document.createElement('div');
            iconRoot.className = 'relative w-[48px] h-[48px] flex items-center justify-center';

            const link = document.createElement('a');
            link.href = site.url; link.target = "_blank"; link.rel = "noopener noreferrer";
            link.className = "flex flex-col items-center gap-3 w-full";
            this.bookmarkManager.fetchIcon(site.name, site.url, iconRoot, theme);

            link.appendChild(iconRoot);
            const label = document.createElement('span');
            label.className = `text-[10px] font-sans tracking-wider mt-3 group-hover:text-opacity-100 text-opacity-80 transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${theme.quoteColor || "text-slate-400"}`;
            label.textContent = site.name;
            link.appendChild(label);
            item.appendChild(link);

            const del = document.createElement('button');
            del.className = "absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] delayed-delete-btn";
            del.innerHTML = "&times;";
            del.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.deleteBookmark(index); };
            item.appendChild(del);
            item.oncontextmenu = (e) => { e.preventDefault(); this.openModal(index, site); };
            fragment.appendChild(item);
        });

        const addBtn = document.createElement('div');
        addBtn.className = 'flex flex-col items-center gap-4 group w-20 md:w-24 cursor-pointer';
        addBtn.innerHTML = `<div class="add-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg></div><span class="text-[10px] tracking-widest text-gray-600 uppercase font-light">Add</span>`;
        addBtn.onclick = () => this.openModal();
        fragment.appendChild(addBtn);
        grid.appendChild(fragment);
    }

    toggleGradient(show) {
        const existing = this.element.querySelector('.cinematic-gradient');
        if (existing) existing.remove();
        if (show) {
            const grad = document.createElement('div');
            grad.className = 'cinematic-gradient absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0';
            const rain = this.element.querySelector('#rain-canvas');
            if (rain) rain.after(grad); else this.element.appendChild(grad);
        }
    }

    initModal() {
        const modal = this.element.querySelector('#add-modal');
        const content = modal.querySelector('.glass-modal');
        const nameIn = this.element.querySelector('#bm-name');
        const urlIn = this.element.querySelector('#bm-url');
        const preview = this.element.querySelector('#preview-icon-container');

        this.openModal = (index = -1, bookmark = null) => {
            this.editingIndex = index;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            content.classList.replace('scale-95', 'scale-100');
            if (index >= 0 && bookmark) { nameIn.value = bookmark.name; urlIn.value = bookmark.url; updatePreview(); }
            else { nameIn.value = ''; urlIn.value = ''; preview.innerHTML = '<div class="glass-box"><span class="text-slate-400 text-[10px] uppercase tracking-widest">Preview</span></div>'; }
            urlIn.focus();
        };

        const close = () => { modal.classList.add('opacity-0', 'pointer-events-none'); content.classList.replace('scale-100', 'scale-95'); };
        const updatePreview = () => {
            const val = urlIn.value.trim(); if (!val) return;
            let url = val.startsWith('http') ? val : 'https://' + val;
            if (!nameIn.value.trim()) nameIn.value = this.bookmarkManager.extractNameFromUrl(url);
            this.bookmarkManager.fetchIcon(nameIn.value || 'Site', url, preview);
        };

        let debounce;
        [urlIn, nameIn].forEach(el => el.oninput = () => { clearTimeout(debounce); debounce = setTimeout(updatePreview, 600); });
        this.element.querySelector('#save-bookmark').onclick = () => {
            let url = urlIn.value.trim(); if (!url.startsWith('http')) url = 'https://' + url;
            const bm = { name: nameIn.value.trim(), url };
            if (this.editingIndex >= 0) this.bookmarks[this.editingIndex] = bm; else this.bookmarks.push(bm);
            this.saveBookmarks(); this.renderGrid(); close();
        };
        this.element.querySelector('#close-modal').onclick = close;
        modal.onclick = (e) => e.target === modal && close();
    }

    saveBookmarks() {
        localStorage.setItem('catzz_bookmarks', JSON.stringify(this.bookmarks));
        if (this.firebaseModule && this.firebaseModule.auth.currentUser) this.firebaseModule.saveSettings(this.firebaseModule.auth.currentUser.uid, { bookmarks: this.bookmarks });
    }
    deleteBookmark(index) { this.bookmarks.splice(index, 1); this.saveBookmarks(); this.renderGrid(); }

    initTypewriter() {
        const p = this.element.querySelector('.prefix'); const t = this.element.querySelector('.typed-quotes');
        p.textContent = this.prefixes[0]; t.textContent = this.suffixes[0];
        p.classList.add('text-prefix-in'); t.classList.add('text-quotes-in');
        this.quoteInterval = setInterval(() => {
            p.classList.replace('text-prefix-in', 'text-out'); t.classList.replace('text-quotes-in', 'text-out');
            setTimeout(() => {
                this.currentIndex = (this.currentIndex + 1) % this.prefixes.length;
                p.textContent = this.prefixes[this.currentIndex]; t.textContent = this.suffixes[this.currentIndex];
                p.classList.replace('text-out', 'text-prefix-in'); t.classList.replace('text-out', 'text-quotes-in');
            }, 1200);
        }, 5000);
    }
}
