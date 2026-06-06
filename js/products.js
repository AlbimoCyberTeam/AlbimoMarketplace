import { db } from "./firebase-config.js";
import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const wadah = document.getElementById("wadah-produk");

if (wadah) {
    // Menyusun query untuk mengambil data produk diurutkan dari yang terbaru
    const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
    );

    // Mendengarkan perubahan data produk secara real-time
    onSnapshot(q, (snapshot) => {
        // Membersihkan wadah penampung sebelum merender ulang data baru
        wadah.innerHTML = "";

        // Validasi jika belum ada produk sama sekali di database
        if (snapshot.empty) {
            wadah.innerHTML = `
                <div class="col-100 text-center text-muted py-5 mx-auto">
                    <p class="mb-0">Belum ada produk yang tersedia di etalase toko.</p>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {
            const produk = doc.data();
            const idProduk = doc.id; // Mengambil ID dokumen unik dari Firebase
            const hargaNumerik = Number(produk.harga) || 0;

            // Perbaikan 1: Membuat string objek JSON yang aman untuk dikirim ke fungsi addToCart via onclick
            // Menggunakan fungsi encodeURIComponent untuk mengantisipasi error jika nama produk mengandung tanda petik
            const dataProdukString = encodeURIComponent(JSON.stringify({
                id: idProduk,
                nama: produk.nama,
                harga: hargaNumerik,
                gambar: produk.gambar
            }));

            // Menyuntikkan struktur kartu produk ke dalam grid HTML
            wadah.innerHTML += `
                <div class="col-md-4 col-sm-6">
                    <div class="card shadow-sm h-100 border-0">
                        <!-- Gambar Produk -->
                        <img src="${produk.gambar || 'https://placehold.co'}" 
                             class="card-img-top" 
                             alt="${produk.nama}"
                             style="height: 220px; object-fit: cover;">
                        
                        <div class="card-body d-flex flex-column">
                            <!-- Nama Produk -->
                            <h5 class="card-title fw-bold text-dark text-truncate mb-1" title="${produk.nama}">
                                ${produk.nama}
                            </h5>
                            
                            <!-- Deskripsi Produk -->
                            <p class="card-text text-muted small text-truncate-2 flex-grow-1 mb-2">
                                ${produk.deskripsi || 'Tidak ada deskripsi produk.'}
                            </p>
                            
                            <!-- Harga Produk -->
                            <h6 class="text-primary fw-bold mb-3 fs-5">
                                Rp ${hargaNumerik.toLocaleString("id-ID")}
                            </h6>
                            
                            <!-- Perbaikan 2: Menghubungkan tombol langsung ke fungsi addToCart global milik cart.js -->
                            <button class="btn btn-primary w-100 py-2 mt-auto" 
                                    onclick="window.addToCart(JSON.parse(decodeURIComponent('${dataProdukString}')))">
                                🛒 Tambah Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }, (error) => {
        console.error("Gagal memuat etalase produk secara real-time:", error);
        wadah.innerHTML = `
            <div class="col-100 text-center text-danger py-5 mx-auto">
                <p class="mb-0">❌ Gagal memuat produk. Silakan periksa koneksi internet Anda.</p>
            </div>
        `;
    });
}
