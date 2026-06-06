let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  alert("Produk ditambahkan ke keranjang");
}

function renderCart() {
  const container = document.getElementById("cart-items");

  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.harga);

    container.innerHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5>${item.nama}</h5>
          <p>Rp ${item.harga}</p>

          <button
            class="btn btn-danger btn-sm"
            onclick="removeCart(${index})">
            Hapus
          </button>
        </div>
      </div>
    `;
  });

  document.getElementById("total").innerText =
    "Rp " + total.toLocaleString("id-ID");
}

window.removeCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

window.addToCart = addToCart;

renderCart();