import { db } from "./firebase-config.js";
import { uploadImage } from "./cloudinary.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const form =
document.getElementById("paymentForm");

form.addEventListener("submit",
async(e)=>{

e.preventDefault();

const file =
document.getElementById("bukti").files[0];

try{

const imageUrl =
await uploadImage(file);

await addDoc(
collection(db,"payments"),
{
buktiTransfer:imageUrl,
status:"Menunggu Verifikasi",
createdAt:serverTimestamp()
}
);

alert("Bukti transfer berhasil dikirim");

}
catch(error){

console.error(error);

alert("Gagal upload");

}

});