/* วันนี้กินอะไรดี — แนะนำอาหารไทย
 *
 * ศัพท์ที่ใช้ในไฟล์นี้อ้างอิง CONTEXT.md: Dish, Pool, Favourite, Featured Dish,
 * Category, Spicy
 *
 * !! ห้ามแก้ slug ของจานที่มีอยู่แล้ว !!
 * slug คือสิ่งที่ค้างอยู่ใน localStorage ของผู้ใช้ การเปลี่ยนเท่ากับทำ Favourite
 * ของคนที่เคยกดไว้หาย — ดู docs/adr/0001-stable-slug-ids-for-favourites.md
 */

'use strict';

/* ===== Category ===== */

const CATEGORIES = [
  { key: 'single',  label: 'จานเดียว' },
  { key: 'side',    label: 'กับข้าว' },
  { key: 'yum',     label: 'ยำ-น้ำพริก' },
  { key: 'dessert', label: 'ของหวาน' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

/* ===== Pool =====
 * เน้นจานที่สั่งกินจริงในชีวิตประจำวัน ไม่ใช่จานดังที่หาซื้อยาก
 * spicy เป็นการประมาณของคนเขียนลิสต์ ไม่ใช่ค่าที่วัดจริง
 */

const DISHES = [
  // --- จานเดียว (12) ---
  { slug: 'pad-krapow-moo', name: 'ผัดกะเพราหมูสับไข่ดาว', nameEn: 'Pad Krapow Moo',
    emoji: '🌿', category: 'single', spicy: 2,
    desc: 'คำตอบมาตรฐานของคนคิดไม่ออก หมูสับผัดกะเพราพริกกระเทียม ราดข้าวสวยร้อน ๆ กับไข่ดาวกรอบขอบ' },
  { slug: 'khao-man-gai', name: 'ข้าวมันไก่', nameEn: 'Khao Man Gai',
    emoji: '🍗', category: 'single', spicy: 0,
    desc: 'ไก่ต้มนุ่มบนข้าวหุงมันไก่ กินกับน้ำจิ้มเต้าเจี้ยวขิงที่เผ็ดแค่ไหนอยู่ที่มือเราเอง' },
  { slug: 'khao-mu-daeng', name: 'ข้าวหมูแดง', nameEn: 'Khao Mu Daeng',
    emoji: '🍖', category: 'single', spicy: 0,
    desc: 'หมูแดงหั่นบางราดน้ำราดหวานเค็ม มักมาคู่หมูกรอบกับไข่ต้มและแตงกวา' },
  { slug: 'pad-thai', name: 'ผัดไทยกุ้งสด', nameEn: 'Pad Thai',
    emoji: '🍤', category: 'single', spicy: 0,
    desc: 'เส้นจันท์ผัดน้ำมะขามเปียก โรยถั่วป่นบีบมะนาว ปรุงความเผ็ดเพิ่มเองด้วยพริกป่น' },
  { slug: 'khao-pad-moo', name: 'ข้าวผัดหมู', nameEn: 'Khao Pad Moo',
    emoji: '🍚', category: 'single', spicy: 0,
    desc: 'ข้าวผัดจานง่ายที่ทุกร้านทำได้ ขาดไม่ได้คือมะนาวฝานกับน้ำปลาพริก' },
  { slug: 'guay-teow-nam-moo', name: 'ก๋วยเตี๋ยวหมูน้ำใส', nameEn: 'Guay Teow Nam Moo',
    emoji: '🍜', category: 'single', spicy: 1,
    desc: 'น้ำซุปใสกับหมูสับหมูชิ้นและลูกชิ้น มื้อเบาที่ปรุงรสเองได้ครบจากเครื่องปรุงสี่ถ้วย' },
  { slug: 'khao-kha-moo', name: 'ข้าวขาหมู', nameEn: 'Khao Kha Moo',
    emoji: '🐷', category: 'single', spicy: 1,
    desc: 'ขาหมูตุ๋นเปื่อยราดข้าว มากับน้ำจิ้มพริกกระเทียมเปรี้ยวและผักกาดดอง' },
  { slug: 'khao-soi-gai', name: 'ข้าวซอยไก่', nameEn: 'Khao Soi Gai',
    emoji: '🍲', category: 'single', spicy: 2,
    desc: 'เส้นบะหมี่ในน้ำแกงกะทิเครื่องเทศแบบเหนือ โรยเส้นทอดกรอบ กินกับผักดองกับหอมแดง' },
  { slug: 'rad-na-moo', name: 'ราดหน้าหมู', nameEn: 'Rad Na Moo',
    emoji: '🥬', category: 'single', spicy: 0,
    desc: 'เส้นใหญ่ผัดซีอิ๊วราดน้ำข้นกับคะน้า เติมพริกน้ำส้มแล้วรสชาติเปลี่ยนไปเลย' },
  { slug: 'pad-see-ew', name: 'ผัดซีอิ๊ว', nameEn: 'Pad See Ew',
    emoji: '🥢', category: 'single', spicy: 0,
    desc: 'เส้นใหญ่ผัดไฟแรงกับไข่และคะน้า หอมกระทะแบบที่ทำเองที่บ้านยากจะเหมือน' },
  { slug: 'khao-kai-jeow', name: 'ข้าวไข่เจียว', nameEn: 'Khao Kai Jeow',
    emoji: '🍳', category: 'single', spicy: 0,
    desc: 'ไข่เจียวฟูกรอบบนข้าวสวย ราดซอสพริกแล้วจบ มื้อที่ไม่เคยทำให้ผิดหวัง' },
  { slug: 'ba-mee-moo-daeng', name: 'บะหมี่หมูแดง', nameEn: 'Ba Mee Moo Daeng',
    emoji: '🍥', category: 'single', spicy: 0,
    desc: 'บะหมี่เหลืองเหนียวนุ่มกับหมูแดงและเกี๊ยว สั่งแห้งหรือน้ำก็ได้ตามอารมณ์' },

  // --- กับข้าว (9) ---
  { slug: 'tom-yum-kung', name: 'ต้มยำกุ้ง', nameEn: 'Tom Yum Kung',
    emoji: '🦐', category: 'side', spicy: 3,
    desc: 'เปรี้ยวเผ็ดร้อนจากตะไคร้ใบมะกรูดข่าและพริก สั่งน้ำข้นหรือน้ำใสเป็นเรื่องที่เถียงกันไม่จบ' },
  { slug: 'gaeng-keow-wan-gai', name: 'แกงเขียวหวานไก่', nameEn: 'Gaeng Keow Wan Gai',
    emoji: '🥥', category: 'side', spicy: 2,
    desc: 'แกงกะทิเขียวหอมใบโหระพา กินกับข้าวสวยหรือขนมจีนก็เข้ากัน' },
  { slug: 'tom-kha-gai', name: 'ต้มข่าไก่', nameEn: 'Tom Kha Gai',
    emoji: '🥛', category: 'side', spicy: 1,
    desc: 'กะทิกับข่าและมะนาว เผ็ดน้อยกว่าต้มยำมาก เหมาะเวลาอยากได้อะไรอุ่น ๆ แต่ไม่อยากเผ็ด' },
  { slug: 'pad-pak-boong', name: 'ผัดผักบุ้งไฟแดง', nameEn: 'Pad Pak Boong Fai Daeng',
    emoji: '🔥', category: 'side', spicy: 2,
    desc: 'ผักบุ้งผัดไฟแรงกับเต้าเจี้ยวและพริก จานผักที่สั่งคู่กับอะไรก็ได้' },
  { slug: 'pla-rad-prik', name: 'ปลาทอดราดพริก', nameEn: 'Pla Rad Prik',
    emoji: '🐟', category: 'side', spicy: 3,
    desc: 'ปลาทอดกรอบราดน้ำพริกเปรี้ยวหวานเผ็ด จานที่ทำให้กินข้าวหมดหม้อ' },
  { slug: 'gaeng-som-pak-ruam', name: 'แกงส้มผักรวม', nameEn: 'Gaeng Som',
    emoji: '🍛', category: 'side', spicy: 3,
    desc: 'แกงเปรี้ยวเผ็ดไม่ใส่กะทิ รสจัดจนต้องมีอะไรจืด ๆ กินคู่' },
  { slug: 'kai-palo', name: 'ไข่พะโล้', nameEn: 'Kai Palo',
    emoji: '🥚', category: 'side', spicy: 0,
    desc: 'ไข่ต้มกับหมูสามชั้นในน้ำพะโล้หอมเครื่องเทศ หวานเค็มกลมกล่อม ไม่เผ็ดเลย' },
  { slug: 'gaeng-jued-tao-hoo', name: 'แกงจืดเต้าหู้หมูสับ', nameEn: 'Gaeng Jued Tao Hoo',
    emoji: '🍵', category: 'side', spicy: 0,
    desc: 'ซุปใสกับเต้าหู้ไข่และหมูสับ ตัวช่วยประจำโต๊ะเวลาสั่งของเผ็ดไว้หลายจาน' },
  { slug: 'pad-pak-ruam', name: 'ผัดผักรวมมิตร', nameEn: 'Pad Pak Ruam',
    emoji: '🥦', category: 'side', spicy: 0,
    desc: 'ผักหลายอย่างผัดน้ำมันหอย จานสามัญที่สั่งเพื่อให้มื้อนี้ดูมีผักบ้าง' },

  // --- ยำ-น้ำพริก (5) ---
  { slug: 'som-tam-thai', name: 'ส้มตำไทย', nameEn: 'Som Tam Thai',
    emoji: '🥗', category: 'yum', spicy: 3,
    desc: 'มะละกอสับตำกับมะนาวน้ำปลาถั่วลิสง สั่งกี่เม็ดบอกได้ แต่มือคนตำเป็นคนตัดสิน' },
  { slug: 'larb-moo', name: 'ลาบหมู', nameEn: 'Larb Moo',
    emoji: '🌶️', category: 'yum', spicy: 3,
    desc: 'หมูสับคลุกข้าวคั่วพริกป่นกับสะระแหน่ เปรี้ยวเผ็ดหอม กินกับข้าวเหนียวและผักสด' },
  { slug: 'yam-woon-sen', name: 'ยำวุ้นเส้น', nameEn: 'Yam Woon Sen',
    emoji: '🦑', category: 'yum', spicy: 3,
    desc: 'วุ้นเส้นลวกยำกับหมูสับและทะเล รสแซ่บที่กินเป็นมื้อเดียวก็อยู่ท้อง' },
  { slug: 'nam-prik-kapi', name: 'น้ำพริกกะปิปลาทู', nameEn: 'Nam Prik Kapi',
    emoji: '🐠', category: 'yum', spicy: 3,
    desc: 'น้ำพริกกะปิกับปลาทูทอดและผักลวก มื้อไทยแท้ที่กินแล้วข้าวหายไปหลายจาน' },
  { slug: 'nam-tok-moo', name: 'น้ำตกหมู', nameEn: 'Nam Tok Moo',
    emoji: '🥩', category: 'yum', spicy: 3,
    desc: 'หมูย่างหั่นชิ้นยำกับข้าวคั่วพริกป่นและมะนาว หอมกว่าลาบเพราะได้กลิ่นย่าง' },

  // --- ของหวาน (4) ---
  { slug: 'khao-niao-mamuang', name: 'ข้าวเหนียวมะม่วง', nameEn: 'Mango Sticky Rice',
    emoji: '🥭', category: 'dessert', spicy: 0,
    desc: 'ข้าวเหนียวมูนราดกะทิกับมะม่วงสุก ของหวานที่มีฤดูกาลของมันเอง' },
  { slug: 'bua-loy', name: 'บัวลอยน้ำขิง', nameEn: 'Bua Loy',
    emoji: '🍡', category: 'dessert', spicy: 0,
    desc: 'แป้งปั้นลูกกลมในน้ำกะทิหรือน้ำขิงร้อน ๆ หวานอุ่นสบายท้อง' },
  { slug: 'lod-chong', name: 'ลอดช่องน้ำกะทิ', nameEn: 'Lod Chong',
    emoji: '🍧', category: 'dessert', spicy: 0,
    desc: 'ลอดช่องเย็น ๆ ในน้ำกะทิน้ำตาลโตนด ของหวานประจำวันที่อากาศร้อนเกินทน' },
  { slug: 'kluay-buat-chee', name: 'กล้วยบวชชี', nameEn: 'Kluay Buat Chee',
    emoji: '🍌', category: 'dessert', spicy: 0,
    desc: 'กล้วยน้ำว้าต้มในกะทิหวานเค็ม ของหวานบ้าน ๆ ที่ทำกินเองได้ในสิบนาที' },
];

const DISH_BY_SLUG = new Map(DISHES.map((d) => [d.slug, d]));

/* ===== Favourite — เก็บในเครื่องผู้ใช้เท่านั้น ===== */

const STORAGE_KEY = 'thai-food:favourites';

/** อ่าน Favourite จาก localStorage
 *  ตัด slug ที่ไม่มีอยู่ใน Pool ปัจจุบันทิ้ง (ADR-0001)
 *  พังเมื่อไหร่ก็ถือว่าไม่มี Favourite แล้วไปต่อ ไม่รบกวนผู้ใช้
 */
function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((slug) => DISH_BY_SLUG.has(slug)));
  } catch (err) {
    return new Set();
  }
}

/** เขียน Favourite ลง localStorage — เบราว์เซอร์ที่ปิด storage ไว้จะ throw ตรงนี้
 *  ปล่อยผ่านเงียบ ๆ เว็บยังใช้งานได้ปกติ แค่หัวใจไม่ถูกจำ
 */
function saveFavourites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favourites]));
  } catch (err) {
    /* ไม่ทำอะไร: จำไม่ได้ดีกว่าขึ้น error ขวางหน้า */
  }
}

/* ===== สถานะของหน้า ===== */

const favourites = loadFavourites();
let featuredSlug = null;      // Dish ที่แสดงบนการ์ดใบใหญ่
let activeCategory = 'all';   // ชิป Category ที่เลือกอยู่ เลือกได้ทีละหนึ่ง
let favOnly = false;          // สวิตช์ "เฉพาะที่ชอบ"
let gridSlugs = [];           // สแนปช็อตของกริด คำนวณใหม่เมื่อ "ตัวกรอง" เปลี่ยนเท่านั้น
let swapTimer = null;         // คิวทรานซิชันของการ์ดใบใหญ่

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const els = {
  featured: document.getElementById('featured'),
  randomBtn: document.getElementById('random-btn'),
  chips: document.getElementById('chips'),
  favOnly: document.getElementById('fav-only'),
  grid: document.getElementById('grid'),
  empty: document.getElementById('empty'),
  footerNote: document.getElementById('footer-note'),
};

/* ===== ตัวช่วยแสดงผล ===== */

function spicyText(level) {
  return level === 0 ? 'ไม่เผ็ด' : '🌶️'.repeat(level);
}

function spicyLabel(level) {
  return level === 0 ? 'ไม่เผ็ด' : `ความเผ็ด ${level} จาก 3`;
}

function heartHtml(dish, extraClass) {
  const on = favourites.has(dish.slug);
  return `<button type="button" class="heart ${extraClass}" data-heart="${dish.slug}"
            aria-pressed="${on}" aria-label="ชอบ ${dish.name}">${on ? '♥' : '♡'}</button>`;
}

/* ===== การ์ด Featured Dish ===== */

function renderFeatured(dish) {
  els.featured.innerHTML = `
    <div class="featured-emoji" aria-hidden="true">${dish.emoji}</div>
    <h3 class="featured-name">${dish.name}</h3>
    <p class="featured-name-en">${dish.nameEn}</p>
    <p class="featured-desc">${dish.desc}</p>
    <div class="featured-meta">
      <span class="chip chip--${dish.category}">${CATEGORY_LABEL[dish.category]}</span>
      <span class="spicy" aria-label="${spicyLabel(dish.spicy)}">${spicyText(dish.spicy)}</span>
    </div>
    ${heartHtml(dish, 'heart--lg')}`;
}

/** ตั้ง Dish ที่จะแสดงบนการ์ดใบใหญ่ — มาจากการสุ่มหรือจากการกดการ์ดในกริดก็ได้ */
function setFeatured(slug, animate) {
  const dish = DISH_BY_SLUG.get(slug);
  if (!dish) return;

  const previous = featuredSlug;
  featuredSlug = slug;

  if (animate && !reduceMotion.matches) {
    // กดรัว ๆ ต้องไม่ทำให้จานที่ค้างคิวอยู่แวบขึ้นมาก่อนจานล่าสุด
    if (swapTimer) clearTimeout(swapTimer);
    els.featured.classList.add('is-swapping');
    swapTimer = setTimeout(() => {
      renderFeatured(dish);
      els.featured.classList.remove('is-swapping');
      swapTimer = null;
    }, 180);
  } else {
    renderFeatured(dish);
  }

  highlightInGrid(previous, slug);
}

/** ย้ายขอบเน้นในกริด โดยไม่เรนเดอร์กริดใหม่และไม่เลื่อนจอตาม */
function highlightInGrid(previousSlug, nextSlug) {
  if (previousSlug) {
    const old = els.grid.querySelector(`.card[data-slug="${previousSlug}"]`);
    if (old) old.classList.remove('is-featured');
  }
  const next = els.grid.querySelector(`.card[data-slug="${nextSlug}"]`);
  if (next) next.classList.add('is-featured');
}

/* ===== ปุ่มสุ่ม — ดึงจาก Pool ทั้งหมดเสมอ ไม่สนตัวกรอง ===== */

function pickRandomSlug() {
  const candidates = DISHES.filter((d) => d.slug !== featuredSlug);
  const pool = candidates.length > 0 ? candidates : DISHES;
  return pool[Math.floor(Math.random() * pool.length)].slug;
}

/* ===== กริด Pool ===== */

function matchesFilters(dish) {
  if (activeCategory !== 'all' && dish.category !== activeCategory) return false;
  if (favOnly && !favourites.has(dish.slug)) return false;
  return true;
}

function cardHtml(dish) {
  const featured = dish.slug === featuredSlug ? ' is-featured' : '';
  return `
    <li class="card${featured}" data-slug="${dish.slug}">
      <button type="button" class="card-main" data-pick="${dish.slug}">
        <span class="card-emoji" aria-hidden="true">${dish.emoji}</span>
        <span class="card-name">${dish.name}</span>
        <span class="card-name-en">${dish.nameEn}</span>
        <span class="card-meta">
          <span class="chip chip--${dish.category}">${CATEGORY_LABEL[dish.category]}</span>
          <span class="spicy" aria-label="${spicyLabel(dish.spicy)}">${spicyText(dish.spicy)}</span>
        </span>
      </button>
      ${heartHtml(dish, '')}
    </li>`;
}

/** เรนเดอร์กริดจากสแนปช็อตใหม่
 *  เรียกเมื่อ "ตัวกรองเปลี่ยน" เท่านั้น — การกดหัวใจไม่เรียกฟังก์ชันนี้
 *  เพื่อให้การ์ดที่เพิ่งเอาหัวใจออกค้างอยู่ ไม่หายไปใต้นิ้วผู้ใช้
 */
function renderGrid() {
  gridSlugs = DISHES.filter(matchesFilters).map((d) => d.slug);
  els.grid.innerHTML = gridSlugs.map((slug) => cardHtml(DISH_BY_SLUG.get(slug))).join('');
  renderEmptyState();
}

function renderEmptyState() {
  if (gridSlugs.length > 0) {
    els.empty.hidden = true;
    els.empty.innerHTML = '';
    return;
  }

  let message;
  if (favOnly && activeCategory !== 'all') {
    message = `ยังไม่มี${CATEGORY_LABEL[activeCategory]}ที่ชอบ`;
  } else if (favOnly) {
    message = 'ยังไม่มีจานที่ชอบ — กดหัวใจที่จานไหนก็ได้เพื่อเก็บไว้';
  } else {
    message = 'ไม่มีจานในกลุ่มนี้';
  }

  els.empty.innerHTML = message +
    (favOnly ? '<button type="button" id="clear-fav-filter">ปิดตัวกรองเฉพาะที่ชอบ</button>' : '');
  els.empty.hidden = false;
}

/* ===== Favourite: สลับสถานะ ===== */

function toggleFavourite(slug) {
  if (!DISH_BY_SLUG.has(slug)) return;

  if (favourites.has(slug)) {
    favourites.delete(slug);
  } else {
    favourites.add(slug);
  }
  saveFavourites();

  // หัวใจของจานเดียวกันอาจมีสองที่ (การ์ดใบใหญ่ + การ์ดในกริด) ต้องเปลี่ยนพร้อมกัน
  const on = favourites.has(slug);
  document.querySelectorAll(`[data-heart="${slug}"]`).forEach((btn) => {
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? '♥' : '♡';
  });
}

/* ===== ตัวกรอง ===== */

function renderChips() {
  const all = [{ key: 'all', label: 'ทั้งหมด' }, ...CATEGORIES];
  els.chips.innerHTML = all.map((c) => `
    <button type="button" class="chip-btn" data-category="${c.key}"
            aria-pressed="${c.key === activeCategory}">${c.label}</button>`).join('');
}

function setCategory(key) {
  if (key === activeCategory) return;
  activeCategory = key;
  els.chips.querySelectorAll('[data-category]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.category === activeCategory));
  });
  renderGrid();
}

/* ===== ผูก event ===== */

els.randomBtn.addEventListener('click', () => {
  setFeatured(pickRandomSlug(), true);
});

els.featured.addEventListener('click', (event) => {
  const heart = event.target.closest('[data-heart]');
  if (heart) toggleFavourite(heart.dataset.heart);
});

els.grid.addEventListener('click', (event) => {
  const heart = event.target.closest('[data-heart]');
  if (heart) {
    toggleFavourite(heart.dataset.heart);
    return;
  }
  const pick = event.target.closest('[data-pick]');
  if (pick) setFeatured(pick.dataset.pick, true);
});

els.chips.addEventListener('click', (event) => {
  const chip = event.target.closest('[data-category]');
  if (chip) setCategory(chip.dataset.category);
});

els.favOnly.addEventListener('change', () => {
  favOnly = els.favOnly.checked;
  renderGrid();
});

els.empty.addEventListener('click', (event) => {
  if (event.target.id !== 'clear-fav-filter') return;
  els.favOnly.checked = false;
  favOnly = false;
  renderGrid();
});

/* ===== เริ่มต้น ===== */

els.footerNote.textContent =
  `เมนูในลิสต์ ${DISHES.length} จาน · ระดับความเผ็ดเป็นการประมาณ ไม่ใช่ค่าที่วัดจริง · ` +
  'รายการโปรดเก็บไว้ในเครื่องนี้เท่านั้น ไม่ได้ส่งไปไหน';

renderChips();
renderGrid();
setFeatured(pickRandomSlug(), false);  // สุ่มให้เลยตอนโหลดหน้า ไม่ต้องรอผู้ใช้กด
