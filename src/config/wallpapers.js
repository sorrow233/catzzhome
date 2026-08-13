const blog = 'https://blog.catzz.work/file';
const gallery = 'https://catzz.work/artworks';

export const WALLPAPERS = [
  wallpaper('rainy_window', 'Rainy Window', `${blog}/1767459124084_rainy_window_thumb.webp`, `${blog}/1767459123988_rainy_window.webp`, '#a5f3fc', '#22d3ee', 'rgba(34,211,238,.4)', { cinematic: false }),
  wallpaper('wet_street', 'Wet Street', `${blog}/1767459127086_wet_street_thumb.webp`, `${blog}/1767459129847_wet_street.webp`, '#e0e7ff', '#818cf8', 'rgba(129,140,248,.4)'),
  wallpaper('city_bed', 'City Bed', `${blog}/1767459119214_city_bed_thumb.webp`, `${blog}/1767459126076_city_bed.webp`, '#fcd34d', '#fbbf24', 'rgba(251,191,36,.4)'),
  wallpaper('umbrella_street', 'Umbrella Street', `${blog}/1767459127120_umbrella_street_thumb.webp`, `${blog}/1767459127815_umbrella_street.webp`, '#e879f9', '#d946ef', 'rgba(217,70,239,.4)'),
  wallpaper('flower_window', 'Flower Window', `${blog}/1767459120854_flower_window_thumb.webp`, `${blog}/1767459120939_flower_window.webp`, '#6ee7b7', '#34d399', 'rgba(52,211,153,.4)'),
  wallpaper('white_shirt_girl', 'White Shirt Girl', `${blog}/1767459128017_white_shirt_girl_thumb.webp`, `${blog}/1767459123491_white_shirt_girl.webp`, '#cbd5e1', '#fff', 'rgba(255,255,255,.4)'),
  wallpaper('sunset_balcony', 'Sunset Balcony', `${blog}/1767459121541_sunset_balcony_thumb.webp`, `${blog}/1767459122549_sunset_balcony.webp`, '#fdba74', '#fb923c', 'rgba(251,146,60,.5)', { cinematic: false }),
  wallpaper('night_view', 'Night View', `${blog}/1767459127940_night_view_thumb.webp`, `${blog}/1767459128088_night_view.webp`, '#93c5fd', '#60a5fa', 'rgba(96,165,250,.6)', { cinematic: false }),
  wallpaper('summer_room', '永远有多远', '/wallpapers/thumbs/summer-room.webp', `${gallery}/146824736.webp`, '#d7eef2', '#fff', 'rgba(157,219,226,.38)', { position: '50% 50%', mobilePosition: '42% 50%' }),
  wallpaper('thunder_sign', '雷暴の予感', '/wallpapers/thumbs/thunder-sign.webp', `${gallery}/146254732.webp`, '#e8e5f0', '#fff', 'rgba(190,184,218,.42)', { position: '57% 50%', mobilePosition: '61% 50%' }),
  wallpaper('after_school_rain', '放課後', '/wallpapers/thumbs/after-school-rain.webp', `${gallery}/145893732.webp`, '#d8e8ee', '#fff', 'rgba(179,216,224,.42)', { position: '48% 50%', mobilePosition: '38% 50%', cinematic: false }),
  wallpaper('winter_alley', '积极过冬', '/wallpapers/thumbs/winter-alley.webp', `${gallery}/140457811.webp`, '#eef2ff', '#fff', 'rgba(210,220,255,.38)', { position: '50% 52%', mobilePosition: '48% 50%', cinematic: false }),
  wallpaper('rain_vending', '雨夜贩卖机', '/wallpapers/thumbs/rain-vending.webp', `${gallery}/131571863_p1.webp`, '#dbeafe', '#fff', 'rgba(147,197,253,.45)', { position: '50% 50%', mobilePosition: '52% 50%', cinematic: false }),
  wallpaper('city_rain_window', '城市雨窗', '/wallpapers/thumbs/city-rain-window.webp', `${gallery}/131571863_p5.webp`, '#fed7aa', '#fff', 'rgba(251,146,60,.42)', { position: '58% 50%', mobilePosition: '67% 50%', cinematic: false })
];

export const WALLPAPER_URLS = Object.fromEntries(WALLPAPERS.map(({ id, url }) => [id, url]));

function wallpaper(id, name, thumbUrl, url, iconColor, iconHoverColor, glowColor, options = {}) {
  return {
    id, name, thumbUrl, url,
    position: options.position || '50% 50%',
    mobilePosition: options.mobilePosition || options.position || '50% 50%',
    cinematic: options.cinematic ?? true,
    theme: { iconColor, iconHoverColor, glowColor }
  };
}
