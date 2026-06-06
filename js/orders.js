import { db }
from "./firebase-config.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

export async function createOrder(data){

await addDoc(
collection(db,"orders"),
{
...data,
status:"Menunggu",
createdAt:serverTimestamp()
}
);

}