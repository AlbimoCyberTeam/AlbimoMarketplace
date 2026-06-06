/**
 * Fungsi untuk memicu kemunculan notifikasi sistem di perangkat pengguna
 * @param {string} msg - Isi pesan teks yang akan ditampilkan di dalam notifikasi
 */
export async function showNotification(msg) {
  // Validasi awal: Memeriksa apakah browser pengguna mendukung Web Notifications API
  if (!("Notification" in window)) {
    console.warn("Browser ini tidak mendukung fitur notifikasi sistem.");
    return;
  }

  // Kondisi 1: Jika hak akses izin notifikasi sudah disetujui sebelumnya oleh pengguna
  if (Notification.permission === "granted") {
    new Notification("Marketplace Store", {
      body: msg,
      icon: "assets/icon.png" // Opsional: Anda bisa menyelipkan logo toko online Anda di sini
    });
  } 
  // Kondisi 2: Jika hak akses belum pernah ditentukan (belum disetujui maupun ditolak)
  else if (Notification.permission !== "denied") {
    // Memunculkan kotak dialog pop-up resmi browser untuk meminta izin akses ke pengguna
    const permission = await Notification.requestPermission();
    
    // Jika pengguna menekan tombol 'Izinkan' (Allow)
    if (permission === "granted") {
      new Notification("Marketplace Store", {
        body: msg,
        icon: "assets/icon.png"
      });
    }
  }
}
