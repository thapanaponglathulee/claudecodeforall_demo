import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import orderReducer, { changeQty, removeItem, clearOrder, selectOrderItems } from './orderSlice.js';
import filtersReducer from './filtersSlice.js';
import uiReducer from './uiSlice.js';
import { loadOrder, saveOrder } from './storage.js';

/* เขียนลง localStorage ผ่าน listener middleware แทนที่จะเรียก saveOrder
 * กระจายอยู่ในทุก handler — reducer จึงยังบริสุทธิ์ และมีที่เขียนลงเครื่องแค่ที่เดียว */
const persistence = createListenerMiddleware();

persistence.startListening({
  matcher: isAnyOf(changeQty, removeItem, clearOrder),
  effect: (action, api) => {
    saveOrder(selectOrderItems(api.getState()));
  },
});

export const store = configureStore({
  reducer: {
    order: orderReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  preloadedState: {
    order: { items: loadOrder() },
  },
  middleware: (getDefault) => getDefault().prepend(persistence.middleware),
});
