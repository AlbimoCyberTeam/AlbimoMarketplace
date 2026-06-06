import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Fungsi pembantu untuk mengambil status peran (role) pengguna dari Firestore berdasarkan UID
 * @param {string} uid - ID unik pengguna dari Firebase Authentication
 * @returns {Promise<string>} - Mengembalikan string peran seperti 'admin', 'customer', atau 'seller'
 */
export async function getUserRole(uid) {
  // Validasi awal jika parameter UID kosong atau tidak valid
  if (!uid) return "customer";

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      // Mengembalikan data role dari database, jika propertinya kosong beri nilai 'customer'
      return data.role || "customer";
    }

    // Perbaikan: Mengubah 'user' menjadi 'customer' agar selaras dengan file auth.js dan dashboard-user.html
    return "customer";

  } catch (error) {
    console.error("Gagal memeriksa role pengguna di database:", error);
    // Jika koneksi internet terputus atau gagal, kembalikan role paling aman (customer)
    return "customer";
  }
}
