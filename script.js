// ===== محتوى المصدر =====
// ملاحظة: النصوص الدينية هنا يجب مراجعتها والتأكد من صحتها قبل الاعتماد عليها في صفحة حقيقية.
const المحتوى = {
  اية: [
    "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    "وَبَشِّرِ الصَّابِرِينَ"
  ],
  حديث: [
    "خيركم من تعلم القرآن وعلمه",
    "تبسمك في وجه أخيك صدقة",
    "الدين النصيحة"
  ],
  حكمة: [
    "من حسن إسلام المرء تركه ما لا يعنيه",
    "رأس الحكمة مخافة الله",
    "خير الأمور أوسطها"
  ]
};

const الهاشتاغات = "#اسلاميات #قران #حديث #دعاء";

let النوع_الحالي = "اية";

// ===== عناصر الصفحة =====
const postBox = document.getElementById('post');
const logBox = document.getElementById('log');
const chips = document.querySelectorAll('.chip');

// ===== تبديل نوع المحتوى =====
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    النوع_الحالي = chip.dataset.type;
  });
});

// ===== توليد منشور =====
document.getElementById('generateBtn').addEventListener('click', انشئ_منشور);

function انشئ_منشور() {
  const قائمة = المحتوى[النوع_الحالي];
  const النص = قائمة[Math.floor(Math.random() * قائمة.length)];
  const المنشور = `🌙 ${النص}\n\n${الهاشتاغات}`;
  postBox.value = المنشور;
  اضف_للسجل(`تم توليد منشور (${النوع_الحالي})`);
}

// ===== نسخ المنشور =====
document.getElementById('copyBtn').addEventListener('click', () => {
  if (!postBox.value) {
    اضف_للسجل("لا يوجد نص لنسخه بعد");
    return;
  }
  navigator.clipboard.writeText(postBox.value)
    .then(() => اضف_للسجل("تم نسخ النص"))
    .catch(() => اضف_للسجل("تعذر النسخ، انسخ يدويًا"));
});

// ===== حفظ في السجل / إحصائيات =====
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!postBox.value) {
    اضف_للسجل("ولّد منشورًا أولًا قبل الحفظ");
    return;
  }
  حفظ_منشور(postBox.value);
  اضف_للسجل("تم حفظ المنشور في السجل");
  حدث_الإحصائيات();
});

function حفظ_منشور(نص) {
  const البيانات = تحميل_البيانات();
  البيانات.posts.push({ text: نص, date: new Date().toISOString() });
  localStorage.setItem('yassirai_البيانات', JSON.stringify(البيانات));
}

function تحميل_البيانات() {
  try {
    const خام = localStorage.getItem('yassirai_البيانات');
    return خام ? JSON.parse(خام) : { posts: [] };
  } catch {
    return { posts: [] };
  }
}

// ===== إحصائيات الانتظام =====
function حدث_الإحصائيات() {
  const { posts } = تحميل_البيانات();

  document.getElementById('totalPosts').textContent = posts.length;

  const الآن = new Date();
  const بداية_الأسبوع = new Date(الآن);
  بداية_الأسبوع.setDate(الآن.getDate() - 7);
  const هذا_الأسبوع = posts.filter(p => new Date(p.date) >= بداية_الأسبوع);
  document.getElementById('weekPosts').textContent = هذا_الأسبوع.length;

  // أيام متتالية فيها منشور واحد على الأقل
  const أيام = new Set(posts.map(p => new Date(p.date).toDateString()));
  let عداد = 0;
  let يوم_فحص = new Date();
  while (أيام.has(يوم_فحص.toDateString())) {
    عداد++;
    يوم_فحص.setDate(يوم_فحص.getDate() - 1);
  }
  document.getElementById('streakDays').textContent = عداد;
}

// ===== تذكير محلي =====
document.getElementById('reminderBtn').addEventListener('click', () => {
  const دقائق = parseInt(document.getElementById('reminderMinutes').value);
  if (!دقائق || دقائق <= 0) {
    اضف_للسجل("أدخل عدد دقائق صحيح");
    return;
  }
  اضف_للسجل(`تم ضبط تذكير بعد ${دقائق} دقيقة (يعمل فقط ما دام هذا التبويب مفتوحًا)`);
  setTimeout(() => {
    اضف_للسجل("⏰ حان وقت النشر المخطط له");
    if (Notification && Notification.permission === "granted") {
      new Notification("حان وقت النشر", { body: "جهّز منشورك الآن" });
    }
  }, دقائق * 60 * 1000);
});

if (typeof Notification !== "undefined" && Notification.permission === "default") {
  Notification.requestPermission();
}

// ===== السجل =====
function اضف_للسجل(نص) {
  const فارغ = logBox.querySelector('.log-empty');
  if (فارغ) فارغ.remove();

  const وقت = new Date().toLocaleTimeString('ar');
  const سطر = document.createElement('p');
  سطر.textContent = `[${وقت}] ${نص}`;
  logBox.appendChild(سطر);
  logBox.scrollTop = logBox.scrollHeight;
}

// ===== تشغيل أولي =====
حدث_الإحصائيات();
انشئ_منشور();
