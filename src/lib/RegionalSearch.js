export function regionalSearchEngine({ country = '', language = '' } = {}) {
  if (country) return country.toUpperCase() === 'CN' ? 'baidu' : 'google';
  return /^zh(?:-CN|-Hans)?$/i.test(language) ? 'baidu' : 'google';
}

export function pageRegion(documentRef = document) {
  return documentRef.querySelector('meta[name="catzz-region"]')?.content || '';
}
