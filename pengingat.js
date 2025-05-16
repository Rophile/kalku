// Load prediksi dari localStorage
const data = JSON.parse(localStorage.getItem('menstrualData') || 'null');
const predictedPeriods = data?.predictedPeriods || [];
const periodLength = data?.periodLength || 5;

// Countdown
function getNextDate(arr) {
  const today = new Date(); today.setHours(0,0,0,0);
  for (let p of arr) {
    const d = new Date(p.startDate);
    if (d >= today) return p.startDate;
  }
  return null;
}
function updateCountdown() {
  const next = getNextDate(predictedPeriods);
  const el = document.getElementById('countdownText');
  if (!next) return el.textContent = '—';
  const diff = Math.ceil((new Date(next) - new Date()) / (1000*60*60*24));
  el.textContent = diff > 0 ? `${diff} Hari Lagi` : diff === 0 ? 'Hari Ini' : '—';
}

// Quotes
const quotes = [
  { text: "Merawat diri bukan memanjakan diri, tapi bentuk cinta kepada diri sendiri.", author: "Najwa Shihab" },
  { text: "Tubuh perempuan punya caranya sendiri untuk bicara. Dengarkan baik-baik.", author: "Cinta Laura" },
  { text: "Tidak apa-apa merasa lelah. Istirahat bukan berarti menyerah.", author: "Maudy Ayunda" },
  { text: "Cintai tubuhmu, sebab di sanalah kamu tinggal seumur hidupmu.", author: "Dewi Lestari" },
  { text: "Perubahan emosi bukan kelemahan, itu bagian dari menjadi manusia.", author: "Tere Liye" },
  { text: "Hidup yang seimbang dimulai dari mengenali dan menerima diri sendiri.", author: "Dian Sastrowardoyo" },
  { text: "Siklus perempuan adalah kekuatan, bukan beban.", author: "Najwa Shihab" },
  { text: "Kesehatan bukan hanya soal fisik, tapi juga soal hati dan pikiran.", author: "Dr. Reisa Broto Asmoro" },
  { text: "Kamu tidak harus kuat setiap saat, cukup jadi manusia yang jujur pada perasaannya.", author: "Hanum Salsabiela Rais" },
  { text: "Menjadi perempuan adalah anugerah yang luar biasa. Rawat dirimu seperti merawat sesuatu yang berharga.", author: "Ayu Utami" }
];
let currentQuoteIndex = 0;
function tampilkanQuoteBerurutan() {
  if (currentQuoteIndex >= quotes.length) currentQuoteIndex = 0;
  const q = quotes[currentQuoteIndex++];
  document.getElementById('quoteText').innerText = `“${q.text}”`;
  document.getElementById('quoteAuthor').innerText = `— ${q.author}`;
}

// Mood Harian
const moodAdviceMap = {
  happy:     "Senang itu berkah! Bagikan senyum kamu hari ini 💕",
  sad:       "Sedih itu manusiawi. Luangkan waktu untuk dirimu sendiri 🌧️",
  tired:     "Istirahat itu penting, yuk tidur cukup malam ini 😴",
  angry:     "Tarik napas dalam–dalam, kamu bisa melewati ini 😤",
  energetic: "Kamu lagi on fire! Manfaatkan energi positif ini 🔥"
};
function setupMoodSelector() {
  document.querySelectorAll('.mood-emojis').forEach(emoji => {
    emoji.addEventListener('click', () => {
      const mood = emoji.dataset.mood;
      document.getElementById('moodAdvice').innerText = moodAdviceMap[mood];
    });
  });
}

// Screen switch
function showScreen(screen) {
  document.getElementById('screenPengingat').style.display = screen==='pengingat' ? 'block' : 'none';
  document.getElementById('screenQuote').style.display      = screen==='quote'      ? 'block' : 'none';
  if (screen === 'pengingat') updateCountdown();
  if (screen === 'quote') tampilkanQuoteBerurutan();
}

// Init
window.onload = () => {
  updateCountdown();
  setupMoodSelector();
};
