import { db } from "./firebase-config.js";
import { uploadImage } from "./cloudinary.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Ambil data harga ringkasan dari localStorage sebagai nilai tagihan dinamis
// Catatan: Idealnya data diambil dari ID pesanan, ini solusi tercepat untuk integrasi lokal
const infoKeranjangTerakhir = JSON.parse(localStorage.getItem("cart")) || [];

// =========================================================
// 1. MENAMPILKAN TOTAL TAGIHAN DI LAYAR
// =========================================================
function inisialisasiHalamanPembayaran() {
  const totalTagihanEl = document.getElementById("totalTagihan");
  
  // Menghitung perkiraan tagihan berdasarkan isi keranjang belanja terakhir (sebelum dihapus/jika dipertahankan)
  // Atau Anda bisa menyimpan totalHarga ke localStorage di file checkout.js sebelum dihapus.
  const nominalTagihan = localStorage.getItem("lastOrderTotal") || "0";
  
  if (totalTagihanEl) {
    totalTagihanEl.innerText = "Rp " + Number(nominalTagihan).toLocaleString("id-ID");
  }
}

// =========================================================
// 2. PROSES PENGIRIMAN BUKTI TRANSFER
// =========================================================
const form = document.getElementById("paymentForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const fileInput = document.getElementById("bukti");
    const file = fileInput.files[0];

    // Validasi keamanan jika file gambar kosong
    if (!file) {
      alert("Silakan pilih file foto bukti transfer terlebih dahulu.");
      return;
    }

    try {
      // Perbaikan 1: Mengunci tombol dan memberikan tanda loading text agar tidak diklik ganda
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "⏳ Mengupload Bukti Transfer...";
      }

      // Mengunggah file gambar ke Cloudinary
      const imageUrl = await uploadImage(file);

      if (submitBtn) {
        submitBtn.innerText = "💾 Mencatat Pembayaran...";
      }

      // Perbaikan 2: Mengambil ID pesanan cadangan dari memori lokal agar data tidak anonim
      const orderIdTerkait = localStorage.getItem("lastOrderId") || "Anonim/Tanpa_ID";
      const nominalBayar = Number(localStorage.getItem("lastOrderTotal")) || 0;

      // Menyimpan dokumentasi pembayaran secara lengkap ke Firestore
      await addDoc(collection(db, "payments"), {
        orderId: orderIdTerkait, // Mencegah data anonim, mengaitkan pembayaran ke pesanan
        nominalTransfer: nominalBayar,
        buktiTransfer: imageUrl,
        status: "Menunggu Verifikasi", // Akan diubah oleh admin di dashboard nantinya
        createdAt: serverTimestamp()
      });

      alert("🎉 Bukti transfer berhasil dikirim! Mohon tunggu konfirmasi admin.");
      
      // Bersihkan data riwayat pembayaran sementara di lokal komputer
      localStorage.removeItem("lastOrderId");
      localStorage.removeItem("lastOrderTotal");
      
      // Alihkan pengguna kembali ke halaman utama toko
      window.location.href = "index.html";

    } catch (error) {
      console.error("Gagal memproses upload pembayaran:", error);
      alert("❌ Gagal upload: " + error.message);
      
      // Membuka kembali kunci tombol jika proses gagal agar pengguna bisa mencoba lagi
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Kirim Bukti Transfer";
      }
    }
  });
}

// Jalankan pengaturan visual saat halaman web selesai dimuat
document.addEventListener("DOMContentLoaded", inisialisasiHalamanPembayaran);
