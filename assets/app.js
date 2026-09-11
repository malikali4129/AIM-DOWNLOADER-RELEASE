import { getReleases, formatDate, formatSize } from './releases.mjs';

document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
  menu.hidden = false;
  const closeMenu = () => { menu.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open',open); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

const statuses = document.querySelectorAll('[data-release-status]');
const list = document.querySelector('[data-release-list]');
if (statuses.length) {
  const status = text => statuses.forEach(node => { node.textContent = text; });
  status('Checking the latest release… GitHub downloads remain available below.');
  try {
    const releases = await getReleases(Boolean(list));
    if (!releases.length) {
      status('No stable release information is available yet. Check GitHub for updates.');
    } else if (list) {
      status('Stable releases from the official GitHub channel.');
      releases.forEach((release,index) => {
        const article = document.createElement('article'); article.className = 'release-row';
        const version = document.createElement('div');
        if (!index) { const badge=document.createElement('span'); badge.className='pill'; badge.textContent='MOST RECENT'; version.append(badge); }
        const title = document.createElement('h2'); title.textContent=release.tag; version.append(title);
        const info = document.createElement('div');
        const name = document.createElement('p'); name.textContent=release.name; info.append(name);
        if (release.date) { const time=document.createElement('time'); time.dateTime=release.date; time.textContent=formatDate(release.date); info.append(time); }
        const link=document.createElement('a'); link.className='text-link'; link.href=release.url; link.textContent='Release notes & downloads ↗';
        article.append(version,info,link); list.append(article);
      });
    } else {
      const release = releases[0];
      status(`Latest stable release: ${release.tag}${release.date ? ' · '+formatDate(release.date) : ''}`);
      ['installer','portable','checksums'].forEach(kind => {
        const link=document.querySelector(`[data-asset="${kind}"]`);
        const asset=release[kind];
        if (asset && link) {
          link.href=asset.url; link.hidden=false;
          const info=document.querySelector(`[data-asset-info="${kind}"]`);
          if (info) info.textContent=`Windows 10 / 11 · x64${asset.size ? ' · '+formatSize(asset.size) : ''}`;
        } else {
          const missing=document.querySelector(`[data-missing="${kind}"]`); if(missing)missing.hidden=false;
        }
      });
    }
  } catch {
    status('Live release details are unavailable right now. You can still get AIM from GitHub below.');
  }
}
