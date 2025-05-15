// Variabel global
let currentDate = new Date();
let predictedPeriods = [];
let isEditMode = false;

// Elemen DOM
const monthYearElement = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const actionBtn = document.getElementById('action-btn');
const lastPeriodInput = document.getElementById('last-period');
const cycleLengthInput = document.getElementById('cycle-length');
const periodLengthInput = document.getElementById('period-length');
const predictionText = document.getElementById('prediction-text');
const formContainer = document.getElementById('form-container');

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Set tanggal default untuk input (hari ini)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    lastPeriodInput.value = formattedDate;
    
    generateCalendar(currentDate);
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    
    actionBtn.addEventListener('click', handleAction);
    
    // Cek data tersimpan
    const savedData = localStorage.getItem('menstrualData');
    if (savedData) {
        const data = JSON.parse(savedData);
        lastPeriodInput.value = data.lastPeriod;
        cycleLengthInput.value = data.cycleLength;
        periodLengthInput.value = data.periodLength;
        predictedPeriods = data.predictedPeriods || [];
        
        setEditMode(false); // Set mode ke tampil (form hidden)
    } else {
        // Tidak ada data tersimpan, tampilkan form untuk input pertama kali
        setEditMode(true);
    }
});

// Fungsi utama untuk tombol aksi
function handleAction() {
    if (isEditMode) {
        calculatePeriods();
    } else {
        setEditMode(true); // Tampilkan form untuk edit
    }
}

// Fungsi untuk mengatur mode edit
function setEditMode(edit) {
    isEditMode = edit;
    
    if (edit) {
        // Mode edit: tampilkan form
        formContainer.classList.add('visible');
        actionBtn.textContent = 'Hitung Prediksi';
        actionBtn.classList.remove('calculate-mode');
        actionBtn.classList.add('edit-mode');
        
        // Enable input fields
        lastPeriodInput.disabled = false;
        cycleLengthInput.disabled = false;
        periodLengthInput.disabled = false;
    } else {
        // Mode tampil: sembunyikan form
        formContainer.classList.remove('visible');
        actionBtn.textContent = 'Ubah Data';
        actionBtn.classList.remove('edit-mode');
        actionBtn.classList.add('calculate-mode');
        updatePredictionInfo();
        
        // Disable input fields
        lastPeriodInput.disabled = true;
        cycleLengthInput.disabled = true;
        periodLengthInput.disabled = true;
    }
}

// Fungsi untuk menghitung prediksi
function calculatePeriods() {
    const lastPeriodDate = new Date(lastPeriodInput.value);
    const cycleLength = parseInt(cycleLengthInput.value);
    const periodLength = parseInt(periodLengthInput.value);
    
    // Validasi input
    if (isNaN(lastPeriodDate.getTime())) {
        alert('Masukkan tanggal haid terakhir yang valid.');
        return;
    }
    
    if (cycleLength < 20 || cycleLength > 45) {
        alert('Siklus menstruasi biasanya antara 20-45 hari.');
        return;
    }
    
    if (periodLength < 2 || periodLength > 10) {
        alert('Durasi menstruasi biasanya antara 2-10 hari.');
        return;
    }
    
    // Hitung prediksi
    predictedPeriods = [];
    for (let i = 0; i < 6; i++) {
        const startDate = new Date(lastPeriodDate);
        startDate.setDate(startDate.getDate() + (i * cycleLength));
        
        const periodDays = [];
        for (let j = -1; j < periodLength; j++) {
            const periodDay = new Date(startDate);
            periodDay.setDate(periodDay.getDate() + j);
            periodDays.push(periodDay.toISOString().split('T')[0]);
        }
        
        predictedPeriods.push({
            startDate: startDate.toISOString().split('T')[0],
            periodDays: periodDays
        });
    }
    
    // Simpan ke localStorage
    localStorage.setItem('menstrualData', JSON.stringify({
        lastPeriod: lastPeriodInput.value,
        cycleLength: cycleLength,
        periodLength: periodLength,
        predictedPeriods: predictedPeriods
    }));
    
    // Sembunyikan form dan ubah tombol
    setEditMode(false);
    generateCalendar(currentDate);
}

// Fungsi untuk menghasilkan kalender
function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update judul bulan dan tahun
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                       "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    
    // Kosongkan kalender
    calendarBody.innerHTML = '';
    
    // Dapatkan hari pertama bulan ini dan hari terakhir bulan ini
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Dapatkan hari dalam minggu untuk hari pertama (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
    const firstDayOfWeek = firstDay.getDay();
    
    // Dapatkan jumlah hari dalam bulan ini
    const daysInMonth = lastDay.getDate();
    
    // Dapatkan jumlah hari dari bulan sebelumnya yang perlu ditampilkan
    const prevMonthLastDay = new Date(year, month, 0);
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Dapatkan hari ini untuk penanda
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    let dateNum = 1;
    let nextMonthDateNum = 1;
    
    // Buat baris kalender (6 baris untuk mencakup semua kemungkinan)
    for (let i = 0; i < 6; i++) {
        // Jika sudah melewati bulan ini dan tanggal sudah melebihi jumlah hari, berhenti
        if (dateNum > daysInMonth && i > 0) break;
        
        const row = document.createElement('tr');
        
        // Buat sel untuk setiap hari dalam minggu
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            let cellDate = null;
            
            // Hari dari bulan sebelumnya
            if (i === 0 && j < daysFromPrevMonth) {
                const prevDate = prevMonthLastDay.getDate() - (daysFromPrevMonth - j - 1);
                cell.innerHTML = `<div class="day-number other-month">${prevDate}</div>`;
                cell.classList.add('other-month');
            } 
            // Hari dari bulan ini
            else if (dateNum <= daysInMonth) {
                cellDate = new Date(year, month, dateNum);
                const dateStr = cellDate.toISOString().split('T')[0];
                
                cell.innerHTML = `<div class="day-number">${dateNum}</div>`;
                
                // Tandai hari ini
                if (isCurrentMonth && dateNum === today.getDate()) {
                    cell.classList.add('today');
                }
                
                // Tandai hari prediksi menstruasi
                if (isPredictedPeriodDay(cellDate)) {
                    cell.classList.add('period-day');
                }
                
                dateNum++;
            } 
            // Hari dari bulan berikutnya
            else {
                cell.innerHTML = `<div class="day-number other-month">${nextMonthDateNum}</div>`;
                cell.classList.add('other-month');
                nextMonthDateNum++;
            }
            
            row.appendChild(cell);
        }
        
        calendarBody.appendChild(row);
    }
}

// Fungsi untuk mengecek apakah suatu tanggal adalah hari prediksi menstruasi
function isPredictedPeriodDay(date) {
    if (predictedPeriods.length === 0) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    
    for (const period of predictedPeriods) {
        if (period.periodDays.includes(dateStr)) {
            return true;
        }
    }
    
    return false;
}

// Fungsi untuk memperbarui informasi prediksi
function updatePredictionInfo() {
    if (predictedPeriods.length === 0) {
        predictionText.textContent = "Masukkan data menstruasi Anda untuk melihat prediksi.";
        return;
    }
    
    let infoText = "Prediksi menstruasi Anda untuk 6 siklus berikutnya:<br><br>";
    
    for (let i = 0; i < predictedPeriods.length; i++) {
        const startDate = new Date(predictedPeriods[i].startDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(periodLengthInput.value) - 1);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const startDateStr = startDate.toLocaleDateString('id-ID', options);
        const endDateStr = endDate.toLocaleDateString('id-ID', options);
        
        infoText += `<strong>Siklus ${i + 1}:</strong> ${startDateStr} - ${endDateStr}<br>`;
    }
    
    infoText += "<br>Hari-hari prediksi menstruasi ditandai dengan garis merah pada kalender.";
    predictionText.innerHTML = infoText;
}

