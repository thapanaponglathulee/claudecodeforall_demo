import { createSlice } from '@reduxjs/toolkit';

/* สถานะที่เป็นเรื่องของหน้าจอล้วน ๆ ไม่ต้องจำข้ามการเปิดเว็บ
 * จึงแยกออกจาก order ที่ต้องลง localStorage */
const initialState = {
  navOpen: false,
  panelOpen: false,
  previewSlug: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    navToggled(state, action) {
      state.navOpen = action.payload ?? !state.navOpen;
    },
    panelToggled(state, action) {
      state.panelOpen = action.payload ?? !state.panelOpen;
    },
    previewOpened(state, action) {
      state.previewSlug = action.payload;
    },
    previewClosed(state) {
      state.previewSlug = null;
    },
  },
});

export const { navToggled, panelToggled, previewOpened, previewClosed } = uiSlice.actions;
export default uiSlice.reducer;

export const selectNavOpen = (state) => state.ui.navOpen;
export const selectPanelOpen = (state) => state.ui.panelOpen;
export const selectPreviewSlug = (state) => state.ui.previewSlug;
