// ================= FIREBASE CONFIG =================
const firebaseSettings = {
  enabled: true,
  shareCollection: "portfolioShares",
  storageFolder: "portfolio-assets",
  config: {
    apiKey: "AIzaSyDJ0HBARgnIXI39IT0rCCIKg_MjL7n87b0",
    authDomain: "gen-lang-client-0530088745.firebaseapp.com",
    projectId: "gen-lang-client-0530088745",
    storageBucket: "gen-lang-client-0530088745.appspot.com",
    messagingSenderId: "841573260646",
    appId: "1:841573260646:web:5d331f0625bdd5d2743ca7"
  }
};

// ================= FIREBASE INIT =================
let firebaseApp, firebaseDb;

async function initFirebase() {
  if (!firebaseSettings.enabled) return null;

  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

  firebaseApp = initializeApp(firebaseSettings.config);
  firebaseDb = getFirestore(firebaseApp);

  return firebaseDb;
}

// ================= SAVE DATA =================
async function saveToFirebase(data) {
  const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

  const db = await initFirebase();

  const docRef = await addDoc(collection(db, firebaseSettings.shareCollection), data);

  return docRef.id;
}

// ================= LOAD DATA =================
async function loadFromFirebase(id) {
  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

  const db = await initFirebase();

  const docRef = doc(db, firebaseSettings.shareCollection, id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}

// ================= STATE =================
let state = {
  profile: {},
  portfolio: []
};

// ================= SHARE =================
async function copyShareLink() {
  try {
    const id = await saveToFirebase(state);

    const url = `${window.location.origin}?id=${id}`;

    await navigator.clipboard.writeText(url);

    alert("تم نسخ رابط المشاركة");
  } catch (e) {
    console.error(e);
    alert("خطأ في المشاركة");
  }
}

// ================= LOAD FROM URL =================
async function loadSharedData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  const data = await loadFromFirebase(id);

  if (data) {
    state = data;
    renderAll();
  }
}

// ================= RENDER =================
function renderAll() {
  console.log("Rendering:", state);
  // خله نفس كودك القديم
}

// ================= INIT =================
window.addEventListener("load", async () => {
  await loadSharedData();
});

// ================= EVENTS =================
document.getElementById("shareLinkBtn")?.addEventListener("click", copyShareLink);
