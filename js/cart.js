// Membaca data keranjang dari localStorage atau buat array kosong jika belum ada
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fungsi untuk menyimpan perubahan data keranjang ke dalam localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  // Memperbarui jumlah counter keranjang di navbar jika elemennya tersedia
  updateNavbarCartCount();
}

// Fungsi utama untuk menambahkan produk ke dalam keranjang
function addToCart(product) {
  // Mengonversi harga ke tipe data angka untuk memastikan keamanan kalkulasi
  const hargaNumerik = Number(product.harga);
  
  // Periksa apakah produk yang sama sudah pernah dimasukkan sebelumnya
  const produkTersedia = cart.find(item => item.id === product.id);

  if (produkTersedia) {
    // Jika sudah ada, cukup tambahkan jumlah kuantitasnya
    produkTersedia.qty = (produkTersedia.qty || 1) + 1;
  } else {
    // Jika belum ada, masukkan produk baru dengan properti kuantitas awal = 1
    cart.push({
      ...product,
      harga: hargaNumerik,
      qty: 1
    });
  }
  
  saveCart();
  alert(`🎉 "${product.nama}" berhasil dimasukkan ke keranjang!`);
}

// Fungsi untuk merender/menampilkan daftar belanjaan di halaman keranjang.html
function renderCart() {
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!container) return;

  // Kondisi 1: Jika keranjang belanjaan kosong
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted py-5 card border-0 shadow-sm">
        <p class="mb-0">Keranjang belanja Anda masih kosong.</p>
      </div>
    `;
    if (totalElement) totalElement.innerText = "Rp 0";
    if (checkoutBtn) {
      // Menonaktifkan tombol checkout agar pembeli tidak bisa melangkah ke halaman pembayaran
      checkoutBtn.classList.add("disabled", "btn-secondary");
      checkoutBtn.classList.remove("btn-success");
      checkoutBtn.style.pointerEvents = "none";
    }
    return;
  }

  // Kondisi 2: Jika keranjang berisi barang belanjaan
  container.innerHTML = "";
  let totalBelanja = 0;

  cart.forEach((item, index) => {
    const itemQty = item.qty || 1;
    const subTotalItem = item.harga * itemQty;
    totalBelanja += subTotalItem;

    container.innerHTML += `
      <div class="card mb-3 border-0 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1 fw-bold text-dark">${item.nama}</h5>
            <p class="text-muted small mb-0">
              Rp ${item.harga.toLocaleString("id-ID")} x ${itemQty}
            </p>
            <strong class="text-primary small">
              Subtotal: Rp ${subTotalItem.toLocaleString("id-ID")}
            </strong>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-danger" onclick="removeCart(${index})">
              🗑️ Hapus
            </button>
          </div>
        </div>
      </div>
    `;
  });

  // Menampilkan total harga dengan format Rupiah yang rapi (id-ID)
  if (totalElement) {
    totalElement.innerText = "Rp " + totalBelanja.toLocaleString("id-ID");
  }

  // Mengaktifkan kembali tombol checkout
  if (checkoutBtn) {
    checkoutBtn.classList.remove("disabled", "btn-secondary");
    checkoutBtn.classList.add("btn-success");
    checkoutBtn.style.pointerEvents = "auto";
  }
}

// Fungsi pembantu untuk memperbarui angka notifikasi keranjang di navbar index.html
function updateNavbarCartCount() {
  const cartCountBadge = document.getElementById("cartCount");
  if (cartCountBadge) {
    const totalBarang = cart.reduce((total, item) => total + (item.qty || 1), 0);
    if (totalBarang > 0) {
      cartCountBadge.innerText = totalBarang;
      cartCountBadge.classList.remove("d-none");
    } else {
      cartCountBadge.classList.add("d-none");
    }
  }
}

// Fungsi global untuk menghapus item dari keranjang berdasarkan indeksnya
window.removeCart = function(index) {
  const konfirmasi = confirm("Apakah Anda ingin menghapus produk ini dari keranjang?");
  if (konfirmasi) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
};

// Mengekspos fungsi addToCart ke ranah global agar bisa dipanggil tombol di index.html
window.addToCart = addToCart;

// Menjalankan fungsi render dan counter saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateNavbarCartCount();
});
