// firebase/auth.js
import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ==========================================
// 1. FUNGSI REGISTER
// ==========================================

export async function registerUser(
    email,
    password,
    fullName = "Pelanggan",
    role = "customer"
) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName,
            email,
            role,
            createdAt: serverTimestamp()
        });

        return {
            success: true,
            user
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// ==========================================
// 2. FUNGSI LOGIN
// ==========================================

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("Data pengguna tidak ditemukan.");
        }

        const userData = userDoc.data();

        return {
            success: true,
            user,
            role: userData.role || "customer"
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// ==========================================
// 3. FUNGSI LOGOUT
// ==========================================

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "masuk.html";
    } catch (error) {
        console.error(error);
        alert("Logout gagal: " + error.message);
    }
}

// ==========================================
// 4. FORM REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn =
            registerForm.querySelector("button[type='submit']");

        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");

        if (!emailEl || !passwordEl) return;

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        if (password.length < 6) {
            alert("Password minimal 6 karakter.");
            return;
        }

        try {

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "⏳ Mendaftarkan...";
            }

            const result = await registerUser(
                email,
                password,
                "Pelanggan Baru",
                "customer"
            );

            if (result.success) {

                alert("🎉 Pendaftaran berhasil!");

                window.location.href = "masuk.html";

            } else {

                alert("❌ " + result.message);

            }

        } finally {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Daftar Akun";
            }

        }
    });
}

// ==========================================
// 5. FORM LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn =
            loginForm.querySelector("button[type='submit']");

        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");

        if (!emailEl || !passwordEl) return;

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        try {

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "⏳ Memeriksa Akun...";
            }

            const result = await loginUser(
                email,
                password
            );

            if (result.success) {

                if (result.role === "admin") {

                    window.location.href =
                        "admin-panel.html";

                } else {

                    window.location.href =
                        "dashboard-user.html";

                }

            } else {

                alert("❌ " + result.message);

            }

        } finally {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Masuk Sekarang";
            }

        }
    });
}