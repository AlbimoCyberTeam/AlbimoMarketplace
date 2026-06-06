import { db } from "./firebase-config.js";

import { uploadImage }
from "./cloudinary.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const form =
document.getElementById("productForm");

form.addEventListener("submit",
async (e)=>{

e.preventDefault();

const nama =
document.getElementById("nama").value;

const harga =
document.getElementById("harga").value;

const deskripsi =
document.getElementById("deskripsi").value;

const file =
document.getElementById("gambar").files[0];

try{

alert("Mengupload gambar...");

const imageUrl =
await uploadImage(file);

await addDoc(
collection(db,"products"),
{
nama,
harga,
deskripsi,
gambar:imageUrl,
createdAt:serverTimestamp()
}
);

alert("Produk berhasil ditambahkan");

form.reset();

}
catch(error){

console.error(error);

alert("Upload gagal");

}

});