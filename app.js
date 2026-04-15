
const STORAGE_KEY = "nittaq-cv-media-pro-state";

const i18n = {
  ar: {
    navHome: "الرئيسية",
    navAbout: "نبذة",
    navDetails: "البيانات",
    navPortfolio: "الأعمال",
    navContact: "التواصل",
    share: "مشاركة",
    dashboard: "لوحة التحكم",
    dashboardLead: "حدّث البيانات مباشرة وسيتم حفظها محليًا داخل المتصفح.",
    profileTab: "البيانات",
    mediaTab: "الوسائط",
    heroBadge: "واجهة احترافية للسيرة الذاتية والملف المهني",
    learnMore: "تعرف على أكثر",
    viewPortfolio: "استعرض الأعمال",
    experience: "سنوات الخبرة",
    projects: "عدد المشاريع",
    clients: "عدد العملاء",
    items: "عدد العناصر",
    profileBadge: "واجهة رسمية مستقرة",
    aboutBadge: "نبذة تعريفية",
    aboutTitle: "عن الموقع",
    aboutLead: "واجهة رسمية لعرض السيرة الذاتية والملف المهني والأعمال بأسلوب عربي / إنجليزي حديث وواضح.",
    siteAboutLabel: "عن الموقع",
    siteAboutTitle: "نطاق | سي في — Nittaq | CV",
    siteAboutText: "تم تصميم هذا الموقع ليكون واجهة رسمية لعرض السيرة الذاتية والملف المهني والأعمال بطريقة حديثة، واضحة، وسهلة النشر على GitHub وVercel دون إعدادات معقدة. يدعم العربية والإنجليزية ويمنحك لوحة تحكم محلية لتحديث المحتوى بسرعة.",
    welcomeTitle: "أهلاً بك في موقع نطاق | سي في",
    bioTitle: "نبذة مهنية",
    valueTitle: "القيمة المضافة",
    detailsBadge: "البيانات",
    detailsTitle: "البيانات الشخصية والمهنية",
    fullName: "الاسم الكامل",
    fullNameEn: "الاسم بالإنجليزية",
    age: "العمر",
    birthDate: "تاريخ الميلاد",
    city: "المدينة",
    jobTitle: "المسمى المهني",
    specialization: "التخصص",
    workflow: "أسلوب العمل",
    portfolioBadge: "الأعمال",
    portfolioTitle: "ملف الأعمال",
    portfolioLead: "مساحة لعرض الصور والفيديوهات والمواقع داخل بطاقات أنيقة، مع دعم رفع محلي أو روابط مباشرة حسب نوع العمل.",
    contactBadge: "التواصل",
    contactTitle: "روابط التواصل",
    footerText: "واجهة رسمية لعرض السيرة الذاتية والملف المهني والأعمال بشكل عربي احترافي وقابل للنشر الفوري.",
    save: "حفظ",
    reset: "إعادة الضبط",
    addMedia: "إضافة الوسيط",
    clearMedia: "مسح الوسائط",
    shareCopied: "تم نسخ رابط الصفحة.",
    sharePrompt: "انسخ رابط الصفحة:"
  },
  en: {
    navHome: "Home",
    navAbout: "About",
    navDetails: "Details",
    navPortfolio: "Portfolio",
    navContact: "Contact",
    share: "Share",
    dashboard: "Dashboard",
    dashboardLead: "Update the content and save it locally in your browser.",
    profileTab: "Profile",
    mediaTab: "Media",
    heroBadge: "A professional CV and portfolio interface",
    learnMore: "Learn More",
    viewPortfolio: "View Portfolio",
    experience: "Years of Experience",
    projects: "Projects",
    clients: "Clients",
    items: "Items",
    profileBadge: "Stable Official Interface",
    aboutBadge: "Introduction",
    aboutTitle: "About the Website",
    aboutLead: "An official interface for presenting a CV, professional profile, and portfolio in a modern bilingual style.",
    siteAboutLabel: "About the Website",
    siteAboutTitle: "Nittaq | CV",
    siteAboutText: "This website is designed as an official digital presence for presenting a CV, professional profile, and portfolio in a clear, modern, and easy-to-deploy format for GitHub and Vercel.",
    welcomeTitle: "Welcome to Nittaq | CV",
    bioTitle: "Professional Bio",
    valueTitle: "Value Proposition",
    detailsBadge: "Details",
    detailsTitle: "Personal and Professional Information",
    fullName: "Full Name",
    fullNameEn: "Name in English",
    age: "Age",
    birthDate: "Birth Date",
    city: "City",
    jobTitle: "Job Title",
    specialization: "Specialization",
    workflow: "Workflow",
    portfolioBadge: "Portfolio",
    portfolioTitle: "Portfolio",
    portfolioLead: "A clean grid for showcasing images, videos, and websites with support for local uploads or direct links depending on the media type.",
    contactBadge: "Contact",
    contactTitle: "Contact Links",
    footerText: "An official interface for presenting a CV, professional profile, and portfolio in a polished deployable format.",
    save: "Save",
    reset: "Reset",
    addMedia: "Add Media",
    clearMedia: "Clear Media",
    shareCopied: "Page link copied.",
    sharePrompt: "Copy this page link:"
  }
};

const defaultState = {
  language: "ar",
  profile: {
    fullName: "نطاق | سي في",
    fullNameEn: "Nittaq | CV",
    age: "27",
    birthDate: "28 August 1999",
    city: "Jeddah",
    jobTitle: "موقع سيرة ذاتية وملف أعمال رسمي",
    specialization: "السيرة الذاتية، الملف المهني، والعرض الرقمي",
    workflow: "استقرار، وضوح، وسهولة نشر",
    experience: "5+",
    projects: "12",
    clients: "8",
    email: "hello@example.com",
    whatsapp: "+966500000000",
    instagram: "instagram.com/username",
    behance: "behance.net/username",
    linkedin: "linkedin.com/in/username",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    heroIntro: "نطاق | سي في هو موقع سيرة ذاتية وملف أعمال عربي / إنجليزي مصمم لعرض البيانات المهنية والشخصية والأعمال داخل تجربة رقمية حديثة وجاهزة للنشر المباشر على GitHub وVercel.",
    welcome: "هذه النسخة مضبوطة لتكون واجهة رسمية مستقرة لعرض السيرة الذاتية والملف المهني والأعمال مع لوحة تحكم محلية، ودعم للعربية والإنجليزية، وتجربة عرض أنيقة مناسبة للنشر المباشر.",
    bio: "هذا الموقع مخصص لتقديم السيرة الذاتية والبيانات المهنية والأعمال ضمن تجربة رسمية، منظمة، وقابلة للتخصيص الكامل. يمكنك إدخال بياناتك وتحديث أعمالك وروابطك الاجتماعية بسهولة من لوحة التحكم.",
    value: "جاهزية للنشر على GitHub وVercel بدون تعقيد، مع مود رقمي فاخر، ولوحة تحكم سهلة، ومظهر احترافي مناسب للعرض الرسمي."
  },
  portfolio: []
};

let state = loadState();

const els = {
  root: document.documentElement,
  langToggle: document.getElementById("langToggle"),
  shareBtn: document.getElementById("shareBtn"),
  openAdminBtn: document.getElementById("openAdminBtn"),
  closeAdminBtn: document.getElementById("closeAdminBtn"),
  adminOverlay: document.getElementById("adminOverlay"),
  adminDrawer: document.getElementById("adminDrawer"),
  profileForm: document.getElementById("profileForm"),
  mediaForm: document.getElementById("mediaForm"),
  resetBtn: document.getElementById("resetBtn"),
  clearMediaBtn: document.getElementById("clearMediaBtn"),
  heroIntro: document.getElementById("heroIntro"),
  welcomeText: document.getElementById("welcomeText"),
  bioText: document.getElementById("bioText"),
  valueText: document.getElementById("valueText"),
  siteAboutText: document.getElementById("siteAboutText"),
  displayName: document.getElementById("displayName"),
  displayJobTitle: document.getElementById("displayJobTitle"),
  profileImage: document.getElementById("profileImage"),
  expStat: document.getElementById("expStat"),
  projectsStat: document.getElementById("projectsStat"),
  clientsStat: document.getElementById("clientsStat"),
  itemsStat: document.getElementById("itemsStat"),
  miniExp: document.getElementById("miniExp"),
  miniProjects: document.getElementById("miniProjects"),
  miniClients: document.getElementById("miniClients"),
  fullNameView: document.getElementById("fullNameView"),
  fullNameEnView: document.getElementById("fullNameEnView"),
  ageView: document.getElementById("ageView"),
  birthDateView: document.getElementById("birthDateView"),
  cityView: document.getElementById("cityView"),
  jobTitleView: document.getElementById("jobTitleView"),
  specializationView: document.getElementById("specializationView"),
  workflowView: document.getElementById("workflowView"),
  experienceView: document.getElementById("experienceView"),
  projectsView: document.getElementById("projectsView"),
  emailView: document.getElementById("emailView"),
  whatsappView: document.getElementById("whatsappView"),
  instagramView: document.getElementById("instagramView"),
  behanceView: document.getElementById("behanceView"),
  linkedinView: document.getElementById("linkedinView"),
  contactWhatsapp: document.getElementById("contactWhatsapp"),
  contactInstagram: document.getElementById("contactInstagram"),
  contactBehance: document.getElementById("contactBehance"),
  contactLinkedin: document.getElementById("contactLinkedin"),
  portfolioGrid: document.getElementById("portfolioGrid"),
  profileImageUrl: document.getElementById("profileImageUrl"),
  profileImageFile: document.getElementById("profileImageFile"),
  mediaType: document.getElementById("mediaType"),
  mediaTitle: document.getElementById("mediaTitle"),
  mediaDescription: document.getElementById("mediaDescription"),
  mediaUrl: document.getElementById("mediaUrl"),
  mediaFile: document.getElementById("mediaFile"),
  tabs: document.querySelectorAll(".tab-btn"),
  panels: document.querySelectorAll(".tab-panel")
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneData(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...cloneData(defaultState),
      ...parsed,
      profile: { ...cloneData(defaultState.profile), ...(parsed.profile || {}) },
      portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : []
    };
  } catch {
    return cloneData(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function t(key) {
  return i18n[state.language]?.[key] || i18n.ar[key] || key;
}

function applyLanguage() {
  const isArabic = state.language === "ar";
  els.root.lang = isArabic ? "ar" : "en";
  els.root.dir = isArabic ? "rtl" : "ltr";
  els.langToggle.textContent = isArabic ? "AR" : "EN";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
}

function renderProfile() {
  const p = state.profile;
  els.heroIntro.textContent = p.heroIntro;
  els.welcomeText.textContent = p.welcome;
  els.bioText.textContent = p.bio;
  els.valueText.textContent = p.value;
  els.siteAboutText.textContent = t("siteAboutText");
  els.displayName.textContent = state.language === "ar" ? p.fullName : p.fullNameEn;
  els.displayJobTitle.textContent = p.jobTitle;
  els.profileImage.src = p.profileImage || defaultState.profile.profileImage;

  els.expStat.textContent = p.experience;
  els.projectsStat.textContent = p.projects;
  els.clientsStat.textContent = p.clients;
  els.itemsStat.textContent = String(state.portfolio.length);
  els.miniExp.textContent = p.experience;
  els.miniProjects.textContent = p.projects;
  els.miniClients.textContent = p.clients;

  els.fullNameView.textContent = p.fullName;
  els.fullNameEnView.textContent = p.fullNameEn;
  els.ageView.textContent = p.age;
  els.birthDateView.textContent = p.birthDate;
  els.cityView.textContent = p.city;
  els.jobTitleView.textContent = p.jobTitle;
  els.specializationView.textContent = p.specialization;
  els.workflowView.textContent = p.workflow;
  els.experienceView.textContent = p.experience;
  els.projectsView.textContent = p.projects;
  els.emailView.textContent = p.email;
  els.whatsappView.textContent = p.whatsapp;
  els.instagramView.textContent = p.instagram;
  els.behanceView.textContent = p.behance;
  els.linkedinView.textContent = p.linkedin;
  els.contactWhatsapp.textContent = p.whatsapp;
  els.contactInstagram.textContent = p.instagram;
  els.contactBehance.textContent = p.behance;
  els.contactLinkedin.textContent = p.linkedin;
}

function renderPortfolio() {
  els.portfolioGrid.innerHTML = "";
  if (!state.portfolio.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.language === "ar"
      ? "لا توجد أعمال مضافة حاليًا. يمكنك إضافة صورة أو فيديو أو موقع من لوحة التحكم باستخدام رابط مباشر أو رفع محلي حسب النوع."
      : "No portfolio items yet. You can add an image, video, or website from the dashboard using a direct URL or local upload depending on the type.";
    els.portfolioGrid.appendChild(empty);
    return;
  }

  state.portfolio.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "work-card glass reveal is-visible";
    let media = "";
    if (item.type === "video") {
      media = `<div class="thumb"><video controls preload="metadata" src="${item.src}"></video></div>`;
    } else if (item.type === "website") {
      media = `<div class="thumb website-thumb"><div class="website-placeholder"><strong>${state.language === "ar" ? "معاينة موقع" : "Website Preview"}</strong><span>${item.src || ""}</span></div></div>`;
    } else {
      media = `<div class="thumb"><img src="${item.src}" alt="${item.title || ""}"></div>`;
    }

    const websiteLink = item.type === "website" && item.src
      ? `<a class="btn btn-primary" href="${item.src}" target="_blank" rel="noopener">${state.language === "ar" ? "فتح الموقع" : "Open Website"}</a>`
      : "";

    card.innerHTML = `
      ${media}
      <h3>${item.title || ""}</h3>
      <p>${item.description || ""}</p>
      <div class="drawer-actions" style="margin-top:14px">
        ${websiteLink}
        <button class="btn btn-ghost remove-media" data-index="${index}">${state.language === "ar" ? "حذف" : "Remove"}</button>
      </div>
    `;
    els.portfolioGrid.appendChild(card);
  });

  document.querySelectorAll(".remove-media").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      state.portfolio.splice(index, 1);
      renderAll();
    });
  });
}

function renderAll() {
  applyLanguage();
  renderProfile();
  renderPortfolio();
  saveState();
}

function fillProfileForm() {
  const p = state.profile;
  Object.keys(p).forEach(key => {
    if (els.profileForm.elements[key]) {
      els.profileForm.elements[key].value = p[key];
    }
  });
  els.profileImageUrl.value = p.profileImage || "";
  els.profileImageFile.value = "";
}

function openAdmin() {
  document.body.classList.add("drawer-open");
  els.adminDrawer.setAttribute("aria-hidden", "false");
  fillProfileForm();
}
function closeAdmin() {
  document.body.classList.remove("drawer-open");
  els.adminDrawer.setAttribute("aria-hidden", "true");
}

async function fileToDataURL(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function copyShareLink() {
  const url = window.location.origin + window.location.pathname;
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert(t("shareCopied"));
  } catch {
    prompt(t("sharePrompt"), url);
  }
}

function switchTab(tab) {
  els.tabs.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
  els.panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === tab));
}

function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

els.tabs.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
els.langToggle.addEventListener("click", () => {
  state.language = state.language === "ar" ? "en" : "ar";
  renderAll();
});
els.shareBtn.addEventListener("click", copyShareLink);
els.openAdminBtn.addEventListener("click", openAdmin);
els.closeAdminBtn.addEventListener("click", closeAdmin);
els.adminOverlay.addEventListener("click", closeAdmin);

els.profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(els.profileForm);
  for (const [key, value] of formData.entries()) {
    state.profile[key] = value;
  }

  const imageUrl = els.profileImageUrl.value.trim();
  const imageFile = els.profileImageFile.files[0];

  if (imageFile) {
    state.profile.profileImage = await fileToDataURL(imageFile);
  } else if (imageUrl) {
    state.profile.profileImage = imageUrl;
  }

  renderAll();
  closeAdmin();
});

els.mediaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = els.mediaType.value;
  const title = els.mediaTitle.value.trim();
  const description = els.mediaDescription.value.trim();
  const url = els.mediaUrl.value.trim();
  const file = els.mediaFile.files[0];

  let src = "";
  if (file) {
    src = await fileToDataURL(file);
  } else if (url) {
    src = url;
  }

  if (!src) {
    alert(state.language === "ar" ? "أضف رابطًا مباشرًا أو ارفع ملفًا محليًا." : "Please add a direct URL or upload a local file.");
    return;
  }

  if (type === "website" && !/^https?:\/\//i.test(src)) {
    src = "https://" + src;
  }

  state.portfolio.unshift({ type, title, description, src });
  els.mediaTitle.value = "";
  els.mediaDescription.value = "";
  els.mediaUrl.value = "";
  els.mediaFile.value = "";
  renderAll();
  switchTab("media");
});

els.clearMediaBtn.addEventListener("click", () => {
  state.portfolio = [];
  renderAll();
});

els.resetBtn.addEventListener("click", () => {
  state = cloneData(defaultState);
  renderAll();
  closeAdmin();
});

initReveal();
renderAll();
