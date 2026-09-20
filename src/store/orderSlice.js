import { createSlice, createSelector } from '@reduxjs/toolkit';
import { BY_SLUG } from '../data/menu.js';

export const MAX_QTY = 99;

/* state.items เป็น { slug: จำนวน } เก็บเฉพาะรายการที่จำนวนมากกว่า 0
 * ไม่เก็บชื่อหรือราคาซ้ำลงมา เพราะสองอย่างนั้นแก้ที่ MENU ที่เดียวแล้วจบ */
const initialState = { items: {} };

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    /* RTK ใช้ Immer อยู่ข้างใน จึงเขียนแบบแก้ state ตรง ๆ ได้
     * ไม่ต้อง spread เอง และยังได้ state ใหม่แบบ immutable ตามเดิม */
    changeQty: {
      reducer(state, action) {
        const { slug, delta } = action.payload;
        if (!BY_SLUG.has(slug)) return;

        const next = (state.items[slug] || 0) + delta;
        if (next <= 0) delete state.items[slug];
        else state.items[slug] = Math.min(next, MAX_QTY);
      },
      prepare(slug, delta) {
        return { payload: { slug, delta } };
      },
    },

    removeItem(state, action) {
      delete state.items[action.payload];
    },

    clearOrder(state) {
      state.items = {};
    },

    /* ใช้ตอนโหลดค่าที่ค้างอยู่ในเครื่องกลับเข้ามา ผ่านการกรองมาแล้วจาก storage.js */
    orderRestored(state, action) {
      state.items = action.payload;
    },
  },
});

export const { changeQty, removeItem, clearOrder, orderRestored } = orderSlice.actions;
export default orderSlice.reducer;

/* ===== Selectors ===== */

export const selectOrderItems = (state) => state.order.items;

export const selectQtyOf = (slug) => (state) => state.order.items[slug] || 0;

export const selectOrderCount = createSelector(
  [selectOrderItems],
  (items) => Object.values(items).reduce((sum, qty) => sum + qty, 0)
);

export const selectOrderTotal = createSelector(
  [selectOrderItems],
  (items) => Object.entries(items).reduce(
    (sum, [slug, qty]) => sum + BY_SLUG.get(slug).price * qty,
    0
  )
);

/* รายการในแถบล่าง เรียงตามลำดับที่ผู้ใช้กดเลือก ซึ่งคือลำดับคีย์ของ object */
export const selectOrderLines = createSelector(
  [selectOrderItems],
  (items) => Object.entries(items).map(([slug, qty]) => ({
    slug,
    qty,
    dish: BY_SLUG.get(slug),
    sum: BY_SLUG.get(slug).price * qty,
  }))
);
