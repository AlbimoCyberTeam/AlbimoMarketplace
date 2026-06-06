// firebase/auth.js
import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ==========================================
// KODE LOGIKA UTAMA (FUNGSI ASINKRON)
// ==========================================

// 1. Registrasi Pengguna Baru
export async function registerUser(email, password, fullName = "Pelanggan", role = "customer") {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data tambahan ke Firestore (Default role dibuat 'customer')
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            nama: fullName, // Menggunakan 'nama' agar senada dengan profil.html (id="nama")
            email: email,
            role: role, 
            createdAt: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// 2. Login Pengguna
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ambil data role dari Firestore
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

// 3. Logout Pengguna
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
// KODE PENGIKAT EVENT (AUTOMATIC INTEGRATION)
// ==========================================

// Eksekusi ketika file dijalankan di halaman daftar.html
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = registerForm.querySelector("button[type='submit']");
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "⏳ Mendaftarkan..."; }
            
            // Memanggil fungsi register (menggunakan nilai default untuk nama dan role)
            const result = await registerUser(email, password, "Pelanggan Baru", "customer");
            
            if (result.success) {
                alert("🎉 Pendaftaran berhasil! Silakan masuk ke akun Anda.");
                window.location.href = "masuk.html";
            } else {
                alert("❌ Pendaftaran Gagal: " + result.message);
            }
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Daftar"; }
        }
    });
}

// Eksekusi ketika file dijalankan di halaman masuk.html
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector("button[type='submit']");
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "⏳ Memeriksa Akun..."; }
            
            const result = await loginUser(email, password);
            
            if (result.success) {
                alert("👋 Berhasil Masuk!");
                
                // Menangani pengalihan halaman berdasarkan hak akses (Role)
                if (result.role === "admin") {
                    window.location.href = "admin-panel.html";
                } else {
                    window.location.href = "dashboard-user.html";
                }
            } else {
                alert("❌ Gagal Masuk: " + result.message);
            }
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Masuk"; }
        }
    });
}
