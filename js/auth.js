// firebase/auth.js
import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://gstatic.com";
import { doc, setDoc, getDoc } from "https://gstatic.com";

// ==========================================
// 1. LOGIKA UTAMA (FUNGSI ASINKRON)
// ==========================================

export async function registerUser(email, password, fullName = "Pelanggan", role = "customer") {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName: fullName,
            email: email,
            role: role, 
            createdAt: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            return { success: true, user, role: userDoc.data().role };
        } else {
            throw new Error("Data pengguna tidak ditemukan di database.");
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "masuk.html";
    } catch (error) {
        console.error("Logout gagal:", error);
        alert("Logout gagal: " + error.message);
    }
}

// ==========================================
// 2. ISOLASI EVENT HANDLER (PENCEGAH EROR)
// ==========================================

// Hanya berjalan jika dibuka di halaman daftar.html
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = registerForm.querySelector("button[type='submit']");
        
        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");

        if (!emailEl || !passwordEl) return;

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "⏳ Mendaftarkan..."; }
            const result = await registerUser(email, password, "Pelanggan Baru", "customer");
            if (result.success) {
                alert("🎉 Pendaftaran berhasil! Silakan masuk.");
                window.location.href = "masuk.html";
            } else {
                alert("❌ Pendaftaran Gagal: " + result.message);
            }
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Daftar Akun"; }
        }
    });
}

// Hanya berjalan jika dibuka di halaman masuk.html
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector("button[type='submit']");
        
        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");

        // Perbaikan: Mencegah pembacaan value sebelum elemen dipastikan eksis di halaman aktif
        if (!emailEl || !passwordEl) return;

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "⏳ Memeriksa Akun..."; }
            const result = await loginUser(email, password);
            
            if (result.success) {
                alert("👋 Berhasil Masuk!");
                if (result.role === "admin") {
                    window.location.href = "admin-panel.html";
                } else {
                    window.location.href = "dashboard-user.html";
                }
            } else {
                alert("❌ Gagal Masuk: " + result.message);
            }
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Masuk Sekarang"; }
        }
    });
}
