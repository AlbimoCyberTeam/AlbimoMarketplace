import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB39WPXW-vV25QQiUB5Fkk9di4cUVfpCjo",
  authDomain: "albimo-shopee.firebaseapp.com",
  projectId: "albimo-shopee",
  storageBucket: "albimo-shopee.firebasestorage.app",
  messagingSenderId: "349404045321",
  appId: "1:349404045321:web:6d5b49cd1897d4e51418d8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);