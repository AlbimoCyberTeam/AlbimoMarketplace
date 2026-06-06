import { db } from "./firebase-config.js";
import { uploadImage } from "./cloudinary.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const form = document.getElementById("productForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Mengambil elemen tombol untuk membuat efek loading
        const submitBtn = form.querySelector("button[type='submit']");
        
        const nama = document.getElementById("nama").value.trim();
        // Perbaikan 1: Mengonversi string input menjadi tipe data Angka (Number)
        const harga = Number(document.getElementById("harga").value);
        const deskripsi = document.getElementById("deskripsi").value.trim();
        
        const fileInput = document.getElementById("gambar");
        const file = fileInput.files[0];

        // Perbaikan 2: Validasi keamanan jika file gambar belum dipilih
        if (!file) {
            alert("Silakan pilih file gambar terlebih dahulu.");
            return;
        }

        try {
            // Perbaikan 3: Mengunci tombol agar admin tidak klik berkali-kali saat proses upload
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "⏳ Mengupload gambar...";
            }

            // Melakukan proses unggah gambar ke Cloudinary
            const imageUrl = await uploadImage(file);

            if (submitBtn) {
                submitBtn.innerText = "💾 Menyimpan data produk...";
            }

            // Menyimpan dokumen data ke koleksi "products" di Firestore
            await addDoc(collection(db, "products"), {
                nama: nama,
                harga: harga, // Tersimpan sebagai Number yang valid
                deskripsi: deskripsi,
                gambar: imageUrl,
                createdAt: serverTimestamp()
            });

            alert("🎉 Produk berhasil ditambahkan!");
            form.reset();

        } catch (error) {
            console.error("Detail Error Upload:", error);
            alert("❌ Upload gagal: " + error.message);
        } finally {
            // Mengembalikan status tombol ke kondisi semula setelah proses selesai/gagal
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Upload Produk";
            }
        }
    });
}