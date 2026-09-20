import { IMG_BASE, FALLBACK_EMOJI } from '../data/menu.js';

/* ชื่อเมนูมาจากการคัดลอกหน้าเว็บคนอื่น ไม่ใช่ข้อความที่เราพิมพ์เองทั้งหมด
 * จึง escape ก่อนยัดลง innerHTML เสมอ */
export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function baht(amount) {
  return '฿' + amount.toLocaleString('th-TH');
}

export function emojiFor(dish) {
  return FALLBACK_EMOJI[dish.cat] || '🍽️';
}

/* รูปลิงก์ข้ามโดเมน ถ้าวันหนึ่งเจ้าของย้ายไฟล์ ต้องไม่เหลือกรอบรูปแตกค้างไว้
 * base ต่างกันระหว่างการ์ด (256x256) กับ preview (800x0) */
export function imgHtml(dish, base, lazy) {
  return '<img src="' + esc(base + dish.img) + '" alt=""' +
    (lazy ? ' loading="lazy"' : '') + ' decoding="async"' +
    ' data-fallback="' + emojiFor(dish) + '">';
}

export function thumbHtml(dish) {
  const inner = dish.img ? imgHtml(dish, IMG_BASE, true) : emojiFor(dish);
  // รูปกดดูขนาดใหญ่ได้ จึงต้องเป็นปุ่มจริงเพื่อให้ใช้คีย์บอร์ดได้ด้วย
  return '<button type="button" class="thumb-btn" data-preview="' + esc(dish.slug) + '"' +
    ' aria-label="ดูรูป ' + esc(dish.name) + ' ขนาดใหญ่">' +
    '<span class="thumb" aria-hidden="true">' + inner + '</span>' +
  '</button>';
}

export function qtyHtml(dish, qty) {
  return (qty > 0
      ? '<button type="button" class="qty-btn" data-dec="' + esc(dish.slug) + '" aria-label="ลด ' + esc(dish.name) + '">−</button>' +
        '<span class="qty-num" aria-label="จำนวน ' + qty + '">' + qty + '</span>'
      : '') +
    '<button type="button" class="qty-btn" data-inc="' + esc(dish.slug) + '" aria-label="เพิ่ม ' + esc(dish.name) + '">+</button>';
}


