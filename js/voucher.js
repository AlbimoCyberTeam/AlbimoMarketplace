/**
 * Fungsi untuk menghitung dan menerapkan diskon voucher belanja
 * @param {string} kode - Kode kupon yang diketik oleh pembeli
 * @param {number|string} total - Total harga belanja sebelum diskon
 * @returns {object} - Mengembalikan objek status keberhasilan dan total harga baru
 */
export function applyVoucher(kode, total) {
  // Perbaikan 1: Validasi awal jika input kode kosong atau tidak valid
  if (!kode || total === undefined) {
    return { success: false, message: "Kode voucher atau total harga tidak valid." };
  }

  // Perbaikan 2: Memaksa kode kupon menjadi huruf kapital penuh dan menghapus spasi liar
  // Ini mencegah voucher gagal hanya karena pembeli tidak sengaja mengetik huruf kecil
  const kodeBersih = kode.trim().toUpperCase();

  // Perbaikan 3: Memastikan parameter total dikonversi menjadi Tipe Data Angka (Number) yang aman
  const totalNumerik = Number(total);

  // Daftar kode voucher yang tersedia beserta persentase diskonnya
  const vouchers = {
    HEMAT10: 10, // Diskon 10%
    PROMO20: 20  // Diskon 20%
  };

  // Memeriksa apakah kode kupon yang diketik terdaftar di dalam daftar voucher
  if (vouchers[kodeBersih]) {
    const persentaseDiskon = vouchers[kodeBersih];
    
    // Kalkulasi nilai potongan harga
    const diskon = (totalNumerik * persentaseDiskon) / 100;
    const totalHargaBaru = totalNumerik - diskon;

    return {
      success: true,
      persentase: persentaseDiskon,
      potongan: diskon,
      totalBaru: totalHargaBaru < 0 ? 0 : totalHargaBaru // Mencegah total harga minus
    };
  }

  // Mengembalikan status gagal jika kode kupon tidak terdaftar atau kedaluwarsa
  return {
    success: false,
    message: "Kode voucher tidak valid atau sudah kedaluwarsa."
  };
}
