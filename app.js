/* ช้อนทอง ข้าวแกงเมืองทองธานี — หน้าดูเมนูและคิดราคา
 *
 * ข้อมูลเมนูคัดลอกมาจากหน้าสั่งอาหารของร้านบน Wongnai/LINE MAN เมื่อ 2026-09-20
 * รูปภาพ "ลิงก์" ไปที่ img.wongnai.com ไม่ได้เก็บไฟล์ไว้ในโปรเจกต์นี้
 * ราคาและเมนูเปลี่ยนได้ตลอดที่ร้าน — ตัวเลขในหน้านี้เป็นการประมาณ ไม่ใช่ราคาที่ผูกพัน
 *
 * !! ห้ามแก้ slug ของเมนูที่มีอยู่แล้ว !!
 * slug คือสิ่งที่ค้างอยู่ใน localStorage ของผู้ใช้ เปลี่ยนเมื่อไหร่ตะกร้าที่ค้างไว้หาย
 * ดู docs/adr/0001-stable-slug-ids-for-favourites.md
 */

'use strict';

/* ===== ที่อยู่รูปและลิงก์สั่งจริง ===== */

const IMG_BASE = 'https://img.wongnai.com/p/256x256/';

/* Wongnai เสิร์ฟรูปเฉพาะบางขนาดเท่านั้น 800x0 ผ่านครบทั้ง 46 รูป
 * ส่วน 600x600 กับ 960x0 คืน 404 — อย่าเดาขนาดใหม่โดยไม่ลองยิงดูก่อน */
const IMG_PREVIEW_BASE = 'https://img.wongnai.com/p/800x0/';
const ORDER_URL = 'https://www.wongnai.com/delivery/businesses/3538938OX/order';

/* ===== ข้อมูลร้าน =====
 * จาก JSON-LD ของหน้าร้านบน Wongnai เมื่อ 2026-09-20
 * openHour/closeHour คือเวลาหน้าร้าน ส่วน deliveryClose คือเวลาปิดรับเดลิเวอรี่
 */

const SHOP = {
  name: 'ช้อนทอง ข้าวแกงเมืองทองธานี',
  phones: ['0836066996', '0946954193'],
  lat: 13.910931153543,
  lng: 100.55450705811,
  openHour: 6,
  closeHour: 16,
  deliveryClose: '17:30',
};

/* ===== หมวดเมนู ===== */

/* word = คำ billboard ขนาดยักษ์ประจำหมวด ใช้คำไทยถอดเป็นอักษรโรมัน เพราะ
 * line-height 0.70 ตามสเปกทำให้สระบนกับวรรณยุกต์ของตัวไทยทับกันจนอ่านไม่ออก
 * accent สลับ teal/yellow ไปเรื่อย ๆ — สีของคำคือตัวคั่นหมวดในระบบนี้ */
const CATEGORIES = [
  { key: 'rad-gaeng', label: 'ข้าวราดแกง', word: ['RAD', 'GAENG'], accent: 'teal' },
  { key: 'kabkhao', label: 'กับข้าว', word: ['KAB', 'KHAO'], accent: 'yellow' },
  { key: 'khao', label: 'ข้าว', word: ['KHAO'], accent: 'teal' },
  { key: 'namprik', label: 'น้ำพริก & ท็อปปิ้ง', word: ['NAM', 'PRIK'], accent: 'yellow' },
  { key: 'drink', label: 'เครื่องดื่ม', word: ['DRINKS'], accent: 'teal' },
  { key: 'dessert', label: 'ขนม', word: ['KHANOM'], accent: 'yellow' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

/* หมายเหตุที่ร้านเขียนซ้ำในเกือบทุกจานของหมวดนั้น แสดงครั้งเดียวที่หัวหมวดแทน */
const CATEGORY_NOTE = {
  kabkhao: 'เมนูกับข้าวไม่รวมข้าว ถ้าต้องการข้าวสั่งเพิ่มในหมวด "ข้าว"',
};

/* ข้อความนี้ลงท้ายด้วย 🙏 ในข้อมูลร้าน ถ้าตัดแต่ตัวอักษรจะเหลือ emoji ลอยอยู่บนการ์ด */
const BOILERPLATE = 'เมนูกับข้าว ต้องการข้าวกดสั่งเพิ่มหน้าเมนูข้าวค่ะ 🙏';

/* emoji สำรองตอนรูปโหลดไม่ขึ้น หรือเมนูที่ร้านยังไม่ได้ใส่รูป */
const FALLBACK_EMOJI = {
  'rad-gaeng': '🍛', kabkhao: '🍲', khao: '🍚',
  namprik: '🌶️', drink: '🥤', dessert: '🍪',
};

/* ===== Menu =====
 * ราคาเป็นบาท ตรงตามที่ร้านลงไว้ตอนคัดลอกข้อมูล
 * rec = ร้านจัดให้อยู่ในกลุ่ม "เมนูแนะนำ"
 */

const MENU = [
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

const BY_SLUG = new Map(MENU.map((d) => [d.slug, d]));

/* ===== ตะกร้า — เก็บในเครื่องผู้ใช้เท่านั้น ===== */

const STORAGE_KEY = 'chonthong:order';

/** อ่านตะกร้าจาก localStorage
 *  ตัด slug ที่ไม่มีในเมนูปัจจุบันทิ้ง และตัดจำนวนที่ไม่สมเหตุสมผลออก
 *  พังเมื่อไหร่ก็ถือว่าตะกร้าว่างแล้วไปต่อ ไม่รบกวนผู้ใช้
 */
function loadOrder() {
  const order = new Map();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return order;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return order;
    for (const [slug, qty] of Object.entries(parsed)) {
      const n = Math.floor(Number(qty));
      if (BY_SLUG.has(slug) && Number.isFinite(n) && n > 0) {
        order.set(slug, Math.min(n, MAX_QTY));
      }
    }
  } catch (err) {
    order.clear();
  }
  return order;
}

/** เขียนตะกร้าลง localStorage — เบราว์เซอร์ที่ปิด storage ไว้จะ throw ตรงนี้
 *  ปล่อยผ่านเงียบ ๆ เว็บยังใช้งานได้ปกติ แค่จำตะกร้าข้ามครั้งไม่ได้
 */
function saveOrder() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(order)));
  } catch (err) {
    /* ไม่ทำอะไร: จำไม่ได้ดีกว่าขึ้น error ขวางหน้า */
  }
}

/* ===== สถานะของหน้า ===== */

const MAX_QTY = 99;

const order = loadOrder();
let query = '';            // คำค้นที่พิมพ์อยู่
let activeCategory = 'all'; // ชิปหมวดที่เลือก เลือกได้ทีละหนึ่ง
let recOnly = false;        // สวิตช์ "เฉพาะเมนูแนะนำ"
let panelOpen = false;      // แผงรายละเอียดตะกร้าเปิดอยู่หรือไม่
let navOpen = false;        // รายการลัดไปแต่ละหมวดเปิดอยู่หรือไม่
let previewSlug = null;     // เมนูที่กำลังเปิดดูรูปใหญ่ ไม่เปิดอยู่ = null

const els = {
  search: document.getElementById('search'),
  searchClear: document.getElementById('search-clear'),
  recOnly: document.getElementById('rec-only'),
  chips: document.getElementById('chips'),
  menu: document.getElementById('menu'),
  empty: document.getElementById('empty'),
  resultCount: document.getElementById('result-count'),
  orderBar: document.getElementById('order-bar'),
  orderToggle: document.getElementById('order-toggle'),
  orderPanel: document.getElementById('order-panel'),
  orderList: document.getElementById('order-list'),
  orderCount: document.getElementById('order-count'),
  orderTotal: document.getElementById('order-total'),
  orderClear: document.getElementById('order-clear'),
  orderLink: document.getElementById('order-link'),
  navToggle: document.getElementById('nav-toggle'),
  navList: document.getElementById('nav-list'),
  preview: document.getElementById('preview'),
  previewClose: document.getElementById('preview-close'),
  previewFigure: document.getElementById('preview-figure'),
  previewTag: document.getElementById('preview-tag'),
  previewName: document.getElementById('preview-name'),
  previewDesc: document.getElementById('preview-desc'),
  previewPrice: document.getElementById('preview-price'),
  previewQty: document.getElementById('preview-qty'),
  hoursText: document.getElementById('hours-text'),
  hoursDot: document.getElementById('hours-dot'),
  shopPhones: document.getElementById('shop-phones'),
  mapLink: document.getElementById('map-link'),
  footerNote: document.getElementById('footer-note'),
};

/* ===== ตัวช่วย ===== */

/* ชื่อเมนูมาจากการคัดลอกหน้าเว็บคนอื่น ไม่ใช่ข้อความที่เราพิมพ์เองทั้งหมด
 * จึง escape ก่อนยัดลง innerHTML เสมอ */
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function baht(amount) {
  return '฿' + amount.toLocaleString('th-TH');
}

function cleanDesc(dish) {
  return dish.desc.split(BOILERPLATE).join('').trim();
}

/* ตรวจตอนโหลดว่าการตัดข้อความซ้ำไม่ได้ทิ้งเศษไว้บนการ์ด
 * ข้อมูลเมนูคัดลอกมาจากหน้าร้าน รูปแบบข้อความเปลี่ยนได้โดยเราไม่รู้ตัว */
function warnOnDescLeftovers() {
  const leftovers = MENU.filter((d) => {
    const desc = cleanDesc(d);
    return desc !== '' && desc.length <= 3;
  });
  if (leftovers.length > 0) {
    console.warn('เศษคำอธิบายค้างอยู่ ' + leftovers.length + ' รายการ:',
      leftovers.map((d) => d.slug + '=' + JSON.stringify(cleanDesc(d))).join(', '));
  }
}

function qtyOf(slug) {
  return order.get(slug) || 0;
}

function orderCount() {
  let n = 0;
  for (const qty of order.values()) n += qty;
  return n;
}

function orderTotal() {
  let sum = 0;
  for (const [slug, qty] of order) sum += BY_SLUG.get(slug).price * qty;
  return sum;
}

/* ===== ตัวกรอง ===== */

function matchesFilters(dish) {
  if (activeCategory !== 'all' && dish.cat !== activeCategory) return false;
  if (recOnly && !dish.rec) return false;
  if (query && !dish.name.includes(query) && !cleanDesc(dish).includes(query)) return false;
  return true;
}

/* ===== การ์ดเมนู ===== */

function emojiFor(dish) {
  return FALLBACK_EMOJI[dish.cat] || '🍽️';
}

/* รูปลิงก์ข้ามโดเมน ถ้าวันหนึ่งเจ้าของย้ายไฟล์ ต้องไม่เหลือกรอบรูปแตกค้างไว้
 * base ต่างกันระหว่างการ์ด (256x256) กับ preview (800x0) */
function imgHtml(dish, base, lazy) {
  return '<img src="' + esc(base + dish.img) + '" alt=""' +
    (lazy ? ' loading="lazy"' : '') + ' decoding="async"' +
    ' data-fallback="' + emojiFor(dish) + '">';
}

function thumbHtml(dish) {
  const inner = dish.img
    ? imgHtml(dish, IMG_BASE, true)
    : emojiFor(dish);
  // รูปกดดูขนาดใหญ่ได้ จึงต้องเป็นปุ่มจริงเพื่อให้ใช้คีย์บอร์ดได้ด้วย
  return '<button type="button" class="thumb-btn" data-preview="' + esc(dish.slug) + '"' +
    ' aria-label="ดูรูป ' + esc(dish.name) + ' ขนาดใหญ่">' +
    '<span class="thumb" aria-hidden="true">' + inner + '</span>' +
  '</button>';
}

function qtyHtml(dish) {
  const qty = qtyOf(dish.slug);
  return (qty > 0
      ? '<button type="button" class="qty-btn" data-dec="' + esc(dish.slug) + '" aria-label="ลด ' + esc(dish.name) + '">−</button>' +
        '<span class="qty-num" aria-label="จำนวน ' + qty + '">' + qty + '</span>'
      : '') +
    '<button type="button" class="qty-btn" data-inc="' + esc(dish.slug) + '" aria-label="เพิ่ม ' + esc(dish.name) + '">+</button>';
}

function cardHtml(dish) {
  const qty = qtyOf(dish.slug);
  const desc = cleanDesc(dish);
  return '<li class="card' + (qty > 0 ? ' is-picked' : '') + '" data-slug="' + esc(dish.slug) + '">' +
    thumbHtml(dish) +
    '<p class="card-name">' + esc(dish.name) +
      (dish.rec ? '<span class="card-tag">เมนูแนะนำ</span>' : '') +
    '</p>' +
    (desc ? '<p class="card-desc">' + esc(desc) + '</p>' : '') +
    '<div class="card-foot">' +
      '<p class="card-price">' + baht(dish.price) + '</p>' +
      '<div class="card-qty">' + qtyHtml(dish) + '</div>' +
    '</div>' +
  '</li>';
}

/* Billboard Display Headline — คำยักษ์ประจำหมวด สีสลับ teal/yellow
 * ตัวอักษรทำหน้าที่เป็นตัวคั่นหมวดแทนเส้นหรือแถบสี */
function billboardHtml(cat, extraClass) {
  return '<p class="billboard billboard--' + cat.accent + ' ' + extraClass + '" aria-hidden="true">' +
    cat.word.map((w) => '<span>' + esc(w) + '</span>').join('') +
  '</p>';
}

function sectionHtml(cat, dishes) {
  const note = CATEGORY_NOTE[cat.key];
  return '<section class="cat-block" id="cat-' + esc(cat.key) + '">' +
    '<div class="cat-head">' +
      billboardHtml(cat, 'cat-billboard') +
      '<h3 class="tag">' + esc(cat.label) + ' · ' + dishes.length + ' รายการ</h3>' +
      (note ? '<p class="cat-note">' + esc(note) + '</p>' : '') +
    '</div>' +
    '<ul class="cards">' + dishes.map(cardHtml).join('') + '</ul>' +
  '</section>';
}

/* ===== เรนเดอร์ =====
 * เรนเดอร์ใหม่ทั้งลิสต์เฉพาะตอน "ตัวกรองเปลี่ยน" เท่านั้น
 * การกดเพิ่ม/ลดจำนวนแก้เฉพาะการ์ดใบนั้น เพื่อไม่ให้ลิสต์กระโดดใต้นิ้วผู้ใช้
 */
function renderMenu() {
  const shown = MENU.filter(matchesFilters);

  if (shown.length === 0) {
    els.menu.innerHTML = '';
    els.resultCount.textContent = '';
    els.empty.textContent = query
      ? 'ไม่พบเมนูที่ตรงกับ "' + query + '"'
      : 'ไม่มีเมนูในกลุ่มนี้';
    els.empty.hidden = false;
    return;
  }

  els.empty.hidden = true;
  els.resultCount.textContent = 'แสดง ' + shown.length + ' จาก ' + MENU.length + ' รายการ';

  const blocks = [];
  for (const cat of CATEGORIES) {
    const dishes = shown.filter((d) => d.cat === cat.key);
    if (dishes.length > 0) blocks.push(sectionHtml(cat, dishes));
  }
  els.menu.innerHTML = blocks.join('');
}

function renderCard(slug) {
  const card = els.menu.querySelector('.card[data-slug="' + slug + '"]');
  if (!card) return;
  card.outerHTML = cardHtml(BY_SLUG.get(slug));
}

function renderOrder() {
  const count = orderCount();
  els.orderBar.hidden = count === 0;
  if (count === 0) {
    panelOpen = false;
    els.orderPanel.hidden = true;
    els.orderToggle.setAttribute('aria-expanded', 'false');
    return;
  }

  els.orderCount.textContent = count;
  els.orderTotal.textContent = baht(orderTotal());

  els.orderList.innerHTML = [...order].map(([slug, qty]) => {
    const dish = BY_SLUG.get(slug);
    return '<li class="order-item">' +
      '<span class="order-item-qty">' + qty + '×</span>' +
      '<span class="order-item-name">' + esc(dish.name) + '</span>' +
      '<span class="order-item-sum">' + baht(dish.price * qty) + '</span>' +
      '<button type="button" class="order-item-del" data-del="' + esc(slug) + '"' +
        ' aria-label="เอา ' + esc(dish.name) + ' ออก">×</button>' +
    '</li>';
  }).join('');
}

/* ===== แก้จำนวนในตะกร้า ===== */

function changeQty(slug, delta) {
  if (!BY_SLUG.has(slug)) return;
  const next = qtyOf(slug) + delta;
  if (next <= 0) order.delete(slug);
  else order.set(slug, Math.min(next, MAX_QTY));
  saveOrder();
  renderCard(slug);
  renderPreviewQty();
  renderOrder();
}

function removeFromOrder(slug) {
  if (!order.has(slug)) return;
  order.delete(slug);
  saveOrder();
  renderCard(slug);
  renderPreviewQty();
  renderOrder();
}

/* ===== Preview รูปอาหาร ===== */

function renderPreviewQty() {
  if (!previewSlug) return;
  els.previewQty.innerHTML = qtyHtml(BY_SLUG.get(previewSlug));
}

function openPreview(slug) {
  const dish = BY_SLUG.get(slug);
  if (!dish) return;

  previewSlug = slug;
  els.previewFigure.innerHTML = dish.img
    ? imgHtml(dish, IMG_PREVIEW_BASE, false)
    : emojiFor(dish);
  els.previewTag.textContent = CATEGORY_LABEL[dish.cat] + (dish.rec ? ' · เมนูแนะนำ' : '');
  els.previewName.textContent = dish.name;

  const desc = cleanDesc(dish);
  els.previewDesc.textContent = desc;
  els.previewDesc.hidden = desc === '';

  els.previewPrice.textContent = baht(dish.price);
  renderPreviewQty();

  // showModal ดัก Esc และกันโฟกัสหลุดออกนอกกล่องให้เอง
  els.preview.showModal();
}

function closePreview() {
  previewSlug = null;
  // ปล่อยให้ <img> หยุดโหลดและคืนหน่วยความจำ แทนที่จะค้างรูปเดิมไว้
  els.previewFigure.innerHTML = '';
  if (els.preview.open) els.preview.close();
}

/* ===== รายการลัดไปแต่ละหมวด ===== */

function renderNav() {
  els.navList.innerHTML = CATEGORIES.map((c) =>
    '<li><a href="#cat-' + esc(c.key) + '" data-nav>' + esc(c.word.join(' ')) +
    '<span class="nav-list-th">' + esc(c.label) + '</span></a></li>'
  ).join('');
}

function setNavOpen(open) {
  navOpen = open;
  els.navList.hidden = !open;
  els.navToggle.setAttribute('aria-expanded', String(open));
}

/* ===== ชิปหมวด ===== */

function renderChips() {
  const all = [{ key: 'all', label: 'ทั้งหมด' }, ...CATEGORIES];
  els.chips.innerHTML = all.map((c) =>
    '<button type="button" class="chip-btn" data-category="' + c.key + '"' +
    ' aria-pressed="' + (c.key === activeCategory) + '">' + esc(c.label) + '</button>'
  ).join('');
}

function setCategory(key) {
  if (key === activeCategory) return;
  activeCategory = key;
  els.chips.querySelectorAll('[data-category]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.category === activeCategory));
  });
  renderMenu();
}

/* ===== ผูก event ===== */

els.menu.addEventListener('click', (event) => {
  const inc = event.target.closest('[data-inc]');
  if (inc) { changeQty(inc.dataset.inc, 1); return; }
  const dec = event.target.closest('[data-dec]');
  if (dec) { changeQty(dec.dataset.dec, -1); return; }
  const preview = event.target.closest('[data-preview]');
  if (preview) openPreview(preview.dataset.preview);
});

els.previewQty.addEventListener('click', (event) => {
  const inc = event.target.closest('[data-inc]');
  if (inc) { changeQty(inc.dataset.inc, 1); return; }
  const dec = event.target.closest('[data-dec]');
  if (dec) changeQty(dec.dataset.dec, -1);
});

els.previewClose.addEventListener('click', closePreview);

/* กดพื้นที่นอกกล่อง (::backdrop) ให้ปิด — event.target เป็นตัว <dialog> เองเมื่อกดโดน backdrop */
els.preview.addEventListener('click', (event) => {
  if (event.target === els.preview) closePreview();
});

/* ปิดด้วย Esc ผ่าน showModal ก็ยังต้องล้างสถานะของเราเอง */
els.preview.addEventListener('close', () => {
  previewSlug = null;
  els.previewFigure.innerHTML = '';
});

/* รูปจาก Wongnai อาจหายหรือถูกบล็อก — สลับไปใช้ emoji แทนกรอบรูปแตก
 * error ของ <img> ไม่ bubble จึงต้องดักตอน capture */
function swapToFallback(event) {
  const img = event.target;
  if (!img.matches || !img.matches('.thumb img, .preview-figure img')) return;
  const box = img.parentElement;
  box.textContent = img.dataset.fallback || '🍽️';
}

els.menu.addEventListener('error', swapToFallback, true);
els.preview.addEventListener('error', swapToFallback, true);

els.navToggle.addEventListener('click', () => setNavOpen(!navOpen));

els.navList.addEventListener('click', (event) => {
  if (event.target.closest('[data-nav]')) setNavOpen(false);
});

/* กดที่อื่นนอกเมนูลัดให้ปิด ไม่งั้นมันค้างเกะกะอยู่มุมจอ */
document.addEventListener('click', (event) => {
  if (!navOpen) return;
  if (event.target.closest('.nav-menu')) return;
  setNavOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navOpen) setNavOpen(false);
});

els.search.addEventListener('input', () => {
  query = els.search.value.trim();
  els.searchClear.hidden = query === '';
  renderMenu();
});

els.searchClear.addEventListener('click', () => {
  els.search.value = '';
  query = '';
  els.searchClear.hidden = true;
  els.search.focus();
  renderMenu();
});

els.recOnly.addEventListener('change', () => {
  recOnly = els.recOnly.checked;
  renderMenu();
});

els.chips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-category]');
  if (chip) setCategory(chip.dataset.category);
});

els.orderToggle.addEventListener('click', () => {
  panelOpen = !panelOpen;
  els.orderPanel.hidden = !panelOpen;
  els.orderToggle.setAttribute('aria-expanded', String(panelOpen));
});

els.orderList.addEventListener('click', (event) => {
  const del = event.target.closest('[data-del]');
  if (del) removeFromOrder(del.dataset.del);
});

els.orderClear.addEventListener('click', () => {
  const slugs = [...order.keys()];
  order.clear();
  saveOrder();
  slugs.forEach(renderCard);
  renderOrder();
});

/* ===== ข้อมูลร้านบนหน้า ===== */

/** บอกว่าตอนนี้ร้านเปิดอยู่ไหม
 *  อิงนาฬิกาของเครื่องผู้ใช้ ถ้าเครื่องตั้งคนละโซนเวลากับร้านก็จะเพี้ยนตามนั้น
 *  ร้านเปิดเวลาเดียวกันทุกวัน จึงไม่ต้องแยกวัน
 */
function isOpenNow(now) {
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= SHOP.openHour && hour < SHOP.closeHour;
}

function renderHours() {
  const open = isOpenNow(new Date());
  els.hoursText.textContent = open
    ? 'เปิดอยู่ ปิด ' + SHOP.closeHour + ':00'
    : 'ปิดอยู่ เปิด 0' + SHOP.openHour + ':00';
  els.hoursDot.classList.toggle('dot--closed', !open);
}

function renderShop() {
  els.shopPhones.innerHTML = SHOP.phones.map((p) => {
    const pretty = p.slice(0, 3) + '-' + p.slice(3, 6) + '-' + p.slice(6);
    return '<a href="tel:' + esc(p) + '">' + esc(pretty) + '</a>';
  }).join(' · ');

  els.mapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + SHOP.lat + ',' + SHOP.lng;
}

/* ===== เริ่มต้น ===== */

els.orderLink.href = ORDER_URL;

els.footerNote.textContent =
  'เมนู ' + MENU.length + ' รายการ · ราคาคัดลอกมาเมื่อ 20 ก.ย. 2026 อาจไม่ตรงกับหน้าร้านแล้ว · ' +
  'รายการที่เลือกเก็บไว้ในเครื่องนี้เท่านั้น ไม่ได้ส่งไปไหน';

warnOnDescLeftovers();
renderHours();
renderShop();
renderNav();
renderChips();
renderMenu();
renderOrder();

/* หน้าเปิดค้างไว้ข้ามช่วงเปิด-ปิดได้ ป้ายบอกสถานะจึงต้องตามเวลาจริง */
setInterval(renderHours, 60 * 1000);
