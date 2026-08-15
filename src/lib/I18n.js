const translations = {
  zh: {
    skip: '跳到快捷入口', title: 'Catzz', subtitle: '让雨声之外的世界，暂时慢一点。', sync: '云同步', sync_idle: '云同步',
    sync_loading: '正在连接', sync_success: '已同步', sync_error: '同步失败', logout_confirm: '确定退出云同步吗？', login_failed: '登录失败，请稍后重试。',
    theme: '选择壁纸', close: '关闭', cinematic: '增强文字对比', language: '界面语言', add: '添加', edit: '编辑', remove: '删除',
    add_title: '添加快捷方式', edit_title: '编辑快捷方式', preview: '图标预览', url: '链接地址', name: '网站名称', cancel: '取消', save: '保存',
    invalid_url: '请输入有效的 HTTP 或 HTTPS 地址。', invalid_name: '请输入网站名称。', limit: '快捷方式最多只能添加 24 个。',
    theme_hint: '切换 Catzz 壁纸', bookmark_actions: '快捷方式操作', manage_shortcuts_hint: '已进入快捷方式管理，点击空白处完成', empty_icon: '站点', offline: '当前离线，显示本地设置。',
    search_placeholder: '搜索、输入网址或执行命令', search_simple: '搜索或输入网址', search_hint: '输入 / 查看命令，@yt 等指定站点搜索', detecting_site: '正在识别网站名称与图标…', site_detected: '已识别网站信息', site_detect_fallback: '已使用可靠的备用识别', settings: '设置', today: '今日', focus: '专注', notes: '快速记录', calendar: '日历',
    new_task: '今天最重要的事', new_note: '记下突然出现的想法', start: '开始', pause: '暂停', reset: '重置', done: '完成', sessions: '今日专注', minutes: '分钟',
    weather: '天气', enable_weather: '使用当前位置显示天气', location_denied: '无法获取位置，请检查浏览器权限。', search_engine: '默认搜索引擎', open_new_tab: '搜索结果在新标签打开',
    groups: '分组', new_group: '新建分组', import_bookmarks: '导入浏览器书签', export_data: '导出全部数据', import_data: '恢复备份', import_calendar: '导入 ICS 日历',
    appearance: '外观', scene_mode: '按时间自动切换场景', density: '紧凑布局', custom_wallpaper: '上传自己的壁纸', remove_wallpaper: '移除自定义壁纸', ambient: '环境音',
    data_privacy: '数据与隐私', delete_local: '清除本地数据', delete_cloud: '删除云端数据', delete_confirm: '这项操作无法撤销，确定继续吗？', installed: '已安装', install_app: '安装 Catzz', install_unavailable: '当前浏览器暂不支持直接安装，请使用浏览器菜单中的“安装应用”。',
    onboarding_title: '把 Catzz 变成你的起点', onboarding_body: '选择搜索方式，导入常用入口，然后决定是否显示天气。所有设置默认保存在本地。', continue: '开始使用', later: '稍后设置',
    command_unknown: '未知命令。可使用 /weather、/settings 或 /export。', backup_invalid: '备份文件无效。', imported: '导入完成', no_events: '未来七天没有日程', next_event: '下一个日程'
  },
  'zh-TW': {
    skip: '跳到快速入口', title: 'Catzz', subtitle: '讓雨聲之外的世界，暫時慢一點。', sync: '雲端同步', sync_idle: '雲端同步',
    sync_loading: '正在連線', sync_success: '已同步', sync_error: '同步失敗', logout_confirm: '確定登出雲端同步嗎？', login_failed: '登入失敗，請稍後再試。',
    theme: '選擇桌布', close: '關閉', cinematic: '增強文字對比', language: '介面語言', add: '新增', edit: '編輯', remove: '刪除',
    add_title: '新增快速方式', edit_title: '編輯快速方式', preview: '圖示預覽', url: '連結網址', name: '網站名稱', cancel: '取消', save: '儲存',
    invalid_url: '請輸入有效的 HTTP 或 HTTPS 網址。', invalid_name: '請輸入網站名稱。', limit: '快速方式最多只能新增 24 個。',
    theme_hint: '開啟設定', bookmark_actions: '快速方式操作', manage_shortcuts_hint: '已進入快速方式管理，點擊空白處完成', empty_icon: '網站', offline: '目前離線，顯示本機設定。',
    search_placeholder: '搜尋、輸入網址或執行指令', search_simple: '搜尋或輸入網址', search_hint: '輸入 / 查看指令，@yt 等指定網站搜尋', detecting_site: '正在識別網站名稱與圖示…', site_detected: '已識別網站資訊', site_detect_fallback: '已使用可靠的備用識別', settings: '設定', today: '今日', focus: '專注', notes: '快速記錄', calendar: '行事曆',
    new_task: '今天最重要的事', new_note: '記下突然出現的想法', start: '開始', pause: '暫停', reset: '重設', done: '完成', sessions: '今日專注', minutes: '分鐘',
    weather: '天氣', enable_weather: '使用目前位置顯示天氣', location_denied: '無法取得位置，請檢查瀏覽器權限。', search_engine: '預設搜尋引擎', open_new_tab: '搜尋結果在新分頁開啟',
    groups: '分組', new_group: '新增分組', import_bookmarks: '匯入瀏覽器書籤', export_data: '匯出全部資料', import_data: '還原備份', import_calendar: '匯入 ICS 行事曆',
    appearance: '外觀', scene_mode: '依時間自動切換場景', density: '緊湊版面', custom_wallpaper: '上傳自己的桌布', remove_wallpaper: '移除自訂桌布', ambient: '環境音',
    data_privacy: '資料與隱私', delete_local: '清除本機資料', delete_cloud: '刪除雲端資料', delete_confirm: '此操作無法復原，確定繼續嗎？', installed: '已安裝', install_app: '安裝 Catzz', install_unavailable: '目前瀏覽器不支援直接安裝，請使用瀏覽器選單中的「安裝應用程式」。',
    onboarding_title: '讓 Catzz 成為你的起點', onboarding_body: '選擇搜尋方式、匯入常用入口，再決定是否顯示天氣。所有設定預設保存在本機。', continue: '開始使用', later: '稍後設定',
    command_unknown: '未知指令。可使用 /weather、/settings 或 /export。', backup_invalid: '備份檔案無效。', imported: '匯入完成', no_events: '未來七天沒有行程', next_event: '下一個行程'
  },
  en: {
    skip: 'Skip to shortcuts', title: 'Catzz', subtitle: 'Let the world beyond the rain slow down for a while.', sync: 'Cloud sync', sync_idle: 'Cloud sync',
    sync_loading: 'Connecting', sync_success: 'Synced', sync_error: 'Sync failed', logout_confirm: 'Sign out of cloud sync?', login_failed: 'Sign-in failed. Please try again.',
    theme: 'Choose wallpaper', close: 'Close', cinematic: 'Increase text contrast', language: 'Interface language', add: 'Add', edit: 'Edit', remove: 'Remove',
    add_title: 'Add shortcut', edit_title: 'Edit shortcut', preview: 'Icon preview', url: 'Web address', name: 'Site name', cancel: 'Cancel', save: 'Save',
    invalid_url: 'Enter a valid HTTP or HTTPS address.', invalid_name: 'Enter a site name.', limit: 'You can add up to 24 shortcuts.',
    theme_hint: 'Open settings', bookmark_actions: 'Shortcut actions', manage_shortcuts_hint: 'Managing shortcuts · tap outside when done', empty_icon: 'Site', offline: 'You are offline. Local settings are shown.',
    search_placeholder: 'Search, enter a URL, or run a command', search_simple: 'Search or enter a URL', search_hint: 'Type / for commands or @yt to search a site', detecting_site: 'Detecting site name and icon…', site_detected: 'Site details detected', site_detect_fallback: 'Using a reliable fallback', settings: 'Settings', today: 'Today', focus: 'Focus', notes: 'Quick notes', calendar: 'Calendar',
    new_task: 'What matters most today?', new_note: 'Capture a thought before it disappears', start: 'Start', pause: 'Pause', reset: 'Reset', done: 'Done', sessions: 'Sessions today', minutes: 'minutes',
    weather: 'Weather', enable_weather: 'Use my location for weather', location_denied: 'Location is unavailable. Check your browser permission.', search_engine: 'Default search engine', open_new_tab: 'Open searches in a new tab',
    groups: 'Groups', new_group: 'New group', import_bookmarks: 'Import browser bookmarks', export_data: 'Export all data', import_data: 'Restore backup', import_calendar: 'Import ICS calendar',
    appearance: 'Appearance', scene_mode: 'Change scene with the time of day', density: 'Compact layout', custom_wallpaper: 'Upload your wallpaper', remove_wallpaper: 'Remove custom wallpaper', ambient: 'Ambient sound',
    data_privacy: 'Data & privacy', delete_local: 'Clear local data', delete_cloud: 'Delete cloud data', delete_confirm: 'This cannot be undone. Continue?', installed: 'Installed', install_app: 'Install Catzz', install_unavailable: 'Direct installation is unavailable. Use Install app in your browser menu.',
    onboarding_title: 'Make Catzz your starting point', onboarding_body: 'Choose search, import your shortcuts, and decide whether to show weather. Everything stays local by default.', continue: 'Start using Catzz', later: 'Set up later',
    command_unknown: 'Unknown command. Try /weather, /settings, or /export.', backup_invalid: 'This backup is not valid.', imported: 'Import complete', no_events: 'No events in the next seven days', next_event: 'Next event'
  },
  ja: {
    skip: 'ショートカットへ移動', title: 'Catzz', subtitle: '雨音の向こうの世界を、少しだけゆっくりに。', sync: 'クラウド同期', sync_idle: 'クラウド同期',
    sync_loading: '接続中', sync_success: '同期済み', sync_error: '同期失敗', logout_confirm: 'クラウド同期からログアウトしますか？', login_failed: 'ログインに失敗しました。もう一度お試しください。',
    theme: '壁紙を選択', close: '閉じる', cinematic: '文字のコントラストを上げる', language: '表示言語', add: '追加', edit: '編集', remove: '削除',
    add_title: 'ショートカットを追加', edit_title: 'ショートカットを編集', preview: 'アイコンプレビュー', url: 'URL', name: 'サイト名', cancel: 'キャンセル', save: '保存',
    invalid_url: '有効な HTTP または HTTPS URL を入力してください。', invalid_name: 'サイト名を入力してください。', limit: 'ショートカットは24件まで追加できます。',
    theme_hint: '設定を開く', bookmark_actions: 'ショートカット操作', manage_shortcuts_hint: 'ショートカットを編集中です。外側をタップして完了', empty_icon: 'サイト', offline: 'オフラインです。ローカル設定を表示しています。',
    search_placeholder: '検索、URL入力、コマンド実行', search_simple: '検索またはURLを入力', search_hint: '/ でコマンド、@yt でサイト検索', detecting_site: 'サイト名とアイコンを確認中…', site_detected: 'サイト情報を確認しました', site_detect_fallback: '予備の識別方法を使用しました', settings: '設定', today: '今日', focus: '集中', notes: 'クイックメモ', calendar: 'カレンダー',
    new_task: '今日いちばん大切なこと', new_note: '思いつきをすぐに記録', start: '開始', pause: '一時停止', reset: 'リセット', done: '完了', sessions: '今日の集中', minutes: '分',
    weather: '天気', enable_weather: '現在地の天気を表示', location_denied: '位置情報を取得できません。ブラウザの権限を確認してください。', search_engine: '既定の検索エンジン', open_new_tab: '検索結果を新しいタブで開く',
    groups: 'グループ', new_group: 'グループ追加', import_bookmarks: 'ブラウザのブックマークを読み込む', export_data: '全データを書き出す', import_data: 'バックアップを復元', import_calendar: 'ICSカレンダーを読み込む',
    appearance: '外観', scene_mode: '時間帯でシーンを切り替える', density: 'コンパクト表示', custom_wallpaper: '自分の壁紙をアップロード', remove_wallpaper: 'カスタム壁紙を削除', ambient: '環境音',
    data_privacy: 'データとプライバシー', delete_local: 'ローカルデータを消去', delete_cloud: 'クラウドデータを削除', delete_confirm: '元に戻せません。続けますか？', installed: 'インストール済み', install_app: 'Catzzをインストール', install_unavailable: '直接インストールできません。ブラウザメニューの「アプリをインストール」を使用してください。',
    onboarding_title: 'Catzzをあなたの起点に', onboarding_body: '検索方法とショートカットを設定し、天気表示を選びます。データは既定でローカルに保存されます。', continue: '使い始める', later: 'あとで設定',
    command_unknown: '不明なコマンドです。/weather、/settings、/export が使えます。', backup_invalid: 'バックアップが無効です。', imported: '読み込み完了', no_events: '今後7日間の予定はありません', next_event: '次の予定'
  },
  ko: {
    skip: '바로가기로 이동', title: 'Catzz', subtitle: '빗소리 너머의 세상을 잠시 천천히.', sync: '클라우드 동기화', sync_idle: '클라우드 동기화',
    sync_loading: '연결 중', sync_success: '동기화됨', sync_error: '동기화 실패', logout_confirm: '클라우드 동기화에서 로그아웃할까요?', login_failed: '로그인하지 못했습니다. 다시 시도해 주세요.',
    theme: '배경화면 선택', close: '닫기', cinematic: '텍스트 대비 높이기', language: '인터페이스 언어', add: '추가', edit: '편집', remove: '삭제',
    add_title: '바로가기 추가', edit_title: '바로가기 편집', preview: '아이콘 미리보기', url: '웹 주소', name: '사이트 이름', cancel: '취소', save: '저장',
    invalid_url: '올바른 HTTP 또는 HTTPS 주소를 입력하세요.', invalid_name: '사이트 이름을 입력하세요.', limit: '바로가기는 최대 24개까지 추가할 수 있습니다.',
    theme_hint: '설정 열기', bookmark_actions: '바로가기 작업', manage_shortcuts_hint: '바로가기 관리 중 · 바깥쪽을 눌러 완료', empty_icon: '사이트', offline: '오프라인 상태입니다. 로컬 설정을 표시합니다.',
    search_placeholder: '검색, URL 입력 또는 명령 실행', search_simple: '검색 또는 URL 입력', search_hint: '/ 명령 또는 @yt 사이트 검색', detecting_site: '사이트 이름과 아이콘 확인 중…', site_detected: '사이트 정보를 확인했습니다', site_detect_fallback: '안정적인 대체 식별을 사용했습니다', settings: '설정', today: '오늘', focus: '집중', notes: '빠른 메모', calendar: '캘린더',
    new_task: '오늘 가장 중요한 일', new_note: '떠오른 생각을 바로 기록하세요', start: '시작', pause: '일시정지', reset: '초기화', done: '완료', sessions: '오늘의 집중', minutes: '분',
    weather: '날씨', enable_weather: '현재 위치의 날씨 표시', location_denied: '위치를 가져올 수 없습니다. 브라우저 권한을 확인하세요.', search_engine: '기본 검색 엔진', open_new_tab: '검색 결과를 새 탭에서 열기',
    groups: '그룹', new_group: '새 그룹', import_bookmarks: '브라우저 북마크 가져오기', export_data: '모든 데이터 내보내기', import_data: '백업 복원', import_calendar: 'ICS 캘린더 가져오기',
    appearance: '화면', scene_mode: '시간대에 따라 장면 변경', density: '컴팩트 레이아웃', custom_wallpaper: '내 배경화면 업로드', remove_wallpaper: '사용자 배경화면 제거', ambient: '환경음',
    data_privacy: '데이터 및 개인정보', delete_local: '로컬 데이터 지우기', delete_cloud: '클라우드 데이터 삭제', delete_confirm: '되돌릴 수 없습니다. 계속할까요?', installed: '설치됨', install_app: 'Catzz 설치', install_unavailable: '직접 설치할 수 없습니다. 브라우저 메뉴의 앱 설치를 사용하세요.',
    onboarding_title: 'Catzz를 나만의 시작점으로', onboarding_body: '검색 방식을 선택하고 바로가기를 가져온 뒤 날씨 표시 여부를 정하세요. 모든 설정은 기본적으로 로컬에 저장됩니다.', continue: '사용 시작', later: '나중에 설정',
    command_unknown: '알 수 없는 명령입니다. /weather, /settings, /export를 사용할 수 있습니다.', backup_invalid: '유효하지 않은 백업입니다.', imported: '가져오기 완료', no_events: '앞으로 7일간 일정이 없습니다', next_event: '다음 일정'
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
