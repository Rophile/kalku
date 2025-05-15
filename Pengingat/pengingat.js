const quotes = [
    "Haid bukan kelemahan, tapi bukti bahwa tubuh perempuan bekerja dengan luar biasa.",
    "Memahami siklus haid adalah langkah pertama mengenal diri kamu.",
    "Setiap siklus adalah pengingat bahwa tubuh perempuan penuh kekuatan dan keajaiban.",
    "Sakit itu sementara. Tubuhmu butuh waktu untuk pulih, percayalah kamu akan merasa lebih baik.",
    "Seperti bulan, tubuhmu punya siklus indahnya sendiri.",
    "Izinkan dirimu berhenti sejenak. Itu juga bagian dari perjalanan.",
    "Sedikit istirahat hari ini adalah hadiah untuk dirimu esok hari.",
    "Terimakasih sudah membaca quotes hari ini! Jangan lupa tersenyum dan tetap percaya pada dirimu !"
];



let currentQuoteIndex = 0;

function showMainContent() {
    document.getElementById('emoji-description-page').style.display = 'none';
    document.getElementById('quotes-page').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
}

function showEmojiDescription(emoji) {
    // Menyembunyikan konten utama
    document.querySelector('.content').style.display = 'none';
    
    // Menampilkan halaman deskripsi emoji
    const emojiPage = document.getElementById('emoji-description-page');
    emojiPage.style.display = 'block';

    // Menyembunyikan semua deskripsi dan hanya menampilkan yang sesuai dengan emoji
    document.querySelectorAll('.description-container').forEach(desc => desc.style.display = 'none');
    document.getElementById(emoji + '-desc').style.display = 'block';
}

function showQuotes() {
    const quoteText = document.getElementById('quote-text');
    const quoteTitle = document.getElementById('quote-title');
    const backButton = document.querySelector('#quotes-page .back-button');

    if (document.getElementById('quotes-page').style.display === 'none') {
        document.querySelector('.content').style.display = 'none';
        document.getElementById('quotes-page').style.display = 'block';
    }
    
    quoteText.textContent = quotes[currentQuoteIndex];

    // Cek apakah ini adalah quotes terakhir
    if (currentQuoteIndex === quotes.length - 1) {
        backButton.textContent = "⟵";
        backButton.onclick = showMainContent;
    } else {
        backButton.textContent = "Dapatkan Quotes Baru";
        backButton.onclick = showQuotes;
    }

    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
}
