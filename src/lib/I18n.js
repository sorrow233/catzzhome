export const TRANSLATIONS = {
    zh: {
        title: "Catzz",
        hero_title: "Catzz",
        sync_settings: "同步",
        switch_theme: "点击标题切换主题",
        new_shortcut: "添加快捷方式",
        preview: "图标预览",
        url: "链接地址",
        name: "网站名称",
        cancel: "取消",
        save: "保存",
        select_theme: "选择主题",
        cinematic: "沉浸模式",
        add: "添加",
        logout_confirm: "确定要退出登录吗？",
        login_failed: "登录失败",
        change_theme: "切换主题",
        theme_rainy_window: "雨夜清凉",
        theme_wet_street: "潮湿街头",
        theme_city_bed: "城市一隅",
        theme_umbrella_street: "撑伞背影",
        theme_flower_window: "花窗少女",
        theme_white_shirt_girl: "白衣少女",
        theme_sunset_balcony: "阳台日落",
        theme_night_view: "城市夜景"
    },
    en: {
        title: "Catzz",
        hero_title: "Catzz",
        sync_settings: "Sync",
        switch_theme: "Click title to change theme",
        new_shortcut: "Add Shortcut",
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
        change_theme: "Change Theme",
        theme_rainy_window: "Rainy Window",
        theme_wet_street: "Wet Street",
        theme_city_bed: "City Bed",
        theme_umbrella_street: "Umbrella Street",
        theme_flower_window: "Flower Window",
        theme_white_shirt_girl: "White Shirt Girl",
        theme_sunset_balcony: "Sunset Balcony",
        theme_night_view: "Night View"
    },
    ja: {
        title: "Catzz",
        hero_title: "Catzz",
        sync_settings: "同期",
        switch_theme: "タイトルでテーマ変更",
        new_shortcut: "ショートカット追加",
        preview: "プレビュー",
        url: "URL",
        name: "名前",
        cancel: "キャンセル",
        save: "保存",
        select_theme: "テーマ選択",
        cinematic: "シネマティック",
        add: "追加",
        logout_confirm: "ログアウトしますか？",
        login_failed: "ログイン失敗",
        change_theme: "テーマ変更",
        theme_rainy_window: "雨の窓",
        theme_wet_street: "雨の街路",
        theme_city_bed: "都会の片隅",
        theme_umbrella_street: "傘の少女",
        theme_flower_window: "花の窓辺",
        theme_white_shirt_girl: "白シャツの少女",
        theme_sunset_balcony: "夕暮れのバルコニー",
        theme_night_view: "都市の夜景"
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
