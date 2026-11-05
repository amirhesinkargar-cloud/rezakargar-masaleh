// ================== اتصال به Supabase ==================
const SUPABASE_URL = 'https://gqsdfhwrjudnlpwicllm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U2Y8o_oo51UHNf-jNFyrsw_f22l1t1U';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================== اسپلش اسکرین ==================
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) setTimeout(() => splash.classList.add('hidden'), 500);
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
let favorites = JSON.parse(localStorage.getItem('kargar_favorites_v2') || '[]');

// ================== اسلایدر ==================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
function showSlide(index) { if(slides.length) slides.forEach((s, i) => s.classList.toggle('active', i === index)); }
function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
if(slides.length) setInterval(nextSlide, 4000);

// ================== دکمه‌های شناور ==================
function toggleInstaMenu(event) {
    if(event) event.stopPropagation();
    const popup = document.getElementById('instaPopup');
    if(popup) popup.classList.toggle('show');
}
document.addEventListener('click', function(e) {
    const popup = document.getElementById('instaPopup');
    if (popup && popup.classList.contains('show') && !e.target.closest('.floating-insta')) { 
        popup.classList.remove('show'); 
    }
});

// ================== علاقه‌مندی‌ها ==================
function toggleFav(id) {
    if(favorites.includes(id)) favorites = favorites.filter(x => x !== id);
    else favorites.push(id);
    localStorage.setItem('kargar_favorites_v2', JSON.stringify(favorites));
    renderProducts();
}

function openWishlist() {
    if(favorites.length === 0) { alert('لیست علاقه‌مندی‌ها خالی است.'); return; }
    let msg = "محصولات مورد علاقه من:\n\n";
    favorites.forEach(id => {
        let p = productsData.find(x => x.id === id);
        if(p) msg += `- ${p.name}\n`;
    });
    alert(msg);
}

// ================== محصولات ==================
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if(!container) return;
    let html = '';
    const categories = [...new Set(productsData.map(p => p.cat))];
    categories.forEach(cat => {
        html += `<div class="category-title">${cat}</div><div class="products-grid">`;
        productsData.filter(p => p.cat === cat).forEach(p => {
            const isFav = favorites.includes(p.id);
            // استفاده از ایموجی برای لود آنی
            const heartIcon = isFav ? '❤️' : '🤍';
            html += `
                <div class="product-card" data-name="${p.name} ${p.desc}">
                    <button class="wishlist-btn ${isFav?'active':''}" onclick="toggleFav('${p.id}')">
                        ${heartIcon}
                    </button>
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
    
    const elCount = document.getElementById('cartCount');
    if(elCount) elCount.innerText = totalItems;
    
    const elTotalItems = document.getElementById('cartTotalItems');
    if(elTotalItems) elTotalItems.innerText = totalItems;
    
    const elTotalTypes = document.getElementById('cartTotalTypes');
    if(elTotalTypes) elTotalTypes.innerText = totalTypes;
    
    const elTotalPrice = document.getElementById('cartTotalPrice');
    if(elTotalPrice) elTotalPrice.innerText = totalPrice.toLocaleString();
    
    const elFinalPrice = document.getElementById('cartFinalPrice');
    if(elFinalPrice) elFinalPrice.innerText = totalPrice.toLocaleString() + ' تومان';

    const container = document.getElementById('cartItemsContainer');
    if(!container) return;
    
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

// ================== پروفایل و ورود ==================
async function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    const btn = document.getElementById('authSubmitBtn');
    if (!email || !password) { alert('لطفا ایمیل و رمز عبور را وارد کنید'); return; }
    
    btn.disabled = true; btn.textContent = 'لطفا صبر کنید...';
    try {
        const isLoginMode = document.getElementById('authTitle').textContent === 'ورود به حساب';
        if (isLoginMode) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            alert('✅ خوش آمدید!');
            closeModal('authModal');
            updateAuthUI(data.user);
        } else {
            const { data, error } = await supabaseClient.auth.signUp({ email, password });
            if (error) throw error;
            alert('✅ ثبت‌نام موفق! حالا وارد شوید.');
            toggleAuthMode();
        }
    } catch (error) { 
        alert('❌ ' + error.message); 
    } finally { 
        btn.disabled = false; 
        btn.textContent = document.getElementById('authTitle').textContent === 'ورود به حساب' ? 'ورود' : 'ثبت‌نام'; 
    }
}

function toggleAuthMode() {
    const isLogin = document.getElementById('authTitle').textContent === 'ورود به حساب';
    document.getElementById('authTitle').textContent = isLogin ? 'ثبت‌نام' : 'ورود به حساب';
    document.getElementById('authSubmitBtn').textContent = isLogin ? 'ثبت‌نام' : 'ورود';
    document.getElementById('authToggleText').textContent = isLogin ? 'حساب دارید؟ وارد شوید' : 'حساب ندارید؟ ثبت‌نام کنید';
}

function updateAuthUI(user) {
    const btnText = document.getElementById('auth-btn-text');
    if(!btnText) return;
    if (user) {
        btnText.textContent = user.email.split('@')[0];
    } else {
        btnText.textContent = 'ورود / ثبت‌نام';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    updateAuthUI(session ? session.user : null);
});

// ================== ثبت سفارش روبیکا ==================
function sendOrderToRubika(type) {
    if (cart.length === 0) { alert('سبد خرید خالی است.'); return; }
    const lines = cart.map(x => `${x.name} - ${x.qty} عدد`).join('\n');
    let msg = "سفارش من:\n" + lines;
    navigator.clipboard.writeText(msg);
    if(type === 'masaleh') window.open('https://rubika.ir/Rezakargarborzi', '_blank');
    else window.open('https://rubika.ir/akargar01', '_blank');
    alert('لیست کپی شد و روبیکا باز می‌شود.');
    closeModal('cartModal');
}

// ================== نظرات ==================
function addReview() {
    const name = document.getElementById('revName').value;
    const text = document.getElementById('revText').value;
    if (!name || !text) { alert('لطفاً نام و متن نظر را وارد کنید.'); return; }
    
    let html = `
        <div class="review-card">
            <div class="review-header"><span>${name}</span><span>★★★★★</span></div>
            <div class="review-text">${text}</div>
        </div>
    `;
    const container = document.getElementById('reviewsList');
    if(container) container.innerHTML += html;
    closeModal('reviewModal');
    alert('✅ نظر شما ثبت شد.');
}

// ================== ابزارها ==================
function openModal(id) { 
    const modal = document.getElementById(id);
    if(modal) modal.classList.add('show'); 
}
function closeModal(id) { 
    const modal = document.getElementById(id);
    if(modal) modal.classList.remove('show'); 
}
function scrollToTop() { window.scrollTo({top:0, behavior:'smooth'}); }
function scrollToProducts() { 
    const el = document.getElementById('products');
    if(el) el.scrollIntoView({behavior:'smooth'}); 
}

document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', function(e) { if (e.target === this) closeModal(this.id); });
});

// ================== شروع ==================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
