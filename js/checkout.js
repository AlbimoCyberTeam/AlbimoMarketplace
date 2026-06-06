const form = document.getElementById("checkoutForm");

if (form) {
  form.addEventListener("submit", (e) => {

    e.preventDefault();

    alert("Pesanan berhasil dibuat");

    localStorage.removeItem("cart");

    window.location.href = "index.html";
  });
}