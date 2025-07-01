// kuis.js
// JavaScript untuk halaman kuesioner (kuis.html)

document.addEventListener('DOMContentLoaded', () => {
    // --- Referensi Elemen HTML ---
    const questionArea = document.getElementById('question-area');
    const questionTextElement = document.getElementById('question-text');
    // Pastikan ini adalah ID dari elemen div/container yang membungkus gambar
    const questionImageContainer = document.getElementById('question-image-container');
    // Pastikan ini adalah ID dari elemen img itu sendiri di dalam container
    const questionImageElement = document.getElementById('question-image');

    const btnTidak = document.getElementById('btn-tidak');
    const btnYa = document.getElementById('btn-ya');
    const questionCounterElement = document.getElementById('question-counter');
    const childInfoElement = document.getElementById('child-info');

    const resultArea = document.getElementById('result-area');
    const resultInterpretationElement = document.getElementById('result-interpretation');
    const resultSuggestionElement = document.getElementById('result-suggestion');
    const btnRestart = document.getElementById('btn-restart');
    const backToHomeFromResultBtn = document.getElementById('back-to-home-from-result');

    // Referensi tombol kembali (panah) di header kuis
    const backToIdentitasBtnHeader = document.getElementById('back-to-identitas');

    // --- Variabel State Aplikasi ---
    let balitaData = null; // Data balita dari sessionStorage
    let questionsData = null; // Data pertanyaan KPSP untuk kelompok usia tertentu
    let currentQuestionIndex = 0; // Indeks pertanyaan yang sedang ditampilkan
    let score = 0; // Skor jawaban 'YA'
    let ageGroupString = ''; // String kelompok usia (misal "6 bulan", "9 bulan")
    let answersHistory = []; // Untuk melacak jawaban (YA/TIDAK) untuk fitur "kembali"

    // --- Data Pertanyaan KPSP Lengkap ---
    // Struktur ini HARUS SAMA PERSIS dengan struktur data KPSP yang Anda miliki.
    // Pastikan 'imagePath' hanya ada untuk pertanyaan yang memang ada gambarnya.
    // Path gambar diasumsikan relatif dari kuis.html, jadi jika gambar ada di folder 'img', gunakan 'img/nama_gambar.jpg'
    const KPSP_DATA = {
        // --- AWAL DARI 6 BULAN SESUAI PERMINTAAN ---
        "6 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Pada waktu bayi telentang, apakah ia dapat mengikuti gerakan anda dengan menggerakkan kepala sepenuhnya dari satu sisi ke sisi yang lain?", imagePath: '6.1.jpg' },
                    { text: "2. Dapatkah bayi mempertahankan posisi kepala dalam keadaan tegak dan stabil? Jawab TIDAK bila kepala bayi cenderung jatuh ke kanan/kiri atau ke dadanya.", imagePath: null },
                    { text: "3. Sentuhkan pensil di punggung tangan atau ujung jari bayi (jangan meletakkan di atas telapak tangan bayi). Apakah bayi dapat menggenggam pensil itu selama beberapa detik?", imagePath: '6.3.jpg' },
                    { text: "4. Ketika bayi telungkup di alas datar, apakah ia dapat mengangkat dada dengan kedua lengannya sebagai penyangga seperti pada gambar?", imagePath: '6.4.jpg' },
                    { text: "5. Pernahkah bayi mengeluarkan suara gembira bernada tinggi atau memekik tetapi bukan menangis?", imagePath: null },
                    { text: "6. Pernahkah bayi berbalik paling sedikit dua kali, dari telentang ke telungkup atau sebaliknya?", imagePath: null },
                    { text: "7. Pernahkah Anda melihat bayi tersenyum ketika melihat mainan yang lucu, gambar atau binatang peliharaan pada saat ia bermain sendiri?", imagePath: null },
                    { text: "8. Dapatkah bayi mengarahkan matanya pada benda kecil sebesar kacang, kismis atau uang logam? Jawab TIDAK jika ia tidak dapat mengarahkan matanya.", imagePath: null },
                    { text: "9. Dapatkah bayi meraih mainan yang diletakkan agak jauh namun masih berada dalam jangkauan tangannya?", imagePath: null },
                    { text: "10. Pada posisi bayi telentang, pegang kedua tangannya lalu tarik perlahan-lahan ke posisi duduk. Dapatkah bayi mempertahankan lehernya secara kaku seperti gambar di sebelah kiri? Jawab TIDAK bila kepala bayi jatuh kembali seperti gambar sebelah kanan.", imagePath: '6.10.jpg' }
                ]
            }
        },
       "9 bulan": { // Asumsi ini adalah data untuk 9 bulan
        questionsListForAgeSpecificMonth: {
            questionsContentsListKpspModelList: [
                // Contoh: Pertanyaan dari image_c9e0e3.jpg
                { text: "1. Pada posisi bayi telentang, pegang kedua tangannya lalu tarik perlahan-lahan ke posisi duduk. Dapatkah bayi mempertahankan lehernya secara kaku seperti gambar di sebelah kiri? Jawab TIDAK bila kepala bayi jatuh kembali seperti gambar sebelah kanan.", imagePath: '9.1.jpg' }, // Contoh, sesuaikan nama file
                { text: "2. Pernahkah anda melihat bayi memindahkan mainan atau kue kering dari satu tangan ke tangan yang lain? Benda-benda panjang seperti sendok atau kerincingan bertangkai tidak ikut dinilai.", imagePath: null },
                { text: "3. Tarik perhatian bayi dengan memperlihatkan selendang, sapu tangan atau serbet, kemudian jatuhkan ke lantai. Apakah bayi mencoba mencarinya? Misalnya mencari di bawah meja atau di belakang kursi?", imagePath: null },
                { text: "4. Apakah bayi dapat memungut dua benda seperti mainan/kue kering, dan masing-masing tangan memegang satu benda pada saat yang sama? Jawab TIDAK bila bayi tidak pernah melakukan perbuatan ini.", imagePath: null },
                { text: "5. Jika anda mengangkat bayi melalui ketiaknya ke posisi berdiri, dapatkah ia menyangga sebagian berat badan dengan kedua kakinya? Jawab YA bila ia mencoba berdiri dan sebagian berat badan tertumpu pada kedua kakinya.", imagePath: null },
                { text: "6. Dapatkah bayi memungut dengan tangannya benda-benda kecil seperti kismis, kacang-kacangan, potongan biskuit, dengan gerakan meraup atau menggerapai seperti gambar?", imagePath: '9.6.jpg' }, // Contoh, sesuaikan nama file
                { text: "7. Tanpa disangga oleh bantal, kursi atau dinding, dapatkah bayi duduk sendiri selama 60 detik?", imagePath: '9.7.jpg' }, // Contoh, sesuaikan nama file
                { text: "8. Apakah bayi dapat makan kue kering sendiri?", imagePath: null },
                { text: "9. Pada waktu bayi bermain sendiri dan ia diam-diam datang berdiri di belakangnya, apakah ia menengok ke belakang seperti mendengar kedatangan anda? Suara keras tidak ikut dihitung. Jawab YA hanya jika anda melihat reaksinya terhadap suara yang perlahan atau bisikan.", imagePath: null },
                { text: "10. Letakkan suatu mainan yang diinginkannya di luar jangkauan bayi, apakah ia mencoba mendapatkannya dengan mengulurkan lengan atau badannya?", imagePath: null }
                ]
            }
        },
      "12 bulan": {
        questionsListForAgeSpecificMonth: {
            questionsContentsListKpspModelList: [
                { text: "1. Jika anda bersembunyi di belakang sesuatu/di pojok, kemudian muncul dan menghilang secara berulang-ulang di hadapan anak, apakah ia mencari anda atau mengharapkan anda muncul kembali?", imagePath: null },
                { text: "2. Letakkan pensil di telapak tangan bayi. Coba ambil pensil tersebut dengan perlahan-lahan. Sulitkah anda mendapatkan pensil itu kembali?", imagePath: null },
                { text: "3. Apakah anak dapat berdiri sendiri 30 detik atau lebih dengan berpegangan pada kursi/meja?", imagePath: null },
                { text: "4. Apakah anak dapat mengatakan 2 suku kata yang sama, misalnya: \"ma-ma\", \"da-da\" atau \"pa-pa\". Jawab YA bila ia mengeluarkan salah satu suara tadi.", imagePath: null },
                { text: "5. Apakah anak dapat mengangkat badannya ke posisi berdiri tanpa bantuan anda?", imagePath: null },
                { text: "6. Apakah anak dapat membedakan anda dengan orang yang belum ia kenal? Ia akan menunjukkan sikap malu-malu atau ragu-ragu pada saat permulaan bertemu dengan orang yang belum dikenalnya.", imagePath: null },
                { text: "7. Apakah anak dapat mengambil benda kecil seperti kacang atau kismis, dengan meremas di antara ibu jari dan jarinya seperti pada gambar?", imagePath: '12.7.jpg' }, // Asumsi nama file adalah 12.7.jpg
                { text: "8. Apakah anak dapat duduk sendiri tanpa bantuan?", imagePath: null },
                { text: "9. Sebut 2-3 kata yang dapat ditiru oleh anak (tidak perlu kata-kata yang lengkap). Apakah ia mencoba meniru menyebutkan kata-kata tadi?", imagePath: null },
                { text: "10.Tanpa bantuan, apakah anak dapat mempertemukan dua kubus kecil yang ia pegang? Kerincingan bertangkai dan tutup panci tidak ikut dinilai", imagePath: null }
            ]
        }
    },
     "15 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Tanpa bantuan, apakah anak dapat mempertemukan dua kubus kecil yang ia pegang? Kerincingan bertangkai dan tutup panci tidak ikut dinilai.", imagePath: null },
                    { text: "2. Apakah anak dapat jalan sendiri atau jalan dengan berpegangan?", imagePath: null },
                    { text: "3. Tanpa bantuan, apakah anak dapat bertepuk tangan atau melambai-lambai? Jawab TIDAK bila ia membutuhkan bantuan.", imagePath: null },
                    { text: "4. Apakah anak dapat mengatakan \"papa\" ketika ia memanggil/melihat ayahnya, atau mengatakan \"mama\" jika memanggil/melihat ibunya? Jawab YA bila anak mengatakan salah satu diantaranya.", imagePath: null },
                    { text: "5. Dapatkah anak berdiri sendiri tanpa berpegangan selama kira-kira 5 detik?", imagePath: null },
                    { text: "6. Dapatkah anak berdiri sendiri tanpa berpegangan selama 30 detik atau lebih?", imagePath: null },
                    { text: "7. Tanpa berpegangan atau menyentuh lantai, apakah anak dapat membungkuk untuk memungut mainan di lantai dan kemudian berdiri kembali?", imagePath: null },
                    { text: "8. Apakah anak dapat menunjukkan apa yang diinginkannya tanpa menangis atau merengek? Jawab YA bila ia menunjuk, menarik atau mengeluarkan suara yang menyenangkan.", imagePath: null },
                    { text: "9. Apakah anak dapat berjalan di sepanjang ruangan tanpa jatuh atau terhuyung-huyung?", imagePath: null },
                    { text: "10. Apakah anak dapat mengambil benda kecil seperti kacang, kismis, atau potongan biskuit dengan menggunakan ibu jari dan jari telunjuk seperti pada gambar?", imagePath: '15.10.jpg' } // Dari image_c8f884.png
                ]
            }
        },
        "18 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Tanpa bantuan, apakah anak dapat bertepuk tangan atau melambai-lambai? Jawab TIDAK bila ia membutuhkan bantuan.", imagePath: null },
                    { text: "2. Apakah anak dapat mengatakan “papa” ketika ia memanggil/melihat ayahnya, atau mengatakan “mama” jika memanggil/melihat ibunya? Jawab YA bila anak mengatakan salah satu diantaranya.", imagePath: null },
                    { text: "3. Apakah anak dapat berdiri sendiri tanpa berpegangan selama kira-kira 5 detik?", imagePath: null },
                    { text: "4. Apakah anak dapat berdiri sendiri tanpa berpegangan selama 30 detik atau lebih?", imagePath: null },
                    { text: "5. Tanpa berpegangan atau menyentuh lantai, apakah anak dapat membungkuk untuk memungut mainan di lantai dan kemudian berdiri kembali?", imagePath: null },
                    { text: "6. Apakah anak dapat menunjukkan apa yang diinginkannya tanpa menangis atau merengek? Jawab YA bila ia menunjuk, menarik atau mengeluarkan suara yang menyenangkan.", imagePath: null },
                    { text: "7. Apakah anak dapat berjalan di sepanjang ruangan tanpa jatuh atau terhuyung-huyung?", imagePath: null },
                    { text: "8. Apakah anak anak dapat mengambil benda kecil seperti kacang, kismis, atau potongan biskuit dengan meng-gunakan ibu jari dan jari telunjuk seperti pada gambar ?", imagePath: '18.8.jpg' }, // Dari image_c8f84a.png
                    { text: "9. Jika anda menggelindingkan bola ke anak, apakah ia menggelindingkan/melemparkan kembali bola pada anda?", imagePath: null },
                    { text: "10. Apakah anak dapat memegang sendiri cangkir/gelas dan minum dari tempat tersebut tanpa tumpah?", imagePath: null }
                ]
            }
        },
        "21 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Tanpa berpegangan atau menyentuh lantai, apakah anak dapat membungkuk untuk memungut mainan di lantai dan kemudian berdiri kembali?", imagePath: null },
                    { text: "2. Apakah anak dapat menunjukkan apa yang diinginkannya tanpa menangis atau merengek? Jawab YA bila ia menunjuk, menarik atau mengeluarkan suara yang menyenangkan.", imagePath: null },
                    { text: "3. Apakah anak dapat berjalan di sepanjang ruangan tanpa jatuh atau terhuyung-huyung?", imagePath: null },
                    { text: "4. Apakah anak dapat mengambil benda kecil seperti kacang, kismis, atau potongan biskuit dengan meng-gunakan ibu jari dan jari telunjuk seperti pada gambar?", imagePath: '21.4.jpg' }, // Dari image_c8f825.png
                    { text: "5. Jika anda menggelindingkan bola ke anak, apakah ia menggelindingkan/melemparkan kembali bola pada anda?", imagePath: null },
                    { text: "6. Apakah anak dapat memegang sendiri cangkir/gelas dan minum dari tempat tersebut tanpa tumpah?", imagePath: null },
                    { text: "7. Jika anda sedang melakukan pekerjaan rumah tangga, apakah anak meniru apa yang anda lakukan?", imagePath: null },
                    { text: "8. Apakah anak dapat meletakkan satu kubus di atas kubus yang lain tanpa menjatuhkan kubus itu? Kubus yang digunakan ukuran 2.5-5.0 Cm.", imagePath: null },
                    { text: "9. Apakah anak dapat mengucapkan paling sedikit 3 kata yang mempunyai arti selain. \"papa\" dan \"mama\"?", imagePath: null },
                    { text: "10. Apakah anak dapat berjalan mundur 5 langkah atau lebih tanpa kehilangan keseimbangan? (Anda mungkin dapat melihatnya ketika anak menarik mainannya).", imagePath: null }
                ]
            }
        },
        "24 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Jika anda sedang melakukan pekerjaan rumah tangga, apakah anak meniru apa yang anda lakukan?", imagePath: null },
                    { text: "2. Apakah anak dapat meletakkan 1 buah kubus di atas kubus yang lain tanpa menjatuhkan kubus itu? Kubus yang digunakan ukuran 2.5 – 5 cm.", imagePath: null },
                    { text: "3. Apakah anak dapat mengucapkan paling sedikit 3 kata yang mempunyai arti selain \"papa\" dan \"mama\"?", imagePath: null },
                    { text: "4. Apakah anak dapat berjalan mundur 5 langkah atau lebih tanpa kehilangan keseimbangan? (Anda mungkin dapat melihatnya ketika anak menarik mainannya).", imagePath: null },
                    { text: "5. Dapatkah anak melepas pakaiannya seperti: baju, rok, atau celananya? (topi dan kaos kaki tidak ikut dinilai).", imagePath: null },
                    { text: "6. Dapatkah anak berjalan naik tangga sendiri? Jawab YA jika ia naik tangga dengan posisi tegak atau berpegangan pada dinding atau pegangan tangga. Jawab TIDAK jika ia naik tangga dengan merangkak atau anda tidak membolehkan anak naik tangga atau anak harus berpegangan pada seseorang.", imagePath: null },
                    { text: "7. Tanpa bimbingan, petunjuk atau bantuan anda, dapatkah anak menunjuk dengan benar paling sedikit satu bagian badannya (rambut, mata, hidung, mulut, atau bagian badan yang lain)?", imagePath: null },
                    { text: "8. Dapatkah anak makan nasi sendiri sendiri tanpa banyak tumpah?", imagePath: null },
                    { text: "9. Dapatkah anak membantu memungut mainannya sendiri atau membantu mengangkat piring jika diminta?", imagePath: null },
                    { text: "10. Dapatkah anak menendang bola kecil (sebesar bola tenis) ke depan tanpa berpegangan pada apapun? Mendorong tidak ikut dinilai.", imagePath: null }
                ]
            }
        },
        "30 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Dapatkah anak melepas pakaiannya seperti: baju, rok, atau celananya? (topi dan kaos kaki tidak ikut dinilai).", imagePath: null },
                    { text: "2. Dapatkah anak berjalan naik tangga sendiri? Jawab YA jika ia naik tangga dengan posisi tegak atau berpegangan pada dinding atau pegangan tangga. Jawab TIDAK jika ia naik tangga dengan merangkak atau atau anda tidak membolehkan anak naik tangga atau anak harus berpegangan pada seseorang.", imagePath: null },
                    { text: "3. Tanpa bimbingan, petunjuk atau bantuan anda, dapatkan anak menunjuk dengan benar paling sedikit satu bagian badannya (rambut, mata, hidung, mulut, atau bagian badan yang lain)?", imagePath: null },
                    { text: "4. Dapatkah anak makan nasi sendiri sendiri tanpa banyak tumpah?", imagePath: null },
                    { text: "5. Dapatkah anak membantu memungut mainannya sendiri atau membantu mengangkat piring jika diminta?", imagePath: null },
                    { text: "6. Dapatkah anak menendang bola kecil (sebesar bola tenis) ke depan tanpa berpegangan pada apapun? Mendorong tidak ikut dinilai.", imagePath: null },
                    { text: "7. Bila diberi pensil, apakah anak mencoret-coret kertas tanpa bantuan/petunjuk?", imagePath: null },
                    { text: "8. Dapatkah anak meletakkan 4 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu? Kubus yang digunakan ukuran 2.5 - 5 cm.", imagePath: null },
                    { text: "9. Dapatkah anak menggunakan 2 kata pada saat berbicara seperti \"minta minum\", \"mau tidur\"? \"Terimakasih\" dan \"Dadag\" tidak ikut dinilai.", imagePath: null },
                    { text: "10. Apakah anak dapat menyebut 2 diantara gambar-gambar ini tanpa bantuan? (Menyebut dengan suara binatang tidak ikut dinilai).", imagePath: '30.10.jpg' } // Dari image_c8f4c6.png
                ]
            }
        },
        "36 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Bila diberi pensil, apakah anak mencoret-coret kertas tanpa bantuan/petunjuk?", imagePath: null },
                    { text: "2. Dapatkah anak meletakkan 4 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu? Kubus yang digunakan ukuran 2.5 - 5 cm.", imagePath: null },
                    { text: "3. Dapatkah anak menggunakan 2 kata pada saat berbicara seperti \"minta minum\", \"mau tidur\"? \"Terimakasih\" dan \"Dadag\" tidak ikut dinilai.", imagePath: null },
                    { text: "4. Apakah anak dapat menyebut 2 diantara gambar-gambar ini tanpa bantuan?", imagePath: '36.4.jpg' }, // Dari image_c8f482.png
                    { text: "5. Dapatkah anak melempar bola lurus ke arah perut atau dada anda dari jarak 1,5 meter?", imagePath: null },
                    { text: "6. Ikuti perintah ini dengan seksama. Jangan memberi isyarat dengan telunjuk atau mata pada saat memberikan perintah berikut ini: \"Letakkan kertas ini di lantai\". \"Letakkan kertas ini di kursi\". \"Berikan kertas ini kepada ibu\". Dapatkah anak melaksanakan ketiga perintah tadi?", imagePath: null },
                    { text: "7. Buat garis lurus ke bawah sepanjang sekurang-kurangnya 2.5 cm. Suruh anak menggambar garis lain di samping garis ini. Jawab YA bila ia menggambar garis seperti ini: 1/1/1 Jawab TIDAK bila ia menggambar garis seperti ini: 1/1/1", imagePath: '36.7.jpg' }, // Dari image_c8f482.png
                    { text: "8. Letakkan selembar kertas seukuran buku ini di lantai. Apakah anak dapat melompati bagian lebar kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", imagePath: null },
                    { text: "9. Dapatkah anak mengenakan sepatunya sendiri?", imagePath: null },
                    { text: "10. Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", imagePath: null }
                ]
            }
        },
        "42 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Dapatkah anak mengenakan sepatunya sendiri?", imagePath: null },
                    { text: "2. Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", imagePath: null },
                    { text: "3. Setelah makan, apakah anak mencuci dan mengeringkan tangannya dengan baik sehingga anda tidak perlu mengulanginya?", imagePath: null },
                    { text: "4. Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?", imagePath: null },
                    { text: "5. Letakkan selembar kertas seukuran buku ini di lantai. Apakah anak dapat melompati panjang kertas ini dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", imagePath: null },
                    { text: "6. Jangan membantu anak dan jangan menyebut lingkaran. Suruh anak menggambar seperti contoh ini di kertas kosong yang tersedia. Apakah anak dapat menggambar lingkaran?", imagePath: '42.6.jpg' }, // Dari image_c8e5ff.png
                    { text: "7. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus tersebut? Kubus yang digunakan ukuran 2.5 - 5 cm.", imagePath: null },
                    { text: "8. Apakah anak dapat bermain petak umpet, ular naga atau permainan lain dimana ia ikut bermain dan mengikuti aturan bermain?", imagePath: null },
                    { text: "9. Dapatkah anak mengenakan celana panjang, kemeja, baju atau kaos kaki tanpa di bantu? (Tidak termasuk memasang kancing, gesper atau ikat pinggang)", imagePath: null },
                    { text: "10. Dapatkah anak menyebutkan nama lengkapnya tanpa dibantu? Jawab TIDAK jika ia hanya menyebut sebagian namanya atau ucapannya sulit dimengerti.", imagePath: null }
                ]
            }
        },
        "48 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", imagePath: null },
                    { text: "2. Setelah makan, apakah anak mencuci dan mengeringkan tangannya dengan baik sehingga anda tidak perlu mengulanginya?", imagePath: null },
                    { text: "3. Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?", imagePath: null },
                    { text: "4. Letakkan selembar kertas seukuran buku ini di lantai. Apakah anak dapat melompati panjang kertas ini dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", imagePath: null },
                    { text: "5. Jangan membantu anak dan jangan menyebut lingkaran. Suruh anak menggambar seperti contoh ini di kertas kosong yang tersedia. Apakah anak dapat menggambar lingkaran?", imagePath: '48.5.jpg' }, // Dari image_c8e5dd.png
                    { text: "6. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus tersebut? Kubus yang digunakan ukuran 2.5 - 5 cm.", imagePath: null },
                    { text: "7. Apakah anak dapat bermain petak umpet, ular naga atau permainan lain dimana ia ikut bermain dan mengikuti aturan bermain?", imagePath: null },
                    { text: "8. Dapatkah anak mengenakan celana panjang, kemeja, baju atau kaos kaki tanpa di bantu? (Tidak termasuk memasang kancing, gesper atau ikat pinggang)", imagePath: null },
                    { text: "9. Dapatkah anak menyebutkan nama lengkapnya tanpa dibantu? Jawab TIDAK jika ia hanya menyebut sebagian namanya atau ucapannya sulit dimengerti.", imagePath: null },
                    { text: "10. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas yang lain tanpa menjatuhkan kubus tersebut? Kubus yang digunakan ukuran 2.5 - 5 cm", imagePath: null } // (Ini sepertinya duplikasi dari no.1, mungkin ada kesalahan di sumber Anda)
                ]
            }
        },
        "54 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas yang lain tanpa menjatuhkan kubus tersebut? Kubus yang digunakan ukuran 2.5 - 5 cm.", imagePath: null },
                    { text: "2. Apakah anak dapat bermain petak umpet, ular naga atau permainan lain dimana ia ikut bermain dan mengikuti aturan bermain?", imagePath: null },
                    { text: "3. Dapatkah anak mengenakan celana panjang, kemeja, baju atau kaos kaki tanpa di bantu? (Tidak termasuk memasang kancing, gesper atau ikat pinggang)", imagePath: null },
                    { text: "4. Dapatkah anak menyebutkan nama lengkapnya tanpa dibantu? Jawab TIDAK jika ia hanya menyebut sebagian namanya atau ucapannya sulit dimengerti.", imagePath: null },
                    { text: "5. Ini titik-titik di bawah ini dengan jawaban anak. Jangan membantu atau mengulangi pertanyaan. \"Apa yang kamu lakukan jika kamu kedinginan?\" \"Apa yang kamu lakukan jika kamu lapar?\" \"Apa yang kamu lakukan jika kamu lelah?\" Jawab YA jika anak menjawab ke 3 pertanyaan tadi dengan benar, bukan dengan gerakan atau isyarat. Jika kedinginan, jawaban yang benar adalah \"menggigil\", \"pakai mantel\" atau \"mencari selimut\". Jika lapar, jawaban yang benar adalah \"makan\". Jika lelah, jawaban yang benar adalah \"mengantuk\", \"tidur\", \"berbaring\" atau \"tidur-tiduran\", \"menguap\" atau \"bersenandung\". Apakah anak dapat mengungkapkan bajunya atau pakaian boneka?", imagePath: null },
                    { text: "6. Apakah anak dapat mengancingkan bajunya atau pakaian boneka?", imagePath: null },
                    { text: "7. Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 6 detik atau lebih?", imagePath: null },
                    { text: "8. Jangan mengoreksi/membantu anak. Jangan menyebut kata 'lebih panjang'. Perlihatkan gambar kedua garis ini pada anak. Tanyakan: \"Mana garis yang lebih panjang?\" Minta anak menunjuk garis yang lebih panjang. Setelah anak menunjuk, putar lembar ini dan ulangi pertanyaan tersebut. Setelah anak menunjuk, putar lembar ini lagi dan ulangi pertanyaan tadi. Apakah anak dapat menunjuk garis yang lebih panjang sebanyak 3 kali dengan benar?", imagePath: '54.8.jpg' }, //
                    { text: "9. Jangan membantu anak dan jangan memberitahu nama gambar ini, suruh anak menggambar seperti contoh ini di kertas kosong yang tersedia. Berikan 3 kali kesempatan. Apakah anak dapat menggambar seperti contoh ini?", imagePath: '54.9.jpg' }, //
                    { text: "10. Ikuti perintah ini dengan seksama. Jangan memberi isyarat dengan telunjuk atau mata pada saat memberikan perintah berikut ini: \"Letakkan kertas ini di atas lantai\". \"Letakkan kertas ini di bawah kursi\". \"Letakkan kertas ini di depan kamu\". \"Letakkan kertas ini di belakang kamu\". Jawab YA hanya jika anak mengerti arti \"di atas\", \"di bawah\", \"di depan\" dan \"di belakang\".", imagePath: null }
                 ]
            }
        },
        "60 bulan": { // Tambahan untuk 60 bulan
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    {text: "1. Isi titik-titik di bawah ini dengan jawaban anak. Jangan membantu kecuali mengulangi pertanyaan. \"Apa yang kamu lakukan jika kamu kedinginan?\" \"Apa yang kamu lakukan jika kamu lapar?\" \"Apa yang kamu lakukan jika kamu lelah?\" Jawab YA bila anak menjawab ke 3 pertanyaan tadi dengan benar, bukan dengan gerakan atau isyarat. Jika kedinginan, jawaban yang benar adalah \"menggigil\", \"pakai mantel\" atau \"masuk kedalam rumah\". Jika lapar, jawaban yang benar adalah \"makan\". Jika lelah, jawaban yang benar adalah \"mengantuk\", \"tidur\", \"berbaring/tidur-tiduran\", \"istirahat\" atau \"diam sejenak\".",
                        imagePath: null
                    },
                    {
                        text: "2. Apakah anak dapat mengancingkan bajunya atau pakaian boneka?",
                        imagePath: null
                    },
                    {
                        text: "3. Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 6 detik atau lebih?",
                        imagePath: null
                    },
                    {
                        text: "4. Jangan mengoreksi/membantu anak. Jangan menyebut kata \"lebih panjang\". Perlihatkan gambar kedua garis ini pada anak. Tanyakan: \"Mana garis yang lebih panjang?\" Minta anak menunjuk garis yang lebih panjang. Setelah anak menunjuk, putar lembar ini dan ulangi pertanyaan tersebut. Setelah anak menunjuk, putar lembar ini lagi dan ulangi pertanyaan tadi. Apakah anak dapat menunjuk garis yang lebih panjang sebanyak 3 kali dengan benar?",
                        imagePath: '60.4.jpg' //
                    },
                    {
                        text: "5. Jangan membantu anak dan jangan memberitahu nama gambar ini, suruh anak menggambar seperti contoh ini di kertas kosong yang tersedia. Berikan 3 kali kesempatan. Apakah anak dapat menggambar seperti contoh ini?",
                        imagePath: '60.5.jpg' //
                    },
                    {
                        text: "6. Ikuti perintah ini dengan seksama. Jangan memberi isyarat dengan telunjuk atau mata pada saat memberikan perintah berikut ini: \"Letakkan kertas ini di atas lantai\". \"Letakkan kertas ini di bawah kursi\". \"Letakkan kertas ini di depan kamu\". \"Letakkan kertas ini di belakang kamu\". Jawab YA hanya jika anak mengerti arti \"di atas\", \"di bawah\", \"di depan\" dan \"di belakang\".",
                        imagePath: null
                    },
                    {
                        text: "7. Apakah anak bereaksi dengan tenang dan tidak rewel (tanpa menangis atau menggelayut pada anda) pada saat anda meninggalkannya?",
                        imagePath: null
                    },
                    {
                        text: "8. Jangan menunjuk, membantu atau membetulkan, katakan pada anak: \"Tunjukkan segi empat merah\" \"Tunjukkan segi empat kuning\" \"Tunjukkan segi empat biru\" \"Tunjukkan segi empat hijau\". Dapatkah anak menunjuk keempat warna itu dengan benar?",
                        imagePath: '60.8.jpg' // Asumsi gambar untuk pertanyaan ini
                    },
                    {
                        text: "9. Suruh anak melompat dengan satu kaki beberapa kali tanpa berpegangan (lompatan dengan dua kaki tidak ikut dinilai). Apakah ia dapat melompat 2-3 kali dengan satu kaki?",
                        imagePath: null
                    },
                    {
                        text: "10. Dapatkah anak sepenuhnya berpakaian sendiri tanpa bantuan?",
                        imagePath: null
                    },
                ]
            }
        },
        "66 bulan": {
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    { text: "1. Jangan membantu anak dan jangan memberitahu nama gambar ini, suruh anak menggambar seperti contoh ini di kertas kosong yang tersedia. Berikan 3 kali kesempatan. Apakah anak dapat menggambar seperti contoh ini?", imagePath: '66.1.jpg' }, // Asumsi path gambar
                    { text: "2. Ikuti perintah ini dengan seksama. Jangan memberi isyarat dengan telunjuk atau mata pada saat memberikan perintah berikut ini: \"Letakkan kertas ini di lantai\". \"Letakkan kertas ini di kursi\". \"Letakkan kertas ini di depan kamu\". \"Letakkan kertas ini di belakang kamu\". Jawab YA, hanya jika anak mengerti arti \"di atas\", \"di bawah\", \"di depan\" dan \"di belakang\".", imagePath: null },
                    { text: "3. Apakah anak bereaksi dengan tenang dan tidak rewel (tanpa menangis atau menggelayut pada anda) pada saat anda meninggalkannya?", imagePath: null },
                    { text: "4. Jangan menunjuk, membantu atau membetulkan, katakan pada anak: \"Tunjukkan segi empat merah\" \"Tunjukkan segi empat kuning\" \"Tunjukkan segi empat biru\" \"Tunjukkan segi empat hijau\". Dapatkah anak menunjuk keempat warna itu dengan benar?", imagePath: '66.4.jpg' },
                    { text: "5. Suruh anak melompat dengan satu kaki beberapa kali tanpa berpegangan (lompatan dengan dua kaki tidak ikut dinilai). Apakah ia dapat melompat 2-3 kali dengan satu kaki?", imagePath: null },
                    { text: "6. Dapatkah anak sepenuhnya berpakaian sendiri tanpa bantuan?", imagePath: null },
                    { text: "7. Suruh anak menggambar di tempat kosong yang tersedia. Katakan padanya: \"Buatlah gambar orang\". Jangan memberi perintah lebih dari itu. Jangan bertanya/mengingatkan anak bila ada bagian yang belum tergambar. Dalam memberi nilai, hitunglah berapa bagian tubuh yang tergambar. Untuk bagian tubuh yang bergambar seperti mata, telinga, lengan dan kaki, setiap pasang dinilai satu bagian. Dapatkah anak menggambar sedikitnya 3 bagian tubuh?", imagePath: null },
                    { text: "8. Pada gambar orang yang dibuat pada nomor 7, dapatkah anak menggambar sedikitnya 6 bagian tubuh?", imagePath: null },
                    { text: "9. Tulis apa yang dikatakan anak pada kalimat-kalimat yang belum selesai ini, jangan membantu kecuali mengulang pertanyaan: \"Jika kuda besar maka kuda itu makan….\", \"Jika api panas maka es….\", \"Jika ibu seorang wanita maka ayah seorang….\". Apakah anak menjawab dengan benar (tikus kecil, es dingin, ayah seorang pria)?", imagePath: null },
                    { text: "10. Apakah anak dapat menangkap bola kecil sebesar bola tenis/bola kasti hanya dengan menggunakan kedua tangannya? (Bola besar tidak ikut dinilai).", imagePath: null }
                ]
            }
        },
        "70 bulan": { // Menggunakan 70 bulan sebagai kelompok usia untuk pertanyaan yang Anda berikan
            questionsListForAgeSpecificMonth: {
                questionsContentsListKpspModelList: [
                    {
                        text: "1. Jangan menunjuk, membantu, atau membetulkan katakan pada anak: “Tunjukan segiempat merah” “tunjukan segi empat kuning” “tunjukan segiempat biru” “tunjukan segiempat hijau”. Dapatkah anak menunjukan keempat warna dengan benar ?",
                        imagePath: '70.1.jpg'
                    },
                    {
                        text: "2. Suruh anak melompat dengan satu kaki beberapa kali tanpa berpegangan (melompat dengan 2 kaki tidak ikut dinilai). Apakah ia dapat melompat 2 sampai 3 kali dengan satu kaki ?",
                        imagePath: null
                    },
                    {
                        text: "3. Dapatkah anak sepenuhnya berpakaian sendiri tanpa bantuan ?",
                        imagePath: null
                    },
                    {
                        text: "4. Suruh anak menggambar ditempat yang tersedia. Katakan padanya “buatlah gambar orang”. Jangan memberi perintah lebih dari itu. Jangan bertanya/mengingatkan anak bila ada bagian yang belum tergambar. Dalam member nilai, hitunglah berapa bagian tubuh yang tergambar. Untuk bagian tubuh yang berpasangan seperti mata telinga lengan dan kaki setiap pasang dinilai 1 bagian. Dapatkah anak menggambar sedikitnya 3 bagian tubuh ?",
                        imagePath: null // Mungkin ada gambar contoh gambar orang, jika ada, sesuaikan pathnya
                    },
                    {
                        text: "5. Pada gambar orang yang dibuat pada no 4. Dapatkah anak menggambar sedikitnya 6 bagian tubuh ?",
                        imagePath: null
                    },
                    {
                        text: "6. Tulis apa yang dikatakan anak pada kalimat-kalimat yang belu selesai ini, jangan membantu kecuali mengulang pertanyaan : “Jika kuda besar, maka tikus……..”. “jika api panas maka es……..”. “jika ibu seorang wanita maka ayah seorang……”. Apakah anak menjawab dengan benar ( tikus kecil, es dingin, aya seorang pria) ?",
                        imagePath: null
                    },
                    {
                        text: "7. Apakah anak dapat menangkap bola kecil sebesar bola tenis/bola kasti hanya dengan menggunakan kedua tangannya ? (bola besar tidak ikut dinilai)",
                        imagePath: null
                    },
                    {
                        text: "8. Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 11 detik atau lebih ?",
                        imagePath: null
                    },
                    {
                        text: "9. Jangan membantu anak dan jangan memberitahu gambar ini, suruh anak menggambar seperti contoh ini di kertas kosong yang tersedia. Berikan 3 kali kesempatan. Apakah anak dapat menggambar seperti contoh ini ?",
                        imagePath: '70.9.jpg' // Asumsi ada gambar contoh untuk pertanyaan ini, jika ada, sesuaikan path
                    },
                    {
                        text: "10. Isi titik dibawah ini dengan jawaban anak. Jangan membantu keculai mengulang pertanyaan sampai 3 kali bila anak menanyakannya. “sendok dibuat dari apa?”…………….. “sepatu dibuat dari apa?”…………….. “pintu dibuat dari apa?”............. Apakah anak dapat menjawab 3 pertanyaan diatas dengan benar ? sendok dibuat dari besi, baja, plastic, kayu. Sepatu dibuat dari kulit, karet, kain, plastic, kayu. Pintu dibuat dari kayu, besi, kaca.",
                        imagePath: null
                    }
                ]
            }
        }
    };

    // --- Fungsi Inisialisasi Kuis ---
    function initializeKuis() {
        const storedBalita = sessionStorage.getItem('currentBalita');
        if (!storedBalita) {
            alert('Data balita tidak ditemukan. Mohon lengkapi identitas balita terlebih dahulu.');
            window.location.href = 'mulai.html';
            return;
        }
        balitaData = JSON.parse(storedBalita);

        const ageInMonths = calculateAgeInMonths(balitaData.tanggalLahir, balitaData.tanggalPemeriksaan);
        ageGroupString = getKpspAgeGroup(ageInMonths);

        if (!ageGroupString || !KPSP_DATA[ageGroupString]) {
            alert(`Tidak ada kuesioner SIKUMBANG yang sesuai untuk usia anak ini (${ageInMonths} bulan). Mohon periksa kembali data atau pastikan data kuesioner lengkap.`);
            sessionStorage.removeItem('currentBalita'); // Hapus data balita jika tidak ada kuesioner
            window.location.href = 'mulai.html';
            return;
        }

        questionsData = KPSP_DATA[ageGroupString];

        if (childInfoElement) {
            childInfoElement.textContent = `${balitaData.namaAnak} (${balitaData.jenisKelamin}, Usia: ${ageGroupString})`;
        }

        currentQuestionIndex = 0;
        score = 0;
        answersHistory = []; // Reset riwayat jawaban
        questionArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        showQuestion();
    }

    // --- Fungsi Bantuan: Hitung Usia dalam Bulan ---
    function calculateAgeInMonths(birthDate, testDate) {
        const birth = new Date(birthDate);
        const test = new Date(testDate);

        let years = test.getFullYear() - birth.getFullYear();
        let months = test.getMonth() - birth.getMonth();
        let days = test.getDate() - birth.getDate();

        // Koreksi bulan jika hari tes lebih awal dari hari lahir
        if (days < 0) {
            months--;
            // Hitung hari dalam bulan sebelumnya
            // Ini akan mengurus kasus di mana test.getDate() < birth.getDate()
            const prevMonthDate = new Date(test.getFullYear(), test.getMonth(), 0); // Hari terakhir bulan sebelumnya
            days = prevMonthDate.getDate() + days; // Tambahkan hari sisa dari bulan sebelumnya
        }

        let totalMonths = years * 12 + months;

        // Jika hari sisa >= 15, bulatkan ke atas ke bulan berikutnya
        // Ini adalah aturan umum di KPSP untuk penentuan kelompok usia
        if (days >= 15) {
            totalMonths++;
        }

        // KPSP berlaku untuk usia 0-72 bulan
        // Karena Anda ingin mulai dari 6 bulan, kita bisa tambahkan validasi di sini
        if (totalMonths < 6) {
            return 5; // Mengembalikan nilai di bawah 6 agar dideteksi sebagai tidak ada kuesioner
        } else if (totalMonths > 70) {
            // Jika lebih dari 72 bulan, akan menggunakan kuesioner 72 bulan (jika ada)
            // Jika Anda ingin batasan tegas hingga 70 bulan, Anda bisa mengembalikan nilai di atas 70
            return 72; // Mengembalikan 72 untuk menggunakan kuesioner 72 bulan jika tersedia
        }
        return totalMonths;
    }

    // --- Fungsi Bantuan: Dapatkan Kelompok Usia KPSP ---
    // Akan mengembalikan kelompok usia terdekat yang lebih rendah atau sama
    function getKpspAgeGroup(ageInMonths) {
        // Kelompok usia KPSP yang relevan untuk SIKUMBANG (mulai dari 6 bulan)
        // Jika Anda hanya ingin sampai 70 bulan dan tidak ada kelompok 70 bulan secara spesifik,
        // maka usia 67-70 bulan akan jatuh ke kelompok 66 bulan.
        const ageGroups = [6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 70];
        let selectedGroup = null;

        // Cari kelompok usia terdekat yang lebih rendah atau sama
        for (let i = ageGroups.length - 1; i >= 0; i--) {
            if (ageInMonths >= ageGroups[i]) {
                selectedGroup = ageGroups[i];
                break;
            }
        }
        return selectedGroup ? `${selectedGroup} bulan` : null;
    }

    // --- Fungsi Tampilkan Pertanyaan Saat Ini ---
    function showQuestion() {
        const questionList = questionsData.questionsListForAgeSpecificMonth.questionsContentsListKpspModelList;
        const question = questionList[currentQuestionIndex];
        questionTextElement.textContent = question.text;
        questionCounterElement.textContent = `Pertanyaan ${currentQuestionIndex + 1} dari ${questionList.length}`;

        // Kelola tampilan gambar
        if (question.imagePath && questionImageElement) {
            questionImageElement.src = question.imagePath;
            questionImageContainer.classList.remove('hidden'); // Tampilkan kontainer gambar
        } else {
            questionImageContainer.classList.add('hidden'); // Sembunyikan kontainer gambar jika tidak ada gambar
            questionImageElement.src = ''; // Bersihkan src
        }
    }

    // --- Fungsi Proses Jawaban 'Ya' atau 'Tidak' ---
    function processAnswer(isYes) {
        // Simpan jawaban saat ini sebelum melanjutkan
        answersHistory.push(isYes);

        if (isYes) {
            score++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questionsData.questionsListForAgeSpecificMonth.questionsContentsListKpspModelList.length) {
            showQuestion(); // Lanjut ke pertanyaan berikutnya
        } else {
            showResult(); // Semua pertanyaan selesai, tampilkan hasil
        }
    }

    // --- Fungsi Tampilkan Hasil Skrining ---
    function showResult() {
        questionArea.classList.add('hidden'); // Sembunyikan area pertanyaan
        resultArea.classList.remove('hidden'); // Tampilkan area hasil

        let interpretation = '';
        let suggestion = '';
        let status = ''; // Untuk menyimpan status (Sesuai, Meragukan, Penyimpangan)

        // Logika interpretasi hasil KPSP berdasarkan jumlah jawaban 'YA'
        // Kriteria ini umum untuk semua kelompok usia KPSP (jika ada perbedaan, tambahkan logika per usia)
        if (score >= 9) {
            interpretation = 'Perkembangan Anak: Sesuai';
            suggestion = 'Perkembangan anak dianggap normal dan sesuai dengan usianya. Orang tua tetap perlu memberikan stimulasi dan melakukan pemeriksaan rutin pada kunjungan berikutnya.';
            status = 'Sesuai';
        } else if (score >= 7) { // 7 atau 8
            interpretation = 'Perkembangan Anak: Meragukan';
            suggestion = 'Terdapat kemungkinan adanya penyimpangan perkembangan. Orang tua perlu waspada dan berkonsultasi dengan tenaga kesehatan untuk mendapatkan intervensi dini.';
            status = 'Meragukan';
        } else { // Skor 6 atau kurang
            interpretation = 'Perkembangan Anak: Penyimpangan';
            suggestion = 'Perkembangan anak kemungkinan besar mengalami penyimpangan. Segera konsultasikan dengan tenaga kesehatan untuk mendapatkan penanganan yang tepat.';
            status = 'Penyimpangan';
        }

        resultInterpretationElement.textContent = interpretation;
        resultSuggestionElement.textContent = `Jumlah jawaban 'YA': ${score}. ${suggestion}`;

        // --- Simpan hasil ke localStorage untuk riwayat laporan ---
        const kpspResult = {
            id: Date.now(), // ID unik berdasarkan timestamp
            childName: balitaData.namaAnak,
            childGender: balitaData.jenisKelamin,
            childBirthDate: balitaData.tanggalLahir,
            testDate: balitaData.tanggalPemeriksaan,
            ageTested: ageGroupString,
            score: score,
            interpretation: interpretation,
            suggestion: suggestion,
            status: status,
            timestamp: new Date().toISOString()
        };

        const existingReports = JSON.parse(localStorage.getItem('kpspReports') || '[]');
        existingReports.push(kpspResult);
        localStorage.setItem('kpspReports', JSON.stringify(existingReports));
    }

    // --- Event Listeners ---
    btnYa.addEventListener('click', () => processAnswer(true));
    btnTidak.addEventListener('click', () => processAnswer(false));

    btnRestart.addEventListener('click', () => {
        // Hapus data balita dari session storage saat memulai ulang
        sessionStorage.removeItem('currentBalita');
        window.location.href = 'mulai.html'; // Kembali ke halaman identitas balita
    });

    backToHomeFromResultBtn.addEventListener('click', () => {
        window.location.href = 'index.html'; // Kembali ke halaman utama
    });

    // MODIFIKASI: Event listener untuk panah di header
    if (backToIdentitasBtnHeader) {
        backToIdentitasBtnHeader.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                // Jika sedang tidak di pertanyaan pertama, kembali ke pertanyaan sebelumnya
                currentQuestionIndex--;
                const lastAnswer = answersHistory.pop(); // Hapus jawaban terakhir dari riwayat
                if (lastAnswer === true) { // Jika jawaban terakhir adalah 'YA', kurangi skor
                    score--;
                }
                showQuestion(); // Tampilkan pertanyaan sebelumnya
            } else {
                // Jika sudah di pertanyaan pertama, tanyakan konfirmasi untuk keluar
                if (confirm("Apakah Anda yakin ingin keluar dari kuesioner? Progres Anda akan hilang.")) {
                    sessionStorage.removeItem('currentBalita'); // Hapus data balita jika keluar
                    window.location.href = 'mulai.html'; // Kembali ke halaman identitas
                }
            }
        });
    }

    // --- Inisialisasi Saat Halaman Dimuat ---
    initializeKuis();
});