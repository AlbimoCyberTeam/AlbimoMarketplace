import { db } from "./firebase-config.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://gstatic.com";

// Membaca data keranjang belanja yang dibawa dari halaman keranjang
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =========================================================
// 1. MENAMPILKAN RINGKASAN BELANJA DI HALAMAN CHECKOUT
// =========================================================
function tampilkanRingkasanBelanja() {
  const container = document.getElementById("orderItemsContainer");
  const totalElement = document.getElementById("totalHarga");

  if (!container || !totalElement) return;

  // Jika keranjang kosong tapi memaksa masuk halaman checkout, kembalikan ke keranjang
  if (cart.length === 0) {
    alert("Keranjang Anda kosong, silakan pilih produk terlebih dahulu.");
    window.location.href = "keranjang.html";
    return;
  }

  container.innerHTML = "";
  let totalHargaBelanja = 0;

  cart.forEach((item) => {
    const itemQty = item.qty || 1;
    const subTotal = item.harga * itemQty;
    totalHargaBelanja += subTotal;

    // Membuat baris daftar barang belanjaan
    container.innerHTML += `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0 text-dark fw-medium">${item.nama}</h6>
          <small class="text-muted">Rp ${item.harga.toLocaleString("id-ID")} x ${itemQty}</small>
        </div>
        <span class="text-muted">Rp ${subTotal.toLocaleString("id-ID")}</span>
      </li>
    `;
  });

  // Memperbarui total harga di teks visual HTML
  totalElement.innerText = "Rp " + totalHargaBelanja.toLocaleString("id-ID");
}

// =========================================================
// 2. PROSES PEMBUATAN PESANAN (SUBMIT FORMULIR)
// =========================================================
const form = document.getElementById("checkoutForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");

    // Mengambil data identitas yang diisi oleh pembeli di formulir HTML
    const namaPenerima = document.getElementById("namaPenerima").value.trim();
    const alamatLengkap = document.getElementById("alamatLengkap").value.trim();
    const noHp = document.getElementById("noHp").value.trim();

    // Menghitung ulang total harga akhir untuk disimpan ke database
    const totalHargaFinal = cart.reduce((total, item) => total + (item.harga * (item.qty || 1)), 0);

    try {
      // Mengunci tombol agar pembeli tidak melakukan klik ganda saat loading
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "⏳ Memproses Pesanan Anda...";
      }

      // Menyimpan data pesanan secara utuh ke koleksi "orders" di Firestore
      await addDoc(collection(db, "orders"), {
        pembeli: {
          nama: namaPenerima,
          alamat: alamatLengkap,
          telepon: noHp
        },
        items: cart, // Menyimpan array daftar barang yang dibeli
        totalPembayaran: totalHargaFinal,
        statusPesanan: "pending", // Status awal sebelum dibayar pembeli
        createdAt: serverTimestamp() // Penanda waktu transaksi resmi server
      });

      alert("🎉 Pesanan berhasil dibuat! Silakan lakukan pembayaran.");

      // Membersihkan data keranjang belanja di lokal komputer setelah sukses order
      localStorage.removeItem("cart");

      // Mengalihkan pembeli langsung ke halaman pembayaran QRIS
      window.location.href = "pembayaran.html";

    } catch (error) {
      console.error("Gagal membuat dokumentasi pesanan:", error);
      alert("❌ Terjadi kesalahan: " + error.message);
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Buat Pesanan";
      }
    }
  });
}

// Menjalankan fungsi tampilan ringkasan saat halaman checkout selesai dimuat
document.addEventListener("DOMContentLoaded", tampilkanRingkasanBelanja);
