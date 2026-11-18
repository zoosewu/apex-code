// 讀取 api/v1/projects.json 並渲染卡片。這個頁面本身也是 API 的使用端。
const API = 'api/v1/projects.json';
// API 內的網址一律是正式站的絕對網址；在本機或其他網域預覽時改成相對路徑
const SITE = 'https://zoosewu.github.io/apex-code/';
const LOCALES = ['zh-TW', 'en'];

const UI = {
  'zh-TW': { repo: '原始碼', fork: '分支自', error: '無法載入專案資料。', other: 'EN' },
  en: { repo: 'Source', fork: 'Fork of', error: 'Could not load projects.', other: '中文' },
};
const PLATFORMS = {
  windows: 'Windows', macos: 'macOS', linux: 'Linux',
  browser: { 'zh-TW': '瀏覽器', en: 'Browser' }, vscode: 'VS Code', docker: 'Docker',
};

const pickLocale = () => {
  const saved = (() => { try { return localStorage.getItem('lang'); } catch { return null; } })();
  if (LOCALES.includes(saved)) return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en';
};
let lang = pickLocale();
let data = null;

const t = (value) => (typeof value === 'string' ? value : value?.[lang] ?? value?.en ?? '');
const local = (url) => (location.href.startsWith(SITE) ? url : url.replace(SITE, ''));
const repoPath = (url) => url.replace('https://github.com/', '');

function card(p) {
  const node = document.getElementById('card').content.firstElementChild.cloneNode(true);
  const $ = (sel) => node.querySelector(sel);

  const cover = $('.cover');
  const shot = p.screenshots?.[0];
  if (shot) {
    const img = $('.cover img');
    img.src = local(t(shot.src));
    img.alt = t(shot.caption);
    img.width = shot.width;
    img.height = shot.height;
    cover.href = local(t(shot.src));
  } else {
    cover.replaceChildren(Object.assign(document.createElement('span'), { className: 'initial', textContent: p.name[0] }));
    cover.href = p.links.repo;
    cover.setAttribute('aria-hidden', 'true');
    cover.tabIndex = -1;
  }

  $('.name').textContent = p.name;
  $('.name').href = p.links.repo;
  $('.version').textContent = p.version ?? '';
  if (p.upstream) {
    const a = Object.assign(document.createElement('a'), { href: p.upstream, textContent: repoPath(p.upstream), target: '_blank', rel: 'noopener' });
    $('.fork').append(`${UI[lang].fork} `, a);
  } else {
    $('.fork').remove();
  }
  $('.tagline').textContent = t(p.tagline);
  $('.description').textContent = t(p.description);

  const chips = $('.chips');
  for (const id of p.platforms) {
    const label = PLATFORMS[id];
    if (!label) continue; // 未知的值直接略過
    chips.append(Object.assign(document.createElement('li'), { className: 'platform', textContent: t(label) }));
  }
  for (const s of p.stack) chips.append(Object.assign(document.createElement('li'), { textContent: s }));

  const actions = $('.actions');
  for (const [i, item] of p.install.entries()) {
    actions.append(Object.assign(document.createElement('a'), {
      href: item.url, textContent: t(item.label), className: i === 0 ? 'primary' : '', target: '_blank', rel: 'noopener',
    }));
  }
  actions.append(Object.assign(document.createElement('a'), { href: p.links.repo, textContent: UI[lang].repo, target: '_blank', rel: 'noopener' }));
  return node;
}

function render() {
  document.documentElement.lang = lang;
  document.getElementById('lang').textContent = UI[lang].other;
  const main = document.getElementById('projects');
  main.replaceChildren(...data.projects.map(card));
  main.removeAttribute('aria-busy');
}

document.getElementById('lang').addEventListener('click', () => {
  lang = lang === 'zh-TW' ? 'en' : 'zh-TW';
  try { localStorage.setItem('lang', lang); } catch {}
  if (data) render();
});

fetch(API)
  .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then((json) => { data = json; render(); })
  .catch(() => {
    const main = document.getElementById('projects');
    main.replaceChildren(Object.assign(document.createElement('p'), { className: 'error', textContent: UI[lang].error }));
    main.removeAttribute('aria-busy');
  });
