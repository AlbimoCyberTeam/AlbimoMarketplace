import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/* =========================
   REGISTER
========================= */

const registerForm =
document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
      document.getElementById("email").value;

      const password =
      document.getElementById("password").value;

      try {

        const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(
          doc(
            db,
            "users",
            userCredential.user.uid
          ),
          {
            email,
            role: "user",
            createdAt: new Date()
          }
        );

        alert("Pendaftaran berhasil");

        window.location.href =
        "masuk.html";

      } catch (error) {

        alert(error.message);

      }

    }
  );

}

/* =========================
   LOGIN
========================= */

const loginForm =
document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
      document.getElementById("email").value;

      const password =
      document.getElementById("password").value;

      try {

        const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const uid =
        userCredential.user.uid;

        const userDoc =
        await getDoc(
          doc(db, "users", uid)
        );

        if (!userDoc.exists()) {

          alert("Data user tidak ditemukan");

          return;

        }

        const userData =
        userDoc.data();

        if (userData.role === "admin") {

    window.location.href = "admin-panel.html";

} else {

    window.location.href = "dashboard-user.html";

}

      } catch (error) {

        alert(error.message);

      }

    }
  );

}

/* =========================
   LOGOUT
========================= */

window.logoutUser =
async function () {

  await signOut(auth);

  alert("Logout berhasil");

  window.location.href =
  "masuk.html";

};