const quotes = [
    "Haid bukan kelemahan, tapi bukti bahwa tubuh perempuan bekerja dengan luar biasa.",
    "Memahami siklus haid adalah langkah pertama mengenal diri kamu.",
    "Setiap siklus adalah pengingat bahwa tubuh perempuan penuh kekuatan dan keajaiban.",
    "Sakit itu sementara. Tubuhmu butuh waktu untuk pulih, percayalah kamu akan merasa lebih baik.",
    "Seperti bulan, tubuhmu punya siklus indahnya sendiri.",
    "Izinkan dirimu berhenti sejenak. Itu juga bagian dari perjalanan.",
    "Sedikit istirahat hari ini adalah hadiah untuk dirimu esok hari.",
    "Terimakasih sudah  membaca quotes hari ini! Jangan lupa tersenyum dan tetap percaya pada dirimu !"
];

let currentQuoteIndex = 0;

function showMainContent() {
    document.getElementById('emoji-description-page').style.display = 'none';
    document.getElementById('quotes-page').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
}

function showEmojiDescription(emoji) {
    document.querySelector('.content').style.display = 'none';
    const emojiPage = document.getElementById('emoji-description-page');
    emojiPage.style.display = 'block';

    document.querySelectorAll('.description-container').forEach(desc => desc.style.display = 'none');
    document.getElementById(emoji + '-desc').style.display = 'block';
}

function showQuotes() {
    const quoteText = document.getElementById('quote-text');
    const quoteTitle = document.getElementById('quote-title');

    if (document.getElementById('quotes-page').style.display === 'none') {
        document.querySelector('.content').style.display = 'none';
        const quotesPage = document.getElementById('quotes-page');
        quotesPage.style.display = 'block';
    }

    quoteText.textContent = quotes[currentQuoteIndex];
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
}