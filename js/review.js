import { db }
from "./firebase-config.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const form =
document.getElementById("reviewForm");

if (form) form.addEventListener("submit",
async(e)=>{

e.preventDefault();

await addDoc(
collection(db,"reviews"),
{
nama:
document.getElementById("nama").value,

rating:
document.getElementById("rating").value,

komentar:
document.getElementById("komentar").value,

createdAt:
serverTimestamp()
}
);

alert("Ulasan berhasil dikirim");

form.reset();

});