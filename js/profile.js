import { auth, db } from "./firebase-config.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

auth.onAuthStateChanged(async(user)=>{

if(!user) return;

const snap = await getDoc(
doc(db,"users",user.uid)
);

if(snap.exists()){

const data = snap.data();

document.getElementById("nama").innerText =
data.nama || "-";

document.getElementById("email").innerText =
data.email || "-";

document.getElementById("role").innerText =
data.role || "user";

}

});