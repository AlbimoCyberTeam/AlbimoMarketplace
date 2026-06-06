import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const container =
document.getElementById("orders");

async function loadOrders(){

const snapshot =
await getDocs(collection(db,"orders"));

snapshot.forEach((doc)=>{

const order = doc.data();

container.innerHTML += `
<div class="card mb-3">

<div class="card-body">

<h5>Status:
${order.status}</h5>

<p>Total:
Rp ${order.total || 0}</p>

</div>

</div>
`;

});

}

loadOrders();