import { auth, db } from "./firebase-config.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

export async function getUserRole(uid){

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

if(snap.exists()){

return snap.data().role;

}

return "user";
}