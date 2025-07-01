// script-mulai.js
// JavaScript untuk halaman mulai.html (form identitas balita)

const balitaForm = document.getElementById('balita-form');
const inputNamaAnak = document.getElementById('nama-anak');
const inputNamaAyah = document.getElementById('nama-ayah');
const inputNamaIbu = document.getElementById('nama-ibu');
const inputAlamat = document.getElementById('alamat');
const inputTglPemeriksaan = document.getElementById('tgl-pemeriksaan');
const inputTglLahir = document.getElementById('tgl-lahir');
const checkboxKeluhan = document.getElementById('keluhan-perkembangan');

balitaForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah reload halaman

    const balitaData = {
        namaAnak: inputNamaAnak.value,
        namaAyah: inputNamaAyah.value,
        namaIbu: inputNamaIbu.value,
        alamat: inputAlamat.value,
        tglPemeriksaan: inputTglPemeriksaan.value,
        tglLahir: inputTglLahir.value,
        keluhanPerkembangan: checkboxKeluhan.checked
    };

    // Simpan data balita ke localStorage agar bisa diakses di kuis.html
    localStorage.setItem('currentBalitaData', JSON.stringify(balitaData));

    // Arahkan pengguna ke halaman kuis
    window.location.href = 'kuis.html';
});

// Inisialisasi: Set tanggal pemeriksaan default ke hari ini
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    inputTglPemeriksaan.value = `${yyyy}-${mm}-${dd}`;
});