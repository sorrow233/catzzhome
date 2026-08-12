import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'dist');
const target = path.join(root, 'extension-dist');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, {
  recursive: true,
  filter: (entry) => !['_headers', '_redirects', '_routes.json'].includes(path.basename(entry)),
});

const manifest = {
  manifest_version: 3,
  name: 'Catzz - 沉浸式雨夜起始页',
  short_name: 'Catzz',
  version: pkg.version.replace(/-.*$/, ''),
  description: '融合搜索、书签、专注与轻量记录的沉浸式新标签页。',
  chrome_url_overrides: { newtab: 'index.html' },
  permissions: ['geolocation', 'notifications'],
  host_permissions: [
    'https://api.open-meteo.com/*',
    'https://*.googleapis.com/*',
    'https://*.firebaseio.com/*',
    'https://blog.catzz.work/*',
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'; connect-src 'self' https://api.open-meteo.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
  },
};

await writeFile(path.join(target, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
