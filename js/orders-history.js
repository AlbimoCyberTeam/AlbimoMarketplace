import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Fungsi utama untuk memuat data riwayat pesanan dari Firestore
 */
async function loadOrders() {
  const container = document.getElementById("orders");
  if (!container) return;

  try {
    // Menyusun query untuk mengambil data dari koleksi "orders"
    // Opsional: Diurutkan berdasarkan waktu transaksi terbaru (jika indeks Firestore sudah dibuat)
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(ordersQuery);

    // Perbaikan 1: Bersihkan teks "Sedang memuat data..." sebelum menyisipkan data asli
    container.innerHTML = "";

    // Validasi jika belum ada pesanan sama sekali di database
    if (snapshot.empty) {
      container.innerHTML = `
        <div class="text-center text-muted py-5 card border-0 shadow-sm">
          <p class="mb-0">Belum ada riwayat pesanan yang ditemukan.</p>
        </div>
      `;
      return;
    }

    // Melakukan perulangan untuk setiap dokumen pesanan yang ditemukan
    snapshot.forEach((docSnap) => {
      const order = docSnap.data();
      
      // Perbaikan 2: Menyelaraskan nama properti dengan data yang dikirim dari checkout.js
      const status = order.statusPesanan || "pending";
      const totalHarga = order.totalPembayaran || 0;
      const daftarBarang = order.items || [];
      
      // Menentukan warna badge Bootstrap berdasarkan status pesanan agar menarik
      let badgeColor = "bg-warning";
      if (status === "berhasil" || status === "paid") badgeColor = "bg-success";
      if (status === "batal" || status === "cancelled") badgeColor = "bg-danger";

      // Membuat teks daftar nama barang yang dibeli untuk ditampilkan di kartu
      const teksBarang = daftarBarang.map(item => `${item.nama} (${item.qty || 1}x)`).join(", ");

      // Menyuntikkan struktur kartu pesanan yang rapi ke dalam HTML
      container.innerHTML += `
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="text-muted small mb-0">ID Pesanan: ${docSnap.id}</h6>
              <!-- Menampilkan status dengan komponen badge Bootstrap -->
              <span class="badge ${badgeColor} text-capitalize px-3 py-2">${status}</span>
            </div>
            
            <h5 class="card-title text-dark fw-bold mb-1">
              Rp ${totalHarga.toLocaleString("id-ID")}
            </h5>
            
            <p class="card-text text-secondary small mb-0">
              <strong>Produk:</strong> ${teksBarang || "Tidak ada rincian produk"}
            </p>
            
            ${order.pembeli ? `
              <p class="card-text text-muted small mt-2 mb-0 border-top pt-2">
                📍 <strong>Kirim ke:</strong> ${order.pembeli.nama} | ${order.pembeli.alamat}
              </p>
            ` : ""}
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Gagal memuat riwayat pesanan:", error);
    container.innerHTML = `
      <div class="text-center text-danger py-5 card border-0 shadow-sm">
        <p class="mb-0">❌ Gagal memuat data pesanan. Silakan muat ulang halaman.</p>
      </div>
    `;
  }
}

// Perbaikan 3: Menunggu struktur DOM siap seutuhnya sebelum mengeksekusi fungsi Firebase
document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});
