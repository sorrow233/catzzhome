import { i18n } from '../lib/I18n.js';
import { BookmarkManager } from '../lib/BookmarkManager.js';
import { HERO_CONFIG } from '../config/HeroConfig.js';

export class BookmarkComponent {
    constructor(parentContainer, options = {}) {
        this.container = parentContainer;
        this.iconCache = options.iconCache;
        this.firebaseModuleProvider = options.firebaseModuleProvider;
        this.theme = options.theme || {};

        // Mock parent for BookmarkManager which expects { iconCache }
        this.bookmarkManager = new BookmarkManager({ iconCache: this.iconCache });

        this.bookmarks = [];
        this.styleElement = null; // Will use parent's or create own if needed? 
        // Actually, HeroSection handles styles. We just render DOM.

        // Init state
        try {
            const saved = localStorage.getItem('catzz_bookmarks');
            this.bookmarks = saved ? JSON.parse(saved) : HERO_CONFIG.defaultBookmarks;
        } catch (e) {
            this.bookmarks = HERO_CONFIG.defaultBookmarks;
        }

        this.initDOM();
    }

    initDOM() {
        // Create the grid container inside the parent container
        // But actually parentContainer passed from HeroSection is likely the wrapper div
        // HeroSection has: <div id="bookmark-grid"></div>
        // We will target that.
    }

    setTheme(theme) {
        this.theme = theme;
        this.render();
    }

    mount(gridElement) {
        this.gridElement = gridElement;
        this.render();
        this.initModal();
    }

    render() {
        if (!this.gridElement) return;
        const theme = this.theme;
        this.gridElement.innerHTML = '';
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
        addBtn.innerHTML = `<div class="add-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg></div><span class="text-[10px] tracking-widest text-gray-600 uppercase font-light">${i18n.t('add')}</span>`;
        addBtn.onclick = () => this.openModal();
        fragment.appendChild(addBtn);
        this.gridElement.appendChild(fragment);
    }

    initModal() {
        // We assume the modal HTML is already in the document (injected by HeroSection or us).
        // For modularity, we should probably inject it ourselves if not present, OR assume HeroSection structure.
        // HeroSection structure is quite coupled. 
        // Let's assume passed-in 'modalElements' or look them up from document but restrict scope.
        // Getting elements by ID is okay if they are unique.

        const modal = document.querySelector('#add-modal');
        if (!modal) return; // Should handle this better in full refactor (create it)

        const content = modal.querySelector('.glass-modal');
        const nameIn = document.querySelector('#bm-name');
        const urlIn = document.querySelector('#bm-url');
        const preview = document.querySelector('#preview-icon-container');

        this.openModal = (index = -1, bookmark = null) => {
            this.editingIndex = index;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            content.classList.replace('scale-95', 'scale-100');
            if (index >= 0 && bookmark) { nameIn.value = bookmark.name; urlIn.value = bookmark.url; this.updatePreview(urlIn, nameIn, preview); }
            else { nameIn.value = ''; urlIn.value = ''; preview.innerHTML = `<div class="glass-box"><span class="text-slate-400 text-[10px] uppercase tracking-widest">${i18n.t('preview')}</span></div>`; }
            urlIn.focus();
        };

        const close = () => { modal.classList.add('opacity-0', 'pointer-events-none'); content.classList.replace('scale-100', 'scale-95'); };

        this.updatePreview = (urlIn, nameIn, preview) => {
            const val = urlIn.value.trim(); if (!val) return;
            let url = val.startsWith('http') ? val : 'https://' + val;
            if (!nameIn.value.trim()) nameIn.value = this.bookmarkManager.extractNameFromUrl(url);
            this.bookmarkManager.fetchIcon(nameIn.value || 'Site', url, preview);
        };

        let debounce;
        [urlIn, nameIn].forEach(el => el.oninput = () => { clearTimeout(debounce); debounce = setTimeout(() => this.updatePreview(urlIn, nameIn, preview), 600); });

        // Remove old listeners to avoid duplicates if re-inited (though component should be single instance)
        const saveBtn = document.querySelector('#save-bookmark');
        const closeBtn = document.querySelector('#close-modal');

        // Clone to clear listeners is a bit hacky, better to simple assign onclick
        saveBtn.onclick = () => {
            let url = urlIn.value.trim(); if (!url.startsWith('http')) url = 'https://' + url;
            const bm = { name: nameIn.value.trim(), url };
            if (this.editingIndex >= 0) this.bookmarks[this.editingIndex] = bm; else this.bookmarks.push(bm);
            this.saveBookmarks(); this.render(); close();
        };
        closeBtn.onclick = close;
        modal.onclick = (e) => e.target === modal && close();
    }

    saveBookmarks() {
        localStorage.setItem('catzz_bookmarks', JSON.stringify(this.bookmarks));
        // Sync to firebase
        if (this.firebaseModuleProvider) {
            const fb = this.firebaseModuleProvider();
            if (fb && fb.auth.currentUser) {
                fb.saveSettings(fb.auth.currentUser.uid, { bookmarks: this.bookmarks });
            }
        }
    }

    deleteBookmark(index) {
        this.bookmarks.splice(index, 1);
        this.saveBookmarks();
        this.render();
    }

    // External API to update bookmarks from sync
    setBookmarks(bookmarks) {
        this.bookmarks = bookmarks;
        localStorage.setItem('catzz_bookmarks', JSON.stringify(bookmarks));
        this.render();
    }
}
