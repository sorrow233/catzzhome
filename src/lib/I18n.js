export const TRANSLATIONS = {
    zh: {
        title: "古德喵特",
        hero_title: "Catzz",
        sync_settings: "同步设置",
        switch_theme: "点击 'Catzz' 切换主题",
        new_shortcut: "新建快捷方式",
        preview: "预览",
        url: "网址",
        name: "名称",
        cancel: "取消",
        save: "保存",
        select_theme: "选择主题",
        cinematic: "电影感",
        add: "添加",
        logout_confirm: "确定要退出登录吗？",
        login_failed: "登录失败",
        change_theme: "切换主题"
    },
    en: {
        title: "Catzz Home",
        hero_title: "Catzz",
        sync_settings: "Sync Settings",
        switch_theme: "Click 'Catzz' to switch theme",
        new_shortcut: "New Shortcut",
        preview: "Preview",
        url: "URL",
        name: "Name",
        cancel: "Cancel",
        save: "Save",
        select_theme: "Select Theme",
        cinematic: "Cinematic",
        add: "Add",
        logout_confirm: "Logout?",
        login_failed: "Login failed",
        change_theme: "Change Theme"
    },
    ja: {
        title: "Catzzホーム",
        hero_title: "Catzz",
        sync_settings: "設定を同期",
        switch_theme: "「Catzz」をクリックしてテーマを切り替え",
        new_shortcut: "新しいショートカット",
        preview: "プレビュー",
        url: "URL",
        name: "名前",
        cancel: "キャンセル",
        save: "保存",
        select_theme: "テーマを選択",
        cinematic: "シネマティック",
        add: "追加",
        logout_confirm: "ログアウトしますか？",
        login_failed: "ログインに失敗しました",
        change_theme: "テーマを切り替え"
    }
};

class I18n {
    constructor() {
        this.translations = TRANSLATIONS;
        this.locales = ['zh', 'en', 'ja'];
        this.defaultLocale = 'zh';
        this.currentLocale = this.detectLanguage();
        
        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLocale;
    }

    detectLanguage() {
        const saved = localStorage.getItem('catzz_language');
        if (saved && this.locales.includes(saved)) return saved;

        const browserLang = navigator.language.split('-')[0];
        if (this.locales.includes(browserLang)) return browserLang;

        return this.defaultLocale;
    }

    setLanguage(locale) {
        if (this.locales.includes(locale)) {
            this.currentLocale = locale;
            localStorage.setItem('catzz_language', locale);
            document.documentElement.lang = locale;
            return true;
        }
        return false;
    }

    t(key) {
        return this.translations[this.currentLocale][key] || this.translations[this.defaultLocale][key] || key;
    }

    getLocale() {
        return this.currentLocale;
    }
}

export const i18n = new I18n();
