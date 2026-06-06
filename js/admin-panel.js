import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

  // Belum login
  if (!user) {
    alert("Silakan login terlebih dahulu");
    window.location.href = "masuk.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Jika data user tidak ada
    if (!userSnap.exists()) {
      alert("Data pengguna tidak ditemukan");
      window.location.href = "index.html";
      return;
    }

    const data = userSnap.data();

    // Cek role
    if (data.role !== "admin") {
      alert("Akses ditolak");
      window.location.href = "index.html";
      return;
    }

    // Tampilkan nama admin
    const adminName = document.getElementById("adminName");

    if (adminName) {
      adminName.textContent = data.nama || user.email;
    }

  } catch (error) {

    console.error(error);

    alert("Terjadi kesalahan");
    window.location.href = "index.html";

  }

});