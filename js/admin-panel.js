import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut // Tambahan: Mengimpor fungsi signOut untuk proses logout
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

  // 1. Validasi Keamanan: Jika pengguna belum melakukan login sama sekali
  if (!user) {
    alert("Silakan login terlebih dahulu");
    window.location.href = "masuk.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // 2. Validasi Data: Jika akun ter autentikasi tapi datanya tidak ada di Firestore
    if (!userSnap.exists()) {
      alert("Data pengguna tidak ditemukan di database");
      window.location.href = "index.html";
      return;
    }

    const data = userSnap.data();

    // 3. Validasi Otorisasi: Menolak user biasa yang mencoba mengakses halaman admin
    if (data.role !== "admin") {
      alert("Akses ditolak! Menu ini hanya untuk administrator.");
      window.location.href = "index.html";
      return;
    }

    // Menampilkan nama admin atau email secara dinamis di halaman web
    const adminName = document.getElementById("adminName");
    if (adminName) {
      adminName.textContent = data.nama || user.email;
    }

    // Tambahan: Menangani fungsionalitas Tombol Logout secara aman
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      // Menghapus listener lama jika ada, untuk menghindari eksekusi ganda
      logoutBtn.onclick = async () => {
        const konfirmasi = confirm("Apakah Anda yakin ingin keluar dari panel admin?");
        if (konfirmasi) {
          try {
            await signOut(auth);
            alert("Anda telah berhasil keluar akun.");
            window.location.href = "masuk.html";
          } catch (logoutError) {
            console.error("Gagal Logout:", logoutError);
            alert("Gagal keluar akun, silakan coba lagi.");
          }
        }
      };
    }

  } catch (error) {
    console.error("Sistem Error pada Admin Panel:", error);
    alert("Terjadi kesalahan sistem saat memuat data.");
    window.location.href = "index.html";
  }
});
