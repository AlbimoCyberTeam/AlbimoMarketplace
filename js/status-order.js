import { db }
from "./firebase-config.js";

import {
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

export async function updateStatus(
orderId,
status
){

await updateDoc(
doc(db,"orders",orderId),
{
status
}
);

}