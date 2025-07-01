// mulai.js
// JavaScript untuk halaman identitas balita (mulai.html)

document.addEventListener('DOMContentLoaded', () => {
    const balitaForm = document.getElementById('balita-form');
    const namaAnakInput = document.getElementById('nama-anak');
    const namaAyahInput = document.getElementById('nama-ayah');
    const namaIbuInput = document.getElementById('nama-ibu');
    const tanggalLahirInput = document.getElementById('tanggal-lahir');
    const tanggalPemeriksaanInput = document.getElementById('tanggal-pemeriksaan'); // NEW
    const genderLakiCheckbox = document.getElementById('gender-laki');
    const genderPerempuanCheckbox = document.getElementById('gender-perempuan');

    // Mengatur tanggal pemeriksaan default ke hari ini
    tanggalPemeriksaanInput.valueAsDate = new Date();


    // Fungsi untuk menghitung usia dalam bulan pada TANGGAL PEMERIKSAAN
    function calculateAgeInMonths(birthDate, testDate) { // MODIFIED: Tambah parameter testDate
        const birth = new Date(birthDate);
        const test = new Date(testDate); // Gunakan tanggal pemeriksaan

        let years = test.getFullYear() - birth.getFullYear();
        let months = test.getMonth() - birth.getMonth();

        // Adjust months if birth day is after test day
        if (test.getDate() < birth.getDate()) {
            months--;
        }

        let totalMonths = years * 12 + months;

        // KPSP berlaku untuk usia 0-72 bulan
        if (totalMonths < 0) {
            return -1; // Tanggal lahir di masa depan atau setelah tanggal pemeriksaan
        } else if (totalMonths > 72) {
            return 73; // Lebih dari 72 bulan
        }
        return totalMonths;
    }

    balitaForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah form submit secara default

        const namaAnak = namaAnakInput.value.trim();
        const namaAyah = namaAyahInput.value.trim();
        const namaIbu = namaIbuInput.value.trim();
        const tanggalLahir = tanggalLahirInput.value;
        const tanggalPemeriksaan = tanggalPemeriksaanInput.value; // NEW
        const jenisKelamin = genderLakiCheckbox.checked ? 'Laki-laki' : (genderPerempuanCheckbox.checked ? 'Perempuan' : '');

        if (!namaAnak || !namaAyah || !namaIbu || !tanggalLahir || !tanggalPemeriksaan || !jenisKelamin) { // MODIFIED
            alert('Mohon lengkapi semua data identitas balita, termasuk tanggal pemeriksaan.'); // MODIFIED
            return;
        }

        // Validasi tanggal: Tanggal pemeriksaan tidak boleh sebelum tanggal lahir
        if (new Date(tanggalPemeriksaan) < new Date(tanggalLahir)) {
            alert('Tanggal pemeriksaan tidak boleh sebelum tanggal lahir anak.');
            return;
        }


        const ageInMonths = calculateAgeInMonths(tanggalLahir, tanggalPemeriksaan); // MODIFIED: Kirim tanggal pemeriksaan

        if (ageInMonths === -1) {
            alert('Usia anak tidak valid (tanggal lahir di masa depan atau setelah tanggal pemeriksaan).'); // MODIFIED
            return;
        } else if (ageInMonths > 72) {
            alert('Kuesioner KPSP ini hanya untuk anak usia 0-72 bulan.');
            return;
        }

        const balitaData = {
            namaAnak,
            namaAyah,
            namaIbu,
            tanggalLahir,
            tanggalPemeriksaan, // NEW: Tambahkan tanggal pemeriksaan
            jenisKelamin,
            ageInMonths // Usia dalam bulan saat pemeriksaan
        };

        // Simpan data balita ke sessionStorage agar bisa diakses di kuis.js
        sessionStorage.setItem('currentBalita', JSON.stringify(balitaData));

        // Redirect ke halaman kuesioner
        window.location.href = 'kuis.html';
    });
});