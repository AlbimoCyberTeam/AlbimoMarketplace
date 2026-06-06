import { db }
from "./firebase-config.js";

import {
collection,
addDoc,
onSnapshot,
query,
orderBy,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

export async function sendMessage(
nama,
pesan
){

await addDoc(
collection(db,"chats"),
{
nama,
pesan,
createdAt:serverTimestamp()
}
);

}

export function listenChat(callback){

const q =
query(
collection(db,"chats"),
orderBy("createdAt")
);

onSnapshot(q,(snapshot)=>{

const data = [];

snapshot.forEach((doc)=>{

data.push(doc.data());

});

callback(data);

});

}