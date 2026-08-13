import { WALLPAPERS, WALLPAPER_URLS } from './wallpapers.js';

export const HERO_CONFIG = {
  quotes: {
    zh: { prefixes: ['清凉雨夜', '雨伞脆弱', '街边电话', '路旁雨滩'], suffixes: ['温暖过谁的心', '保护了谁前行', '少女心伤忧郁', '天空触手可及'] },
    en: { prefixes: ['Cool Rainy Night', 'Fragile Umbrella', 'Streetside Phone', 'Puddles on the Road'], suffixes: ['Warmed whose heart?', 'Protected whom forward?', "Girl's heart melancholic", 'Sky within reach'] },
    ja: { prefixes: ['涼しい雨夜', '脆い雨傘', '街路の電話', '道端の雨溜まり'], suffixes: ['誰の心を温めた？', '誰の前進を守った？', '少女の心は憂鬱に', '空はすぐそこに'] },
    'zh-TW': { prefixes: ['清涼雨夜', '脆弱雨傘', '街邊電話', '路旁雨灘'], suffixes: ['溫暖過誰的心', '保護了誰前行', '少女心傷憂鬱', '天空觸手可及'] },
    ko: { prefixes: ['서늘한 비의 밤', '여린 우산', '거리의 전화', '길가의 빗물'], suffixes: ['누구의 마음을 데웠을까', '누구의 걸음을 지켰을까', '소녀의 마음은 흐리고', '하늘은 손끝 가까이'] }
  },
  defaultBookmarks: [
    { name: 'Bilibili', url: 'https://www.bilibili.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'Twitter', url: 'https://x.com' },
    { name: 'Gmail', url: 'https://mail.google.com' },
    { name: 'Notion', url: 'https://www.notion.so' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Pixiv', url: 'https://www.pixiv.net' },
    { name: 'Gemini', url: 'https://gemini.google.com' },
    { name: '元宝', url: 'https://yuanbao.tencent.com' },
    { name: 'Google Maps', url: 'https://maps.google.com' },
    { name: 'Netflix', url: 'https://www.netflix.com' }
  ],
  wallpapers: WALLPAPERS,
  wallpaperUrls: WALLPAPER_URLS,
  simpleIconsMap: {
    'x.com': 'x', 'twitter.com': 'twitter', 'mail.google.com': 'gmail', 'chatgpt.com': 'openai',
    'claude.ai': 'anthropic', 'dribbble.com': 'dribbble', 'figma.com': 'figma', 'notion.so': 'notion',
    'vercel.com': 'vercel', 'bluesky.app': 'bluesky', 'github.com': 'github', 'pixiv.net': 'pixiv',
    'gemini.google.com': 'googlegemini', 'yuanbao.tencent.com': 'tencentqq', 'maps.google.com': 'googlemaps', 'netflix.com': 'netflix'
  }
};
