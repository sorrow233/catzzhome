export function resolveSearchTarget(value, country = '') {
  const input = String(value || '').trim();
  if (!input) return null;

  const direct = toWebUrl(input);
  if (direct) return direct;

  const query = encodeURIComponent(input);
  return String(country).toUpperCase() === 'CN'
    ? `https://www.baidu.com/s?wd=${query}`
    : `https://www.google.com/search?q=${query}`;
}

function toWebUrl(value) {
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value)
    ? value
    : looksLikeAddress(value) ? `https://${value}` : '';
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function looksLikeAddress(value) {
  return /^(?:localhost|(?:[\p{L}\d-]+\.)+[\p{L}\d-]{2,})(?::\d+)?(?:[/?#]|$)/iu.test(value);
}
