import { els } from './dom.js';
import { esc, baht, emojiFor, imgHtml, thumbHtml, qtyHtml, labelHtml } from './helpers.js';
import {
  MENU, CATEGORIES, CATEGORY_LABEL, CATEGORY_NOTE, SHOP, BY_SLUG,
  IMG_PREVIEW_BASE, ORDER_URL, HERO_PHOTO,
} from '../data/menu.js';
import { cleanDesc } from '../store/filtersSlice.js';

/* ===== การ์ดเมนู ===== */

function cardHtml(dish, qty) {
  const desc = cleanDesc(dish);
  return '<li class="card' + (qty > 0 ? ' is-picked' : '') + '" data-slug="' + esc(dish.slug) + '">' +
    thumbHtml(dish) +
    '<p class="card-name">' + esc(dish.name) +
      (dish.rec ? '<span class="card-tag">เมนูแนะนำ</span>' : '') +
    '</p>' +
    (desc ? '<p class="card-desc">' + esc(desc) + '</p>' : '') +
    '<div class="card-foot">' +
      '<p class="card-price">' + baht(dish.price) + '</p>' +
      '<div class="card-qty">' + qtyHtml(dish, qty) + '</div>' +
    '</div>' +
  '</li>';
}

function sectionHtml(cat, dishes, items) {
  const note = CATEGORY_NOTE[cat.key];
  return '<section class="cat-block" id="cat-' + esc(cat.key) + '">' +
    '<div class="cat-head">' +
      labelHtml(cat) +
      '<h3 class="heading">' + esc(cat.label) + '</h3>' +
      '<p class="cat-note">' + dishes.length + ' รายการ' +
        (note ? ' · ' + esc(note) : '') + '</p>' +
    '</div>' +
    '<ul class="cards">' +
      dishes.map((d) => cardHtml(d, items[d.slug] || 0)).join('') +
    '</ul>' +
  '</section>';
}

export function renderMenu(groups, shownCount, query, items) {
  if (shownCount === 0) {
    els.menu.innerHTML = '';
    els.resultCount.textContent = '';
    els.empty.textContent = query
      ? 'ไม่พบเมนูที่ตรงกับ "' + query + '"'
      : 'ไม่มีเมนูในกลุ่มนี้';
    els.empty.hidden = false;
    return;
  }

  els.empty.hidden = true;
  els.resultCount.textContent = 'แสดง ' + shownCount + ' จาก ' + MENU.length + ' รายการ';
  els.menu.innerHTML = groups.map((g) => sectionHtml(g.cat, g.dishes, items)).join('');
}

/* แก้เฉพาะการ์ดใบเดียว ไม่แตะลิสต์ทั้งก้อน เพื่อไม่ให้ลิสต์กระโดดใต้นิ้วผู้ใช้ */
export function renderCard(slug, qty) {
  const card = els.menu.querySelector('.card[data-slug="' + slug + '"]');
  if (!card) return;
  card.outerHTML = cardHtml(BY_SLUG.get(slug), qty);
}

/* ===== แถบ Order ===== */

export function renderOrder(lines, count, total, panelOpen) {
  els.orderBar.hidden = count === 0;

  if (count === 0) {
    els.orderPanel.hidden = true;
    els.orderToggle.setAttribute('aria-expanded', 'false');
    return;
  }

  els.orderCount.textContent = count;
  els.orderTotal.textContent = baht(total);
  els.orderPanel.hidden = !panelOpen;
  els.orderToggle.setAttribute('aria-expanded', String(panelOpen));

  els.orderList.innerHTML = lines.map((line) =>
    '<li class="order-item">' +
      '<span class="order-item-qty">' + line.qty + '×</span>' +
      '<span class="order-item-name">' + esc(line.dish.name) + '</span>' +
      '<span class="order-item-sum">' + baht(line.sum) + '</span>' +
      '<button type="button" class="order-item-del" data-del="' + esc(line.slug) + '"' +
        ' aria-label="เอา ' + esc(line.dish.name) + ' ออก">×</button>' +
    '</li>'
  ).join('');
}

/* ===== Preview รูปอาหาร ===== */

export function renderPreview(slug, qty) {
  if (!slug) {
    // ปล่อยให้ <img> หยุดโหลดและคืนหน่วยความจำ แทนที่จะค้างรูปเดิมไว้
    els.previewFigure.innerHTML = '';
    if (els.preview.open) els.preview.close();
    return;
  }

  const dish = BY_SLUG.get(slug);
  if (!dish) return;

  els.previewFigure.innerHTML = dish.img
    ? imgHtml(dish, IMG_PREVIEW_BASE, false)
    : emojiFor(dish);
  els.previewTag.textContent = CATEGORY_LABEL[dish.cat] + (dish.rec ? ' · เมนูแนะนำ' : '');
  els.previewName.textContent = dish.name;

  const desc = cleanDesc(dish);
  els.previewDesc.textContent = desc;
  els.previewDesc.hidden = desc === '';

  els.previewPrice.textContent = baht(dish.price);
  els.previewQty.innerHTML = qtyHtml(dish, qty);

  // showModal ดัก Esc และกันโฟกัสหลุดออกนอกกล่องให้เอง
  if (!els.preview.open) els.preview.showModal();
}

/* อัปเดตแค่ปุ่มจำนวนในกล่อง preview ไม่ต้องโหลดรูปใหม่ */
export function renderPreviewQty(slug, qty) {
  if (!slug) return;
  els.previewQty.innerHTML = qtyHtml(BY_SLUG.get(slug), qty);
}

/* ===== ชิปหมวด ===== */

export function renderChips(activeCategory) {
  const all = [{ key: 'all', label: 'ทั้งหมด' }, ...CATEGORIES];
  els.chips.innerHTML = all.map((c) =>
    '<button type="button" class="chip-btn" data-category="' + c.key + '"' +
    ' aria-pressed="' + (c.key === activeCategory) + '">' + esc(c.label) + '</button>'
  ).join('');
}

export function syncChips(activeCategory) {
  els.chips.querySelectorAll('[data-category]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.category === activeCategory));
  });
}

/* ===== เมนูลัดไปแต่ละหมวด ===== */

export function renderNav() {
  els.navList.innerHTML = CATEGORIES.map((c) =>
    '<li><a href="#cat-' + esc(c.key) + '">' + esc(c.word.join(' ')) + '</a></li>'
  ).join('');
}

/* แถบ nav ลอยอยู่บนภาพ hero จนเลื่อนพ้น แล้วกลายเป็นแถบขาวของหน้า
 * ตัวอักษรบนภาพต้องเป็นขาวล้วน ไม่งั้นไม่รอดคอนทราสต์ของรูป */
export function syncNavSolid() {
  const past = window.scrollY > window.innerHeight - 80;
  els.nav.classList.toggle('is-solid', past);
}

/* ===== ข้อมูลร้าน ===== */

/** บอกว่าตอนนี้ร้านเปิดอยู่ไหม
 *  อิงนาฬิกาของเครื่องผู้ใช้ ถ้าเครื่องตั้งคนละโซนเวลากับร้านก็จะเพี้ยนตามนั้น
 *  ร้านเปิดเวลาเดียวกันทุกวัน จึงไม่ต้องแยกวัน
 */
export function isOpenNow(now) {
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= SHOP.openHour && hour < SHOP.closeHour;
}

export function renderHours() {
  const open = isOpenNow(new Date());
  els.hoursText.textContent = open
    ? 'เปิดอยู่ ปิด ' + SHOP.closeHour + ':00'
    : 'ปิดอยู่ เปิด 0' + SHOP.openHour + ':00';
  els.hoursDot.classList.toggle('dot--closed', !open);
}

export function renderShop() {
  els.shopPhones.innerHTML = SHOP.phones.map((p) => {
    const pretty = p.slice(0, 3) + '-' + p.slice(3, 6) + '-' + p.slice(6);
    return '<a class="link" href="tel:' + esc(p) + '">' + esc(pretty) + '</a>';
  }).join(' · ');

  els.mapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + SHOP.lat + ',' + SHOP.lng;
  els.orderLink.href = ORDER_URL;
  els.orderLink2.href = ORDER_URL;
  els.heroPhoto.src = HERO_PHOTO;

  els.footerNote.textContent =
    'เมนู ' + MENU.length + ' รายการ · ราคาคัดลอกมาเมื่อ 20 ก.ย. 2026 อาจไม่ตรงกับหน้าร้านแล้ว · ' +
    'รายการที่เลือกเก็บไว้ในเครื่องนี้เท่านั้น ไม่ได้ส่งไปไหน';
}
