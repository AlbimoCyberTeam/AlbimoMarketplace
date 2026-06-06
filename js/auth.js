// firebase/auth.js
import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// 1. Registrasi Pengguna Baru (Customer atau Seller)
export async function registerUser(email, password, fullName, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data tambahan dan ROLE ke Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName: fullName,
            email: email,
            role: role, // 'customer' atau 'seller' (admin dibuat manual)
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

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "masuk.html";
    } catch (error) {
        console.error("Logout gagal:", error);
        alert("Logout gagal: " + error.message);
    }
}
