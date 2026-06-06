const container =
document.getElementById("wishlist-container");

const wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

wishlist.forEach((item)=>{

container.innerHTML += `
<div class="col-md-4">

<div class="card">

<img src="${item.gambar}"
class="card-img-top">

<div class="card-body">

<h5>${item.nama}</h5>

<p>Rp ${item.harga}</p>

</div>

</div>

</div>
`;

});