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
