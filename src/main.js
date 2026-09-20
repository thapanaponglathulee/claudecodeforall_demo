import { store } from './store/index.js';
import { els } from './ui/dom.js';
import {
  renderMenu, renderCard, renderOrder, renderPreview, renderPreviewQty,
  renderChips, syncChips, renderNav, syncNavSolid, renderHours, renderShop,
} from './ui/render.js';

import {
  changeQty, removeItem, clearOrder,
  selectOrderItems, selectOrderCount, selectOrderTotal, selectOrderLines,
} from './store/orderSlice.js';
import {
  queryChanged, categoryChanged, recOnlyToggled,
  selectQuery, selectActiveCategory, selectRecOnly,
  selectVisibleMenu, selectVisibleByCategory,
} from './store/filtersSlice.js';
import {
  panelToggled, previewOpened, previewClosed,
  selectPanelOpen, selectPreviewSlug,
} from './store/uiSlice.js';

/* ===== เชื่อม store เข้ากับหน้าจอ =====
 * ไม่วาดใหม่ทั้งหน้าทุกครั้งที่ state ขยับ แต่เทียบทีละส่วนว่าอะไรเปลี่ยน
 * เหตุผลสำคัญ: การกดเพิ่ม/ลดจำนวนต้องไม่ทำให้ลิสต์ทั้งก้อนถูกวาดใหม่
 * ไม่งั้นการ์ดจะกระโดดใต้นิ้วผู้ใช้
 *
 * selectVisibleByCategory เป็น createSelector จึงคืน reference เดิม
 * ตราบใดที่ตัวกรองไม่เปลี่ยน ใช้เทียบด้วย !== ได้ตรง ๆ
 */
let prev = {
  groups: null,
  items: null,
  activeCategory: null,
  previewSlug: null,
  orderSignature: null,
};

function sync() {
  const state = store.getState();

  const groups = selectVisibleByCategory(state);
  const items = selectOrderItems(state);
  const previewSlug = selectPreviewSlug(state);

  if (groups !== prev.groups) {
    renderMenu(groups, selectVisibleMenu(state).length, selectQuery(state), items);
  } else if (items !== prev.items) {
    // มีแค่ slug เดียวที่เปลี่ยนต่อหนึ่ง action แต่เทียบทั้งชุดไว้ก่อนเพื่อความปลอดภัย
    const touched = new Set([...Object.keys(items), ...Object.keys(prev.items || {})]);
    for (const slug of touched) {
      const now = items[slug] || 0;
      const before = (prev.items || {})[slug] || 0;
      if (now !== before) renderCard(slug, now);
    }
  }

  const activeCategory = selectActiveCategory(state);
  if (activeCategory !== prev.activeCategory) syncChips(activeCategory);

  const count = selectOrderCount(state);
  const total = selectOrderTotal(state);
  const panelOpen = selectPanelOpen(state);
  const orderSignature = count + '/' + total + '/' + panelOpen;
  if (orderSignature !== prev.orderSignature) {
    renderOrder(selectOrderLines(state), count, total, panelOpen);
  }

  if (previewSlug !== prev.previewSlug) {
    renderPreview(previewSlug, items[previewSlug] || 0);
  } else if (previewSlug && items !== prev.items) {
    renderPreviewQty(previewSlug, items[previewSlug] || 0);
  }

  prev = { groups, items, activeCategory, previewSlug, orderSignature };
}

store.subscribe(sync);

/* ===== ผูก event ===== */

function qtyClick(event) {
  const inc = event.target.closest('[data-inc]');
  if (inc) { store.dispatch(changeQty(inc.dataset.inc, 1)); return true; }
  const dec = event.target.closest('[data-dec]');
  if (dec) { store.dispatch(changeQty(dec.dataset.dec, -1)); return true; }
  return false;
}

els.menu.addEventListener('click', (event) => {
  if (qtyClick(event)) return;
  const preview = event.target.closest('[data-preview]');
  if (preview) store.dispatch(previewOpened(preview.dataset.preview));
});

els.previewQty.addEventListener('click', qtyClick);
els.previewClose.addEventListener('click', () => store.dispatch(previewClosed()));

/* กดพื้นที่นอกกล่อง (::backdrop) ให้ปิด — event.target เป็นตัว <dialog> เองเมื่อกดโดน backdrop */
els.preview.addEventListener('click', (event) => {
  if (event.target === els.preview) store.dispatch(previewClosed());
});

/* ปิดด้วย Esc เป็นกลไกของ <dialog> เอง store จึงต้องตามให้ทัน */
els.preview.addEventListener('close', () => {
  if (selectPreviewSlug(store.getState())) store.dispatch(previewClosed());
});

/* รูปจาก Wongnai อาจหายหรือถูกบล็อก — สลับไปใช้ emoji แทนกรอบรูปแตก
 * error ของ <img> ไม่ bubble จึงต้องดักตอน capture */
function swapToFallback(event) {
  const img = event.target;
  if (!img.matches || !img.matches('.thumb img, .preview-figure img')) return;
  img.parentElement.textContent = img.dataset.fallback || '🍽️';
}

els.menu.addEventListener('error', swapToFallback, true);
els.preview.addEventListener('error', swapToFallback, true);

els.search.addEventListener('input', () => {
  store.dispatch(queryChanged(els.search.value));
  els.searchClear.hidden = els.search.value.trim() === '';
});

els.searchClear.addEventListener('click', () => {
  els.search.value = '';
  els.searchClear.hidden = true;
  els.search.focus();
  store.dispatch(queryChanged(''));
});

els.recOnly.addEventListener('change', () => {
  store.dispatch(recOnlyToggled(els.recOnly.checked));
});

els.chips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-category]');
  if (chip) store.dispatch(categoryChanged(chip.dataset.category));
});

els.orderToggle.addEventListener('click', () => store.dispatch(panelToggled()));

els.orderList.addEventListener('click', (event) => {
  const del = event.target.closest('[data-del]');
  if (del) store.dispatch(removeItem(del.dataset.del));
});

els.orderClear.addEventListener('click', () => store.dispatch(clearOrder()));

/* แถบ nav ลอยบนภาพ hero จนเลื่อนพ้นแล้วจึงกลายเป็นแถบขาว
 * passive: true เพราะไม่ได้ preventDefault จะได้ไม่ขวางการเลื่อน */
window.addEventListener('scroll', syncNavSolid, { passive: true });
window.addEventListener('resize', syncNavSolid);

/* ===== เริ่มต้น ===== */

renderHours();
renderShop();
renderNav();
syncNavSolid();
renderChips(selectActiveCategory(store.getState()));
sync();

/* วาดรอบแรกด้วยมือ เพราะ store.subscribe จะยิงก็ต่อเมื่อมี action เข้ามาเท่านั้น */
const first = store.getState();
renderMenu(
  selectVisibleByCategory(first),
  selectVisibleMenu(first).length,
  selectQuery(first),
  selectOrderItems(first)
);
renderOrder(
  selectOrderLines(first),
  selectOrderCount(first),
  selectOrderTotal(first),
  selectPanelOpen(first)
);

/* หน้าเปิดค้างไว้ข้ามช่วงเปิด-ปิดได้ ป้ายบอกสถานะจึงต้องตามเวลาจริง */
setInterval(renderHours, 60 * 1000);
