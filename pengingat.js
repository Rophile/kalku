document.addEventListener('DOMContentLoaded', function() {
    updateCountdownFromStorage();
    setupMoodSelector();
    tampilkanQuoteBerurutan(); // Tampilkan quote pertama saat load
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Cek dan tampilkan pertanyaan konfirmasi jika hari ini prediksi haid
    checkMenstruationToday();
});

function updateCountdownFromStorage() {
    const savedData = localStorage.getItem('menstrualData');
    const countdownElement = document.querySelector('.circle-inner');
    const reminderElement = document.querySelector('.reminder');
    const countdownCircle = document.querySelector('.countdown-circle');
    
    if (!savedData) {
        countdownElement.textContent = '-';
        reminderElement.textContent = 'Masukkan data menstruasi di halaman kalender';
        resetCountdownStyles(countdownCircle, countdownElement);
        return;
    }
    
    try {
        const data = JSON.parse(savedData);
        
        // Jika tidak ada predictedPeriods, tampilkan pesan untuk input data
        if (!data.predictedPeriods || data.predictedPeriods.length === 0) {
            countdownElement.textContent = '-';
            reminderElement.textContent = 'Masukkan data menstruasi di halaman kalender';
            resetCountdownStyles(countdownCircle, countdownElement);
            return;
        }
        
        // Hitung hari sampai haid berikutnya
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let nextPeriodInfo = null;
        
        // Cari periode berikutnya
        for (const period of data.predictedPeriods) {
            const periodStart = new Date(period.startDate);
            periodStart.setHours(0, 0, 0, 0);
            
            // Cek jika hari ini adalah hari haid
            const isTodayInPeriod = period.periodDays && 
                period.periodDays.includes(today.toISOString().split('T')[0]);
            
            if (isTodayInPeriod || periodStart.getTime() === today.getTime()) {
                nextPeriodInfo = {
                    days: 0,
                    startDate: period.startDate,
                    isToday: true
                };
                break;
            }
            
            // Cek periode mendatang
            if (periodStart > today) {
                const diffDays = Math.ceil((periodStart - today) / (1000 * 60 * 60 * 24));
                nextPeriodInfo = {
                    days: diffDays,
                    startDate: period.startDate,
                    isToday: false
                };
                break;
            }
        }
        
        // Jika tidak ditemukan periode berikutnya (sudah lewat semua prediksi)
        if (!nextPeriodInfo) {
            countdownElement.textContent = '-';
            reminderElement.textContent = 'Perkiraan belum tersedia';
            resetCountdownStyles(countdownCircle, countdownElement);
            return;
        }
        
        // Update tampilan berdasarkan info periode
        updateCountdownDisplay(
            nextPeriodInfo.days, 
            nextPeriodInfo.startDate,
            nextPeriodInfo.isToday,
            countdownCircle,
            countdownElement,
            reminderElement
        );
        
    } catch (error) {
        console.error('Error parsing menstrual data:', error);
        countdownElement.textContent = '-';
        reminderElement.textContent = 'Masukkan data menstruasi di halaman kalender';
        resetCountdownStyles(countdownCircle, countdownElement);
    }
}

function updateCountdownDisplay(days, startDate, isToday, circle, countdown, reminder) {
    if (isToday || days === 0) {
        countdown.textContent = 'HARI INI';
        reminder.textContent = 'Menstruasi diperkirakan hari ini';
        circle.classList.add('today');
        countdown.classList.add('today');
    } else if (days === 1) {
        countdown.textContent = 'BESOK';
        reminder.textContent = 'Menstruasi diperkirakan besok';
        resetCountdownStyles(circle, countdown);
    } else {
        countdown.textContent = `${days} HARI LAGI`;
        const formattedDate = new Date(startDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        reminder.textContent = `Perkiraan haid tanggal ${formattedDate}`;
        resetCountdownStyles(circle, countdown);
    }
}

function resetCountdownStyles(circle, countdown) {
    circle.classList.remove('today');
    countdown.classList.remove('today');
}

function checkMenstruationToday() {
    const savedData = localStorage.getItem('menstrualData');
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    if (!data.predictedPeriods || data.predictedPeriods.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Check if today is a predicted period day
    const isPredictedToday = data.predictedPeriods.some(period => 
        period.periodDays && period.periodDays.includes(todayStr)
    );

    // Check if we've already asked today
    const lastAskedDate = localStorage.getItem('lastConfirmationDate');
    if (lastAskedDate === todayStr) return;

    if (isPredictedToday) {
        // Show custom confirmation dialog
        showCustomConfirmationDialog(todayStr, data);
        localStorage.setItem('lastConfirmationDate', todayStr);
    }
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
  document.getElementById('quoteText').innerText = `"${q.text}"`;
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
  document.querySelector('.content').style.display = screen === 'pengingat' ? 'block' : 'none';
  document.getElementById('screenQuote').style.display = screen === 'quote' ? 'block' : 'none';
  if (screen === 'pengingat') updateCountdownFromStorage();
  if (screen === 'quote') tampilkanQuoteBerurutan();
}
