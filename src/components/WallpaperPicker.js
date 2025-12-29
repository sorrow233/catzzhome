import { i18n } from '../lib/I18n.js';
import { HERO_CONFIG } from '../config/HeroConfig.js';

export class WallpaperPicker {
    constructor(parent) {
        this.parent = parent;
        this.wallpapers = HERO_CONFIG.wallpapers;
        this.observer = null;
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
            const container = document.createElement('div');
            container.className = 'flex flex-col gap-2 group cursor-pointer';

            const thumb = document.createElement('div');
            thumb.className = `bg-thumb w-full h-24 md:h-32 rounded-xl bg-cover bg-center transition-all duration-300 border-2 border-transparent group-hover:border-slate-400/50 ${this.parent.currentBgId === wp.id ? 'active !border-slate-600' : ''}`;
            thumb.dataset.bgUrl = wp.thumbUrl;
            // thumb.title = wp.name || wp.id; // Removed title as we now show name below

            const label = document.createElement('span');
            label.className = 'text-[10px] text-center text-slate-500 font-light tracking-widest uppercase transition-colors group-hover:text-slate-700';
            label.textContent = i18n.t(`theme_${wp.id}`);

            container.addEventListener('click', async () => {
                this.parent.updateWallpaperChange();
                await this.parent.switchBackground(wp.id);
                updateToggleUI();
                closeModal();

                modal.querySelectorAll('.bg-thumb').forEach(t => t.classList.remove('active', '!border-slate-600'));
                thumb.classList.add('active', '!border-slate-600');
            });

            container.appendChild(thumb);
            container.appendChild(label);
            grid.appendChild(container);

            // Add observer to the thumb
            if (this.observer) this.observer.observe(thumb);
        });

        const openModal = () => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.replace('scale-95', 'scale-100');

            // 初始化 Intersection Observer 进行粒度化加载
            if (!this.observer) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const thumb = entry.target;
                        const bgUrl = thumb.dataset.bgUrl;
                        if (entry.isIntersecting) {
                            // 进入视野：加载
                            thumb.style.backgroundImage = `url('${bgUrl}')`;
                        } else {
                            // 移出视野：释放
                            thumb.style.backgroundImage = 'none';
                        }
                    });
                }, { root: grid, threshold: 0.1 });
            }

            // 观察所有缩略图
            grid.querySelectorAll('.bg-thumb').forEach(thumb => {
                this.observer.observe(thumb);
            });
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
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        const modal = this.parent.element.querySelector('#bg-modal');
        if (modal) {
            modal.querySelectorAll('.bg-thumb').forEach(thumb => {
                thumb.style.backgroundImage = 'none';
            });
        }
    }
}
