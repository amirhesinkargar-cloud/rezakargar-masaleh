// ================== اسپلش اسکرین (فقط 0.5 ثانیه) ==================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
    }, 500); // ۰.۵ ثانیه
});

// ================== دیتابیس محصولات ==================
const productsData = [
    { id: 'c1', name: 'سیمان تیپ ۲', desc: 'مناسب بتن‌ریزی عمومی', img: '67.png', cat: 'سیمان', price: 95000 },
    { id: 'c2', name: 'سیمان تیپ ۵', desc: 'مقاوم در برابر سولفات', img: '67.png', cat: 'سیمان', price: 105000 },
    { id: 'c3', name: 'سیمان سفید', desc: 'برای نما و بندکشی', img: 'simans.png', cat: 'سیمان', price: 120000 },
    { id: 'b1', name: 'آجر گره‌ای', desc: 'مناسب دیوارچینی', img: '0987.jpg', cat: 'آجر و بلوک', price: 8000 },
    { id: 'b2', name: 'بلوک تیغه ۱۰', desc: 'دیوارچینی داخلی', img: 'gallery4.jpg', cat: 'آجر و بلوک', price: 15000 },
    { id: 'b3', name: 'بلوک سقفی', desc: 'برای تیرچه بلوک', img: 'gallery3.jpg', cat: 'آجر و بلوک', price: 20000 },
    { id: 'g1', name: 'گچ خورشید', desc: 'کیفیت عالی', img: 'gallery2.jpg', cat: 'گچ', price: 45000 },
    { id: 'g2', name: 'گچ شادیان', desc: 'سفیدکاری', img: 'gallery2.jpg', cat: 'گچ', price: 50000 },
    { id: 't1', name: 'کاشی ۶۰×۱۲۰', desc: 'براق و فوق براق', img: 'gallery1.jpg', cat: 'کاشی و سرامیک', price: 250000 },
    { id: 't2', name: 'سرامیک ۴۰×۱۲۰', desc: 'نما و حیاط', img: 'as.png', cat: 'کاشی و سرامیک', price: 180000 },
    { id: 't3', name: 'کاشی ۸۰×۸۰', desc: 'کف', img: 'gallery1.jpg', cat: 'کاشی و سرامیک', price: 220000 },
    { id: 'p1', name: 'لوله پلیکا', desc: 'فاضلاب', img: '0987.jpg', cat: 'لوله و اتصالات', price: 60000 },
    { id: 'p2', name: 'لوله پنج لایه', desc: 'آب گرم و سرد', img: '0987.jpg', cat: 'لوله و اتصالات', price: 150000 },
    { id: 'p3', name: 'اتصالات', desc: 'لوله‌کشی آب', img: '10.png', cat: 'لوله و اتصالات', price: 30000 },
    { id: 's1', name: 'شیرآلات بهداشتی', desc: 'برندهای معتبر', img: 'shiralat.png', cat: 'تاسیسات', price: 850000 },
    { id: 's2', name: 'پکیج دیواری', desc: 'با گارانتی', img: 'gallery5.jpg', cat: 'تاسیسات', price: 12000000 },
    { id: 's3', name: 'رادیاتور', desc: 'پنلی و آلومینیومی', img: '0987.jpg', cat: 'تاسیسات', price: 2500000 },
    { id: 's4', name: 'پمپ آب', desc: 'خانگی و صنعتی', img: 'poump.png', cat: 'تاسیسات', price: 3500000 },
    { id: 's5', name: 'مخزن آب', desc: 'افقی و عمودی', img: '0987.jpg', cat: 'تاسیسات', price: 1800000 }
];

let cart = [];
let currentUser = JSON.parse(localStorage.getItem('kargar_user')) || null;

// ================== اسلایدر ==================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
function showSlide(index) { slides.forEach((s, i) => s.classList.toggle('active', i === index)); }
function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
setInterval(nextSlide, 4000);

// ================== اینستاگرام ==================
function toggleInstaMenu(event) {
    event.stopPropagation();
    document.getElementById('instaPopup').classList.toggle('show');
}
document.addEventListener('click', function(e) {
    const popup = document.getElementById('instaPopup');
    if (popup.classList.contains('show') && !e.target.closest('.floating-insta')) { popup.classList.remove('show'); }
});

// ================== محصولات ==================
function renderProducts() {
    const container = document.getElementById('productsContainer');
    let html = '';
    const categories = [...new Set(productsData.map(p => p.cat))];
    categories.forEach(cat => {
        html += `<div class="category-title">${cat}</div><div class="products-grid">`;
        productsData.filter(p => p.cat === cat).forEach(p => {
            html += `
                <div class="product-card" data-name="${p.name} ${p.desc}">
                    <img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/150/2d3139/9ca3af?text=No+Image'">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <button class="add-btn" onclick="addToCart('${p.id}')">+ افزودن</button>
                </div>
            `;
        });
        html += `</div>`;
    });
    container.innerHTML = html;
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.trim();
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = card.getAttribute('data-name').includes(query) ? '' : 'none';
    });
}

// ================== سبد خرید ==================
function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name: product.name, price: product.price, qty: 1 });
    updateCartUI();
    alert(`✅ ${product.name} به سبد خرید اضافه شد.`);
}

function updateCartUI() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalTypes = cart.length;
    const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cartCount').innerText = totalItems;
    document.getElementById('cartTotalItems').innerText = totalItems;
    document.getElementById('cartTotalTypes').innerText = totalTypes;
    document.getElementById('cartTotalPrice').innerText = totalPrice.toLocaleString();
    document.getElementById('cartFinalPrice').innerText = totalPrice.toLocaleString() + ' تومان';

    const container = document.getElementById('cartItemsContainer');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:20px;">سبد خرید شما خالی است.</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} تومان</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">🗑</button>
                </div>
            </div>
        `).join('');
    }
}

function changeQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); updateCartUI(); }

function copyCart() {
    if (cart.length === 0) { alert('سبد خرید خالی است!'); return; }
    const text = 'لیست خرید از مصالح کارگر:\n\n' + cart.map(i => `${i.name} - ${i.qty} عدد - ${(i.price*i.qty).toLocaleString()} تومان`).join('\n') + `\n\nجمع کل: ${cart.reduce((s,i)=>s+(i.price*i.qty),0).toLocaleString()} تومان`;
    navigator.clipboard.writeText(text).then(() => alert('✅ لیست خرید کپی شد.'));
}

function payOrder() {
    if (cart.length === 0) { alert('سبد خرید خالی است!'); return; }
    if (!currentUser) { alert('لطفاً ابتدا وارد حساب کاربری خود شوید.'); openModal('profileModal'); return; }
    const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    alert(`💳 در حال انتقال به درگاه پرداخت...\nمبلغ: ${totalPrice.toLocaleString()} تومان`);
    setTimeout(() => {
        alert('✅ پرداخت با موفقیت انجام شد! سفارش شما ثبت گردید.');
        cart = [];
        updateCartUI();
        closeModal('cartModal');
    }, 2000);
}

// ================== پروفایل ==================
function renderProfile() {
    const container = document.getElementById('profileContent');
    if (currentUser) {
        container.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar" onclick="alert('آپلود عکس (شبیه‌سازی)')">
                    ${currentUser.avatar ? `<img src="${currentUser.avatar}">` : '👤'}
                </div>
                <div class="profile-name">${currentUser.name || 'کاربر کارگر'}</div>
                <div class="profile-phone">${currentUser.phone}</div>
            </div>
            <div class="profile-menu">
                <div class="profile-menu-item" onclick="alert('تاریخچه سفارشات خالی است.')"><span>📦 تاریخچه سفارشات</span><span>›</span></div>
                <div class="profile-menu-item" onclick="openModal('orderModal')"><span>📝 ثبت سفارش سریع</span><span>›</span></div>
                <div class="profile-menu-item" onclick="alert('در حال توسعه...')"><span>✏️ ویرایش اطلاعات</span><span>›</span></div>
                <div class="profile-menu-item" onclick="logout()" style="color:var(--primary);"><span>🚪 خروج از حساب</span><span>›</span></div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: center;">
                <h3 style="margin-bottom: 20px;">ورود / ثبت‌نام</h3>
                <div class="form-group"><label>شماره موبایل</label><input type="tel" class="form-control" id="loginPhone" placeholder="09123456789" dir="ltr"></div>
                <button class="submit-btn" onclick="sendCode()">دریافت کد پیامکی</button>
                <div id="codeSection" style="display: none; margin-top: 15px;">
                    <div class="form-group"><label>کد پیامکی</label><input type="text" class="form-control" id="loginCode" placeholder="1234" dir="ltr"></div>
                    <button class="submit-btn" onclick="verifyCode()">ورود</button>
                </div>
            </div>
        `;
    }
}

function sendCode() {
    const phone = document.getElementById('loginPhone').value;
    if (!phone || phone.length < 11) { alert('شماره موبایل معتبر وارد کنید.'); return; }
    document.getElementById('codeSection').style.display = 'block';
    alert('📩 کد پیامکی: 1234 (برای تست)');
}

function verifyCode() {
    const code = document.getElementById('loginCode').value;
    if (code !== '1234') { alert('کد وارد شده اشتباه است.'); return; }
    const phone = document.getElementById('loginPhone').value;
    currentUser = { phone: phone, name: 'کاربر کارگر', avatar: '' };
    localStorage.setItem('kargar_user', JSON.stringify(currentUser));
    renderProfile();
    alert('✅ با موفقیت وارد شدید.');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('kargar_user');
    renderProfile();
    alert('از حساب خود خارج شدید.');
}

// ================== ثبت سفارش ==================
function checkCity() {
    const city = document.getElementById('orderCity').value;
    const btn = document.getElementById('orderSubmitBtn');
    const warning = document.getElementById('cityWarning');
    if (city === 'shahrbabak' || city === 'baghin' || city === 'sirjan') {
        btn.disabled = false;
        warning.style.display = 'none';
    } else {
        btn.disabled = true;
        warning.style.display = 'block';
    }
}

function submitOrderForm() {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const city = document.getElementById('orderCity').value;
    if (!name || !phone || !city) { alert('لطفاً همه فیلدها را پر کنید.'); return; }
    if (city !== 'shahrbabak' && city !== 'baghin' && city !== 'sirjan') { alert('ارسال به این شهر امکان‌پذیر نیست.'); return; }
    alert(`✅ سفارش شما ثبت شد، ${name} عزیز. به زودی با شما تماس می‌گیریم.`);
    closeModal('orderModal');
}

// ================== محاسبه‌گر ==================
function switchCalc(type, event) {
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('calc-wall').style.display = type === 'wall' ? 'block' : 'none';
    document.getElementById('calc-ceiling').style.display = type === 'ceiling' ? 'block' : 'none';
    document.getElementById('calc-concrete').style.display = type === 'concrete' ? 'block' : 'none';
    document.getElementById('calc-tile').style.display = type === 'tile' ? 'block' : 'none';
}

function calcWall() {
    const L = parseFloat(document.getElementById('wallL').value) || 0;
    const H = parseFloat(document.getElementById('wallH').value) || 0;
    const blocks = Math.ceil(L * H * 10);
    const cement = Math.ceil(L * H * 0.5);
    document.getElementById('wallResult').innerHTML = `<div><span>تعداد بلوک:</span> <span>${blocks} عدد</span></div><div><span>سیمان (تخمینی):</span> <span>${cement} کیسه</span></div>`;
}

function calcCeiling() {
    const area = parseFloat(document.getElementById('ceilArea').value) || 0;
    const blocks = Math.ceil(area * 2);
    document.getElementById('ceilResult').innerHTML = `<div><span>بلوک سقفی:</span> <span>${blocks} عدد</span></div>`;
}

function calcConcrete() {
    const vol = parseFloat(document.getElementById('conVol').value) || 0;
    const cement = Math.ceil(vol * 5);
    document.getElementById('conResult').innerHTML = `<div><span>سیمان:</span> <span>${cement} کیسه ۵۰ کیلویی</span></div>`;
}

function calcTile() {
    const area = parseFloat(document.getElementById('tileArea').value) || 0;
    const tiles = Math.ceil(area * 6.25);
    document.getElementById('tileResult').innerHTML = `<div><span>تعداد کاشی (با پرت ۱۰٪):</span> <span>${tiles} عدد</span></div>`;
}

// ================== نظرات ==================
function addReview() {
    const name = document.getElementById('revName').value;
    const text = document.getElementById('revText').value;
    if (!name || !text) { alert('لطفاً نام و متن نظر را وارد کنید.'); return; }
    document.getElementById('reviewsList').innerHTML += `
        <div class="review-card">
            <div class="review-header"><span>${name}</span><span>★★★★★</span></div>
            <div class="review-text">${text}</div>
        </div>
    `;
    closeModal('reviewModal');
    alert('✅ نظر شما ثبت شد.');
}

// ================== ابزارها ==================
function openModal(id) { document.getElementById(id).classList.add('show'); if(id === 'profileModal') renderProfile(); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function scrollToTop() { window.scrollTo({top:0, behavior:'smooth'}); }
function scrollToProducts() { document.getElementById('products').scrollIntoView({behavior:'smooth'}); }

document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', function(e) { if (e.target === this) closeModal(this.id); });
});

// ================== شروع ==================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    calcWall(); calcCeiling(); calcConcrete(); calcTile();
});
