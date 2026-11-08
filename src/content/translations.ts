import { wishes } from './wishes.ts';

export type Locale = 'vi' | 'en';
const englishWishes = [
  'Wishing you a peaceful Mid-Autumn Festival, surrounded by those you love.',
  'May everything you wish for gently become real.',
  'May your family always be together, happy and full of laughter.',
  'May tonight’s moonlight bring peace to your heart.',
  'May you always find the courage to follow what you love.',
  'Sending you a little sweetness and plenty of joy under the full moon.',
  'May the days ahead be as bright and clear as the autumn moon.',
  'May your love stay warm and lasting through every season of the moon.',
  'May good fortune and a kind companion follow you on every journey.',
  'Wishing you a beautiful Mid-Autumn night and memories to treasure.',
  'May your worries drift away on the breeze, leaving joy by your side.',
  'May you and your loved one always find each other under the moon.',
];
const entries: [string, string][] = [
  ['TẾT TRUNG THU', 'MID-AUTUMN FESTIVAL'],
  ['ĐÊM HỘI TRĂNG RẰM', 'A NIGHT UNDER THE FULL MOON'],
  ['Một đêm trăng,', 'One moonlit night,'],
  ['ngàn điều ước.', 'a thousand wishes.'],
  ['Có một lời chúc đang chờ bạn,', 'A little wish is waiting for you,'],
  ['ở phía bên kia đêm trăng.', 'just beyond the moonlit doors.'],
  ['Bước vào đêm trăng', 'Enter the moonlit night'],
  ['Thả lồng đèn', 'Release the lantern'],
  ['Đang chuẩn bị đêm trăng…', 'Preparing your moonlit night…'],
  ['Đang thắp sáng phố cổ…', 'Lighting up the old town…'],
  ['Mời bạn bước qua cánh cửa đêm trăng', 'Step through the doors into the moonlight'],
  ['Thử lại', 'Try again'],
  ['GỬI LÊN TRỜI MỘT LỜI THƯƠNG', 'SEND A LITTLE LOVE TO THE SKY'],
  ['RẰM THÁNG TÁM', 'THE EIGHTH FULL MOON'],
  ['MÙA ĐOÀN VIÊN', 'A SEASON OF REUNION'],
  ['MỘT MÙA TRĂNG ĐỂ NHỚ', 'A MOONLIT NIGHT TO REMEMBER'],
  ['Nguyệt Ước — về trang đầu', 'Nguyệt Ước — back to home'],
  ['CHƯƠNG I · BÊN DÒNG SÔNG', 'CHAPTER I · BY THE RIVER'],
  ['CHƯƠNG II · NGÀN ĐIỀU ƯỚC', 'CHAPTER II · A THOUSAND WISHES'],
  ['Cùng gửi ước nguyện lên trời', 'Send a wish into the sky together'],
  ['Một lời chúc dành riêng cho bạn', 'A wish just for you'],
  [
    'Có những điều, hãy để ánh đèn thay lời muốn nói.',
    'Some things are best said with a little light.',
  ],
  ['Gửi lên trời một lời thương…', 'Sending a little love into the sky…'],
  ['Để những điều ước bay xa…', 'Let your wishes fly…'],
  [
    'Chạm vào lồng đèn lớn đang bay để nhận lời chúc.',
    'Tap a large floating lantern to receive a wish.',
  ],
  ['MỘT CHIẾC ĐÈN · MỘT ĐIỀU ƯỚC', 'ONE LANTERN · ONE WISH'],
  ['MỖI ÁNH ĐÈN MANG MỘT CHÚT BÌNH YÊN', 'EACH LIGHT CARRIES A LITTLE PEACE'],
  ['Điều khiển câu chuyện', 'Story controls'],
  ['Quay lại', 'Go back'],
  ['Về trang đầu', 'Back to home'],
  ['Về cây cầu', 'Back to the bridge'],
  ['Bật âm thanh', 'Turn sound on'],
  ['Tắt âm thanh', 'Mute sound'],
  ['Ngôn ngữ', 'Language'],
  ['Không thể bật âm thanh. Hãy thử lại.', 'Could not start audio. Please try again.'],
  ['Đóng lời chúc', 'Close wish'],
  ['MỘT CHIẾC ĐÈN ĐÃ TÌM THẤY BẠN', 'A LANTERN HAS FOUND YOU'],
  ['Lời chúc đêm trăng', 'A moonlit wish'],
  ['Gói chút bình yên, gửi đến riêng bạn.', 'A little peace, sent just to you.'],
  ['Trở lại bầu trời', 'Return to the sky'],
  ['Nhận lời chúc', 'Receive a wish'],
  ['Chưa thể tải lời chúc. Hãy thử lại.', 'Could not load your wish. Please try again.'],
  [
    'Chưa thể tải khung cảnh. Hãy thử lại hoặc kiểm tra hỗ trợ WebGL.',
    'Could not load the scene. Please try again or check WebGL support.',
  ],
  [
    'Bạn đang trên cầu trong đêm Trung thu. Chọn Thả lồng đèn để bắt đầu.',
    'You are on the bridge. Choose Release the lantern to begin.',
  ],
  [
    'Bạn đã trở lại trên cầu. Chọn Thả lồng đèn để xem lại.',
    'You are back on the bridge. Release the lantern to watch again.',
  ],
  [
    'Bầu trời lời chúc đã mở. Chọn một chiếc lồng đèn.',
    'The sky of wishes is ready. Choose a lantern.',
  ],
  [
    'Phố cổ bên sông với thuyền, đèn lễ hội và bầu trời sao',
    'An old riverside town with boats, festive lanterns and a starry sky',
  ],
  ...wishes.map((wish, index): [string, string] => [wish, englishWishes[index]]),
];
const toEnglish = new Map(entries);
const toVietnamese = new Map(entries.map(([vi, en]) => [en, vi]));

export function translate(text: string, locale: Locale): string {
  const value = text.trim();
  const known = (locale === 'en' ? toEnglish : toVietnamese).get(value);
  if (known) return text.replace(value, known);
  const lamp = value.match(/^(?:Mở lời chúc từ lồng đèn |Open wish from lantern )(\d+)$/);
  if (lamp)
    return locale === 'en'
      ? `Open wish from lantern ${lamp[1]}`
      : `Mở lời chúc từ lồng đèn ${lamp[1]}`;
  const loading = value.match(
    /^(?:Đang chuẩn bị người bạn đồng hành|Preparing your companions) · (\d+)\/2$/,
  );
  if (loading)
    return `${locale === 'en' ? 'Preparing your companions' : 'Đang chuẩn bị người bạn đồng hành'} · ${loading[1]}/2`;
  return text;
}

export function localizePage(root: HTMLElement, locale: Locale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const next = translate(node.nodeValue ?? '', locale);
    if (next !== node.nodeValue) node.nodeValue = next;
  }
  for (const element of [
    root,
    ...Array.from(root.querySelectorAll<HTMLElement>('[aria-label], [title], [data-tooltip]')),
  ]) {
    for (const attribute of ['aria-label', 'title', 'data-tooltip']) {
      const value = element.getAttribute(attribute);
      if (value) {
        const next = translate(value, locale);
        if (next !== value) element.setAttribute(attribute, next);
      }
    }
  }
}
