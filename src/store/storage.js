import { BY_SLUG } from '../data/menu.js';
import { MAX_QTY } from './orderSlice.js';

export const STORAGE_KEY = 'chonthong:order';

/** อ่าน Order ที่ค้างอยู่ในเครื่อง
 *  ตัด slug ที่ไม่มีในเมนูปัจจุบันทิ้ง และตัดจำนวนที่ไม่สมเหตุสมผลออก
 *  พังเมื่อไหร่ก็ถือว่าไม่มีอะไรค้างแล้วไปต่อ ไม่รบกวนผู้ใช้
 */
export function loadOrder() {
  const items = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return items;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return items;

    for (const [slug, qty] of Object.entries(parsed)) {
      const n = Math.floor(Number(qty));
      if (BY_SLUG.has(slug) && Number.isFinite(n) && n > 0) {
        items[slug] = Math.min(n, MAX_QTY);
      }
    }
  } catch (err) {
    return {};
  }
  return items;
}

/** เขียน Order ลง localStorage — เบราว์เซอร์ที่ปิด storage ไว้จะ throw ตรงนี้
 *  ปล่อยผ่านเงียบ ๆ เว็บยังใช้งานได้ปกติ แค่จำข้ามครั้งไม่ได้
 */
export function saveOrder(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    /* ไม่ทำอะไร: จำไม่ได้ดีกว่าขึ้น error ขวางหน้า */
  }
}
