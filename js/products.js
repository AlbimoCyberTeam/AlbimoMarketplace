import { db }
from "./firebase-config.js";

import {
collection,
onSnapshot,
query,
orderBy
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const wadah =
document.getElementById("wadah-produk");

if(wadah){

const q =
query(
collection(db,"products"),
orderBy("createdAt","desc")
);

onSnapshot(q,(snapshot)=>{

wadah.innerHTML="";

snapshot.forEach((doc)=>{

const produk = doc.data();

wadah.innerHTML += `
<div class="col-md-4">

<div class="card shadow-sm h-100">

<img
src="${produk.gambar}"
class="card-img-top"
style="height:250px;object-fit:cover;">

<div class="card-body">

<h5>${produk.nama}</h5>

<p>${produk.deskripsi}</p>

<h6>
Rp ${Number(produk.harga).toLocaleString("id-ID")}
</h6>

<button
class="btn btn-primary">
Tambah Keranjang
</button>

</div>

</div>

</div>
`;

});

});

}