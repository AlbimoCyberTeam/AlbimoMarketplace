// Membaca data wishlist dari localStorage atau buat array kosong jika belum ada
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

/**
 * Fungsi utama untuk merender/menampilkan daftar produk favorit di halaman wishlist.html
 */
function renderWishlist() {
  const container = document.getElementById("wishlist-container");
  if (!container) return;

  // Perbaikan 1: Bersihkan konten bawaan (termasuk kartu teks "Belum ada produk") sebelum merender data asli
  container.innerHTML = "";

  // Kondisi 1: Jika daftar keinginan (wishlist) kosong
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted py-5 card border-0 shadow-sm mx-3">
        <p class="mb-2">Belum ada produk di dalam wishlist Anda.</p>
        <div class="mt-2">
          <a href="index.html" class="btn btn-primary btn-sm">Cari Produk Keren</a>
        </div>
      </div>
    `;
    return;
  }

  // Kondisi 2: Jika wishlist berisi produk favorit
  wishlist.forEach((item, index) => {
    const hargaNumerik = Number(item.harga) || 0;

    // Menyiapkan string objek JSON yang aman untuk dikirim ke fungsi addToCart (milik cart.js)
    const dataProdukString = encodeURIComponent(JSON.stringify({
      id: item.id,
      nama: item.nama,
      harga: hargaNumerik,
      gambar: item.gambar
    }));

    // Menyuntikkan kartu produk favorit ke dalam grid HTML dengan penataan Bootstrap yang rapi
    container.innerHTML += `
      <div class="col-md-4 col-sm-6">
        <div class="card shadow-sm h-100 border-0">
          <img src="${item.gambar || 'https://placehold.co'}" 
               class="card-img-top" 
               alt="${item.nama}"
               style="height: 220px; object-fit: cover;">
          
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark text-truncate mb-1" title="${item.nama}">
              ${item.nama}
            </h5>
            <h6 class="text-primary fw-bold mb-3">
              Rp ${hargaNumerik.toLocaleString("id-ID")}
            </h6>
            
            <!-- Grup Tombol Aksi Terintegrasi -->
            <div class="d-grid gap-2 mt-auto">
              <!-- Perbaikan 3: Menambahkan Tombol Tambah ke Keranjang Belanja -->
              <button class="btn btn-primary btn-sm py-2" 
                      onclick="window.addToCart(JSON.parse(decodeURIComponent('${dataProdukString}')))">
                🛒 Masuk Keranjang
              </button>
              
              <!-- Perbaikan 4: Menambahkan Tombol Hapus Produk dari Wishlist -->
              <button class="btn btn-outline-danger btn-sm py-2" 
                      onclick="removeFromWishlist(${index})">
                🗑️ Hapus dari Favorit
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * Fungsi global untuk mengeluarkan produk dari daftar keinginan pembeli berdasarkan indeksnya
 * @param {number} index - Indeks baris produk di dalam array wishlist
 */
window.removeFromWishlist = function(index) {
  const konfirmasi = confirm("Apakah Anda ingin menghapus produk ini dari daftar wishlist?");
  if (konfirmasi) {
    wishlist.splice(index, 1); // Menghapus item dari array
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Menyimpan perubahan ke memori
    renderWishlist(); // Merender ulang tampilan visual di layar
  }
};

// Perbaikan 2: Menunggu struktur DOM siap seutuhnya sebelum mengeksekusi fungsi penampilan data
document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});
