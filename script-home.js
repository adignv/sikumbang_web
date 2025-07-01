// script-home.js
// JavaScript untuk halaman utama (index.html)

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan welcome screen terlihat saat halaman dimuat
    // Tidak ada lagi logika show/hide div karena setiap menu akan mengarah ke halaman HTML terpisah.
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.remove('hidden');
    }
});