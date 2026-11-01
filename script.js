/* ============================================
   مصالح ساختمانی و تاسیسات مرکزی کارگر
   فایل جاوااسکریپت یکپارچه — هماهنگ با index.html
   ============================================ */

/* ================== CONFIG ================== */
const ADMIN_PASSWORD = 'admin1234';

/* ================== STATE ================== */
let cart = [];
let currentRating = 0;
let reviews = [];
let currentFilter = 'all';
let isAdminLoggedIn = false;
let logoClickCount = 0;
let logoClickTimer = null;

/* ================== LOAD/SAVE ================== */
function loadReviews() {
  try {
    const saved = localStorage.getItem('kargar_reviews');
    reviews = saved ? JSON.parse(saved) : [];
  } catch { reviews = []; }
}

function saveReviews() {
  try {
    localStorage.setItem('kargar_reviews', JSON.stringify(reviews));
  } catch (e) {
    showToast('❌ خطا در ذخیره نظرات', 'error');
  }
}

/* ================== TOAST ================== */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ================== REVEAL ================== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ================== CART ================== */
function activateProduct(productName, btn) {
  btn.style.display = 'none';
  const label = document.getElementById('label-' + productName);
  if (label) label.classList.add('hidden');
  const qtyControl = document.getElementById('qty-' + productName);
  if (qtyControl) qtyControl.classList.add('show');
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) { if (existingItem.qty < 100000) existingItem.qty++; }
  else { cart.push({ name: productName, qty: 1 }); }
  const input = document.getElementById('input-' + productName);
  if (input) { const item = cart.find(i => i.name === productName); if (item) input.value = item.qty; }
  updateCart();
  showToast('✅ به لیست خرید اضافه شد');
}

function decreaseQty(productName) {
  const item = cart.find(i => i.name === productName);
  if (!item) return;
  if (item.qty > 1) { item.qty--; }
  else {
    cart = cart.filter(i => i.name !== productName);
    const qtyControl = document.getElementById('qty-' + productName);
    if (qtyControl) qtyControl.classList.remove('show');
    const section = document.getElementById('section-' + productName);
    if (section) { const addBtn = section.querySelector('.add-icon-btn'); if (addBtn) addBtn.style.display = 'flex'; }
    const label = document.getElementById('label-' + productName);
    if (label) label.classList.remove('hidden');
  }
  const input = document.getElementById('input-' + productName);
  const currentItem = cart.find(i => i.name === productName);
  if (input && currentItem) input.value = currentItem.qty;
  updateCart();
}

function increaseQty(productName) {
  const item = cart.find(i => i.name === productName);
  if (item && item.qty < 100000) {
    item.qty++;
    const input = document.getElementById('input-' + productName);
    if (input) input.value = item.qty;
    updateCart();
  }
}

function setQty(productName, value) {
  let qty = parseInt(value) || 1;
  if (qty < 1) qty = 1;
  if (qty > 100000) qty = 100000;
  const item = cart.find(i => i.name === productName);
  if (item) { item.qty = qty; } else { cart.push({ name: productName, qty }); }
  const input = document.getElementById('input-' + productName);
  if (input) input.value = qty;
  updateCart();
}

function setCartQty(productName, value) {
  let qty = parseInt(value) || 1;
  if (qty < 1) qty = 1;
  if (qty > 100000) qty = 100000;
  const item = cart.find(i => i.name === productName);
  if (item) { item.qty = qty; }
  const productInput = document.getElementById('input-' + productName);
  if (productInput) productInput.value = qty;
  updateCart();
}

function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  const qtyControl = document.getElementById('qty-' + productName);
  if (qtyControl) qtyControl.classList.remove('show');
  const section = document.getElementById('section-' + productName);
  if (section) { const addBtn = section.querySelector('.add-icon-btn'); if (addBtn) addBtn.style.display = 'flex'; }
  const label = document.getElementById('label-' + productName);
  if (label) label.classList.remove('hidden');
  updateCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (!confirm('آیا از پاک کردن کل لیست مطمئن هستید؟')) return;
  cart.forEach(item => {
    const qtyControl = document.getElementById('qty-' + item.name);
    if (qtyControl) qtyControl.classList.remove('show');
    const section = document.getElementById('section-' + item.name);
    if (section) { const addBtn = section.querySelector('.add-icon-btn'); if (addBtn) addBtn.style.display = 'flex'; }
    const label = document.getElementById('label-' + item.name);
    if (label) label.classList.remove('hidden');
  });
  cart = [];
  updateCart();
  showToast('🗑 لیست خرید پاک شد', 'info');
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const summaryTypes = document.getElementById('summaryTypes');
  const summaryTotal = document.getElementById('summaryTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalTypes = cart.length;

  if (cartCount) cartCount.textContent = totalItems;
  if (summaryTypes) summaryTypes.textContent = totalTypes;
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
            <button onclick="event.stopPropagation(); decreaseQty('${item.name}')">−</button>
            <input type="number" value="${item.qty}" min="1" max="100000"
                   onchange="event.stopPropagation(); setCartQty('${item.name}', this.value)"
                   onclick="event.stopPropagation();">
            <button onclick="event.stopPropagation(); increaseQty('${item.name}')">+</button>
          </div>
          <button class="cart-item-remove" onclick="event.stopPropagation(); removeFromCart('${item.name}')" title="حذف">✕</button>
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
}

function cartToText() {
  return '🛒 لیست خرید من از مصالح ساختمانی و تاسیسات مرکزی کارگر:\n\n' +
    cart.map((item, i) => `${i+1}. ${item.name} — تعداد: ${item.qty}`).join('\n') +
    `\n\n📦 مجموع: ${cart.length} قلم کالا — ${cart.reduce((s, i) => s + i.qty, 0)} عدد`;
}

function sendToEita(type) {
  if (cart.length === 0) { showToast('⚠️ لیست شما خالی است', 'error'); return; }
  const text = cartToText();
  copyToClipboard(text).then(() => {
    showToast('✅ لیست کپی شد. ایتا باز می‌شود...');
    setTimeout(() => { window.location.href = 'eitaa://'; }, 700);
  });
}

function copyCart() {
  if (cart.length === 0) { showToast('⚠️ لیست شما خالی است', 'error'); return; }
  copyToClipboard(cartToText()).then(() => showToast('✅ لیست کپی شد'));
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
    resolve();
  });
}

/* ================== SEARCH ================== */
function normalize(str) {
  return (str || '').toString().toLowerCase()
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ۀهٔ]/g, 'ه')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .trim();
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
    resultInfo.innerHTML = '🔍 <strong>' + visibleCount + '</strong> محصول پیدا شد';
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

function setRating(value) {
  currentRating = value;
  updateStars(value);
}

function updateStars(value) {
  document.querySelectorAll('.star').forEach(star => {
    const v = parseInt(star.getAttribute('data-value'));
    star.classList.toggle('active', v <= value);
  });
}

function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name) { showToast('⚠️ لطفاً نام خود را وارد کنید', 'error'); return; }
  if (name.length < 2) { showToast('⚠️ نام باید حداقل ۲ حرف باشد', 'error'); return; }
  if (currentRating === 0) { showToast('⚠️ لطفاً امتیاز خود را انتخاب کنید', 'error'); return; }
  if (!text) { showToast('⚠️ لطفاً نظر خود را بنویسید', 'error'); return; }
  if (text.length < 10) { showToast('⚠️ نظر باید حداقل ۱۰ حرف باشد', 'error'); return; }

  const review = {
    id: Date.now(),
    name,
    text,
    rating: currentRating,
    status: 'pending',
    date: new Date().toISOString()
  };

  reviews.push(review);
  saveReviews();
  renderReviewsList();
  updateAdminStats();
  showToast('✅ نظر شما ثبت شد. پس از تأیید نمایش داده می‌شود.');
  closeReviewForm();
}

function renderReviewsList() {
  const container = document.getElementById('reviewsList');
  if (!container) return;
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
          <div class="review-author">
            <div class="review-avatar">${initials}</div>
            <span>${escapeHtml(r.name)}</span>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <p class="review-text">${escapeHtml(r.text)}</p>
        <span class="review-date">📅 ${dateStr}</span>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

/* ================== ADMIN ================== */
function tripleClickLogo() {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  if (logoClickCount >= 3) {
    logoClickCount = 0;
    openAdmin();
    return;
  }
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 600);
}

function openAdmin() {
  const overlay = document.getElementById('adminOverlay');
  if (!overlay) { showToast('❌ پنل ادمین در HTML موجود نیست', 'error'); return; }
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  if (isAdminLoggedIn) {
    showAdminPanel();
  } else {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    setTimeout(() => { const p = document.getElementById('adminPassword'); if (p) p.focus(); }, 200);
  }
}

function closeAdmin() {
  const overlay = document.getElementById('adminOverlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}

function loginAdmin() {
  const pass = document.getElementById('adminPassword').value;
  if (pass === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    showToast('✅ ورود موفق');
    showAdminPanel();
  } else {
    showToast('❌ رمز عبور اشتباه است', 'error');
    document.getElementById('adminPassword').value = '';
  }
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
  const elT = document.getElementById('statTotal');
  const elA = document.getElementById('statApproved');
  const elP = document.getElementById('statPending');
  if (elT) elT.textContent = total;
  if (elA) elA.textContent = approved;
  if (elP) elP.textContent = pending;
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
  let filtered = reviews;
  if (currentFilter !== 'all') {
    filtered = reviews.filter(r => r.status === currentFilter);
  }
  filtered = filtered.slice().reverse();

  if (filtered.length === 0) {
    container.innerHTML = `<div class="admin-empty">📭 هیچ نظری در این دسته وجود ندارد</div>`;
    return;
  }

  container.innerHTML = filtered.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const dateStr = new Date(r.date).toLocaleString('fa-IR');
    const statusLabels = { pending: '⏳ در انتظار', approved: '✅ تأیید شده', rejected: '❌ رد شده' };
    return `
      <div class="admin-review-item ${r.status}">
        <div class="admin-review-head">
          <div class="admin-review-name">
            <span>👤 ${escapeHtml(r.name)}</span>
            <span style="font-size: 11px; color: #94a3b8;">${statusLabels[r.status]}</span>
          </div>
          <div class="admin-review-stars">${stars}</div>
        </div>
        <p class="admin-review-text">${escapeHtml(r.text)}</p>
        <div style="font-size: 11px; color: #94a3b8;">📅 ${dateStr}</div>
        <div class="admin-review-actions">
          ${r.status !== 'approved' ? `<button class="btn-approve" onclick="approveReview(${r.id})">✅ تأیید</button>` : ''}
          ${r.status !== 'rejected' ? `<button class="btn-reject" onclick="rejectReview(${r.id})">❌ رد</button>` : ''}
          <button class="btn-delete" onclick="deleteReview(${r.id})">🗑 حذف</button>
        </div>
      </div>
    `;
  }).join('');
}

function approveReview(id) {
  const r = reviews.find(x => x.id === id);
  if (!r) return;
  r.status = 'approved';
  saveReviews();
  updateAdminStats();
  renderAdminReviews();
  renderReviewsList();
  showToast('✅ نظر تأیید شد');
}

function rejectReview(id) {
  const r = reviews.find(x => x.id === id);
  if (!r) return;
  r.status = 'rejected';
  saveReviews();
  updateAdminStats();
  renderAdminReviews();
  renderReviewsList();
  showToast('❌ نظر رد شد', 'info');
}

function deleteReview(id) {
  if (!confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
  reviews = reviews.filter(x => x.id !== id);
  saveReviews();
  updateAdminStats();
  renderAdminReviews();
  renderReviewsList();
  showToast('🗑 نظر حذف شد', 'info');
}

function exportReviews() {
  const dataStr = JSON.stringify(reviews, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kargar-reviews-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 فایل JSON دانلود شد');
}

function importReviews(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('فرمت نامعتبر');
      if (!confirm(`آیا ${imported.length} نظر بارگذاری شود؟ (نظرات فعلی جایگزین می‌شوند)`)) return;
      reviews = imported;
      saveReviews();
      updateAdminStats();
      renderAdminReviews();
      renderReviewsList();
      showToast('✅ نظرات با موفقیت بارگذاری شد');
    } catch (err) {
      showToast('❌ فایل JSON نامعتبر است', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ================== ASSISTANT ================== */
function toggleAssistant(event) {
  if (event) event.stopPropagation();
  document.getElementById('assistantWindow').classList.toggle('show');
  document.getElementById('instaMenu').classList.remove('show');
  document.getElementById('cartWindow').classList.remove('show');
}

function sendAssistantMsg() {
  const input = document.getElementById('assistantInput');
  const msg = input.value.trim();
  if (!msg) return;
  addMsg(msg, 'user');
  input.value = '';
  setTimeout(() => {
    const reply = getAssistantReply(msg);
    addMsg(reply, 'bot');
  }, 400);
}

const knowledgeBase = {
  'سیمان': '💡 سیمان تیپ ۱ برای کارهای عمومی، تیپ ۲ برای بتن‌ریزی معمولی، تیپ ۵ برای بتن‌های حساس به سولفات.\n📞 استعلام قیمت: ۰۹۱۳۳۹۰۸۲۳۰',
  'بلوک': '💡 بلوک تیغه برای دیوارچینی داخلی، بلوک سقفی برای تیرچه بلوک.\n📏 برای هر متر مربع دیوار حدود ۱۰ عدد بلوک.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'کاشی': '💡 کاشی دیواری و کف در طرح‌ها و رنگ‌های متنوع.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'سرامیک': '💡 سرامیک کف و دیوار با مقاومت بالا.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'گچ': '💡 گچ سفیدکاری و ساختمانی، کیسه‌های ۳۰ و ۴۰ کیلویی.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'لوله': '💡 لوله پلیکا، پنج لایه، پنبه‌ای و فلزی در سایزهای مختلف.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'پکیج': '💡 پکیج دیواری و زمینی با گارانتی.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'رادیاتور': '💡 رادیاتور پنلی و آلومینیومی در ابعاد مختلف.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'شیرآلات': '💡 شیرآلات بهداشتی و ساختمانی از برندهای معتبر.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'سینک': '💡 سینک ظرفشویی استیل و گرانیتی در ابعاد مختلف.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'چینی': '💡 توالت ایرانی و فرنگی از برندهای معتبر.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'پمپ': '💡 پمپ آب خانگی، نیمه صنعتی و صنعتی.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'مخزن': '💡 مخازن آب افقی، عمودی، ایستاده و خوابیده.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'هود': '💡 هود آشپزخانه در مدل‌های مختلف.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'گاز': '💡 گاز صفحه‌ای در مدل‌ها و سایزهای مختلف.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'آینه': '💡 آینه‌های سرویس بهداشتی در ابعاد و طرح‌های متنوع.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'فلاش': '💡 فلاش تانک توکار و روکار در مدل‌های مختلف.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'موزاییک': '💡 موزاییک پرسی و معمولی برای محوطه‌سازی.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'آجر': '💡 آجر گره‌ای و سفال برای دیوارچینی و نماکاری.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'آهک': '💡 آهک کیسه‌ای و ساختمانی برای ملات و شفته‌ریزی.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'پودر سنگ': '💡 پودر سنگ جوشقان و سایر معادن.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'اتصالات': '💡 انواع اتصالات لوله‌کشی آب و فاضلاب.\n📞 ۰۹۱۳۳۹۰۸۳۹۳',
  'دیوار': '💡 برای هر متر مربع دیوار تیغه‌ای: ۱۰ عدد بلوک + ۵ کیلو گچ + ۳ کیلو سیمان.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'سقف': '💡 برای هر متر مربع سقف تیرچه بلوک: ۲ عدد بلوک سقفی + تیرچه + میلگرد.\n📞 ۰۹۱۳۳۹۰۸۲۳۰',
  'قیمت': '💰 برای استعلام قیمت روز:\n📞 مصالح: ۰۹۱۳۳۹۰۸۲۳۰\n📞 تاسیسات: ۰۹۱۳۳۹۰۸۳۹۳',
  'تماس': '📞 مصالح: ۰۹۱۳۳۹۰۸۲۳۰\n📞 تاسیسات: ۰۹۱۳۳۹۰۸۳۹۳\n📞 مغازه: ۰۳۴-۳۴۳۴۱۳۰۳',
  'آدرس': '📍 شهربابک، خیابان مطهری، نبش کوچه ۱۱\n⏰ شنبه تا پنجشنبه، ۸ صبح تا ۸ شب',
  'ارسال': '✅ ارسال سریع با ناوگان خودمون در شهربابک و حومه.',
  'سلام': 'سلام و خوش آمدید! 😊 چطور می‌تونم کمکتون کنم؟'
};

function getAssistantReply(msg) {
  const lower = normalize(msg);
  const sortedKeys = Object.keys(knowledgeBase).sort((a,b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(normalize(key))) return knowledgeBase[key];
  }
  return 'متأسفم، متوجه نشدم. 🤔\n\nمی‌تونید اینا رو بپرسید:\n• قیمت سیمان چنده؟\n• برای دیوارچینی چی لازم دارم؟\n• آدرس فروشگاه کجاست؟\n• پکیج دارید؟\n\nیا تماس بگیرید:\n📞 ۰۹۱۳۳۹۰۸۲۳۰';
}

function addMsg(text, type) {
  const container = document.getElementById('assistantMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'assistant-msg ' + type;
  div.innerHTML = text.replace(/\n/g, '<br>');
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

/* ================== INSTA MENU ================== */
function toggleInstaMenu(event) {
  if (event) event.stopPropagation();
  document.getElementById('instaMenu').classList.toggle('show');
  document.getElementById('cartWindow').classList.remove('show');
  document.getElementById('assistantWindow').classList.remove('show');
}

/* ================== GLOBAL CLICK ================== */
document.addEventListener('click', function(event) {
  const menu = document.getElementById('instaMenu');
  const instaBtn = document.querySelector('.floating-insta-btn');
  const cartWindow = document.getElementById('cartWindow');
  const cartBtn = document.getElementById('floatingCartBtn');
  const assistantWindow = document.getElementById('assistantWindow');
  const assistantBtn = document.querySelector('.floating-assistant-btn');

  if (instaBtn && !instaBtn.contains(event.target) && menu && !menu.contains(event.target)) {
    menu.classList.remove('show');
  }
  if (cartBtn && !cartBtn.contains(event.target) && cartWindow && !cartWindow.contains(event.target)) {
    cartWindow.classList.remove('show');
  }
  if (assistantBtn && !assistantBtn.contains(event.target) && assistantWindow && !assistantWindow.contains(event.target)) {
    assistantWindow.classList.remove('show');
  }
  if (event.target.classList && event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('show');
    document.body.style.overflow = '';
  }
});

/* ================== KEYBOARD ================== */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    openAdmin();
  }
  if (e.key === 'Escape') {
    document.getElementById('cartWindow').classList.remove('show');
    document.getElementById('assistantWindow').classList.remove('show');
    document.getElementById('instaMenu').classList.remove('show');
    document.querySelectorAll('.modal-overlay.show').forEach(m => {
      m.classList.remove('show');
      document.body.style.overflow = '';
    });
    const adminOv = document.getElementById('adminOverlay');
    if (adminOv && adminOv.classList.contains('show')) closeAdmin();
  }
});

/* ================== ORDER ================== */
function openOrderForm() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeOrderForm() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function submitOrder() {
  const name = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const type = document.getElementById('orderType').value;
  const note = document.getElementById('orderNote').value.trim();

  if (!name || name.length < 2) { showToast('⚠️ نام را درست وارد کنید', 'error'); return; }
  if (!/^09\d{9}$/.test(phone)) { showToast('⚠️ شماره موبایل معتبر وارد کنید (مثل 09xxxxxxxxx)', 'error'); return; }
  if (!address || address.length < 5) { showToast('⚠️ آدرس را کامل وارد کنید', 'error'); return; }

  let text = '🛒 سفارش آنلاین جدید از سایت کارگر:\n\n';
  text += '👤 نام: ' + name + '\n';
  text += '📞 تلفن: ' + phone + '\n';
  text += '📍 آدرس: ' + address + '\n';
  text += '📦 نوع: ' + (type === 'masaleh' ? 'مصالح ساختمانی' : type === 'tasisat' ? 'تاسیسات' : 'مصالح + تاسیسات') + '\n';
  if (note) text += '📝 توضیحات: ' + note + '\n';

  if (cart.length > 0) {
    text += '\n--- لیست خرید ---\n';
    cart.forEach((item, i) => {
      text += `${i+1}. ${item.name} — تعداد: ${item.qty}\n`;
    });
    text += `\n📦 مجموع: ${cart.length} قلم — ${cart.reduce((s, i) => s + i.qty, 0)} عدد`;
  } else {
    text += '\n(لیست خرید خالی)';
  }

  copyToClipboard(text).then(() => {
    showToast('✅ سفارش کپی شد. در حال باز کردن ایتا...');
    setTimeout(() => {
      if (cart.length > 0) {
        cart = [];
        updateCart();
        document.querySelectorAll('[id^="qty-"]').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.add-icon-btn').forEach(b => b.style.display = 'flex');
        document.querySelectorAll('.add-label').forEach(l => l.classList.remove('hidden'));
      }
      closeOrderForm();
    }, 1500);
  });
}

/* ================== CALCULATOR ================== */
function openCalculator() {
  const modal = document.getElementById('calcModal');
  if (!modal) return;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  calcWall();
  calcCeiling();
  calcConcrete();
  calcTile();
}

function closeCalculator() {
  const modal = document.getElementById('calcModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function switchCalc(name, btn) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('calc-' + name);
  if (panel) panel.classList.add('active');
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
    <h4>📊 نتیجه محاسبه</h4>
    <div class="calc-result-item"><span>مساحت دیوار:</span><span>${area.toFixed(2)} متر مربع</span></div>
    <div class="calc-result-item"><span>تعداد بلوک:</span><span>${blocks} عدد</span></div>
    <div class="calc-result-item"><span>سیمان (تخمینی):</span><span>${cement} کیسه</span></div>
    <div class="calc-result-item"><span>ماسه (تخمینی):</span><span>${sand} متر مکعب</span></div>
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
    <h4>📊 نتیجه محاسبه سقف تیرچه بلوک</h4>
    <div class="calc-result-item"><span>مساحت سقف:</span><span>${area.toFixed(2)} متر مربع</span></div>
    <div class="calc-result-item"><span>بلوک سقفی:</span><span>${blocks} عدد</span></div>
    <div class="calc-result-item"><span>تیرچه:</span><span>${joists} عدد</span></div>
    <div class="calc-result-item"><span>سیمان (تخمینی):</span><span>${cement} کیسه</span></div>
    <div class="calc-result-item"><span>میلگرد (تخمینی):</span><span>${steel} کیلوگرم</span></div>
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
    <h4>📊 نتیجه محاسبه بتن</h4>
    <div class="calc-result-item"><span>حجم بتن:</span><span>${vol.toFixed(2)} متر مکعب</span></div>
    <div class="calc-result-item"><span>عیار سیمان:</span><span>${grade} kg/m³</span></div>
    <div class="calc-result-item"><span>سیمان:</span><span>${cement} کیسه ۵۰ کیلویی</span></div>
    <div class="calc-result-item"><span>ماسه:</span><span>${sand} متر مکعب</span></div>
    <div class="calc-result-item"><span>شن:</span><span>${gravel} متر مکعب</span></div>
    <div class="calc-result-item"><span>آب (تخمینی):</span><span>${water} لیتر</span></div>
  `;
  window._lastCalc = { cement, sand, gravel, vol };
}

function calcTile() {
  const area = parseFloat(document.getElementById('tileArea').value) || 0;
  const size = document.getElementById('tileSize').value.split('x');
  const tileArea = (parseFloat(size[0]) * parseFloat(size[1])) / 10000;
  const tilesPerSqm = 1 / tileArea;
  const totalTiles = Math.ceil(area * tilesPerSqm * 1.1);
  const boxes = Math.ceil(totalTiles / 10);
  const cement = Math.ceil(area * 0.4);
  document.getElementById('tileResult').innerHTML = `
    <h4>📊 نتیجه محاسبه کاشی‌کاری</h4>
    <div class="calc-result-item"><span>مساحت:</span><span>${area.toFixed(2)} متر مربع</span></div>
    <div class="calc-result-item"><span>ابعاد کاشی:</span><span>${size[0]}×${size[1]} سانتی</span></div>
    <div class="calc-result-item"><span>تعداد کاشی (با پرت ۱۰٪):</span><span>${totalTiles} عدد</span></div>
    <div class="calc-result-item"><span>تعداد کارتن (۱۰ عددی):</span><span>${boxes} کارتن</span></div>
    <div class="calc-result-item"><span>سیمان (تخمینی):</span><span>${cement} کیسه</span></div>
  `;
  window._lastCalc = { totalTiles, boxes, cement, area };
}

function addCalcToCart() {
  const activePanel = document.querySelector('.calc-panel.active');
  if (!activePanel) return;
  const nameMap = { 'calc-wall': 'بلوک تیغه', 'calc-ceiling': 'بلوک سقفی', 'calc-concrete': 'سیمان', 'calc-tile': 'کاشی' };
  const productName = nameMap[activePanel.id];
  if (!productName) return;
  let qty = 1;
  if (activePanel.id === 'calc-wall' && window._lastCalc) qty = window._lastCalc.blocks;
  if (activePanel.id === 'calc-ceiling' && window._lastCalc) qty = window._lastCalc.blocks;
  if (activePanel.id === 'calc-concrete' && window._lastCalc) qty = window._lastCalc.cement;
  if (activePanel.id === 'calc-tile' && window._lastCalc) qty = window._lastCalc.totalTiles;
  const existing = cart.find(i => i.name === productName);
  if (existing) existing.qty += qty;
  else cart.push({ name: productName, qty: qty });
  updateCart();
  showToast(`✅ ${qty} عدد ${productName} به لیست اضافه شد`);
  closeCalculator();
}

/* ================== BLOG ================== */
const blogPosts = [
  {
    id: 'cement-guide', tag: 'مصالح', icon: '🏗',
    title: 'راهنمای کامل انتخاب سیمان مناسب برای پروژه',
    excerpt: 'سیمان تیپ ۱، ۲، ۵ یا سفید؟ کدوم برای پروژه شما مناسبه؟ تفاوت‌ها و کاربردهای هرکدوم رو بررسی می‌کنیم.',
    date: '۱۴۰۳/۰۸/۱۵',
    content: `
      <h2>مقدمه</h2>
      <p>انتخاب سیمان مناسب، یکی از مهم‌ترین تصمیمات در هر پروژه ساختمانی است. سیمان‌های مختلف خواص متفاوتی دارند و استفاده نادرست از آنها می‌تواند منجر به ترک، ریزش و کاهش عمر سازه شود.</p>
      <h3>۱. سیمان تیپ ۱ (سیمان معمولی)</h3>
      <p>پرمصرف‌ترین نوع سیمان که برای کارهای عمومی ساختمانی مثل بتن‌ریزی، ملات، بندکشی و نماکاری استفاده می‌شود. <strong>کاربرد:</strong> پروژه‌های معمولی، سازه‌های بتنی غیر حساس.</p>
      <h3>۲. سیمان تیپ ۲</h3>
      <p>سیمان اصلاح‌شده که حرارت هیدراتاسیون کمتری دارد. برای بتن‌ریزی در حجم زیاد و هوای گرم مناسب است.</p>
      <h3>۳. سیمان تیپ ۵</h3>
      <p>سیمان ضد سولفات که در برابر حمله سولفات‌ها مقاوم است. <strong>کاربرد:</strong> سازه‌های در تماس با آب دریا، فاضلاب، خاک‌های سولفاته.</p>
      <h3>۴. سیمان سفید</h3>
      <p>برای نماکاری، بندکشی و کارهای تزئینی استفاده می‌شود.</p>
      <div class="highlight">💡 <strong>نکته مهم:</strong> برای پروژه‌های خاص حتماً با کارشناس ما مشورت کنید. تماس: ۰۹۱۳۳۹۰۸۲۳۰</div>
    `
  },
  {
    id: 'wall-blocks', tag: 'مصالح', icon: '🧱',
    title: 'چگونه تعداد بلوک مورد نیاز دیوار را محاسبه کنیم؟',
    excerpt: 'فرمول ساده محاسبه بلوک تیغه و سقفی + نکات مهم در خرید که پول و زمان شما رو ذخیره می‌کنه.',
    date: '۱۴۰۳/۰۸/۱۰',
    content: `
      <h2>مقدمه</h2>
      <p>یکی از پرتکرارترین سوالات مشتریان، محاسبه تعداد بلوک مورد نیاز است. محاسبه دقیق باعث می‌شود نه اضافه بخری و نه وسط کار بمانی!</p>
      <h3>فرمول محاسبه بلوک تیغه</h3>
      <p><strong>تعداد بلوک = مساحت دیوار (متر مربع) × تعداد بلوک در متر مربع</strong></p>
      <ul>
        <li>بلوک ۱۰ سانتی: ۱۰ عدد در متر مربع</li>
        <li>بلوک ۱۵ سانتی: ۷ عدد در متر مربع</li>
        <li>بلوک ۲۰ سانتی: ۵ عدد در متر مربع</li>
      </ul>
      <h3>مثال عملی</h3>
      <p>دیواری به طول ۱۰ متر و ارتفاع ۳ متر: مساحت = ۳۰ متر مربع. اگر بلوک ۱۰ سانتی استفاده کنیم: ۳۰ × ۱۰ = ۳۰۰ عدد بلوک.</p>
      <div class="highlight">⚠️ <strong>نکات مهم:</strong><br>• همیشه ۵٪ پرت اضافه کن<br>• درب و پنجره رو کم کن<br>• برای دیوار حمال از بلوک مناسب استفاده کن</div>
      <h3>محاسبه بلوک سقفی</h3>
      <p>برای هر متر مربع سقف تیرچه بلوک، حدود <strong>۲ عدد بلوک سقفی</strong> نیاز است. مثلا برای ۱۰۰ متر سقف: ۲۰۰ عدد بلوک.</p>
    `
  },
  {
    id: 'pipes-guide', tag: 'تاسیسات', icon: '🔧',
    title: 'انواع لوله ساختمانی و کاربرد هرکدام',
    excerpt: 'پلیکا، پنج لایه، پنبه‌ای یا فلزی؟ برای آب سرد، گرم و فاضلاب کدام لوله رو انتخاب کنیم؟',
    date: '۱۴۰۳/۰۸/۰۵',
    content: `
      <h2>مقدمه</h2>
      <p>انتخاب لوله مناسب برای آب‌رسانی و فاضلاب، نقش کلیدی در دوام تاسیسات ساختمان دارد.</p>
      <h3>۱. لوله پلیکا (PVC)</h3>
      <p>برای فاضلاب و آب سرد استفاده می‌شود. <strong>مزایا:</strong> ارزان، سبک، نصب راحت. <strong>معایب:</strong> در برابر حرارت ضعیف است.</p>
      <h3>۲. لوله پنج لایه (PEX-AL-PEX)</h3>
      <p>برای آب گرم و سرد و حتی سیستم گرمایش از کف. <strong>مزایا:</strong> مقاوم به حرارت و فشار، عمر طولانی.</p>
      <h3>۳. لوله پنبه‌ای (گالوانیزه)</h3>
      <p>برای آب سرد و گرم. <strong>معایب:</strong> زنگ‌زدگی در بلندمدت.</p>
      <h3>۴. لوله فلزی (مسی و فولادی)</h3>
      <p>برای سیستم‌های خاص. مسی گران ولی بادوام است.</p>
      <div class="highlight">💡 <strong>توصیه ما:</strong> برای آب گرم از پنج لایه، برای فاضلاب از پلیکا و برای آب سرد از پلیکا یا پنج لایه استفاده کنید.</div>
    `
  },
  {
    id: 'package-guide', tag: 'تاسیسات', icon: '🔥',
    title: 'راهنمای خرید پکیج دیواری؛ ظرفیت مناسب خانه شما چقدره؟',
    excerpt: 'پکیج ۲۴ یا ۲۸؟ برای خانه ۱۰۰ متری چی بگیریم؟ معیارهای انتخاب پکیج رو بررسی می‌کنیم.',
    date: '۱۴۰۳/۰۷/۲۸',
    content: `
      <h2>مقدمه</h2>
      <p>پکیج دیواری یکی از اصلی‌ترین تجهیزات گرمایشی خانه‌های مدرن است. انتخاب اشتباه ظرفیت باعث هدررفت انرژی یا کمبود گرمایش می‌شود.</p>
      <h3>ظرفیت پکیج بر اساس متراژ</h3>
      <ul>
        <li>تا ۸۰ متر → پکیج ۲۴ هزار</li>
        <li>۸۰ تا ۱۲۰ متر → پکیج ۲۴ یا ۲۸ هزار</li>
        <li>۱۲۰ تا ۱۸۰ متر → پکیج ۳۲ هزار</li>
        <li>بالای ۱۸۰ متر → پکیج ۳۵ به بالا</li>
      </ul>
      <h3>نکات مهم در خرید</h3>
      <p><strong>۱. برند معتبر:</strong> برندهای اروپایی و ایرانی معتبر با گارانتی.</p>
      <p><strong>۲. نوع سوخت:</strong> گاز طبیعی یا دوگانه‌سوز.</p>
      <p><strong>۳. تکنولوژی:</strong> فن‌دار یا بدون فن.</p>
      <p><strong>۴. خدمات پس از فروش:</strong> حتماً نمایندگی رسمی باشد.</p>
      <div class="highlight">⚠️ <strong>توجه:</strong> نصب پکیج حتماً باید توسط نصاب مجاز انجام شود تا گارانتی معتبر باشد.</div>
    `
  },
  {
    id: 'sanitary-guide', tag: 'تاسیسات', icon: '🚽',
    title: 'چگونه چینی بهداشتی باکیفیت بخریم؟',
    excerpt: 'توالت ایرانی، فرنگی، والهنگ یا زمینی؟ ملاک‌های تشخیص کیفیت چینی بهداشتی چیه؟',
    date: '۱۴۰۳/۰۷/۲۰',
    content: `
      <h2>مقدمه</h2>
      <p>چینی بهداشتی یکی از اقلامی است که سال‌ها در خانه می‌ماند، پس خرید باکیفیت اهمیت زیادی دارد.</p>
      <h3>ملاک‌های کیفیت چینی</h3>
      <p><strong>۱. لعاب:</strong> لعاب صاف و براق نشانه کیفیت است.</p>
      <p><strong>۲. ضخامت:</strong> چینی خوب سنگین‌تر است.</p>
      <p><strong>۳. رنگ:</strong> رنگ یکنواخت بدون لکه.</p>
      <p><strong>۴. نشان استاندارد:</strong> حتماً داشته باشد.</p>
      <h3>توالت ایرانی یا فرنگی؟</h3>
      <ul>
        <li><strong>ایرانی:</strong> بهداشتی‌تر از نظر پزشکی، مناسب مکان‌های عمومی</li>
        <li><strong>فرنگی:</strong> راحت‌تر برای سالمندان و افراد دارای مشکل حرکتی</li>
      </ul>
      <h3>انواع توالت فرنگی</h3>
      <ul>
        <li><strong>زمینی:</strong> ساده و ارزان</li>
        <li><strong>والهنگ:</strong> نصب روی دیوار، تمیز کردن راحت</li>
        <li><strong>یک تکه:</strong> یکپارچه، شیک‌تر</li>
      </ul>
      <div class="highlight">💡 <strong>توصیه:</strong> هنگام خرید، حتماً از نزدیک ببینید و از فروشنده معتبر بخرید.</div>
    `
  }
];

function renderBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = blogPosts.map(p => `
    <div class="blog-card" onclick="openArticle('${p.id}')">
      <div class="blog-card-img">${p.icon}</div>
      <div class="blog-card-body">
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="blog-card-meta">
          <span class="blog-card-tag">${p.tag}</span>
          <span>📅 ${p.date}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openArticle(id) {
  const post = blogPosts.find(p => p.id === id);
  if (!post) return;
  document.getElementById('articleTitle').innerHTML = post.icon + ' ' + post.title;
  document.getElementById('articleContent').innerHTML = `
    <div class="blog-meta">
      <span>🏷 ${post.tag}</span>
      <span>📅 ${post.date}</span>
    </div>
    ${post.content}
  `;
  document.getElementById('articleModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  document.getElementById('articleModal').classList.remove('show');
  document.body.style.overflow = '';
}

function callForArticle() {
  window.location.href = 'tel:09133908230';
}

/* ================== INIT ================== */
document.addEventListener('DOMContentLoaded', () => {
  loadReviews();
  renderReviewsList();
  updateCart();
  initReveal();
  renderBlog();
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');
});
