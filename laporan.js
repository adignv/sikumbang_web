// laporan.js
// JavaScript untuk halaman laporan (laporan.html)

document.addEventListener('DOMContentLoaded', function() {
    const reportsList = document.getElementById('reports-list');
    const noReportsMessage = document.getElementById('no-reports-message');
    const clearReportsBtn = document.getElementById('clear-reports-btn');

    function loadReports() {
        const reports = JSON.parse(localStorage.getItem('kpspReports') || '[]');

        reportsList.innerHTML = ''; // Bersihkan daftar yang ada

        if (reports.length === 0) {
            noReportsMessage.classList.remove('hidden'); // Tampilkan pesan jika tidak ada laporan
            if (clearReportsBtn) {
                clearReportsBtn.classList.add('hidden'); // Sembunyikan tombol hapus jika tidak ada laporan
            }
        } else {
            noReportsMessage.classList.add('hidden'); // Sembunyikan pesan jika ada laporan
            if (clearReportsBtn) {
                clearReportsBtn.classList.remove('hidden'); // Tampilkan tombol hapus
            }
            
            // Urutkan laporan dari yang terbaru ke terlama
            reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            reports.forEach(report => {
                const reportItem = document.createElement('div');
                reportItem.classList.add('report-item');

                // Format tanggal agar lebih mudah dibaca
                const testDate = new Date(report.timestamp).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                reportItem.innerHTML = `
                    <h3>Skrining pada ${testDate}</h3>
                    <p><strong>Nama Anak:</strong> ${report.childName}</p>
                    <p><strong>Usia saat tes:</strong> ${report.ageTested}</p>
                    <p><strong>Skor KPSP:</strong> ${report.score}/10</p>
                    <p><strong>Status:</strong> <span style="font-weight: bold; color: ${getReportStatusColor(report.status)};">${report.status}</span></p>
                    <hr>
                    <p><strong>Interpretasi:</strong> ${report.interpretation}</p>
                    <p><strong>Saran:</strong> ${report.suggestion}</p>
                `;
                reportsList.appendChild(reportItem);
            });
        }
    }

    // --- Fungsi Penentu Warna Status Laporan ---
    // Fungsi ini telah disesuaikan untuk menerima status tanpa '(S)', '(M)', '(P)'
    function getReportStatusColor(status) {
        switch (status) {
            case 'Sesuai': // Akan cocok jika status di localStorage adalah 'Sesuai'
                return '#28a745'; // Hijau
            case 'Meragukan': // Akan cocok jika status di localStorage adalah 'Meragukan'
                return '#ffc107'; // Kuning (biasanya ini warna untuk peringatan/meragukan)
            case 'Dicurigai Penyimpangan': // Akan cocok jika status di localStorage adalah 'Dicurigai Penyimpangan'
                return '#dc3545'; // Merah (biasanya ini warna untuk bahaya/penyimpangan)
            default:
                return '#333'; // Default abu-abu gelap
        }
    }

    // Event listener untuk tombol hapus laporan
    if (clearReportsBtn) { // Pastikan tombol ada sebelum menambahkan event listener
        clearReportsBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua laporan skrining? Tindakan ini tidak dapat dibatalkan.')) {
                localStorage.removeItem('kpspReports'); // Hapus semua laporan
                loadReports(); // Muat ulang daftar laporan (akan kosong)
            }
        });
    }

    // Muat laporan saat halaman pertama kali dimuat
    loadReports();
});