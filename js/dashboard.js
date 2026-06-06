import { db }
from "./firebase-config.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

async function loadDashboard(){

const produk =
await getDocs(collection(db,"products"));

const orders =
await getDocs(collection(db,"orders"));

const users =
await getDocs(collection(db,"users"));

document.getElementById("totalProduk")
.innerText = produk.size;

document.getElementById("totalOrder")
.innerText = orders.size;

document.getElementById("totalUser")
.innerText = users.size;

}

loadDashboard();