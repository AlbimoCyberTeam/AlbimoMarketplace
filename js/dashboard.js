import { db } from "./firebase-config.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Fungsi utama untuk memuat statistik data dashboard admin
 */
async function loadDashboard() {
  try {
    // Menarik seluruh data koleksi dari Firebase Firestore secara bersamaan
    const produkSnap = await getDocs(collection(db, "products"));
    const ordersSnap = await getDocs(collection(db, "orders"));
    const usersSnap  = await getDocs(collection(db, "users"));

    // Mengambil elemen teks visual dari halaman dashboard.html
    const totalProdukEl = document.getElementById("totalProduk");
    const totalOrderEl  = document.getElementById("totalOrder");
    const totalUserEl   = document.getElementById("totalUser");

    // Perbaikan 1: Validasi keberadaan elemen HTML sebelum menyuntikkan data angka
    if (totalProdukEl) {
      totalProdukEl.innerText = produkSnap.size;
    }
    
    if (totalOrderEl) {
      totalOrderEl.innerText = ordersSnap.size;
    }
    
    if (totalUserEl) {
      totalUserEl.innerText = usersSnap.size;
    }

  } catch (error) {
    // Perbaikan 2: Menangkap eror jaringan atau aturan hak akses database (Firestore Rules)
    console.error("Gagal memuat statistik data dashboard:", error);
    
    // Memberikan indikator eror visual yang ramah bagi admin di layar
    const elemenAngka = ["totalProduk", "totalOrder", "totalUser"];
    elemenAngka.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = "⚠️";
    });
  }
}

// Perbaikan 3: Menunggu dokumen HTML selesai dirakit seutuhnya (DOM Ready) sebelum memanggil Firebase
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});
