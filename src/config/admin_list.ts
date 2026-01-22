// DAFTAR EMAIL ADMIN
// Masukkan email yang diizinkan mengakses Admin Panel di sini
export const ALLOWED_ADMINS = [
    "imammalikidokter@medprep.com", // Ganti dengan email login Dokter yang asli
    "imammaliki@unimus.ac.id",
    "admin@medprep.id",
    "asisten1@gmail.com",
    "editor_soal@gmail.com",
    // Tambahkan sampai 5 atau lebih
  ];
  
  export const isAdmin = (email: string | null | undefined) => {
    return email ? ALLOWED_ADMINS.includes(email) : false;
  };