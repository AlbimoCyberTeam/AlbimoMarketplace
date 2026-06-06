import { db } from "./firebase-config.js";
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Fungsi untuk memperbarui status pesanan di database oleh Admin/Penjual
 * @param {string} orderId - ID Dokumen unik pesanan di Firestore
 * @param {string} status - Status baru (contoh: 'paid', 'success', 'cancelled')
 */
export async function updateStatus(orderId, status) {
  // Validasi awal untuk memastikan data parameter tidak kosong sebelum dikirim ke server
  if (!orderId || !status) {
    throw new Error("ID Pesanan dan Status baru wajib diisi.");
  }

  try {
    const orderRef = doc(db, "orders", orderId);

    // Perbaikan: Mengubah properti 'status' menjadi 'statusPesanan'
    // agar sinkron dengan file checkout.js dan order-history.js
    await updateDoc(orderRef, {
      statusPesanan: status.trim().toLowerCase()
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui status pesanan di Firestore:", error);
    throw error;
  }
}
