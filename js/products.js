const products = [
  {
    nama: "Sepatu Running",
    harga: "250000",
    gambar: "https://picsum.photos/300/200?1"
  },
  {
    nama: "Headset Gaming",
    harga: "350000",
    gambar: "https://picsum.photos/300/200?2"
  },
  {
    nama: "Smart Watch",
    harga: "500000",
    gambar: "https://picsum.photos/300/200?3"
  }
];

const wadah = document.getElementById("wadah-produk");

if (wadah) {
  products.forEach((produk) => {
    wadah.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${produk.gambar}" class="card-img-top">
          <div class="card-body">
            <h5>${produk.nama}</h5>
            <p>Rp ${produk.harga}</p>
            <button class="btn btn-primary">
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    `;
  });
}