export const REPOSITORY = 'https://github.com/malikali4129/AIM-DOWNLOADER-RELEASE';
export const API = 'https://api.github.com/repos/malikali4129/AIM-DOWNLOADER-RELEASE';

export function safeReleaseUrl(value, asset = false) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    const prefix = '/malikali4129/AIM-DOWNLOADER-RELEASE/releases/';
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.port || !url.pathname.startsWith(prefix)) return null;
    if (asset && !url.pathname.startsWith(prefix + 'download/')) return null;
    return url.href;
  } catch { return null; }
}

export function normalizeRelease(data) {
  if (!data || typeof data !== 'object' || data.draft || data.prerelease || typeof data.tag_name !== 'string' || !data.tag_name.trim()) return null;
  const url = safeReleaseUrl(data.html_url);
  if (!url) return null;
  const assets = Array.isArray(data.assets) ? data.assets : [];
  function find(pattern) {
    const entry = assets.find(a => a && typeof a.name === 'string' && pattern.test(a.name) && safeReleaseUrl(a.browser_download_url, true));
    return entry ? { name: entry.name, url: safeReleaseUrl(entry.browser_download_url, true), size: Number.isFinite(entry.size) && entry.size > 0 ? entry.size : null } : null;
  }
  const date = typeof data.published_at === 'string' && Number.isFinite(Date.parse(data.published_at)) ? data.published_at : null;
  return { tag: data.tag_name, name: typeof data.name === 'string' && data.name.trim() ? data.name : data.tag_name, url, date,
    installer: find(/^AIM-DOWNLOADER(?:-[\w.+-]+)?-win-x64-setup\.exe$/i),
    portable: find(/^AIM-DOWNLOADER(?:-[\w.+-]+)?-win-x64-portable\.zip$/i),
    checksums: find(/^SHA256SUMS\.txt$/i) };
}

export function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  return new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024) + ' MB';
}

export function formatDate(date) {
  return date ? new Intl.DateTimeFormat('en', { year:'numeric', month:'short', day:'numeric', timeZone:'UTC' }).format(new Date(date)) : '';
}

export async function getReleases(history = false, fetcher = globalThis.fetch) {
  const response = await fetcher(API + (history ? '/releases?per_page=30' : '/releases/latest'), { headers:{ Accept:'application/vnd.github+json' }, signal:AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Release service unavailable');
  const data = await response.json();
  if (history && !Array.isArray(data)) throw new Error('Invalid release list');
  return (history ? data : [data]).map(normalizeRelease).filter(Boolean).slice(0,10);
}
