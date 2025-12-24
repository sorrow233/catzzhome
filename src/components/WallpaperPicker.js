import { HERO_CONFIG } from '../config/HeroConfig.js';

export class WallpaperPicker {
    constructor(parent) {
        this.parent = parent;
        this.wallpapers = HERO_CONFIG.wallpapers;
        this.thumbnailsLoaded = false;
    }

    init() {
        const title = this.parent.element.querySelector('#hero-title');
        const modal = this.parent.element.querySelector('#bg-modal');
        const modalContent = modal.querySelector('.glass-modal');
        const closeBtn = this.parent.element.querySelector('#close-bg-modal');
        const grid = modal.querySelector('.grid');
        const toggleBtn = modal.querySelector('#cinematic-toggle');
        const toggleKnob = toggleBtn.querySelector('div');

        const updateToggleUI = () => {
            const isOn = this.parent.getCinematicState();
            if (isOn) {
                toggleBtn.classList.remove('bg-slate-300'); toggleBtn.classList.add('bg-slate-700');
                toggleKnob.classList.remove('left-1'); toggleKnob.classList.add('left-6');
            } else {
                toggleBtn.classList.remove('bg-slate-700'); toggleBtn.classList.add('bg-slate-300');
                toggleKnob.classList.remove('left-6'); toggleKnob.classList.add('left-1');
            }
        };

        updateToggleUI();

        toggleBtn.addEventListener('click', () => {
            const newState = !this.parent.getCinematicState();
            this.parent.cinematicPrefs[this.parent.currentBgId] = newState;
            localStorage.setItem('catzz_cinematic_prefs', JSON.stringify(this.parent.cinematicPrefs));
            updateToggleUI();
            this.parent.toggleGradient(newState);

            if (this.parent.firebaseModule) {
                this.parent.firebaseModule.auth.currentUser &&
                    this.parent.firebaseModule.saveSettings(this.parent.firebaseModule.auth.currentUser.uid, { cinematicPrefs: this.parent.cinematicPrefs });
            }
        });

        this.wallpapers.forEach(wp => {
            const thumb = document.createElement('div');
            thumb.className = `bg-thumb w-full h-32 rounded-xl bg-cover bg-center ${this.parent.currentBgId === wp.id ? 'active' : ''}`;
            thumb.dataset.bgUrl = wp.thumbUrl;
            thumb.title = wp.name || wp.id;
            thumb.addEventListener('click', () => {
                this.parent.updateWallpaperChange();
                if (this.parent.currentLoadedBgId && this.parent.currentLoadedBgId !== wp.id) {
                    this.parent.clearPreviousWallpaper();
                }

                this.parent.currentBgId = wp.id;
                const originalUrl = this.parent.getWallpaperUrl(wp.id);
                this.parent.element.style.backgroundImage = `url('${originalUrl}')`;
                this.parent.element.classList.remove('bg-gradient-to-b');
                this.parent.currentLoadedBgId = wp.id;

                const theme = this.parent.getCurrentTheme();
                this.parent.updateDynamicStyles(theme);
                this.parent.applyThemeToElements(theme);

                localStorage.setItem('catzz_bg_id', wp.id);
                if (this.parent.firebaseModule && this.parent.firebaseModule.auth.currentUser) {
                    this.parent.firebaseModule.saveSettings(this.parent.firebaseModule.auth.currentUser.uid, {
                        bgId: wp.id,
                        cinematicPrefs: this.parent.cinematicPrefs
                    });
                }

                updateToggleUI();
                this.parent.toggleGradient(this.parent.getCinematicState());
                closeModal();

                modal.querySelectorAll('.bg-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            grid.appendChild(thumb);
        });

        const openModal = () => {
            if (!this.thumbnailsLoaded) {
                modal.querySelectorAll('.bg-thumb').forEach(thumb => {
                    const bgUrl = thumb.dataset.bgUrl;
                    if (bgUrl) thumb.style.backgroundImage = `url('${bgUrl}')`;
                });
                this.thumbnailsLoaded = true;
            }
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95'); modalContent.classList.add('scale-100');
        };

        const closeModal = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.replace('scale-100', 'scale-95');
            // 立即清理非选中壁纸的预览图引用，释放内存
            this.clearThumbnails();
        };

        title.addEventListener('click', () => {
            if (!localStorage.getItem('catzz_guide_seen')) {
                localStorage.setItem('catzz_guide_seen', 'true');
                const guide = this.parent.element.querySelector('#theme-guide');
                if (guide) guide.classList.add('opacity-0');
            }
            openModal();
        });
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    clearThumbnails() {
        if (!this.thumbnailsLoaded) return;
        const modal = this.parent.element.querySelector('#bg-modal');
        if (!modal) return;

        // 如果选择器已关闭，强制清除所有预览图引用
        if (modal.classList.contains('opacity-0')) {
            modal.querySelectorAll('.bg-thumb').forEach(thumb => {
                thumb.style.backgroundImage = 'none';
            });
            this.thumbnailsLoaded = false;
        }
    }
}
