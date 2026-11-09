import './shared/styles/main.css';
import { FestivalEngine } from './engine/festival-engine';
import { wishes } from './content/wishes';
import { pickWish } from './domain/wishes/pick-wish';
import { transition, type StoryEvent, type StoryState } from './app/story-state';
import { AmbientAudio } from './engine/ambient-audio';
import { localizePage, type Locale } from './content/translations';

const app = document.querySelector<HTMLElement>('#app')!;
const moonIcon =
  '<img class="moon-logo" src="/branding/logo-moon-rabbit.png" width="48" height="48" alt="" decoding="async" />';
const cloud =
  '<svg viewBox="0 0 360 110" fill="none" aria-hidden="true"><path d="M0 80h110c35 0 45-28 21-34-18-5-25 15-11 19h84c34 0 38-37 10-37-17 0-23 15-15 23h63c31 0 32-34 10-38-16-3-24 9-22 19h60c22 0 30 19 20 29h30M0 93h158c25 0 28-15 15-19M210 89h150" stroke="currentColor" stroke-width="1"/></svg>';
const door = (side: string) => `
  <div class="home__door home__door--${side}" aria-hidden="true">
    <div class="home__lattice"></div><div class="home__door-border"></div>
    <div class="home__moon-ring"></div>
    <div class="home__cloud home__cloud--top">${cloud}</div>
    <div class="home__cloud home__cloud--bottom">${cloud}</div>
    <div class="home__hanging-lantern"><i></i><b></b></div>
    <div class="home__mountains"></div>
    <span class="home__door-stud"></span>
  </div>`;
app.innerHTML = `
  <div class="experience" id="experience" inert>
    <div class="experience__scene" id="scene"></div>
    <div class="experience__vignette" aria-hidden="true"></div>
    <header class="scene-heading"><span class="eyebrow" id="scene-number">CHƯƠNG I · BÊN DÒNG SÔNG</span><h2 id="scene-title">Cùng gửi ước nguyện lên trời</h2></header>
    <div class="lantern-targets" id="lantern-targets" hidden></div>
    <section class="scene-controls" aria-label="Điều khiển câu chuyện">
      <p id="scene-description">Có những điều, hãy để ánh đèn thay lời muốn nói.</p>
      <button class="button action-button action-button--release" id="release">
        <span class="action-button__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 4h10l1 4-2 9H8L6 8l1-4Z"/><path d="M7 8h10M9 4l1 13m5-13-1 13M10 20h4m-2-3v3M10 2h4"/></svg></span>
        <span class="action-button__label">Thả lồng đèn</span>
        <svg class="action-button__arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10"/></svg>
      </button>
      <p class="scene-controls__hint" id="scene-hint">MỘT CHIẾC ĐÈN · MỘT ĐIỀU ƯỚC</p>
    </section>
  </div>
  <section class="home" id="home" aria-labelledby="home-title">
    ${door('left')}${door('right')}
    <div class="home__stars" aria-hidden="true">✧ <span>·</span> ✦ <span>·</span> ✧</div>
    <div class="home__content">
      <span class="home__festival">TẾT TRUNG THU <span>·</span> ĐÊM HỘI TRĂNG RẰM</span>
      <div class="home__ornament" aria-hidden="true"><span class="home__ornament-line"></span><img class="star-lantern-emblem" src="/branding/star-lantern.svg" width="48" height="56" alt=""/><span class="home__ornament-line home__ornament-line--end"></span></div>
      <h1 id="home-title">Một đêm trăng,<br/><em>ngàn điều ước.</em></h1>
      <p class="home__intro">Có một lời chúc đang chờ bạn,<br/>ở phía bên kia đêm trăng.</p>
      <button class="button action-button action-button--entry" id="enter" disabled>
        <span class="action-button__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M18.5 14.2A7.8 7.8 0 0 1 9.8 5.5 7.8 7.8 0 1 0 18.5 14.2Z"/><path d="M17 3v4m-2-2h4m1 4v2m-1-1h2"/></svg></span>
        <span class="action-button__label">Bước vào đêm trăng</span>
        <svg class="action-button__arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10"/></svg>
      </button>
      <p class="home__status" id="load-status" role="status">Đang chuẩn bị đêm trăng…</p>
      <button class="text-button home__retry" id="retry" hidden>Thử lại</button>
    </div>
    <footer class="home__footer"><span>GỬI LÊN TRỜI MỘT LỜI THƯƠNG</span><span>RẰM THÁNG TÁM <i>✧</i> MÙA ĐOÀN VIÊN</span></footer>
  </section>
  <a class="brand" href="./" aria-label="Nguyệt Ước — về trang đầu">${moonIcon}<span>NGUYỆT ƯỚC<small>MỘT MÙA TRĂNG ĐỂ NHỚ</small></span></a>
  <nav class="top-controls" aria-label="Điều khiển câu chuyện">
    <div class="language-picker" id="language-picker">
      <button class="top-controls__button language-picker__trigger" id="language" type="button"
        aria-label="Ngôn ngữ" aria-haspopup="menu" aria-expanded="false" aria-controls="language-menu">
        <span id="language-value">VI</span>
        <svg class="language-picker__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="language-picker__menu" id="language-menu" role="menu" aria-label="Ngôn ngữ" hidden>
        <button class="language-picker__option" type="button" role="menuitemradio" aria-checked="true" data-locale="vi" lang="vi" tabindex="-1">
          <span>Tiếng Việt</span><span class="language-picker__check" aria-hidden="true">✓</span>
        </button>
        <button class="language-picker__option" type="button" role="menuitemradio" aria-checked="false" data-locale="en" lang="en" tabindex="-1">
          <span>English</span><span class="language-picker__check" aria-hidden="true">✓</span>
        </button>
      </div>
    </div>
    <button class="top-controls__button top-controls__button--sound" id="sound" type="button" aria-label="Bật âm thanh" aria-pressed="false">
      <span class="top-controls__sound-icon" id="sound-icon" aria-hidden="true">♪</span><span class="top-controls__label" id="sound-label">Bật âm thanh</span>
    </button>
    <button class="top-controls__button top-controls__button--back" id="replay" type="button" aria-label="Quay lại" hidden>
      <span class="top-controls__icon" aria-hidden="true">↶</span><span class="top-controls__label">Quay lại</span>
    </button>
  </nav>
  <dialog class="wish-dialog" id="wish-dialog" aria-labelledby="wish-title" aria-describedby="wish-text">
    <button class="wish-dialog__close" id="close-wish" aria-label="Đóng lời chúc">×</button>
    <div class="wish-dialog__moon">${moonIcon}</div>
    <span class="eyebrow">MỘT CHIẾC ĐÈN ĐÃ TÌM THẤY BẠN</span>
    <h2 id="wish-title">Lời chúc đêm trăng</h2>
    <p class="wish-dialog__message" id="wish-text"></p>
    <div class="wish-dialog__divider" aria-hidden="true">─── ✧ ───</div>
    <p class="wish-dialog__note">Gói chút bình yên, gửi đến riêng bạn.</p>
    <button class="button action-button action-button--sky" id="continue">
      <span class="action-button__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 18h13a3 3 0 0 0 .4-6 5 5 0 0 0-9.6-1.5A4 4 0 0 0 5 18Z"/><path d="m7 3 .6 1.6L9 5l-1.4.5L7 7l-.5-1.5L5 5l1.5-.4L7 3Zm10-1v4m-2-2h4"/></svg></span>
      <span class="action-button__label">Trở lại bầu trời</span>
      <svg class="action-button__arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg>
    </button>
  </dialog>
  <div class="announcement" role="status" aria-live="polite" id="announcement"></div>
`;
const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const home = get('home');
const experience = get('experience');
const enter = get<HTMLButtonElement>('enter');
const release = get<HTMLButtonElement>('release');
const replay = get<HTMLButtonElement>('replay');
const retry = get<HTMLButtonElement>('retry');
const dialog = get<HTMLDialogElement>('wish-dialog');
const targets = get('lantern-targets');
const media = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = media.matches;
let engine: FestivalEngine | null = null;
let state: StoryState = 'homeLoading';
let openElapsed = 0;
let openingFrame = 0;
let lastOpenTime = 0;
let lastLantern: number | null = null;
let loadVersion = 0;

function send(event: StoryEvent) {
  const next = transition(state, event);
  if (next === state) return false;
  state = next;
  document.documentElement.dataset.story = state;
  replay.hidden = state.startsWith('home') || state === 'openingDoors';
  replay.disabled = state === 'releasing' || state === 'transitioning';
  replay.setAttribute('aria-label', state === 'scene2Ready' ? 'Về cây cầu' : 'Về trang đầu');
  return true;
}
function announce(text: string) {
  get('announcement').textContent = text;
}
function syncMotion() {
  document.documentElement.classList.toggle('reduced-motion', reduced);
  engine?.setReduced(reduced);
}
media.addEventListener('change', (event) => {
  reduced = event.matches;
  syncMotion();
});
syncMotion();

const audio = new AmbientAudio();
const soundButton = get<HTMLButtonElement>('sound');
soundButton.addEventListener('click', async () => {
  soundButton.disabled = true;
  try {
    await audio.setEnabled(!audio.enabled);
    const label = audio.enabled ? 'Tắt âm thanh' : 'Bật âm thanh';
    get('sound-label').textContent = label;
    get('sound-icon').textContent = audio.enabled ? '♫' : '♪';
    soundButton.setAttribute('aria-label', label);
    soundButton.setAttribute('aria-pressed', String(audio.enabled));
  } catch (error) {
    console.error('Audio unavailable', error);
    announce('Không thể bật âm thanh. Hãy thử lại.');
  } finally {
    soundButton.disabled = false;
  }
});
document.addEventListener('visibilitychange', () => {
  void audio
    .syncVisibility()
    .catch((error) => console.error('Audio visibility update failed', error));
});

let locale: Locale = 'vi';
try {
  locale = localStorage.getItem('nguyet-uoc.locale') === 'en' ? 'en' : 'vi';
} catch {
  /* Session-only fallback. */
}
const language = get<HTMLButtonElement>('language');
const languagePicker = get('language-picker');
const languageMenu = get('language-menu');
const languageOptions = Array.from(
  languageMenu.querySelectorAll<HTMLButtonElement>('[data-locale]'),
);
function syncLanguagePicker() {
  get('language-value').textContent = locale.toUpperCase();
  languageOptions.forEach((option) =>
    option.setAttribute('aria-checked', String(option.dataset.locale === locale)),
  );
}
function closeLanguageMenu(returnFocus = false) {
  languageMenu.hidden = true;
  language.setAttribute('aria-expanded', 'false');
  if (returnFocus) language.focus();
}
function openLanguageMenu(
  index = languageOptions.findIndex((option) => option.dataset.locale === locale),
) {
  languageMenu.hidden = false;
  language.setAttribute('aria-expanded', 'true');
  languageOptions[index]?.focus();
}
syncLanguagePicker();
function applyLanguage() {
  localizePage(app, locale);
  document.documentElement.lang = locale;
  document.title =
    locale === 'vi'
      ? 'Nguyệt Ước — Một đêm trăng, ngàn điều ước'
      : 'Nguyệt Ước — One moonlit night, a thousand wishes';
}
language.addEventListener('click', () => {
  if (languageMenu.hidden) openLanguageMenu();
  else closeLanguageMenu(true);
});
language.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  openLanguageMenu(event.key === 'ArrowDown' ? 0 : languageOptions.length - 1);
});
languageOptions.forEach((option) =>
  option.addEventListener('click', () => {
    locale = option.dataset.locale === 'en' ? 'en' : 'vi';
    try {
      localStorage.setItem('nguyet-uoc.locale', locale);
    } catch {
      /* Keep the selected language for this session. */
    }
    syncLanguagePicker();
    applyLanguage();
    closeLanguageMenu(true);
  }),
);
languageMenu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeLanguageMenu(true);
    return;
  }
  const current = languageOptions.indexOf(document.activeElement as HTMLButtonElement);
  let next: number;
  if (event.key === 'ArrowDown') next = (current + 1) % languageOptions.length;
  else if (event.key === 'ArrowUp')
    next = (current - 1 + languageOptions.length) % languageOptions.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = languageOptions.length - 1;
  else return;
  event.preventDefault();
  languageOptions[next].focus();
});
document.addEventListener('pointerdown', (event) => {
  if (!languagePicker.contains(event.target as Node)) closeLanguageMenu();
});
languagePicker.addEventListener('focusout', (event) => {
  if (!languagePicker.contains(event.relatedTarget as Node | null)) closeLanguageMenu();
});
// Translate changing status text without recreating the 3D scene or rerolling a wish.
const translationObserver = new MutationObserver(() => applyLanguage());
translationObserver.observe(app, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['aria-label', 'title', 'data-tooltip'],
});
applyLanguage();

for (let id = 0; id < 12; id++) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lantern-target';
  button.setAttribute('aria-label', `Mở lời chúc từ lồng đèn ${id + 1}`);
  button.innerHTML = '<span aria-hidden="true">✧</span>';
  button.setAttribute('data-tooltip', 'Nhận lời chúc');
  button.addEventListener('click', () => openWish(id));
  button.addEventListener('focus', () => engine?.setFocusedLantern(id));
  button.addEventListener('blur', () => {
    if (!dialog.open) engine?.setFocusedLantern(null);
  });
  targets.append(button);
}
function openWish(id: number) {
  if (state !== 'scene2Ready' || dialog.open) return;
  const wish = pickWish(wishes);
  if (!wish) {
    announce('Chưa thể tải lời chúc. Hãy thử lại.');
    return;
  }
  lastLantern = id;
  engine?.setFocusedLantern(id);
  get('wish-text').textContent = wish;
  dialog.showModal();
  get('close-wish').focus();
}
function closeWish() {
  dialog.close();
}
get('close-wish').addEventListener('click', closeWish);
get('continue').addEventListener('click', closeWish);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeWish();
});
dialog.addEventListener('close', () => {
  const button = lastLantern === null ? null : (targets.children[lastLantern] as HTMLButtonElement);
  if (button && !button.hidden) button.focus();
  else
    (
      Array.from(targets.children).find((b) => !(b as HTMLElement).hidden) as
        HTMLButtonElement | undefined
    )?.focus();
  // Restore keyboard focus but release the reading pause, so this lamp flies on.
  engine?.setFocusedLantern(null);
});

async function load() {
  const version = ++loadVersion;
  retry.hidden = true;
  enter.disabled = true;
  get('load-status').textContent = 'Đang thắp sáng phố cổ…';
  engine?.dispose();
  engine = null;
  try {
    engine = new FestivalEngine(get('scene'), {
      onReleased: () => {
        send('released');
        get('scene-description').textContent = 'Để những điều ước bay xa…';
      },
      onArrived: () => {
        if (!send('arrived')) return;
        get('scene-number').textContent = 'CHƯƠNG II · NGÀN ĐIỀU ƯỚC';
        get('scene-title').textContent = 'Một lời chúc dành riêng cho bạn';
        get('scene-description').textContent = 'Chạm vào lồng đèn lớn đang bay để nhận lời chúc.';
        get('scene-hint').textContent = 'MỖI ÁNH ĐÈN MANG MỘT CHÚT BÌNH YÊN';
        targets.hidden = false;
        replay.hidden = false;
        announce('Bầu trời lời chúc đã mở. Chọn một chiếc lồng đèn.');
      },
      onSelect: openWish,
      onProject: (positions) =>
        positions.forEach((p) => {
          const button = targets.children[p.id] as HTMLButtonElement;
          button.hidden = !p.visible;
          button.style.left = p.x + '%';
          button.style.top = p.y + '%';
        }),
    });
    engine.setReduced(reduced);
    await engine.load((done) => {
      if (version === loadVersion)
        get('load-status').textContent = `Đang chuẩn bị người bạn đồng hành · ${done}/2`;
    });
    if (version !== loadVersion) return;
    send('loaded');
    enter.disabled = false;
    get('load-status').textContent = 'Mời bạn bước qua cánh cửa đêm trăng';
  } catch (error) {
    if (version !== loadVersion) return;
    console.error('Không thể chuẩn bị khung cảnh:', error);
    engine?.dispose();
    engine = null;
    send('failed');
    get('load-status').textContent =
      'Chưa thể tải khung cảnh. Hãy thử lại hoặc kiểm tra hỗ trợ WebGL.';
    retry.hidden = false;
  }
}
retry.addEventListener('click', () => {
  if (send('retry')) void load();
});
function finishOpening() {
  if (!send('opened')) return;
  home.hidden = true;
  home.inert = true;
  experience.inert = false;
  release.focus();
  announce('Bạn đang trên cầu trong đêm Trung thu. Chọn Thả lồng đèn để bắt đầu.');
}
function animateDoors(now: number) {
  if (state !== 'openingDoors') return;
  const dt = document.hidden || !lastOpenTime ? 0 : Math.min((now - lastOpenTime) / 1000, 0.05);
  lastOpenTime = document.hidden ? 0 : now;
  openElapsed += dt;
  const progress = reduced ? 1 : Math.min(1, openElapsed / 1.5);
  home.style.setProperty('--open', String(progress * progress * (3 - 2 * progress)));
  if (progress === 1) finishOpening();
  else openingFrame = requestAnimationFrame(animateDoors);
}
enter.addEventListener('click', () => {
  if (!send('open')) return;
  enter.disabled = true;
  openElapsed = 0;
  lastOpenTime = 0;
  home.classList.add('home--opening');
  openingFrame = requestAnimationFrame(animateDoors);
});
release.addEventListener('click', () => {
  if (!send('release')) return;
  release.hidden = true;
  get('scene-description').textContent = 'Gửi lên trời một lời thương…';
  engine?.release();
});
replay.addEventListener('click', () => {
  if (state === 'scene1Ready') {
    if (!send('back')) return;
    engine?.reset();
    home.hidden = false;
    home.inert = false;
    experience.inert = true;
    home.classList.remove('home--opening');
    home.style.setProperty('--open', '0');
    enter.disabled = false;
    enter.focus();
    return;
  }
  if (!send('replay')) return;
  if (dialog.open) dialog.close();
  targets.hidden = true;
  release.hidden = false;
  get('scene-number').textContent = 'CHƯƠNG I · BÊN DÒNG SÔNG';
  get('scene-title').textContent = 'Cùng gửi ước nguyện lên trời';
  get('scene-description').textContent = 'Có những điều, hãy để ánh đèn thay lời muốn nói.';
  get('scene-hint').textContent = 'MỘT CHIẾC ĐÈN · MỘT ĐIỀU ƯỚC';
  engine?.reset();
  announce('Bạn đã trở lại trên cầu. Chọn Thả lồng đèn để xem lại.');
  release.focus();
});
window.addEventListener('pagehide', () => {
  cancelAnimationFrame(openingFrame);
  engine?.dispose();
  audio.dispose();
  translationObserver.disconnect();
});
void load();
