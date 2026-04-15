const firebaseSettings = {
  enabled: false,
  shareCollection: "portfolioShares",
  storageFolder: "portfolio-assets",
  config: {
    apiKey: "ضع-apiKey-هنا",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
  }
};
function isFirebaseConfigured() {
  const c = firebaseSettings.config || {};
  return Boolean(firebaseSettings.enabled && c.apiKey && c.authDomain && c.projectId && c.storageBucket && c.messagingSenderId && c.appId && !String(c.apiKey).includes("ضع-") && !String(c.projectId).includes("your-project-id"));
}
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
async function ensureFirebaseSdk() {
  if (!isFirebaseConfigured()) return false;
  if (firebaseApp && firebaseAuth && firebaseDb && firebaseStorage) return true;
  const [{ initializeApp }, { getAuth, signInAnonymously }, { getFirestore, doc, getDoc, setDoc, serverTimestamp }, { getStorage, ref, uploadBytes, getDownloadURL }] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js")
  ]);
  firebaseApp = initializeApp(firebaseSettings.config);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
  firebaseStorage = getStorage(firebaseApp);
  window.__firebaseShareApi = { signInAnonymously, doc, getDoc, setDoc, serverTimestamp, ref, uploadBytes, getDownloadURL };
  return true;
}
function canUseFirebaseShare() {
  return isFirebaseConfigured();
}
async function ensureFirebaseUser() {
  await ensureFirebaseSdk();
  if (!canUseFirebaseShare()) throw new Error("firebase_not_configured");
  if (firebaseAuth.currentUser) return firebaseAuth.currentUser;
  const credential = await window.__firebaseShareApi.signInAnonymously(firebaseAuth);
  return credential.user;
}
function isBase64DataUrl(value) {
  return typeof value === "string" && value.startsWith("data:") && value.includes(";base64,");
}
function dataUrlToBlob(value) {
  const [meta, base64 = ""] = String(value).split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mimeType }), mimeType };
}
function extFromMime(mimeType) {
  const map = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogv" };
  return map[mimeType] || "bin";
}
async function uploadIfNeeded(value, pathPrefix) {
  if (!isBase64DataUrl(value)) return value;
  await ensureFirebaseSdk();
  const { blob, mimeType } = dataUrlToBlob(value);
  const storageRef = window.__firebaseShareApi.ref(firebaseStorage, `${firebaseSettings.storageFolder}/${pathPrefix}.${extFromMime(mimeType)}`);
  await window.__firebaseShareApi.uploadBytes(storageRef, blob, { contentType: mimeType });
  return window.__firebaseShareApi.getDownloadURL(storageRef);
}
async function createFirebaseShareLink({ state, currentLang, currentTheme, baseUrl }) {
  const user = await ensureFirebaseUser();
  const shareId = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 4);
  const ownerId = user.uid;
  const snapshot = JSON.parse(JSON.stringify(state));
  snapshot.profile.profileImage = await uploadIfNeeded(snapshot.profile.profileImage, `${ownerId}/${shareId}/profile-image`);
  snapshot.portfolio = await Promise.all((snapshot.portfolio || []).map(async (item, index) => ({
    ...item,
    cover: await uploadIfNeeded(item.cover, `${ownerId}/${shareId}/portfolio-${index + 1}-cover`),
    videoUrl: await uploadIfNeeded(item.videoUrl, `${ownerId}/${shareId}/portfolio-${index + 1}-video`)
  })));
  await window.__firebaseShareApi.setDoc(window.__firebaseShareApi.doc(firebaseDb, firebaseSettings.shareCollection, shareId), {
    ownerId,
    public: true,
    profile: snapshot.profile,
    portfolio: snapshot.portfolio,
    createdAt: window.__firebaseShareApi.serverTimestamp(),
    updatedAt: window.__firebaseShareApi.serverTimestamp()
  });
  const url = new URL(baseUrl);
  url.search = "";
  url.searchParams.set("s", shareId);
  url.searchParams.set("l", currentLang);
  url.searchParams.set("t", currentTheme);
  return url.toString();
}
async function loadFirebaseSharedState(shareId) {
  await ensureFirebaseSdk();
  if (!canUseFirebaseShare()) return null;
  const snap = await window.__firebaseShareApi.getDoc(window.__firebaseShareApi.doc(firebaseDb, firebaseSettings.shareCollection, shareId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { profile: data.profile || {}, portfolio: Array.isArray(data.portfolio) ? data.portfolio : [] };
}
const STORAGE_KEY = "landing-portfolio-ar-data-v1";
function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}
function getVideoPlaceholder(title) {
  const safeTitle = encodeURIComponent(title || "Video");
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2307111f'/><stop offset='1' stop-color='%238c56ff'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><circle cx='600' cy='400' r='110' fill='rgba(255,255,255,0.12)'/><polygon points='565,335 565,465 680,400' fill='white'/><text x='600' y='620' fill='white' font-size='44' text-anchor='middle' font-family='Arial'>${safeTitle}</text></svg>`;
}
const defaultData = {
  profile: {
    fullName: "اسمك هنا",
    fullNameEn: "Your Name",
    age: "26",
    birthDate: "15 أغسطس 1999",
    birthDateEn: "15 August 1999",
    city: "الرياض",
    cityEn: "Riyadh",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    jobTitle: "مصمم رقمي ومطور واجهات وتجارب بصرية",
    jobTitleEn: "Digital Designer & UI Developer",
    experience: "5+",
    projects: "24",
    clients: "12",
    intro: "أبني حضورًا رقميًا احترافيًا يعرض سيرتي الذاتية وأعمالي وخدماتي بأسلوب عربي أنيق، واضح، وسهل التصفح مع لمسات بصرية رقمية راقية.",
    introEn: "I build a refined digital presence that presents my profile, portfolio, and services in a clean and premium way.",
    welcomeTitle: "أهلاً بك في موقعي الشخصي",
    welcomeTitleEn: "Welcome to My Personal Website",
    welcome: "يسعدني حضورك هنا. ستجد في هذه الصفحة نبذة تعريفية شاملة، بيانات السيرة الذاتية، وأعمالي المصنفة داخل مجلدات صور وفيديوهات بتجربة عرض حديثة واحترافية.",
    welcomeEn: "I am glad you are here. On this page you will find a complete introduction, CV details, and categorized work in a modern professional presentation.",
    bio: "أعمل على تقديم حلول بصرية رقمية تجمع بين الجمال، التنظيم، وسهولة العرض. أهتم بالتفاصيل الدقيقة، وضوح الرسالة، وانعكاس الهوية المهنية بشكل راقٍ ومقنع.",
    bioEn: "I create digital visual solutions that combine beauty, clarity, and structured presentation with careful attention to detail.",
    skills: "تصميم واجهات, تصميم بصري, هوية رقمية, موشن جرافيك, عرض أعمال, تجربة مستخدم",
    skillsEn: "UI Design, Visual Design, Digital Identity, Motion Graphics, Portfolio Presentation, User Experience",
    specialization: "تصميم رقمي وتطوير واجهات",
    specializationEn: "Digital Design and Interface Development",
    workflow: "دقة، ترتيب، وتنفيذ بصري راقٍ",
    workflowEn: "Precision, structure, and premium visual execution",
    value: "حلول تجمع الجمال والوضوح والنتيجة العملية",
    valueEn: "Solutions that combine elegance, clarity, and practical results",
    contactLink: "https://wa.me/",
    socialWhatsapp: "https://wa.me/",
    socialInstagram: "https://instagram.com/",
    socialX: "https://x.com/",
    socialBehance: "https://behance.net/",
    socialEmail: "mailto:you@example.com"
  },
  portfolio: [
    { id: createId(), type: "images", title: "هوية إعلانية رقمية", description: "نموذج عرض لعمل بصري بأسلوب رقمي حديث يصلح للبوسترات والإعلانات.", cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", videoUrl: "" },
    { id: createId(), type: "videos", title: "عرض موشن تعريفي", description: "مثال لفيديو تعريفي أو عرض مشروع يمكن ربطه من يوتيوب أو فيميو أو رابط مباشر.", cover: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", videoUrl: "https://example.com/video" }
  ]
};
const els = {
  heroName: document.getElementById("heroName"), heroJobTitle: document.getElementById("heroJobTitle"), heroIntro: document.getElementById("heroIntro"), welcomeTitle: document.getElementById("welcomeTitle"), welcomeText: document.getElementById("welcomeText"), statExperience: document.getElementById("statExperience"), statProjects: document.getElementById("statProjects"), statClients: document.getElementById("statClients"), personalInfo: document.getElementById("personalInfo"), professionalBio: document.getElementById("professionalBio"), skillsWrap: document.getElementById("skillsWrap"), specializationText: document.getElementById("specializationText"), workflowText: document.getElementById("workflowText"), valueText: document.getElementById("valueText"), contactButton: document.getElementById("contactButton"), profileImage: document.getElementById("profileImage"), socialWhatsapp: document.getElementById("socialWhatsapp"), socialInstagram: document.getElementById("socialInstagram"), socialX: document.getElementById("socialX"), socialBehance: document.getElementById("socialBehance"), socialEmail: document.getElementById("socialEmail"), imagesCount: document.getElementById("imagesCount"), videosCount: document.getElementById("videosCount"), imagesPreview: document.getElementById("imagesPreview"), videosPreview: document.getElementById("videosPreview"), adminPanel: document.getElementById("adminPanel"), openAdminBtn: document.getElementById("openAdminBtn"), shareLinkBtn: document.getElementById("shareLinkBtn"), themeToggleBtn: document.getElementById("themeToggleBtn"), closeAdminBtn: document.getElementById("closeAdminBtn"), adminOverlay: document.getElementById("adminOverlay"), profileForm: document.getElementById("profileForm"), portfolioForm: document.getElementById("portfolioForm"), resetDataBtn: document.getElementById("resetDataBtn"), portfolioAdminList: document.getElementById("portfolioAdminList"), portfolioModal: document.getElementById("portfolioModal"), closeModalBtn: document.getElementById("closeModalBtn"), modalTitle: document.getElementById("modalTitle"), modalGrid: document.getElementById("modalGrid"), portfolioItemTemplate: document.getElementById("portfolioItemTemplate")
};
const PROFILE_KEY_MAP = { fullName: "n", fullNameEn: "ne", age: "a", birthDate: "b", birthDateEn: "be", city: "c", cityEn: "ce", profileImage: "pi", jobTitle: "j", jobTitleEn: "je", experience: "x", projects: "p", clients: "cl", intro: "i", introEn: "ie", welcomeTitle: "w", welcomeTitleEn: "we", welcome: "m", welcomeEn: "me", bio: "o", bioEn: "oe", skills: "s", skillsEn: "se", specialization: "sp", specializationEn: "spe", workflow: "wf", workflowEn: "wfe", value: "v", valueEn: "ve", contactLink: "k", socialWhatsapp: "sw", socialInstagram: "si", socialX: "sx", socialBehance: "sb", socialEmail: "sm" };
const PORTFOLIO_KEY_MAP = { id: "i", type: "t", title: "n", description: "d", cover: "c", videoUrl: "v" };
const PROFILE_KEY_MAP_REV = Object.fromEntries(Object.entries(PROFILE_KEY_MAP).map(([k, v]) => [v, k]));
const PORTFOLIO_KEY_MAP_REV = Object.fromEntries(Object.entries(PORTFOLIO_KEY_MAP).map(([k, v]) => [v, k]));
const queryParams = new URLSearchParams(window.location.search);
const sharePayload = queryParams.get("s") || queryParams.get("share");
const isSharedView = Boolean(sharePayload);
const LANG_KEY = "landing-portfolio-lang-v1";
const THEME_KEY = "landing-portfolio-theme-v1";
const sharedLang = queryParams.get("l") || queryParams.get("lang");
const sharedTheme = queryParams.get("t") || queryParams.get("theme");
let currentLang = sharedLang || localStorage.getItem(LANG_KEY) || "ar";
let currentTheme = sharedTheme || localStorage.getItem(THEME_KEY) || "dark";
const translations = {
  ar: { brand: "ملفي الرقمي", navAbout: "نبذة", navPortfolio: "الأعمال", navData: "البيانات", navContact: "التواصل", shareBtn: "مشاركة", adminBtn: "لوحة التحكم", heroChip: "هوية رقمية عربية بأسلوب فاخر وحديث", welcomeLabel: "رسالة ترحيبية", viewPortfolio: "استعرض ملف الأعمال", learnMore: "تعرف علي أكثر", profileCard: "الملف التعريفي", active: "نشط", yearsExp: "سنوات خبرة", projectsDone: "مشروع مكتمل", clientsPartners: "عميل وشريك", cvComplete: "سيرة ذاتية شاملة", cvPrecise: "بيانات شخصية ومهنية دقيقة", aboutTitle: "نبذة تعريفية", personalData: "البيانات الشخصية", professionalData: "البيانات المهنية", portfolioTitle: "ملف الاعمال", imagesFolder: "مجلد الصور", imagesGallery: "معرض الصور", imagesDesc: "للتصاميم، الهوية البصرية، الإعلانات، البوسترات، والمواد الثابتة.", videosFolder: "مجلد الفيديوهات", videosGallery: "معرض الفيديو", videosDesc: "للموشن، المقاطع الإعلانية، الريلز، العروض المتحركة، وأعمال الفيديو.", extraData: "بيانات اضافية", specializationLabel: "مجال التخصص", workflowLabel: "أسلوب العمل", valueLabel: "القيمة المضافة", contactHeading: "ابدأ بعرض أعمالك بصورة تليق بك", contactNow: "تواصل الآن", itemWord: "عنصر", imageWord: "صورة", videoWord: "فيديو", openVideo: "فتح الفيديو", openImage: "فتح الصورة", noItems: "لا توجد عناصر بعد", noItemsDesc: "أضف أعمالك من لوحة التحكم لتظهر هنا تلقائيًا.", shareCopied: "تم نسخ رابط المشاركة.", sharePrompt: "انسخ رابط المشاركة:", modalImages: "الصور", modalVideos: "الفيديوهات", fullName: "الاسم الكامل", age: "العمر", birthDate: "تاريخ الميلاد", city: "المدينة", jobTitle: "المسمى المهني", experience: "سنوات الخبرة" },
  en: { brand: "My Digital Portfolio", navAbout: "About", navPortfolio: "Portfolio", navData: "Data", navContact: "Contact", shareBtn: "Share", adminBtn: "Admin", heroChip: "Luxury Arabic digital identity", welcomeLabel: "Welcome Message", viewPortfolio: "View Portfolio", learnMore: "Learn More", profileCard: "Profile Card", active: "Active", yearsExp: "Years Experience", projectsDone: "Completed Projects", clientsPartners: "Clients & Partners", cvComplete: "Complete CV", cvPrecise: "Accurate personal and professional data", aboutTitle: "About", personalData: "Personal Information", professionalData: "Professional Information", portfolioTitle: "Portfolio", imagesFolder: "Images Folder", imagesGallery: "Image Gallery", imagesDesc: "For designs, branding, ads, posters, and static work.", videosFolder: "Videos Folder", videosGallery: "Video Gallery", videosDesc: "For motion, promo clips, reels, and video work.", extraData: "Additional Data", specializationLabel: "Specialization", workflowLabel: "Workflow", valueLabel: "Added Value", contactHeading: "Start showcasing your work professionally", contactNow: "Contact Now", itemWord: "items", imageWord: "Image", videoWord: "Video", openVideo: "Open Video", openImage: "Open Image", noItems: "No items yet", noItemsDesc: "Add your work from the admin panel to show it here.", shareCopied: "Share link copied.", sharePrompt: "Copy share link:", modalImages: "Images", modalVideos: "Videos", fullName: "Full Name", age: "Age", birthDate: "Birth Date", city: "City", jobTitle: "Job Title", experience: "Years of Experience" }
};
let state = loadState();
function base64UrlEncode(text) {
  return btoa(unescape(encodeURIComponent(text))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64UrlDecode(text) {
  const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  return decodeURIComponent(escape(atob(padded)));
}
function serializeCompactState(source) {
  const profile = {};
  Object.entries(source.profile || {}).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      profile[PROFILE_KEY_MAP[key] || key] = value;
    }
  });
  const portfolio = (source.portfolio || []).map(item => {
    const compact = {};
    Object.entries(item || {}).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        compact[PORTFOLIO_KEY_MAP[key] || key] = value;
      }
    });
    return compact;
  });
  return { p: profile, o: portfolio };
}
function deserializeCompactState(compact) {
  const profile = {};
  Object.entries(compact.p || {}).forEach(([key, value]) => {
    profile[PROFILE_KEY_MAP_REV[key] || key] = value;
  });
  const portfolio = (compact.o || []).map(item => {
    const expanded = {};
    Object.entries(item || {}).forEach(([key, value]) => {
      expanded[PORTFOLIO_KEY_MAP_REV[key] || key] = value;
    });
    return expanded;
  });
  return { profile, portfolio };
}
function decodeShareState(payload) {
  try {
    const parsed = JSON.parse(base64UrlDecode(payload));
    const expanded = parsed.p || parsed.o ? deserializeCompactState(parsed) : parsed;
    return { profile: { ...defaultData.profile, ...expanded.profile }, portfolio: Array.isArray(expanded.portfolio) ? expanded.portfolio : [] };
  } catch {
    return null;
  }
}
function loadState() {
  if (sharePayload) {
    const shared = decodeShareState(sharePayload);
    if (shared) return shared;
    return cloneData(defaultData);
  }
  try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return cloneData(defaultData); const parsed = JSON.parse(raw); return { profile: { ...defaultData.profile, ...parsed.profile }, portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : cloneData(defaultData.portfolio) }; } catch { return cloneData(defaultData); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function openAdmin() { els.adminPanel.classList.add("open"); els.adminPanel.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll"); }
function closeAdmin() { els.adminPanel.classList.remove("open"); els.adminPanel.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); }
function personalInfoMarkup(profile) { const rows = [["الاسم الكامل", profile.fullName],["العمر", profile.age],["تاريخ الميلاد", profile.birthDate],["المدينة", profile.city],["المسمى المهني", profile.jobTitle],["سنوات الخبرة", profile.experience]]; return rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value || "-"}</dd></div>`).join(""); }
function t(key) { return (translations[currentLang] && translations[currentLang][key]) || translations.ar[key] || key; }
function localizedValue(arKey, enKey) {
  if (currentLang === "en") return state.profile[enKey] || state.profile[arKey] || "";
  return state.profile[arKey] || "";
}
function applyLanguage() {
  document.documentElement.lang = currentLang === "ar" ? "ar" : "en";
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  if (els.shareLinkBtn) els.shareLinkBtn.title = currentLang === "ar" ? "تغيير اللغة" : "Change language";
  const langBtn = document.getElementById("languageToggleBtn");
  if (langBtn) langBtn.textContent = currentLang === "ar" ? "EN" : "AR";
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme === "light" ? "light" : "dark");
  if (els.themeToggleBtn) {
    els.themeToggleBtn.textContent = currentTheme === "light" ? "☾" : "☀";
    els.themeToggleBtn.title = currentTheme === "light" ? "Dark Mode" : "Light Mode";
  }
}
function renderSkills(skillsValue) { const skills = skillsValue.split(",").map(item => item.trim()).filter(Boolean); els.skillsWrap.innerHTML = skills.map(skill => `<span>${skill}</span>`).join(""); }
function renderPortfolioCounts() { const imagesCount = state.portfolio.filter(item => item.type === "images").length; const videosCount = state.portfolio.filter(item => item.type === "videos").length; els.imagesCount.textContent = `${imagesCount} ${t("itemWord")}`; els.videosCount.textContent = `${videosCount} ${t("itemWord")}`; }
function renderFolderPreview(target, type) {
  if (!target) return;
  const items = state.portfolio.filter(item => item.type === type).slice(0, 4);
  if (!items.length) {
    const placeholder = type === "images"
      ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'><rect width='100%25' height='100%25' rx='28' fill='%23122139'/><text x='50%25' y='54%25' text-anchor='middle' fill='white' font-size='28' font-family='Arial'>Portfolio</text></svg>"
      : getVideoPlaceholder("Video");
    target.innerHTML = `<span class="preview-card main"><img src="${placeholder}" alt=""></span><span class="preview-card small one"></span><span class="preview-card small two"></span><span class="preview-card small three"></span>`;
    return;
  }
  const cards = items.map((item, index) => `<span class="preview-card ${index === 0 ? "main" : `small p${index}`}"><img src="${item.cover}" alt="${item.title}"></span>`).join("");
  target.innerHTML = cards;
}
function renderAdminList() {
  if (!state.portfolio.length) { els.portfolioAdminList.innerHTML = `<div class="admin-item"><div><strong>لا توجد أعمال مضافة بعد</strong><p>أضف صورك أو فيديوهاتك من النموذج أعلاه.</p></div></div>`; return; }
  els.portfolioAdminList.innerHTML = state.portfolio.map(item => `<article class="admin-item"><div><strong>${item.title}</strong><p>${item.type === "images" ? t("imageWord") : t("videoWord")} — ${item.description || "..."}</p></div><button class="delete-btn" type="button" data-id="${item.id}">حذف</button></article>`).join("");
  els.portfolioAdminList.querySelectorAll("[data-id]").forEach(button => button.addEventListener("click", () => { state.portfolio = state.portfolio.filter(item => item.id !== button.dataset.id); saveState(); renderAll(); }));
}
function renderModal(folderType) {
  const items = state.portfolio.filter(item => item.type === folderType);
  els.modalTitle.textContent = folderType === "images" ? t("modalImages") : t("modalVideos");
  els.modalGrid.innerHTML = "";
  if (!items.length) { els.modalGrid.innerHTML = `<article class="portfolio-item glass"><div class="item-copy"><strong class="item-title">${t("noItems")}</strong><p class="item-description">${t("noItemsDesc")}</p></div></article>`; }
  else {
    items.forEach(item => {
      const node = els.portfolioItemTemplate.content.cloneNode(true);
      const thumb = node.querySelector(".item-thumb");
      thumb.src = item.cover || "https://via.placeholder.com/1200x900?text=Portfolio";
      thumb.alt = item.title;
      node.querySelector(".item-title").textContent = item.title;
      node.querySelector(".item-description").textContent = item.description || "بدون وصف";
      const link = node.querySelector(".item-link");
      link.href = item.type === "videos" ? (item.videoUrl || item.cover || "#") : (item.cover || "#");
      link.textContent = item.type === "videos" ? t("openVideo") : t("openImage");
      els.modalGrid.appendChild(node);
    });
  }
  if (typeof els.portfolioModal.showModal === "function") {
    els.portfolioModal.showModal();
  } else {
    els.portfolioModal.setAttribute("open", "open");
  }
}
function fillForms() { Object.entries(state.profile).forEach(([key, value]) => { const field = els.profileForm.elements.namedItem(key); if (field) field.value = value; }); }
function renderAll() {
  const p = state.profile;
  els.heroName.textContent = localizedValue("fullName", "fullNameEn") || "اسمك هنا"; els.heroJobTitle.textContent = localizedValue("jobTitle", "jobTitleEn"); els.heroIntro.textContent = localizedValue("intro", "introEn"); els.welcomeTitle.textContent = localizedValue("welcomeTitle", "welcomeTitleEn") || "أهلاً بك"; els.welcomeText.textContent = localizedValue("welcome", "welcomeEn"); els.statExperience.textContent = p.experience || "0"; els.statProjects.textContent = p.projects || "0"; els.statClients.textContent = p.clients || "0"; els.personalInfo.innerHTML = personalInfoMarkupLang(p); els.professionalBio.textContent = localizedValue("bio", "bioEn"); renderSkills(localizedValue("skills", "skillsEn")); els.specializationText.textContent = localizedValue("specialization", "specializationEn"); els.workflowText.textContent = localizedValue("workflow", "workflowEn"); els.valueText.textContent = localizedValue("value", "valueEn"); els.contactButton.href = p.contactLink || "#"; if (els.profileImage) { els.profileImage.src = p.profileImage || defaultData.profile.profileImage; } if (els.socialWhatsapp) els.socialWhatsapp.href = p.socialWhatsapp || "#"; if (els.socialInstagram) els.socialInstagram.href = p.socialInstagram || "#"; if (els.socialX) els.socialX.href = p.socialX || "#"; if (els.socialBehance) els.socialBehance.href = p.socialBehance || "#"; if (els.socialEmail) els.socialEmail.href = p.socialEmail || "#";
  renderPortfolioCounts(); renderFolderPreview(els.imagesPreview, "images"); renderFolderPreview(els.videosPreview, "videos"); renderAdminList(); fillForms();
  applyLanguage();
  applyTheme();
}
function personalInfoMarkupLang(profile) { const rows = [[t("fullName"), localizedValue("fullName", "fullNameEn")],[t("age"), profile.age],[t("birthDate"), localizedValue("birthDate", "birthDateEn")],[t("city"), localizedValue("city", "cityEn")],[t("jobTitle"), localizedValue("jobTitle", "jobTitleEn")],[t("experience"), profile.experience]]; return rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value || "-"}</dd></div>`).join(""); }
function closeModal() {
  if (typeof els.portfolioModal.close === "function") {
    els.portfolioModal.close();
  } else {
    els.portfolioModal.removeAttribute("open");
  }
}
function encodeShareState() {
  return base64UrlEncode(JSON.stringify(serializeCompactState(state)));
}
async function copyShareLink() {
  try {
    const shareUrl = window.location.origin + window.location.pathname.replace(/index\.html$/i, "");
    await navigator.clipboard.writeText(shareUrl);
    alert(t("shareCopied"));
  } catch {
    const fallbackUrl = window.location.origin + window.location.pathname.replace(/index\.html$/i, "");
    prompt(t("sharePrompt"), fallbackUrl);
  }
}
function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem(LANG_KEY, currentLang);
  renderAll();
}
function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme();
}
els.openAdminBtn.addEventListener("click", openAdmin); els.closeAdminBtn.addEventListener("click", closeAdmin); els.adminOverlay.addEventListener("click", closeAdmin);
els.profileForm.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(els.profileForm);
  Object.keys(state.profile).forEach(key => {
    const value = formData.get(key);
    if (typeof value === "string") state.profile[key] = value.trim();
  });
  const profileFile = els.profileForm.elements.namedItem("profileImageFile");
  if (profileFile && profileFile.files && profileFile.files[0]) {
    state.profile.profileImage = await readFileAsDataUrl(profileFile.files[0]);
  }
  saveState();
  renderAll();
  closeAdmin();
});
els.portfolioForm.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(els.portfolioForm);
  const coverFileInput = els.portfolioForm.elements.namedItem("coverFile");
  const videoFileInput = els.portfolioForm.elements.namedItem("videoFile");
  const coverFileData = coverFileInput && coverFileInput.files && coverFileInput.files[0] ? await readFileAsDataUrl(coverFileInput.files[0]) : "";
  const videoFileData = videoFileInput && videoFileInput.files && videoFileInput.files[0] ? await readFileAsDataUrl(videoFileInput.files[0]) : "";
  const type = String(formData.get("type") || "images");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const coverLink = String(formData.get("cover") || "").trim();
  const videoLink = String(formData.get("videoUrl") || "").trim();
  const finalCover = coverFileData || coverLink || (type === "videos" ? getVideoPlaceholder(title) : "");
  const finalVideo = videoFileData || videoLink;
  const item = { id: createId(), type, title, description, cover: finalCover, videoUrl: finalVideo };
  if (!item.title || !item.cover) {
    alert("أدخل عنوان العمل وأضف صورة غلاف بالرابط أو من جهازك.");
    return;
  }
  if (type === "videos" && !item.videoUrl) {
    alert("أضف رابط الفيديو أو ارفع ملف الفيديو من جهازك.");
    return;
  }
  state.portfolio.unshift(item);
  saveState();
  renderAll();
  els.portfolioForm.reset();
});
if (els.shareLinkBtn) els.shareLinkBtn.addEventListener("click", copyShareLink);
const languageToggleBtn = document.getElementById("languageToggleBtn");
if (languageToggleBtn) languageToggleBtn.addEventListener("click", toggleLanguage);
if (els.themeToggleBtn) els.themeToggleBtn.addEventListener("click", toggleTheme);
els.resetDataBtn.addEventListener("click", () => { state = cloneData(defaultData); saveState(); renderAll(); });
document.querySelectorAll(".folder-card").forEach(card => card.addEventListener("click", () => renderModal(card.dataset.folder)));
els.closeModalBtn.addEventListener("click", closeModal);
els.portfolioModal.addEventListener("click", event => { const r = els.portfolioModal.getBoundingClientRect(); const inside = r.top <= event.clientY && event.clientY <= r.top + r.height && r.left <= event.clientX && event.clientX <= r.left + r.width; if (!inside) closeModal(); });
const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }, { threshold: .16 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
async function initSharedView() {
  if (!sharePayload) return;
  const legacy = decodeShareState(sharePayload);
  if (legacy) {
    state = legacy;
    return;
  }
  if (canUseFirebaseShare()) {
    const remoteState = await loadFirebaseSharedState(sharePayload);
    if (remoteState) {
      state = { profile: { ...defaultData.profile, ...(remoteState.profile || {}) }, portfolio: Array.isArray(remoteState.portfolio) ? remoteState.portfolio : [] };
      return;
    }
  }
}
async function initApp() {
  if (isSharedView) document.body.classList.add("view-only");
  applyTheme();
  await initSharedView();
  renderAll();
}
initApp();



    async function handleWebsiteSubmit(e){
      e.preventDefault();
      const form = e.currentTarget;
      const title = form.elements.title.value.trim();
      const description = form.elements.description.value.trim();
      const url = form.elements.url.value.trim();
      const file = form.elements.file.files[0];
      const imageUrl = form.elements.imageUrl.value.trim();
      let image = '';
      if(file){ image = await fileToDataUrl(file); }
      else if(imageUrl){ image = safeLink(imageUrl); }
      if(!title || !description || !url){
        showToast('يرجى إضافة عنوان ووصف ورابط الموقع.');
        return;
      }
      if(!state.websites) state.websites = [];
      state.websites.unshift({ title, description, url: safeLink(url), image });
      form.reset();
      renderAll();
      switchPortfolioTab('websites');
      showToast('تمت إضافة الموقع بنجاح.');
    }

    function removeWebsite(index){
      state.websites.splice(index, 1);
      renderAll();
      showToast('تم حذف الموقع.');
    }

