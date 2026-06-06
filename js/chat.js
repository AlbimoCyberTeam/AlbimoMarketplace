import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Fungsi untuk mengirim pesan baru ke dalam database Firestore
 * @param {string} nama - Nama pengirim pesan
 * @param {string} pesan - Isi pesan teks
 */
export async function sendMessage(nama, pesan) {
    // Perbaikan 1: Validasi keamanan untuk memotong spasi dan mencegah pesan kosong terkirim
    const namaBersih = nama ? nama.trim() : "";
    const pesanBersih = pesan ? pesan.trim() : "";

    if (!namaBersih || !pesanBersih) {
        throw new Error("Nama dan isi pesan tidak boleh kosong.");
    }

    try {
        await addDoc(collection(db, "chats"), {
            nama: namaBersih,
            pesan: pesanBersih,
            createdAt: serverTimestamp() // Waktu dihitung dari server Firebase
        });
    } catch (error) {
        console.error("Gagal mengirim pesan chat:", error);
        throw error;
    }
}

/**
 * Fungsi untuk mendengarkan perubahan data obrolan secara real-time
 * @param {function} callback - Fungsi penanganan untuk merender ulang tampilan data teks chat
 */
export function listenChat(callback) {
    const q = query(
        collection(db, "chats"),
        orderBy("createdAt", "asc") // Mengurutkan dari pesan terlama ke terbaru
    );

    // Perbaikan 2: Menggunakan snapshot listener dengan konfigurasi yang lebih aman
    // untuk mengantisipasi nilai 'createdAt' yang sempat bernilai null sementara di sisi klien
    return onSnapshot(q, (snapshot) => {
        const data = [];

        snapshot.forEach((doc) => {
            const docData = doc.data();
            
            // Masukkan data ke array hanya jika data tersebut valid
            // Kita bisa memberikan nilai waktu cadangan (Date.now()) jika createdAt milik server belum siap
            data.push({
                id: doc.id,
                ...docData,
                createdAt: docData.createdAt ? docData.createdAt.toDate() : new Date()
            });
        });

        // Mengirimkan array data yang bersih ke fungsi pembantu di file visual (UI)
        callback(data);
    }, (error) => {
        console.error("Gagal memuat pembaruan chat secara real-time:", error);
    });
}
