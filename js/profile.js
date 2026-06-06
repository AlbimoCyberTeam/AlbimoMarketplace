import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Memantau perubahan status login pengguna secara real-time
auth.onAuthStateChanged(async (user) => {
  
  // Perbaikan 1: Validasi Keamanan. Jika pengguna belum login, langsung usir ke halaman masuk
  if (!user) {
    alert("Silakan login terlebih dahulu untuk melihat profil Anda.");
    window.location.href = "masuk.html";
    return;
  }

  try {
    // Mengambil rujukan dokumen pengguna dari koleksi "users" berdasarkan UID akun login
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      // Mengambil elemen-elemen teks visual dari halaman profil.html
      const namaEl  = document.getElementById("nama");
      const emailEl = document.getElementById("email");
      const roleEl  = document.getElementById("role");

      // Perbaikan 2: Menyelaraskan nama properti dengan 'fullName' sesuai format di file auth.js
      if (namaEl) {
        namaEl.innerText = data.fullName || data.nama || "Pelanggan Tanpa Nama";
      }

      if (emailEl) {
        emailEl.innerText = data.email || user.email || "-";
      }

      if (roleEl) {
        const userRole = data.role || "customer";
        roleEl.innerText = userRole.toUpperCase();

        // Variasi Estetika: Mengubah warna badge Bootstrap berdasarkan status peran akun
        roleEl.className = "badge fs-6 px-3 py-2"; // Reset kelas dasar badge
        if (userRole === "admin" || userRole === "seller") {
          roleEl.classList.add("bg-danger"); // Warna merah jika dia pengelola toko
        } else {
          roleEl.classList.add("bg-primary"); // Warna biru jika dia pembeli biasa
        }
      }
    } else {
      // Kondisi jika akun login ada di Firebase Auth tetapi dokumen datanya terhapus di Firestore
      alert("Biodata profil Anda tidak ditemukan di database.");
      window.location.href = "index.html";
    }

  } catch (error) {
    console.error("Gagal mengambil data profil dari Firestore:", error);
    
    // Memberikan informasi indikator kegagalan yang ramah di layar pengguna
    const elemenProfil = ["nama", "email"];
    elemenProfil.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = "⚠️ Gagal memuat data";
    });
  }
});
