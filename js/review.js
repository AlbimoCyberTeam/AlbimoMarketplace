import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const form = document.getElementById("reviewForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    
    // Mengambil nilai input dari formulir HTML
    const nama = document.getElementById("nama").value.trim();
    // Perbaikan 1: Mengonversi nilai string rating menjadi Tipe Data Angka (Number) yang valid
    const rating = Number(document.getElementById("rating").value);
    const komentar = document.getElementById("komentar").value.trim();

    // Perbaikan 2: Mengambil ID Produk terkait dari memori lokal (URL parameter atau localStorage)
    // Agar ulasan ini terikat pada produk yang tepat dan tidak menjadi data anonim
    const productIdTerkait = localStorage.getItem("activeReviewProductId") || "Umum/Tanpa_ID";

    try {
      // Perbaikan 3: Mengunci tombol agar pembeli tidak mengirim data ganda saat loading jaringan
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "⏳ Mengirim Ulasan...";
      }

      // Menyimpan dokumen data ulasan secara lengkap ke koleksi "reviews" di Firestore
      await addDoc(collection(db, "reviews"), {
        productId: productIdTerkait, // Menghubungkan ulasan ke produk spesifik
        nama: nama,
        rating: rating, // Tersimpan sebagai angka murni (1-5)
        komentar: komentar,
        createdAt: serverTimestamp() // Penanda waktu resmi dari server Firebase
      });

      alert("🎉 Terima kasih! Ulasan Anda berhasil dikirim.");
      form.reset();

      // Opsional: Hapus ID produk penampung sementara dari memori setelah selesai
      localStorage.removeItem("activeReviewProductId");

      // Mengalihkan pembeli kembali ke halaman utama toko
      window.location.href = "index.html";

    } catch (error) {
      console.error("Gagal mengirimkan data ulasan:", error);
      alert("❌ Terjadi kesalahan saat mengirim ulasan: " + error.message);
    } finally {
      // Membuka kembali kunci tombol setelah proses selesai atau gagal
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Kirim Ulasan Sekarang";
      }
    }
  });
}
