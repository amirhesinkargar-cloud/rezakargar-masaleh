/* ================== CONFIG ================== */
const ADMIN_PASSWORD = 'admin1234';
const STORAGE_KEYS = {
  reviews: 'kargar_reviews',
  cart: 'kargar_cart',
  wishlist: 'kargar_wishlist',
  profile: 'kargar_profile',
  history: 'kargar_history',
  theme: 'kargar_theme',
  visits: 'kargar_visits',
  recent: 'kargar_recent',
  discount: 'kargar_discount'
};

const DISCOUNT_CODES = {
  'KARGAR10': 10,
  'KARGAR20': 20,
  'WELCOME': 5
};

/* ================== STATE ================== */
let cart = [];
let wishlist = [];
let reviews = [];
let history = [];
let profile = { name: '', phone: '', address: '' };
let recentProducts = [];
let currentRating = 0;
let currentFilter = 'all';
let isAdminLoggedIn = false;
let logoClickCount = 0;
let logoClickTimer = null;
let currentDiscount = 0;
let allProducts = [];

/* ================== PRODUCTS DATA ================== */
const PRODUCTS = [
  { id: 'cement', name: 'انواع سیمان', desc: 'سیمان تیپ ۱، تیپ ۲، تیپ ۵، سیمان سفید و پاکتی.', image: '67.png', category: 'construction', keywords: 'سیمان تیپ بتن' },
  { id: 'block-tip', name: 'بلوک تیغه', desc: 'بلوک سبک تیغه‌ای برای دیوارچینی داخلی.', image: 'gallery4.jpg', category: 'construction', keywords: 'بلوک تیغه دیوار' },
  { id: 'block-saqf', name: 'بلوک سقفی', desc: 'بلوک سقفی سبک و مقاوم برای تیرچه بلوک.', image: 'gallery3.jpg', category: 'construction', keywords: 'بلوک سقفی تیرچه' },
  { id: 'tile', name: 'کاشی', desc: 'کاشی دیواری و کف در طرح‌ها و رنگ‌های متنوع.', image: 'gallery1.jpg', category: 'construction', keywords: 'کاشی دیوار کف' },
  { id: 'ceramic', name: 'سرامیک', desc: 'سرامیک کف و دیوار با مقاومت بالا.', image: 'as.png', category: 'construction', keywords: 'سرامیک کف دیوار' },
  { id: 'mozaic', name: 'موزاییک', desc: 'موزاییک پرسی و معمولی برای محوطه‌سازی.', image: '76.png', category: 'construction', keywords: 'موزاییک محوطه' },
  { id: 'gach', name: 'گچ', desc: 'گچ ساختمانی و گچ سفیدکاری، کیسه‌های ۳۰ و ۴۰ کیلوگرمی.', image: 'gallery2.jpg', category: 'construction', keywords: 'گچ سفیدکاری' },
  { id: 'poudr', name: 'پودر سنگ', desc: 'پودر سنگ جوشقان و سایر معادن، مناسب برای بتن و ملات.', image: 'gallery2.jpg', category: 'construction', keywords: 'پودر سنگ' },
  { id: 'ajar', name: 'آجر گره‌ای', desc: 'آجر گره‌ای و سفال برای دیوارچینی و نماکاری.', image: 'gereyi.jpg', category: 'construction', keywords: 'آجر گره سفال' },
  { id: 'cement-white', name: 'سیمان سفید', desc: 'سیمان سفید پاکتی برای کارهای نما و بندکشی.', image: 'simans.png', category: 'construction', keywords: 'سیمان سفید' },
  { id: 'ahak', name: 'آهک', desc: 'آهک کیسه‌ای و ساختمانی برای ملات و شفته‌ریزی.', image: 'gallery5.jpg', category: 'construction', keywords: 'آهک' },

  { id: 'pipe', name: 'انواع لوله', desc: 'لوله‌های پلیکا، پنبه‌ای، پنج لایه و فلزی در سایزهای مختلف.', image: '0987.jpg', category: 'facilities', keywords: 'لوله پلیکا پنج' },
  { id: 'fittings', name: 'اتصالات', desc: 'انواع اتصالات لوله‌کشی آب و فاضلاب.', image: '10.png', category: 'facilities', keywords: 'اتصالات' },
  { id: 'shiralat', name: 'شیرآلات', desc: 'شیرآلات بهداشتی و ساختمانی از برندهای معتبر.', image: 'shiralat.png', category: 'facilities', keywords: 'شیرآلات' },
  { id: 'hood', name: 'هود', desc: 'هود آشپزخانه در مدل‌های مختلف.', image: 'file_00000000635481f4a6020687c0453495.png', category: 'facilities', keywords: 'هود آشپزخانه' },
  { id: 'sink', name: 'سینک', desc: 'سینک ظرفشویی استیل و گرانیتی در ابعاد مختلف.', image: 'cv.png', category: 'facilities', keywords: 'سینک ظرفشویی' },
  { id: 'roshoii', name: 'روشویی', desc: 'روشویی و دستشویی در طرح‌های مختلف.', image: 'roshoii.png', category: 'facilities', keywords: 'روشویی دستشویی' },
  { id: 'chini', name: 'چینی بهداشتی', desc: 'توالت ایرانی و فرنگی از برندهای معتبر.', image: 'file_0000000073e881f48aff32b3a446cd5f.png', category: 'facilities', keywords: 'چینی توالت' },
  { id: 'flush', name: 'انواع فلاش تانک', desc: 'فلاش تانک توکار و روکار، در مدل‌های مختلف.', image: 'file_00000000614c81f48075e69377334388.png', category: 'facilities', keywords: 'فلاش تانک' },
  { id: 'jame', name: 'جامایع', desc: 'جامایع در طرح‌ها و رنگ‌های متنوع.', image: '0987.jpg', category: 'facilities', keywords: 'جامایع' },
  { id: 'jadastmal', name: 'جادستمال', desc: 'جادستمال در طرح‌ها و رنگ‌های مختلف.', image: 'file_00000000d1188246978a93e7572407c9.png', category: 'facilities', keywords: 'جادستمال' },
  { id: 'ayneh', name: 'آینه', desc: 'آینه‌های سرویس بهداشتی در ابعاد و طرح‌های متنوع.', image: 'ayeneh1.jpg', category: 'facilities', keywords: 'آینه سرویس' },
  { id: 'package', name: 'پکیج', desc: 'پکیج دیواری و زمینی با گارانتی.', image: '0987.jpg', category: 'facilities', keywords: 'پکیج' },
  { id: 'radiator', name: 'رادیاتور', desc: 'رادیاتور پنلی و آلومینیومی در ابعاد مختلف.', image: 'file_000000000d54824689102bfa7c628d6b.png', category: 'facilities', keywords: 'رادیاتور' },
  { id: 'cooler', name: 'کولر سلولزی', desc: 'کولر آبی سلولزی با مصرف بهینه آب و برق.', image: '0987.jpg', category: 'facilities', keywords: 'کولر سلولزی' },
  { id: 'tank', name: 'انواع مخازن آب', desc: 'مخازن افقی، عمودی، ایستاده و خوابیده در ظرفیت‌های مختلف.', image: 'tank.jpg', category: 'facilities', keywords: 'مخزن آب تانکر' },
  { id: 'pump', name: 'پمپ آب', desc: 'پمپ آب خانگی، نیمه صنعتی و صنعتی در توان‌های مختلف.', image: 'poump.png', category: 'facilities', keywords: 'پمپ آب' },
  { id: 'pump-control', name: 'ست کنترل پمپ آب', desc: 'ست کنترل اتوماتیک برای روشن و خاموش کردن هوشمند پمپ آب.', image: '0987.jpg', category: 'facilities', keywords: 'ست کنترل پمپ' },
  { id: 'gas', name: 'گاز صفحه‌ای', desc: 'گاز صفحه‌ای در مدل‌ها و سایزهای مختلف.', image: 'file_00000000f1e482108cf2476f4e3c0c0e.png', category: 'facilities', keywords: 'گاز صفحه' }
];

/* ================== STORAGE HELPERS ================== */
function saveToStorage(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {} }
function loadFromStorage(key, defaultValue) {
  try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : defaultValue; }
  catch (e) { return defaultValue; }
}

/* ================== INIT ================== */
function initApp() {
  cart = loadFromStorage(STORAGE_KEYS.cart, []);
  wishlist = loadFromStorage(STORAGE_KEYS.wishlist, []);
  reviews = loadFromStorage(STORAGE_KEYS.reviews, []);
  history = loadFromStorage(STORAGE_KEYS.history, []);
  profile = loadFromStorage(STORAGE_KEYS.profile, { name: '', phone: '', address: '' });
  recentProducts = loadFromStorage(STORAGE_KEYS.recent, []);
  currentDiscount = loadFromStorage(STORAGE_KEYS.discount, 0);

  const visits = loadFromStorage(STORAGE_KEYS.visits, { count: 0, firstVisit: null, lastVisit: null });
  visits.count++;
  visits.lastVisit = new Date().toISOString();
  if (!visits.firstVisit) visits.firstVisit = visits.lastVisit;
  saveToStorage(STORAGE_KEYS.visits, visits);

  allProducts = PRODUCTS;
  renderProducts();
  renderReviewsList();
  renderWishlist();
  renderHistory();
  loadProfile();
  updateCart();
  updateWishlistCount();
  initReveal();
  renderBlog();
  applySavedTheme();

  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');
}

/* ================== RENDER PRODUCTS ================== */
function renderProducts() {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  const fragment = document.createDocumentFragment();

  const construction = allProducts.filter(p => p.category === 'construction');
  if (construction.length) {
    const title = document.createElement('div');
    title.className = 'category-title construction';
    title.textContent = '🏗 مصالح ساختمانی';
    fragment.appendChild(title);
    construction.forEach(p => fragment.appendChild(makeProductCard(p)));
  }

  const facilities = allProducts.filter(p => p.category === 'facilities');
  if (facilities.length) {
    const title = document.createElement('div');
    title.className = 'category-title facilities';
    title.textContent = '🔧 تجهیزات تاسیساتی';
    fragment.appendChild(title);
    facilities.forEach(p => fragment.appendChild(makeProductCard(p)));
  }

  container.innerHTML = '';
  container.appendChild(fragment);
  if (typeof initReveal === 'function') initReveal();
}

function makeProductCard(p) {
  const div = document.createElement('div');
  div.className = 'product-card reveal';
  div.id = 'card-' + p.id;
  div.setAttribute('data-id', p.id);
  div.setAttribute('data-name', (p.keywords || '') + ' ' + p.name + ' ' + p.desc);

  const isInWishlist = wishlist.includes(p.id);
  const cartItem = cart.find(item => item.id === p.id);
  const isInCart = !!cartItem;

  div.innerHTML = `
    <div class="product-top">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
        <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" id="wish-${p.id}" onclick="toggleWishlistItem('${p.id}', event)" title="افزودن به علاقه‌مندی">
          ${isInWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
      </div>
      <div class="add-section" id="section-${p.id}">
        <button class="add-icon-btn" onclick="activateProduct('${p.id}', this)" style="${isInCart ? 'display:none' : ''}">+</button>
        <span class="add-label ${isInCart ? 'hidden' : ''}" id="label-${p.id}">افزودن به لیست</span>
        <div class="qty-control ${isInCart ? 'show' : ''}" id="qty-${p.id}">
          <button onclick="decreaseQty('${p.id}')">−</button>
          <input type="number" value="${cartItem ? cartItem.qty : 1}" min="1" max="100000" onchange="setQty('${p.id}', this.value)" id="input-${p.id}">
          <button onclick="increaseQty('${p.id}')">+</button>
        </div>
      </div>
    </div>
    <div class="stock-status">
      <span class="stock-dot"></span> موجود در انبار
    </div>
  `;
  return div;
}

/* ================== CART ================== */
function activateProduct(productId, btn) {
  btn.style.display = 'none';
  const label = document.getElementById('label-' + productId);
  if (label) label.classList.add('hidden');
  const qtyControl = document.getElementById('qty-' + productId);
  if (qtyControl) qtyControl.classList.add('show');

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) { if (existingItem.qty < 100000) existingItem.qty++; }
  else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) { cart.push({ id: productId, name: product.name, qty: 1 }); addToRecent(productId); }
  }
  const input = document.getElementById('input-' + productId);
  const item = cart.find(i => i.id === productId);
  if (input && item) input.value = item.qty;
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
  showToast('به لیست خرید اضافه شد');
}

function decreaseQty(productId) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (item.qty > 1) { item.qty--; }
  else {
    cart = cart.filter(i => i.id !== productId);
    const qtyControl = document.getElementById('qty-' + productId);
    if (qtyControl) qtyControl.classList.remove('show');
    const section = document.getElementById('section-' + productId);
    if (section) { const addBtn = section.querySelector('.add-icon-btn'); if (addBtn) addBtn.style.display = 'flex'; }
    const label = document.getElementById('label-' + productId);
    if (label) label.classList.remove('hidden');
  }
  const input = document.getElementById('input-' + productId);
  const currentItem = cart.find(i => i.id === productId);
  if (input && currentItem) input.value = currentItem.qty;
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
}

function increaseQty(productId) {
  const item = cart.find(i => i.id === productId);
  if (item && item.qty < 100000) {
    item.qty++;
    const input = document.getElementById('input-' + productId);
    if (input) input.value = item.qty;
    saveToStorage(STORAGE_KEYS.cart, cart);
    updateCart();
  }
}

function setQty(productId, value) {
  let qty = parseInt(value) || 1;
  if (qty < 1) qty = 1;
  if (qty > 100000) qty = 100000;
  const item = cart.find(i => i.id === productId);
  if (item) { item.qty = qty; }
  else { const product = PRODUCTS.find(p => p.id === productId); if (product) cart.push({ id: productId, name: product.name, qty }); }
  const input = document.getElementById('input-' + productId);
  if (input) input.value = qty;
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
}

function setCartQty(productId, value) {
  let qty = parseInt(value) || 1;
  if (qty < 1) qty = 1;
  if (qty > 100000) qty = 100000;
  const item = cart.find(i => i.id === productId);
  if (item) item.qty = qty;
  const productInput = document.getElementById('input-' + productId);
  if (productInput) productInput.value = qty;
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  const qtyControl = document.getElementById('qty-' + productId);
  if (qtyControl) qtyControl.classList.remove('show');
  const section = document.getElementById('section-' + productId);
  if (section) { const addBtn = section.querySelector('.add-icon-btn'); if (addBtn) addBtn.style.display = 'flex'; }
  const label = document.getElementById('label-' + productId);
  if (label) label.classList.remove('hidden');
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (!confirm('آیا از پاک کردن کل لیست مطمئن هستید؟')) return;
  cart = [];
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
  renderProducts();
  showToast('لیست خرید پاک شد', 'info');
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const summaryTypes = document.getElementById('summaryTypes');
  const summaryTotal = document.getElementById('summaryTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cartCount) cartCount.textContent = totalItems;
  if (summaryTypes) summaryTypes.textContent = cart.length;
  if (summaryTotal) summaryTotal.textContent = totalItems;

  if (floatingCartBtn) {
    if (cart.length > 0) floatingCartBtn.classList.add('show');
    else floatingCartBtn.classList.remove('show');
  }

  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div>لیست شما خالی است</div>';
    } else {
      cartItems.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-index">آیتم ${idx + 1}</div>
          </div>
          <div class="cart-item-qty">
            <button onclick="event.stopPropagation(); decreaseQty('${item.id}')">−</button>
            <input type="number" value="${item.qty}" min="1" max="100000" onchange="event.stopPropagation(); setCartQty('${item.id}', this.value)" onclick="event.stopPropagation();">
            <button onclick="event.stopPropagation(); increaseQty('${item.id}')">+</button>
          </div>
          <button class="cart-item-remove" onclick="event.stopPropagation(); removeFromCart('${item.id}')" title="حذف">✕</button>
        </div>
      `).join('');
    }
  }
}

function toggleCart(event) {
  if (event) event.stopPropagation();
  document.getElementById('cartWindow').classList.toggle('show');
  document.getElementById('instaMenu').classList.remove('show');
  document.getElementById('assistantWindow').classList.remove('show');
  closeAllOtherWindows('cartWindow');
}

function cartToText() {
  return 'لیست خرید من از مصالح ساختمانی و تاسیسات مرکزی کارگر:\n\n' +
    cart.map((item, i) => `${i+1}. ${item.name} — تعداد: ${item.qty}`).join('\n') +
    `\n\nمجموع: ${cart.length} قلم کالا — ${cart.reduce((s, i) => s + i.qty, 0)} عدد`;
}

function sendToEita(type) {
  if (cart.length === 0) { showToast('لیست شما خالی است', 'error'); return; }
  copyToClipboard(cartToText()).then(() => {
    showToast('لیست کپی شد. ایتا باز می‌شود...');
    setTimeout(() => { window.location.href = 'eitaa://'; }, 700);
  });
}

function copyCart() {
  if (cart.length === 0) { showToast('لیست شما خالی است', 'error'); return; }
  copyToClipboard(cartToText()).then(() => showToast('لیست کپی شد'));
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((resolve) => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta); resolve();
  });
}

/* ================== WISHLIST ================== */
function toggleWishlistItem(productId, event) {
  if (event) event.stopPropagation();
  const index = wishlist.indexOf(productId);
  if (index > -1) { wishlist.splice(index, 1); showToast('از علاقه‌مندی‌ها حذف شد', 'info'); }
  else { wishlist.push(productId); showToast('به علاقه‌مندی‌ها اضافه شد ❤️'); }
  
  saveToStorage(STORAGE_KEYS.wishlist, wishlist);
  
  const btn = document.getElementById('wish-' + productId);
  if (btn) {
    btn.classList.toggle('active');
    btn.innerHTML = btn.classList.contains('active') ? '❤️' : '🤍';
  }
  updateWishlistCount();
  renderWishlist();
}

function updateWishlistCount() {
  const count = document.getElementById('wishlistCount');
  const btn = document.getElementById('floatingWishlistBtn');
  if (count) count.textContent = wishlist.length;
  if (btn) {
    if (wishlist.length > 0) btn.classList.add('show');
    else btn.classList.remove('show');
  }
}

function renderWishlist() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  if (wishlist.length === 0) {
    container.innerHTML = '<div class="wishlist-empty"><div class="wishlist-empty-icon">❤️</div>هنوز محصولی به علاقه‌مندی‌ها اضافه نکردی.<br>روی قلب کنار محصولات بزن!</div>';
    return;
  }
  container.innerHTML = wishlist.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-index">${p.desc.substring(0, 40)}...</div>
        </div>
        <div class="wishlist-item-actions" style="display:flex; gap:6px;">
          <button onclick="addWishlistToCart('${id}')" style="background:#0d9488;color:white;border:none;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer;font-family:inherit;">افزودن</button>
          <button onclick="toggleWishlistItem('${id}', event)" style="background:#fee2e2;color:#ef4444;border:none;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer;">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function addWishlistToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name: p.name, qty: 1 });
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
  showToast('به لیست خرید اضافه شد');
}

function toggleWishlist(event) {
  if (event) event.stopPropagation();
  document.getElementById('wishlistWindow').classList.toggle('show');
  closeAllOtherWindows('wishlistWindow');
}

/* ================== HISTORY ================== */
function addToHistory(order) {
  history.unshift({ id: Date.now(), date: new Date().toISOString(), ...order });
  if (history.length > 20) history = history.slice(0, 20);
  saveToStorage(STORAGE_KEYS.history, history);
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('historyItems');
  if (!container) return;
  if (history.length === 0) {
    container.innerHTML = '<div class="history-empty"><div class="history-empty-icon">📜</div>هنوز سفارشی ثبت نکردی.</div>';
    return;
  }
  container.innerHTML = history.map(h => {
    const date = new Date(h.date).toLocaleDateString('fa-IR');
    const itemsText = h.items ? h.items.map(i => `${i.name} (${i.qty})`).join('، ') : 'لیست خالی';
    return `
      <div class="history-item">
        <div class="history-item-head">
          <span class="history-item-date">📅 ${date}</span>
          <span class="history-item-status">ثبت شده</span>
        </div>
        <p class="history-item-products">${itemsText}</p>
      </div>
    `;
  }).join('');
}

function toggleHistory(event) {
  if (event) event.stopPropagation();
  document.getElementById('historyWindow').classList.toggle('show');
  closeAllOtherWindows('historyWindow');
}

/* ================== PROFILE ================== */
function loadProfile() {
  const nameEl = document.getElementById('profileName');
  const phoneEl = document.getElementById('profilePhone');
  const addressEl = document.getElementById('profileAddress');
  if (nameEl) nameEl.value = profile.name || '';
  if (phoneEl) phoneEl.value = profile.phone || '';
  if (addressEl) addressEl.value = profile.address || '';
}

function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const address = document.getElementById('profileAddress').value.trim();
  profile = { name, phone, address };
  saveToStorage(STORAGE_KEYS.profile, profile);
  showToast('پروفایل ذخیره شد');
  toggleProfile();
}

function toggleProfile(event) {
  if (event) event.stopPropagation();
  document.getElementById('profileWindow').classList.toggle('show');
  closeAllOtherWindows('profileWindow');
  loadProfile();
}

function openProfile() { 
  closeAdmin();
  toggleProfile(); 
}

function prefillOrderForm() {
  if (profile.name) document.getElementById('orderName').value = profile.name;
  if (profile.phone) document.getElementById('orderPhone').value = profile.phone;
  if (profile.address) document.getElementById('orderAddress').value = profile.address;
}

/* ================== RECENT ================== */
function addToRecent(productId) {
  recentProducts = recentProducts.filter(id => id !== productId);
  recentProducts.unshift(productId);
  if (recentProducts.length > 10) recentProducts = recentProducts.slice(0, 10);
  saveToStorage(STORAGE_KEYS.recent, recentProducts);
}

/* ================== THEME ================== */
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
  saveToStorage(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
}

function applySavedTheme() {
  const theme = loadFromStorage(STORAGE_KEYS.theme, 'light');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = '☀️';
  }
}

/* ================== SEARCH ================== */
function normalize(str) {
  return (str || '').toString().toLowerCase().replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[ۀهٔ]/g, 'ه').replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

function searchProducts() {
  const query = normalize(document.getElementById('searchInput').value);
  const cards = document.querySelectorAll('.product-card');
  const categoryTitles = document.querySelectorAll('.category-title');
  const clearBtn = document.getElementById('searchClear');
  const resultInfo = document.getElementById('searchResultInfo');
  const noResult = document.getElementById('noResult');

  if (query === '') {
    cards.forEach(card => card.style.display = '');
    categoryTitles.forEach(title => title.style.display = '');
    clearBtn.classList.remove('show');
    resultInfo.innerHTML = '';
    noResult.classList.remove('show');
    return;
  }

  clearBtn.classList.add('show');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = normalize(card.getAttribute('data-name'));
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    const title = normalize(h3 ? h3.textContent : '');
    const desc = normalize(p ? p.textContent : '');

    if (name.includes(query) || title.includes(query) || desc.includes(query)) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  categoryTitles.forEach(title => {
    let next = title.nextElementSibling;
    let hasVisible = false;
    while (next && !next.classList.contains('category-title')) {
      if (next.classList.contains('product-card') && next.style.display !== 'none') {
        hasVisible = true; break;
      }
      next = next.nextElementSibling;
    }
    title.style.display = hasVisible ? '' : 'none';
  });

  if (visibleCount === 0) {
    noResult.classList.add('show');
    resultInfo.innerHTML = '';
  } else {
    noResult.classList.remove('show');
    resultInfo.innerHTML = '<strong>' + visibleCount + '</strong> محصول پیدا شد';
  }
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  searchProducts();
  document.getElementById('searchInput').focus();
}

/* ================== FAQ ================== */
function toggleFaq(el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

/* ================== REVIEWS ================== */
function openReviewForm() {
  document.getElementById('reviewFormWindow').classList.add('show');
  document.getElementById('reviewFormWindow').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeReviewForm() {
  document.getElementById('reviewFormWindow').classList.remove('show');
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewText').value = '';
  currentRating = 0;
  updateStars(0);
}

function setRating(value) { currentRating = value; updateStars(value); }

function updateStars(value) {
  document.querySelectorAll('.star').forEach(star => {
    const v = parseInt(star.getAttribute('data-value'));
    star.classList.toggle('active', v <= value);
  });
}

function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name) { showToast('لطفاً نام خود را وارد کنید', 'error'); return; }
  if (name.length < 2) { showToast('نام باید حداقل ۲ حرف باشد', 'error'); return; }
  if (currentRating === 0) { showToast('لطفاً امتیاز خود را انتخاب کنید', 'error'); return; }
  if (!text) { showToast('لطفاً نظر خود را بنویسید', 'error'); return; }
  if (text.length < 10) { showToast('نظر باید حداقل ۱۰ حرف باشد', 'error'); return; }

  const review = { id: Date.now(), name, text, rating: currentRating, status: 'pending', date: new Date().toISOString() };
  reviews.push(review);
  saveToStorage(STORAGE_KEYS.reviews, reviews);
  renderReviewsList();
  if (isAdminLoggedIn) updateAdminStats();
  showToast('نظر شما ثبت شد. پس از تأیید نمایش داده می‌شود.');
  closeReviewForm();
}

function renderReviewsList() {
  const container = document.getElementById('reviewsList');
  const approved = reviews.filter(r => r.status === 'approved');

  if (approved.length === 0) {
    container.innerHTML = `<div class="no-reviews-yet"><div class="no-reviews-icon">💬</div>هنوز نظری ثبت نشده.<br>اولین نفری باشید که نظر می‌ده!</div>`;
    return;
  }

  container.innerHTML = approved.slice().reverse().map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const initials = r.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('');
    const dateStr = new Date(r.date).toLocaleDateString('fa-IR');
    return `
      <div class="review-card">
        <div class="review-head">
          <div class="review-author"><div class="review-avatar">${initials}</div><span>${escapeHtml(r.name)}</span></div>
          <div class="review-stars">${stars}</div>
        </div>
        <p class="review-text">${escapeHtml(r.text)}</p>
        <span class="review-date">📅 ${dateStr}</span>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

/* ================== ADMIN ================== */
function tripleClickLogo() {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  if (logoClickCount >= 3) { logoClickCount = 0; openAdmin(); return; }
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 600);
}

function openAdmin() {
  const overlay = document.getElementById('adminOverlay');
  if (!overlay) return;
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  if (isAdminLoggedIn) { showAdminPanel(); }
  else {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    setTimeout(() => { const pass = document.getElementById('adminPassword'); if (pass) pass.focus(); }, 200);
  }
}

function closeAdmin() { document.getElementById('adminOverlay').classList.remove('show'); document.body.style.overflow = ''; }

function loginAdmin() {
  const pass = document.getElementById('adminPassword').value;
  if (pass === ADMIN_PASSWORD) { isAdminLoggedIn = true; showToast('ورود موفق'); showAdminPanel(); }
  else { showToast('رمز عبور اشتباه است', 'error'); document.getElementById('adminPassword').value = ''; }
}

function showAdminPanel() {
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  updateAdminStats();
  renderAdminReviews();
}

function updateAdminStats() {
  const total = reviews.length;
  const approved = reviews.filter(r => r.status === 'approved').length;
  const pending = reviews.filter(r => r.status === 'pending').length;
  const rejected = reviews.filter(r => r.status === 'rejected').length;
  const elTotal = document.getElementById('statTotal'); const elApproved = document.getElementById('statApproved');
  const elPending = document.getElementById('statPending'); const elRejected = document.getElementById('statRejected');
  if (elTotal) elTotal.textContent = total; if (elApproved) elApproved.textContent = approved;
  if (elPending) elPending.textContent = pending; if (elRejected) elRejected.textContent = rejected;
}

function filterReviews(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderAdminReviews();
}

function renderAdminReviews() {
  const container = document.getElementById('adminReviewsList');
  if (!container) return;
  let filtered = currentFilter !== 'all' ? reviews.filter(r => r.status === currentFilter) : reviews;
  filtered = filtered.slice().reverse();

  if (filtered.length === 0) { container.innerHTML = `<div class="admin-empty">هیچ نظری در این دسته وجود ندارد</div>`; return; }

  container.innerHTML = filtered.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const dateStr = new Date(r.date).toLocaleString('fa-IR');
    const statusLabels = { pending: 'در انتظار', approved: 'تأیید شده', rejected: 'رد شده' };
    return `
      <div class="admin-review-item ${r.status}">
        <div class="admin-review-head">
          <div class="admin-review-name"><span>${escapeHtml(r.name)}</span><span style="font-size: 11px; color: #94a3b8;">${statusLabels[r.status]}</span></div>
          <div class="admin-review-stars">${stars}</div>
        </div>
        <p class="admin-review-text">${escapeHtml(r.text)}</p>
        <div style="font-size: 11px; color: #94a3b8;">${dateStr}</div>
        <div class="admin-review-actions">
          ${r.status !== 'approved' ? `<button class="btn-approve" onclick="approveReview(${r.id})">تأیید</button>` : ''}
          ${r.status !== 'rejected' ? `<button class="btn-reject" onclick="rejectReview(${r.id})">رد</button>` : ''}
          <button class="btn-delete" onclick="deleteReview(${r.id})">حذف</button>
        </div>
      </div>
    `;
  }).join('');
}

function approveReview(id) {
  const r = reviews.find(x => x.id === id); if (!r) return;
  r.status = 'approved'; saveToStorage(STORAGE_KEYS.reviews, reviews);
  updateAdminStats(); renderAdminReviews(); renderReviewsList(); showToast('نظر تأیید شد');
}

function rejectReview(id) {
  const r = reviews.find(x => x.id === id); if (!r) return;
  r.status = 'rejected'; saveToStorage(STORAGE_KEYS.reviews, reviews);
  updateAdminStats(); renderAdminReviews(); renderReviewsList(); showToast('نظر رد شد', 'info');
}

function deleteReview(id) {
  if (!confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
  reviews = reviews.filter(x => x.id !== id); saveToStorage(STORAGE_KEYS.reviews, reviews);
  updateAdminStats(); renderAdminReviews(); renderReviewsList(); showToast('نظر حذف شد', 'info');
}

function exportReviews() {
  const dataStr = JSON.stringify(reviews, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = 'kargar-reviews-' + new Date().toISOString().slice(0,10) + '.json';
  a.click(); URL.revokeObjectURL(url); showToast('فایل JSON دانلود شد');
}

function importReviews(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('فرمت نامعتبر');
      if (!confirm(`آیا ${imported.length} نظر بارگذاری شود؟`)) return;
      reviews = imported; saveToStorage(STORAGE_KEYS.reviews, reviews);
      updateAdminStats(); renderAdminReviews(); renderReviewsList(); showToast('نظرات بارگذاری شد');
    } catch (err) { showToast('فایل JSON نامعتبر است', 'error'); }
  };
  reader.readAsText(file); event.target.value = '';
}

/* ================== ASSISTANT ================== */
function toggleAssistant(event) {
  if (event) event.stopPropagation();
  document.getElementById('assistantWindow').classList.toggle('show');
  document.getElementById('instaMenu').classList.remove('show');
  document.getElementById('cartWindow').classList.remove('show');
  closeAllOtherWindows('assistantWindow');
}

function sendAssistantMsg() {
  const input = document.getElementById('assistantInput');
  const msg = input.value.trim(); if (!msg) return;
  addMsg(msg, 'user'); input.value = '';
  setTimeout(() => { const reply = getAssistantReply(msg); addMsg(reply, 'bot'); }, 400);
}

const knowledgeBase = {
  'سیمان': 'سیمان تیپ ۱ برای کارهای عمومی، تیپ ۲ برای بتن‌ریزی معمولی، تیپ ۵ برای بتن‌های حساس به سولفات.\nاستعلام قیمت: ۰۹۱۳۳۹۰۸۲۳۰',
  'بلوک': 'بلوک تیغه برای دیوارچینی داخلی، بلوک سقفی برای تیرچه بلوک.\nبرای هر متر مربع دیوار حدود ۱۰ عدد بلوک.\n۰۹۱۳۳۹۰۸۲۳۰',
  'قیمت': 'برای استعلام قیمت روز:\nمصالح: ۰۹۱۳۳۹۰۸۲۳۰\nتاسیسات: ۰۹۱۳۳۹۰۸۳۹۳',
  'تماس': 'مصالح: ۰۹۱۳۳۹۰۸۲۳۰\nتاسیسات: ۰۹۱۳۳۹۰۸۳۹۳\nمغازه: ۰۳۴-۳۴۳۴۱۳۰۳۸۶',
  'آدرس': 'شهربابک، خیابان مطهری، نبش کوچه ۱۱\nشنبه تا پنجشنبه، ۸ صبح تا ۸ شب',
  'سلام': 'سلام و خوش آمدید! چطور می‌تونم کمکتون کنم؟'
};

function getAssistantReply(msg) {
  const lower = normalize(msg);
  const sortedKeys = Object.keys(knowledgeBase).sort((a,b) => b.length - a.length);
  for (const key of sortedKeys) { if (lower.includes(normalize(key))) return knowledgeBase[key]; }
  return 'متأسفم، متوجه نشدم.\n\nمی‌تونید اینا رو بپرسید:\n• قیمت سیمان چنده؟\n• برای دیوارچینی چی لازم دارم؟\n• آدرس فروشگاه کجاست؟\n\nیا تماس بگیرید:\n۰۹۱۳۳۹۰۸۲۳۰';
}

function addMsg(text, type) {
  const container = document.getElementById('assistantMessages');
  const div = document.createElement('div');
  div.className = 'assistant-msg ' + type;
  div.innerHTML = text.replace(/\n/g, '<br>');
  container.appendChild(div); container.scrollTop = container.scrollHeight;
}

/* ================== INSTA MENU ================== */
function toggleInstaMenu(event) {
  if (event) event.stopPropagation();
  document.getElementById('instaMenu').classList.toggle('show');
  document.getElementById('cartWindow').classList.remove('show');
  document.getElementById('assistantWindow').classList.remove('show');
}

/* ================== GLOBAL CLICK ================== */
function closeAllOtherWindows(exceptId) {
  ['cartWindow', 'wishlistWindow', 'historyWindow', 'profileWindow', 'assistantWindow'].forEach(id => {
    if (id !== exceptId) { const el = document.getElementById(id); if (el) el.classList.remove('show'); }
  });
}

document.addEventListener('click', function(event) {
  const menu = document.getElementById('instaMenu');
  const instaBtn = document.querySelector('.floating-insta-btn');
  if (instaBtn && !instaBtn.contains(event.target) && menu && !menu.contains(event.target)) menu.classList.remove('show');
  
  if (event.target.classList && event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('show'); document.body.style.overflow = '';
  }
});

/* ================== KEYBOARD ================== */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) { e.preventDefault(); openAdmin(); }
  if (e.key === 'Escape') {
    ['cartWindow', 'assistantWindow', 'wishlistWindow', 'historyWindow', 'profileWindow', 'instaMenu'].forEach(id => document.getElementById(id).classList.remove('show'));
    document.querySelectorAll('.modal-overlay.show').forEach(m => { m.classList.remove('show'); document.body.style.overflow = ''; });
  }
});

/* ================== ORDER ================== */
function openOrderForm() {
  document.getElementById('orderModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  prefillOrderForm();
}
function closeOrderForm() {
  document.getElementById('orderModal').classList.remove('show');
  document.body.style.overflow = '';
}

function submitOrder() {
  const name = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const type = document.getElementById('orderType').value;
  const note = document.getElementById('orderNote').value.trim();
  const discountInput = document.getElementById('orderDiscount');
  const discountCode = discountInput ? discountInput.value.trim().toUpperCase() : '';

  if (!name || name.length < 2) { showToast('نام را درست وارد کنید', 'error'); return; }
  if (!/^09\d{9}$/.test(phone)) { showToast('شماره موبایل معتبر وارد کنید', 'error'); return; }
  if (!address || address.length < 5) { showToast('آدرس را کامل وارد کنید', 'error'); return; }

  let discountPercent = 0;
  if (discountCode) {
    if (DISCOUNT_CODES[discountCode]) discountPercent = DISCOUNT_CODES[discountCode];
    else { showToast('کد تخفیف نامعتبر است', 'error'); return; }
  }

  let text = '🛒 سفارش آنلاین جدید:\n\n';
  text += '👤 نام: ' + name + '\n📞 تلفن: ' + phone + '\n📍 آدرس: ' + address + '\n';
  text += '📦 نوع: ' + (type === 'masaleh' ? 'مصالح' : type === 'tasisat' ? 'تاسیسات' : 'هر دو') + '\n';
  if (discountCode) text += '🎁 کد تخفیف: ' + discountCode + ' (' + discountPercent + '%)\n';
  if (note) text += '📝 توضیحات: ' + note + '\n';

  if (cart.length > 0) {
    text += '\n--- لیست خرید ---\n';
    cart.forEach((item, i) => { text += `${i+1}. ${item.name} — تعداد: ${item.qty}\n`; });
    text += `\n📦 مجموع: ${cart.length} قلم — ${cart.reduce((s, i) => s + i.qty, 0)} عدد`;
  }

  addToHistory({ name, phone, address, type, note, items: cart.map(i => ({ name: i.name, qty: i.qty })), discount: discountCode, discountPercent });
  profile = { name, phone, address };
  saveToStorage(STORAGE_KEYS.profile, profile);

  copyToClipboard(text).then(() => {
    showToast('سفارش ثبت شد. در حال باز کردن ایتا...');
    setTimeout(() => { cart = []; saveToStorage(STORAGE_KEYS.cart, cart); updateCart(); renderProducts(); closeOrderForm(); }, 1500);
  });
}

/* ================== CALCULATOR ================== */
function openCalculator() {
  document.getElementById('calcModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  calcWall(); calcCeiling(); calcConcrete(); calcTile();
}
function closeCalculator() {
  document.getElementById('calcModal').classList.remove('show');
  document.body.style.overflow = '';
}
function switchCalc(name, btn) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active'); document.getElementById('calc-' + name).classList.add('active');
}

function calcWall() {
  const L = parseFloat(document.getElementById('wallLength').value) || 0;
  const H = parseFloat(document.getElementById('wallHeight').value) || 0;
  const perSqm = parseFloat(document.getElementById('wallType').value);
  const area = L * H;
  const blocks = Math.ceil(area * perSqm);
  const cement = Math.ceil(area * 0.5);
  const sand = (area * 0.02).toFixed(2);
  document.getElementById('wallResult').innerHTML = `
    <h4>نتیجه محاسبه</h4>
    <div class="calc-result-item"><span>مساحت دیوار:</span><span>${area.toFixed(2)} متر مربع</span></div>
    <div class="calc-result-item"><span>تعداد بلوک:</span><span>${blocks} عدد</span></div>
    <div class="calc-result-item"><span>سیمان:</span><span>${cement} کیسه</span></div>
    <div class="calc-result-item"><span>ماسه:</span><span>${sand} متر مکعب</span></div>
  `;
  window._lastCalc = { blocks, cement, sand, area };
}

function calcCeiling() {
  const area = parseFloat(document.getElementById('ceilingArea').value) || 0;
  const blocks = Math.ceil(area * 2);
  const joists = Math.ceil(area * 0.55);
  const cement = Math.ceil(area * 0.8);
  const steel = Math.ceil(area * 4);
  document.getElementById('ceilingResult').innerHTML = `
    <h4>نتیجه محاسبه سقف</h4>
    <div class="calc-result-item"><span>مساحت:</span><span>${area.toFixed(2)} متر مربع</span></div>
    <div class="calc-result-item"><span>بلوک سقفی:</span><span>${blocks} عدد</span></div>
    <div class="calc-result-item"><span>تیرچه:</span><span>${joists} عدد</span></div>
    <div class="calc-result-item"><span>سیمان:</span><span>${cement} کیسه</span></div>
    <div class="calc-result-item"><span>میلگرد:</span><span>${steel} کیلو</span></div>
  `;
  window._lastCalc = { blocks, joists, cement, steel, area };
}

function calcConcrete() {
  const vol = parseFloat(document.getElementById('concreteVol').value) || 0;
  const grade = parseFloat(document.getElementById('concreteGrade').value);
  const cement = Math.ceil(vol * grade / 50);
  const sand = (vol * 0.5).toFixed(2);
  const gravel = (vol * 0.85).toFixed(2);
  const water = Math.ceil(vol * 180);
  document.getElementById('concreteResult').innerHTML = `
    <h4>نتیجه محاسبه بتن</h4>
    <div class="calc-result-item"><span>حجم:</span><span>${vol.toFixed(2)} متر مکعب</span></div>
    <div class="calc-result-item"><span>عیار:</span><span>${grade} kg/m³</span></div>
    <div class="calc-result-item"><span>سیمان:</span><span>${cement} کیسه</span></div>
    <div class="calc-result-item"><span>ماسه:</span><span>${sand} متر مکعب</span></div>
    <div class="calc-result-item"><span>شن:</span><span>${gravel} متر مکعب</span></div>
    <div class="calc-result-item"><span>آب:</span><span>${water} لیتر</span></div>
  `;
  window._lastCalc = { cement, sand, gravel, vol };
}

function calcTile() {
  const area = parseFloat(document.getElementById('tileArea').value) || 0;
  const size = document.getElementById('tileSize').value.split('x');
  const tileArea = (parseFloat(size[0]) * parseFloat(size[1])) / 10000;
  const totalTiles = Math.ceil(area * (1 / tileArea) * 1.1);
  const boxes = Math.ceil(totalTiles / 10);
  const cement = Math.ceil(area * 0.4);
  document.getElementById('tileResult').innerHTML = `
    <h4>نتیجه محاسبه کاشی‌کاری</h4>
    <div class="calc-result-item"><span>مساحت:</span><span>${area.toFixed(2)} متر مربع</span></div>
    <div class="calc-result-item"><span>ابعاد:</span><span>${size[0]}×${size[1]}</span></div>
    <div class="calc-result-item"><span>تعداد (با پرت):</span><span>${totalTiles} عدد</span></div>
    <div class="calc-result-item"><span>کارتن:</span><span>${boxes} عدد</span></div>
    <div class="calc-result-item"><span>سیمان:</span><span>${cement} کیسه</span></div>
  `;
  window._lastCalc = { totalTiles, boxes, cement, area };
}

function addCalcToCart() {
  const activePanel = document.querySelector('.calc-panel.active').id;
  const nameMap = { 'calc-wall': 'بلوک تیغه', 'calc-ceiling': 'بلوک سقفی', 'calc-concrete': 'سیمان', 'calc-tile': 'کاشی' };
  const idMap = { 'calc-wall': 'block-tip', 'calc-ceiling': 'block-saqf', 'calc-concrete': 'cement', 'calc-tile': 'tile' };
  const productName = nameMap[activePanel];
  const productId = idMap[activePanel];
  let qty = 1;
  if (activePanel === 'calc-wall' && window._lastCalc) qty = window._lastCalc.blocks;
  if (activePanel === 'calc-ceiling' && window._lastCalc) qty = window._lastCalc.blocks;
  if (activePanel === 'calc-concrete' && window._lastCalc) qty = window._lastCalc.cement;
  if (activePanel === 'calc-tile' && window._lastCalc) qty = window._lastCalc.totalTiles;

  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, name: productName, qty });
  saveToStorage(STORAGE_KEYS.cart, cart);
  updateCart();
  renderProducts();
  showToast(`${qty} عدد ${productName} به لیست اضافه شد`);
  closeCalculator();
}

/* ================== BLOG ================== */
const blogPosts = [
  { id: 'cement-guide', tag: 'مصالح', icon: '🏗', title: 'راهنمای کامل انتخاب سیمان مناسب', excerpt: 'سیمان تیپ ۱، ۲، ۵ یا سفید؟', date: '۱۴۰۳/۰۸/۱۵', content: `<h2>مقدمه</h2><p>انتخاب سیمان مناسب، یکی از مهم‌ترین تصمیمات در هر پروژه ساختمانی است.</p>` },
  { id: 'wall-blocks', tag: 'مصالح', icon: '🧱', title: 'چگونه تعداد بلوک مورد نیاز را محاسبه کنیم؟', excerpt: 'فرمول ساده محاسبه بلوک', date: '۱۴۰۳/۰۸/۱۰', content: `<h2>مقدمه</h2><p>محاسبه دقیق بلوک باعث می‌شود نه اضافه بخری و نه وسط کار بمانی!</p>` },
  { id: 'pipes-guide', tag: 'تاسیسات', icon: '🔧', title: 'انواع لوله ساختمانی و کاربرد آن‌ها', excerpt: 'پلیکا، پنج لایه، یا فلزی؟', date: '۱۴۰۳/۰۸/۰۵', content: `<h2>مقدمه</h2><p>انتخاب لوله مناسب نقش کلیدی در دوام تاسیسات دارد.</p>` },
  { id: 'package-guide', tag: 'تاسیسات', icon: '🔥', title: 'راهنمای خرید پکیج دیواری', excerpt: 'پکیج مناسب خانه شما کدام است؟', date: '۱۴۰۳/۰۷/۲۸', content: `<h2>مقدمه</h2><p>انتخاب اشتباه ظرفیت پکیج باعث هدررفت انرژی می‌شود.</p>` }
];

function renderBlog() {
  const grid = document.getElementById('blogGrid'); if (!grid) return;
  grid.innerHTML = blogPosts.map(p => `
    <div class="blog-card" onclick="openArticle('${p.id}')">
      <div class="blog-card-img">${p.icon}</div>
      <div class="blog-card-body">
        <h3>${p.title}</h3><p>${p.excerpt}</p>
        <div class="blog-card-meta"><span class="blog-card-tag">${p.tag}</span><span>📅 ${p.date}</span></div>
      </div>
    </div>
  `).join('');
}

function openArticle(id) {
  const post = blogPosts.find(p => p.id === id); if (!post) return;
  document.getElementById('articleTitle').innerHTML = post.icon + ' ' + post.title;
  document.getElementById('articleContent').innerHTML = `<div class="blog-meta"><span>🏷 ${post.tag}</span><span>📅 ${post.date}</span></div>${post.content}`;
  document.getElementById('articleModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeArticle() { document.getElementById('articleModal').classList.remove('show'); document.body.style.overflow = ''; }
function callForArticle() { window.location.href = 'tel:09133908230'; }

/* ================== TOAST ================== */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer'); if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type; toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; setTimeout(() => toast.remove(), 300); }, 3200);
}

/* ================== REVEAL ================== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ================== INIT ================== */
document.addEventListener('DOMContentLoaded', initApp);
