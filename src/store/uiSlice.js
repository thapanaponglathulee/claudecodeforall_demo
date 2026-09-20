import { createSlice } from '@reduxjs/toolkit';

/* สถานะที่เป็นเรื่องของหน้าจอล้วน ๆ ไม่ต้องจำข้ามการเปิดเว็บ
 * จึงแยกออกจาก order ที่ต้องลง localStorage */
const initialState = {
  panelOpen: false,
  previewSlug: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
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

export const { panelToggled, previewOpened, previewClosed } = uiSlice.actions;
export default uiSlice.reducer;

export const selectPanelOpen = (state) => state.ui.panelOpen;
export const selectPreviewSlug = (state) => state.ui.previewSlug;
