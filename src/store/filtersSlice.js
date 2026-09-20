import { createSlice, createSelector } from '@reduxjs/toolkit';
import { MENU, CATEGORIES, BOILERPLATE } from '../data/menu.js';

const initialState = {
  query: '',
  activeCategory: 'all',
  recOnly: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    queryChanged(state, action) {
      state.query = action.payload.trim();
    },
    categoryChanged(state, action) {
      state.activeCategory = action.payload;
    },
    recOnlyToggled(state, action) {
      state.recOnly = action.payload;
    },
  },
});

export const { queryChanged, categoryChanged, recOnlyToggled } = filtersSlice.actions;
export default filtersSlice.reducer;

/* ===== Selectors ===== */

export const selectQuery = (state) => state.filters.query;
export const selectActiveCategory = (state) => state.filters.activeCategory;
export const selectRecOnly = (state) => state.filters.recOnly;

export function cleanDesc(dish) {
  return dish.desc.split(BOILERPLATE).join('').trim();
}

/* createSelector จำผลไว้ให้ ตราบใดที่ตัวกรองไม่เปลี่ยน การกดเพิ่มจำนวน
 * จึงไม่ทำให้ต้องกรองเมนูทั้ง 48 รายการใหม่ */
export const selectVisibleMenu = createSelector(
  [selectQuery, selectActiveCategory, selectRecOnly],
  (query, activeCategory, recOnly) => MENU.filter((dish) => {
    if (activeCategory !== 'all' && dish.cat !== activeCategory) return false;
    if (recOnly && !dish.rec) return false;
    if (query && !dish.name.includes(query) && !cleanDesc(dish).includes(query)) return false;
    return true;
  })
);

/* จัดกลุ่มตามหมวด โดยคงลำดับหมวดตามที่ประกาศไว้ใน CATEGORIES */
export const selectVisibleByCategory = createSelector(
  [selectVisibleMenu],
  (shown) => CATEGORIES
    .map((cat) => ({ cat, dishes: shown.filter((d) => d.cat === cat.key) }))
    .filter((group) => group.dishes.length > 0)
);
