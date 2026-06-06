/**
 * Fungsi untuk mengunggah file gambar ke Cloudinary Media Server
 * @param {File|FileList} file - Objek file tunggal atau daftar file dari input HTML
 * @returns {Promise<string>} - Mengembalikan string URL gambar aman (secure_url)
 */
export async function uploadImage(file) {
  // Pengaturan konfigurasi akun Cloudinary Anda
  const CLOUD_NAME = "diutiwqz1";
  const UPLOAD_PRESET = "albimostore";

  // Perbaikan 1: Validasi dan pengamanan objek file
  // Jika parameter yang dikirim adalah objek FileList (hasil dari input.files), ambil indeks pertamanya [0]
  let fileYangDiunggah = file;
  if (file && file instanceof FileList) {
    fileYangDiunggah = file[0];
  }

  // Jika setelah diperiksa ternyata tidak ada file valid yang bisa diproses
  if (!fileYangDiunggah) {
    throw new Error("Tidak ada file gambar valid yang dipilih untuk diunggah.");
  }

  const formData = new FormData();
  formData.append("file", fileYangDiunggah); // Memastikan file tunggal yang dikirim
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    // Memeriksa apakah server Cloudinary merespons dengan status sukses (200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Gagal mengunggah ke Cloudinary.");
    }

    const data = await response.json();

    // Perbaikan 2: Validasi apakah secure_url berhasil didapatkan dari respon server
    if (!data.secure_url) {
      throw new Error("Cloudinary tidak mengembalikan URL gambar yang valid.");
    }

    return data.secure_url;

  } catch (error) {
    console.error("Sistem Error pada Cloudinary Upload:", error);
    throw error; // Melempar eror agar bisa ditangkap oleh try-catch di admin.js / payment.js
  }
}
