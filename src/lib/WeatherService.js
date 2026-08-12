const WEATHER_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather({ latitude, longitude }, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'auto'
  });
  const response = await fetch(`${WEATHER_ENDPOINT}?${params}`, { signal });
  if (!response.ok) throw new Error(`weather_${response.status}`);
  const data = await response.json();
  return {
    temperature: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
    isDay: Boolean(data.current.is_day)
  };
}

export function weatherSymbol(code) {
  if (code === 0) return '☀';
  if ([1, 2, 3].includes(code)) return '☁';
  if ([45, 48].includes(code)) return '≋';
  if (code >= 51 && code <= 67) return '☂';
  if (code >= 71 && code <= 77) return '❄';
  if (code >= 80 && code <= 82) return '☂';
  if (code >= 95) return 'ϟ';
  return '·';
}

export function requestPosition() {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ latitude: Number(coords.latitude.toFixed(4)), longitude: Number(coords.longitude.toFixed(4)) }),
    reject,
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
  ));
}
