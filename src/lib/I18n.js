const translations = {
  zh: {
    skip: '跳到快捷入口', title: 'Catzz', subtitle: '让雨声之外的世界，暂时慢一点。', sync: '云同步', sync_idle: '云同步',
    sync_loading: '正在连接', sync_success: '已同步', sync_error: '同步失败', logout_confirm: '确定退出云同步吗？', login_failed: '登录失败，请稍后重试。',
    theme: '选择壁纸', close: '关闭', cinematic: '增强文字对比', language: '界面语言', add: '添加', edit: '编辑', remove: '删除',
    add_title: '添加快捷方式', edit_title: '编辑快捷方式', preview: '图标预览', url: '链接地址', name: '网站名称', cancel: '取消', save: '保存',
    invalid_url: '请输入有效的 HTTP 或 HTTPS 地址。', invalid_name: '请输入网站名称。', limit: '快捷方式最多只能添加 24 个。',
    theme_hint: '打开壁纸设置', bookmark_actions: '快捷方式操作', empty_icon: '站点', offline: '当前离线，显示本地设置。'
  },
  'zh-TW': {
    skip: '跳到快速入口', title: 'Catzz', subtitle: '讓雨聲之外的世界，暫時慢一點。', sync: '雲端同步', sync_idle: '雲端同步',
    sync_loading: '正在連線', sync_success: '已同步', sync_error: '同步失敗', logout_confirm: '確定登出雲端同步嗎？', login_failed: '登入失敗，請稍後再試。',
    theme: '選擇桌布', close: '關閉', cinematic: '增強文字對比', language: '介面語言', add: '新增', edit: '編輯', remove: '刪除',
    add_title: '新增快速方式', edit_title: '編輯快速方式', preview: '圖示預覽', url: '連結網址', name: '網站名稱', cancel: '取消', save: '儲存',
    invalid_url: '請輸入有效的 HTTP 或 HTTPS 網址。', invalid_name: '請輸入網站名稱。', limit: '快速方式最多只能新增 24 個。',
    theme_hint: '開啟桌布設定', bookmark_actions: '快速方式操作', empty_icon: '網站', offline: '目前離線，顯示本機設定。'
  },
  en: {
    skip: 'Skip to shortcuts', title: 'Catzz', subtitle: 'Let the world beyond the rain slow down for a while.', sync: 'Cloud sync', sync_idle: 'Cloud sync',
    sync_loading: 'Connecting', sync_success: 'Synced', sync_error: 'Sync failed', logout_confirm: 'Sign out of cloud sync?', login_failed: 'Sign-in failed. Please try again.',
    theme: 'Choose wallpaper', close: 'Close', cinematic: 'Increase text contrast', language: 'Interface language', add: 'Add', edit: 'Edit', remove: 'Remove',
    add_title: 'Add shortcut', edit_title: 'Edit shortcut', preview: 'Icon preview', url: 'Web address', name: 'Site name', cancel: 'Cancel', save: 'Save',
    invalid_url: 'Enter a valid HTTP or HTTPS address.', invalid_name: 'Enter a site name.', limit: 'You can add up to 24 shortcuts.',
    theme_hint: 'Open wallpaper settings', bookmark_actions: 'Shortcut actions', empty_icon: 'Site', offline: 'You are offline. Local settings are shown.'
  },
  ja: {
    skip: 'ショートカットへ移動', title: 'Catzz', subtitle: '雨音の向こうの世界を、少しだけゆっくりに。', sync: 'クラウド同期', sync_idle: 'クラウド同期',
    sync_loading: '接続中', sync_success: '同期済み', sync_error: '同期失敗', logout_confirm: 'クラウド同期からログアウトしますか？', login_failed: 'ログインに失敗しました。もう一度お試しください。',
    theme: '壁紙を選択', close: '閉じる', cinematic: '文字のコントラストを上げる', language: '表示言語', add: '追加', edit: '編集', remove: '削除',
    add_title: 'ショートカットを追加', edit_title: 'ショートカットを編集', preview: 'アイコンプレビュー', url: 'URL', name: 'サイト名', cancel: 'キャンセル', save: '保存',
    invalid_url: '有効な HTTP または HTTPS URL を入力してください。', invalid_name: 'サイト名を入力してください。', limit: 'ショートカットは24件まで追加できます。',
    theme_hint: '壁紙設定を開く', bookmark_actions: 'ショートカット操作', empty_icon: 'サイト', offline: 'オフラインです。ローカル設定を表示しています。'
  },
  ko: {
    skip: '바로가기로 이동', title: 'Catzz', subtitle: '빗소리 너머의 세상을 잠시 천천히.', sync: '클라우드 동기화', sync_idle: '클라우드 동기화',
    sync_loading: '연결 중', sync_success: '동기화됨', sync_error: '동기화 실패', logout_confirm: '클라우드 동기화에서 로그아웃할까요?', login_failed: '로그인하지 못했습니다. 다시 시도해 주세요.',
    theme: '배경화면 선택', close: '닫기', cinematic: '텍스트 대비 높이기', language: '인터페이스 언어', add: '추가', edit: '편집', remove: '삭제',
    add_title: '바로가기 추가', edit_title: '바로가기 편집', preview: '아이콘 미리보기', url: '웹 주소', name: '사이트 이름', cancel: '취소', save: '저장',
    invalid_url: '올바른 HTTP 또는 HTTPS 주소를 입력하세요.', invalid_name: '사이트 이름을 입력하세요.', limit: '바로가기는 최대 24개까지 추가할 수 있습니다.',
    theme_hint: '배경화면 설정 열기', bookmark_actions: '바로가기 작업', empty_icon: '사이트', offline: '오프라인 상태입니다. 로컬 설정을 표시합니다.'
  }
};

export const LOCALES = Object.keys(translations);

export function detectLocale({ search = globalThis.location?.search || '', saved, browser = globalThis.navigator?.language || '' } = {}) {
  const query = new URLSearchParams(search).get('lang');
  if (LOCALES.includes(query)) return query;
  if (LOCALES.includes(saved)) return saved;
  if (LOCALES.includes(browser)) return browser;
  const base = browser.split('-')[0];
  return LOCALES.includes(base) ? base : 'zh';
}

class I18n {
  constructor() {
    let saved;
    try { saved = localStorage.getItem('catzz_language'); } catch { saved = undefined; }
    this.locale = detectLocale({ saved });
  }

  t(key) { return translations[this.locale]?.[key] || translations.zh[key] || key; }
  getLocale() { return this.locale; }
  setLanguage(locale) {
    if (!LOCALES.includes(locale)) return false;
    this.locale = locale;
    localStorage.setItem('catzz_language', locale);
    return true;
  }
  applyDocumentLanguage() {
    document.documentElement.lang = this.locale === 'zh' ? 'zh-CN' : this.locale;
    const skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = this.t('skip');
  }
}

export const i18n = new I18n();
