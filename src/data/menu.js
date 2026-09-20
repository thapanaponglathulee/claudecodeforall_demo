/* ข้อมูลเมนูและข้อมูลร้าน — คัดลอกจากหน้าร้านบน Wongnai เมื่อ 2026-09-20
 *
 * เป็นสแนปช็อต ไม่ได้ดึงสด หน้านี้ไม่มี backend และการยิงตรงจากเบราว์เซอร์
 * ไปหน้าคนอื่นติด CORS อยู่แล้ว
 *
 * !! ห้ามแก้ slug ของเมนูที่มีอยู่แล้ว !!
 * slug คือสิ่งที่ค้างอยู่ใน localStorage ของผู้ใช้ เปลี่ยนเมื่อไหร่ Order ที่ค้างไว้หาย
 * ดู docs/adr/0001-stable-slug-ids-for-favourites.md
 */

export const IMG_BASE = 'https://img.wongnai.com/p/256x256/';

/* Wongnai เสิร์ฟรูปเฉพาะบางขนาดเท่านั้น 800x0 ผ่านครบทั้ง 46 รูป
 * ส่วน 600x600 กับ 960x0 คืน 404 — อย่าเดาขนาดใหม่โดยไม่ลองยิงดูก่อน */
export const IMG_PREVIEW_BASE = 'https://img.wongnai.com/p/800x0/';

export const ORDER_URL = 'https://www.wongnai.com/delivery/businesses/3538938OX/order';

/* รูปหน้าร้านจาก JSON-LD ของ Wongnai ใช้เป็นภาพเต็มจอของ hero
 * ระบบนี้ให้ภาพถ่ายทำงานด้านอารมณ์ทั้งหมด UI จึงไม่มีสีเลย */
export const HERO_PHOTO = 'https://img.wongnai.com/p/1920x0/2025/11/08/b11109856d824eebb6f8bc4f0c78e4ca.jpg';

/* ===== ข้อมูลร้าน =====
 * จาก JSON-LD ของหน้าร้านบน Wongnai
 * openHour/closeHour คือเวลาหน้าร้าน ส่วน deliveryClose คือเวลาปิดรับเดลิเวอรี่ */
export const SHOP = {
  name: 'ช้อนทอง ข้าวแกงเมืองทองธานี',
  phones: ['0836066996', '0946954193'],
  lat: 13.910931153543,
  lng: 100.55450705811,
  openHour: 6,
  closeHour: 16,
  deliveryClose: '17:30',
};

/* ===== หมวดเมนู =====
 * word = คำไทยถอดเป็นอักษรโรมัน ใช้เป็น tracked uppercase label ประจำหมวด
 * และเป็นลิงก์ใน nav ระบบนี้ไม่มีสีเน้น หมวดจึงแยกกันด้วยที่ว่างกับเส้น 1px */
export const CATEGORIES = [
  { key: 'rad-gaeng', label: 'ข้าวราดแกง', word: ['RAD', 'GAENG'] },
  { key: 'kabkhao', label: 'กับข้าว', word: ['KAB', 'KHAO'] },
  { key: 'khao', label: 'ข้าว', word: ['KHAO'] },
  { key: 'namprik', label: 'น้ำพริก & ท็อปปิ้ง', word: ['NAM', 'PRIK'] },
  { key: 'drink', label: 'เครื่องดื่ม', word: ['DRINKS'] },
  { key: 'dessert', label: 'ขนม', word: ['KHANOM'] },
];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

/* หมายเหตุที่ร้านเขียนซ้ำในเกือบทุกจานของหมวดนั้น แสดงครั้งเดียวที่หัวหมวดแทน */
export const CATEGORY_NOTE = {
  kabkhao: 'เมนูกับข้าวไม่รวมข้าว ถ้าต้องการข้าวสั่งเพิ่มในหมวด "ข้าว"',
};

/* ข้อความนี้ลงท้ายด้วย 🙏 ในข้อมูลร้าน ถ้าตัดแต่ตัวอักษรจะเหลือ emoji ลอยอยู่บนการ์ด */
export const BOILERPLATE = 'เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏';

/* emoji สำรองตอนรูปโหลดไม่ขึ้น หรือเมนูที่ร้านยังไม่ได้ใส่รูป */
export const FALLBACK_EMOJI = {
  'rad-gaeng': '🍛', kabkhao: '🍲', khao: '🍚',
  namprik: '🌶️', drink: '🥤', dessert: '🍪',
};

/* ===== Menu =====
 * ราคาเป็นบาท ตรงตามที่ร้านลงไว้ตอนคัดลอกข้อมูล
 * rec = ร้านจัดให้อยู่ในกลุ่ม "เมนูแนะนำ" */
export const MENU = [
  { slug: "khao-rad-1", name: "ข้าวราด 1 อย่าง", price: 70, cat: "rad-gaeng",
    img: "2026/09/09/b7caa0d4fccc439a892b12111f5732b6.jpg", rec: true, desc: "เลือกเมนูได้ค่ะ" },
  { slug: "khao-rad-2", name: "ข้าวราดแกง 2 อย่าง", price: 80, cat: "rad-gaeng",
    img: "2026/09/09/64ab9a33a37a481f9876a30a280364da.jpg", rec: true, desc: "เลือกเมนูได้ค่ะ" },
  { slug: "khao-rad-3", name: "ข้าวราดแกง 3 อย่าง", price: 90, cat: "rad-gaeng",
    img: "2026/09/18/84f2d457e0af42359cee92144817aedd.jpg", rec: false, desc: "เลือกเมนูได้ค่ะ" },
  { slug: "palo-moo-sam-chan", name: "พะโล้หมูสามชั้น", price: 70, cat: "kabkhao",
    img: "2026/09/12/83849f05540747669ee10d9effbbbd6a.jpg", rec: true, desc: "พะโล้ ใช้ไข่เป็ด เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "panaeng-moo", name: "พะแนงหมู", price: 80, cat: "kabkhao",
    img: "2026/09/09/8748935d30fd4238b0ed21997a0be818.jpg", rec: true, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "pla-pad-khuen-chai", name: "ปลาผัดขึ้นฉ่าย", price: 80, cat: "kabkhao",
    img: "2026/09/15/78f082f0aa9f433faa6f9d92476c876f.jpg", rec: true, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "pad-pak-ruam-moo", name: "ผัดผักรวมหมู", price: 80, cat: "kabkhao",
    img: "2026/09/09/4cdf477ce07c484bb124027187e40e4a.jpg", rec: true, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "khiao-wan-kai", name: "เขียวหวานไก่", price: 80, cat: "kabkhao",
    img: "2026/09/09/f2b6ef72a9814f90a54531ebb65af27d.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "tom-jued-taohu", name: "ต้มจืดเต้าหู้หมูสับ", price: 80, cat: "kabkhao",
    img: "2026/09/09/61dfeb25f19b4e869d5658463c39ec87.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "pad-prik-gaeng-moo", name: "ผัดพริกแกงหมูถั่วฝักยาว", price: 80, cat: "kabkhao",
    img: "2026/09/11/f565d6ddcd034201ad283ea2bb8d06e1.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "kai-kratiam", name: "ไก่กระเทียม", price: 80, cat: "kabkhao",
    img: "2026/09/12/a934f50038a14074ae9562ac2c430a1b.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "kaprao-moo-sab", name: "กะเพราหมูสับ", price: 80, cat: "kabkhao",
    img: "2026/09/15/c5201aa4f6c94271940c95e4ea3f9b6d.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "kalampli-pad-nampla", name: "กะหล่ำปลีผัดน้ำปลา", price: 80, cat: "kabkhao",
    img: "2026/09/15/253f32de243142b59b9fbac1e98fce2d.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "pad-normai-lookchin", name: "ผัดหน่อไม้ใส่ลูกชิ้น", price: 80, cat: "kabkhao",
    img: "2026/09/15/c98a596501af4b62b181ca2b92694e14.jpg", rec: false, desc: "" },
  { slug: "gaeng-som-pak-ruam", name: "แกงส้มผักรวม", price: 80, cat: "kabkhao",
    img: "2026/09/15/c0ed12e080174d429c3c5305add2bdd5.jpg", rec: false, desc: "เนื้อปลานิลตำละเอียด เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "pad-fak-thong", name: "ผัดฟักทอง", price: 80, cat: "kabkhao",
    img: "2026/09/16/632996e214ab4359933cdcdd5789c2bd.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "moo-pad-prik-yuak", name: "หมูผัดพริกหยวก", price: 80, cat: "kabkhao",
    img: "2026/09/17/fd954f2573ee4223af751e4a4d8aab24.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "tom-kha-kai", name: "ต้มข่าไก่", price: 80, cat: "kabkhao",
    img: "2026/09/18/102be966faec473ea4d7e3c9502ddcbe.jpg", rec: false, desc: "เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏" },
  { slug: "buap-pad-khai", name: "บวบผัดไข่", price: 80, cat: "kabkhao",
    img: "2026/09/19/434ead1ab7d2496bbb73c02e51448dfc.jpg", rec: false, desc: "" },
  { slug: "gaeng-tepo", name: "แกงเทโพ", price: 80, cat: "kabkhao",
    img: "2026/09/20/92a5cafa76d4486e8d1cd31f1cf73ef2.jpg", rec: false, desc: "" },
  { slug: "khao-hom-mali", name: "ข้าวหอมมะลิ", price: 15, cat: "khao",
    img: null, rec: false, desc: "" },
  { slug: "khao-riceberry", name: "ข้าวไรซ์เบอร์รี่", price: 15, cat: "khao",
    img: "2026/09/18/765bb19166614716a5a85a3e8734d550.jpg", rec: false, desc: "" },
  { slug: "kunchiang-moo", name: "กุนเชียงหมูหั่นชิ้น", price: 20, cat: "namprik",
    img: "2026/09/15/1e6335462886418980d4b237c54568da.jpg", rec: false, desc: "จะได้ 4-5 ชิ้น" },
  { slug: "peek-kai-tod", name: "ปีกไก่ทอด", price: 20, cat: "namprik",
    img: null, rec: false, desc: "" },
  { slug: "moo-yor-tod", name: "หมูยอทอด", price: 20, cat: "namprik",
    img: "2026/09/19/0151d387414c4058ad0ebcf7bbec1ace.jpg", rec: false, desc: "1 ชิ้น" },
  { slug: "khai-cha-om", name: "ไข่ชะอม", price: 25, cat: "namprik",
    img: "2026/09/13/60e1c7a74f5d47d194d2a6e694a360d5.jpg", rec: false, desc: "จะได้5-6ชิ้น" },
  { slug: "nam-prik-kapi", name: "น้ำพริกกะปิ", price: 25, cat: "namprik",
    img: "2026/09/15/4a9882e576c440af9cc38689f824822a.jpg", rec: false, desc: "" },
  { slug: "pla-tu-tod", name: "ปลาทูทอด", price: 45, cat: "namprik",
    img: "2026/09/15/8c3b4813de74466ca85f29b46a6b49cc.jpg", rec: false, desc: "" },
  { slug: "set-nam-prik-s", name: "ชุดน้ำพริกกะปิ (เล็ก)", price: 50, cat: "namprik",
    img: "2026/09/09/c44f1b81f4c04ebdb98d63e598afce94.jpg", rec: false, desc: "น้ำพริกกะปิ พร้อมผัก" },
  { slug: "set-nam-prik-m", name: "ชุดน้ำพริกกะปิ (กลาง)", price: 70, cat: "namprik",
    img: "2026/09/09/d5d6d72211084bc38c7312b8bea8b93c.jpg", rec: true, desc: "น้ำพริกกะปิ พร้อมผัก + ไข่ชะอม" },
  { slug: "set-nam-prik-l", name: "ชุดน้ำพริกกะปิ (ใหญ่)", price: 100, cat: "namprik",
    img: "2026/09/09/f5acbac3ff6940e993b04af462fd558f.jpg", rec: true, desc: "น้ำพริกกะปิ พร้อมผัก + ไข่ชะอม + ปลาทู" },
  { slug: "nam-khaeng", name: "น้ำแข็ง", price: 5, cat: "drink",
    img: "2026/09/14/1e51b9e43a364aa485dbe4b09ca462b4.jpg", rec: false, desc: "" },
  { slug: "nam-plao", name: "น้ำเปล่า", price: 15, cat: "drink",
    img: "2026/09/12/7c549e99cd3e40eda43a20c3dd62e66f.jpg", rec: false, desc: "550 ml" },
  { slug: "nam-rae", name: "น้ำแร่", price: 25, cat: "drink",
    img: "2026/09/12/fe0e953c422f4fafb66babe94c63c387.jpg", rec: false, desc: "" },
  { slug: "coke-zero-bottle", name: "โค้ก ไม่มีน้ำตาล ขวดพลาสติก", price: 25, cat: "drink",
    img: "2026/09/13/fd588dfe10a44e93b5c24ac6770530ce.jpg", rec: false, desc: "330 ml" },
  { slug: "nam-kek-huay", name: "น้ำเก๊กฮวย", price: 30, cat: "drink",
    img: "2026/09/14/37ccbd25a5d6490e878cdc7537c84f92.jpg", rec: true, desc: "" },
  { slug: "coke-zero-can", name: "โค้ก ไม่มีน้ำตาล กระป๋อง", price: 30, cat: "drink",
    img: "2026/09/12/4092d8b0c7154befb8f8d9f30eba3124.jpg", rec: false, desc: "" },
  { slug: "schweppes-manao", name: "ชเวปส์มะนาว", price: 30, cat: "drink",
    img: "2026/09/13/9c633d735cf84bdcb04e748fcbdb1c90.jpg", rec: false, desc: "" },
  { slug: "nam-krachiap", name: "น้ำกระเจี๊ยบ", price: 30, cat: "drink",
    img: "2026/09/14/ad5b630fa93d45e1b2258ab5ed925c88.jpg", rec: false, desc: "" },
  { slug: "khao-tom-mad-tua", name: "ข้าวต้มมัด ไส้ถั่ว", price: 20, cat: "dessert",
    img: "2026/09/11/e4bf783848cf4b35af9b00ec86658169.jpg", rec: false, desc: "" },
  { slug: "khanom-kha-kai", name: "ขนมขาไก่", price: 25, cat: "dessert",
    img: "2026/09/14/8002d767513e487c81c19231be6675af.jpg", rec: false, desc: "" },
  { slug: "pang-krob-sapparod", name: "ปังกรอบไส้สับปะรด", price: 25, cat: "dessert",
    img: "2026/09/14/7d6af88f41c44de58f19521799ff8292.jpg", rec: false, desc: "" },
  { slug: "cookie-singapore", name: "คุกกี้สิงคโปร์", price: 25, cat: "dessert",
    img: "2026/09/14/cc22df5411c94cf8a8a842bf01bb1091.jpg", rec: false, desc: "" },
  { slug: "tako-phuak", name: "ตะโก้เผือก", price: 25, cat: "dessert",
    img: "2026/09/19/b7c976f9b5094e0f9a383bbf45d1ceea.jpg", rec: false, desc: "" },
  { slug: "khanom-sai-sai", name: "ขนมใส่ไส้", price: 40, cat: "dessert",
    img: "2026/09/11/90f62031701249339dca581af2c459ca.jpg", rec: true, desc: "2 ห่อ" },
  { slug: "soft-cookie-almond", name: "ซอฟคุกกี้ อัลมอนด์", price: 40, cat: "dessert",
    img: "2026/09/14/eef430a2cfd144db92363705d0c11c80.jpg", rec: true, desc: "" },
  { slug: "soft-cookie-red-velvet", name: "ซอฟคุกกี้ เรดเวลเวท", price: 45, cat: "dessert",
    img: "2026/09/14/0e689f5c1818443a9cf103f8623ddcf0.jpg", rec: true, desc: "" },
  { slug: "soft-cookie-chocolate", name: "ซอฟคุกกี้ ช็อคโกแลต", price: 45, cat: "dessert",
    img: "2026/09/14/61d9a5d76f18424aabdabca64cf168e1.jpg", rec: true, desc: "" },
];

export const BY_SLUG = new Map(MENU.map((d) => [d.slug, d]));
