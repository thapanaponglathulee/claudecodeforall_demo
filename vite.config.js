import { defineConfig } from 'vite';

export default defineConfig({
  /* base แบบ relative ทำให้ dist/ เปิดได้ทั้งจากการ double-click ไฟล์ตรง ๆ
   * และจากการวางไว้ในโฟลเดอร์ย่อยของโดเมน ไม่ต้องอยู่ราก
   * ถ้าเป็น '/' ตามค่าเริ่มต้น ไฟล์ assets จะ 404 ทันทีที่เปิดแบบ file:// */
  base: './',
});
