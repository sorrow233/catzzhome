export const SITE_URL = 'https://ame.catzz.work';

const languages = {
  zh: {
    lang: 'zh-CN',
    title: 'Catzz - 沉浸式雨夜起始页 | 专注与美学',
    description: '沉浸式雨夜起始页，精选壁纸与效率工具。打造属于你的专注空间。',
    ogLocale: 'zh_CN'
  },
  'zh-TW': {
    lang: 'zh-TW',
    title: 'Catzz - 沉浸式雨夜起始頁 | 專注與美學',
    description: '沉浸式雨夜起始頁，精選桌布與效率工具。打造屬於你的專注空間。',
    ogLocale: 'zh_TW'
  },
  en: {
    lang: 'en',
    title: 'Catzz - A Rainy Start Page for Focus',
    description: 'A calm rainy start page with curated wallpapers, shortcuts, and optional cloud sync.',
    ogLocale: 'en_US'
  },
  ja: {
    lang: 'ja',
    title: 'Catzz - 雨夜のスタートページ | 集中と癒やし',
    description: '厳選された壁紙、ショートカット、クラウド同期を備えた静かな雨夜のスタートページ。',
    ogLocale: 'ja_JP'
  },
  ko: {
    lang: 'ko',
    title: 'Catzz - 비 오는 밤 시작 페이지 | 집중과 휴식',
    description: '엄선된 배경화면, 바로가기, 선택적 클라우드 동기화를 제공하는 차분한 시작 페이지입니다.',
    ogLocale: 'ko_KR'
  }
};

export default {
  defaultLocale: 'zh',
  fallbackLocale: 'en',
  baseUrl: SITE_URL,
  locales: Object.keys(languages),
  languages
};
