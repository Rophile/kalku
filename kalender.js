// Variabel global
let currentDate = new Date();
let predictedPeriods = [];
let actualPeriods = [];
let isEditMode = false;
let delayedPeriods = [];


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
document.addEventListener('DOMContentLoaded', async function() {
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
    const savedData = await loadFromDatabase();
    if (savedData) {
        lastPeriodInput.value = savedData.lastPeriod;
        cycleLengthInput.value = savedData.cycleLength;
        periodLengthInput.value = savedData.periodLength;
        predictedPeriods = savedData.predictedPeriods || [];
        actualPeriods = savedData.actualPeriods || [];
        delayedPeriods = savedData.delayedPeriods || [];
        
        setEditMode(false);
    } else {
        setEditMode(true);
    }
});

    // Update kalender ketika data berubah
    window.addEventListener('storage', function() {
        const newData = JSON.parse(localStorage.getItem('menstrualData'));
        if (newData) {
            predictedPeriods = newData.predictedPeriods || [];
            generateCalendar(currentDate);
            updatePredictionInfo();
        }
    });

function handleAction() {
    if (isEditMode) {
        calculatePeriods();
    } else {
        setEditMode(true);
    }
}

function setEditMode(edit) {
    isEditMode = edit;
    
    if (edit) {
        formContainer.classList.add('visible');
        actionBtn.textContent = 'Hitung Prediksi';
        actionBtn.classList.remove('calculate-mode');
        actionBtn.classList.add('edit-mode');
        lastPeriodInput.disabled = false;
        cycleLengthInput.disabled = false;
        periodLengthInput.disabled = false;
    } else {
        formContainer.classList.remove('visible');
        actionBtn.textContent = 'Ubah Data';
        actionBtn.classList.remove('edit-mode');
        actionBtn.classList.add('calculate-mode');
        updatePredictionInfo();
        lastPeriodInput.disabled = true;
        cycleLengthInput.disabled = true;
        periodLengthInput.disabled = true;
        
        // Scroll ke bawah untuk menampilkan tombol "Ubah Data"
        setTimeout(() => {
            actionBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 300);
    }
}

console.log("actualPeriods:", actualPeriods);
console.log("delayedPeriods:", delayedPeriods);


async function calculatePeriods() {
    const lastPeriodDate = new Date(lastPeriodInput.value);
    const cycleLength = parseInt(cycleLengthInput.value);
    const periodLength = parseInt(periodLengthInput.value);
    


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
    
    // Data yang akan disimpan
    const dataToSave = {
        lastPeriod: lastPeriodInput.value,
        cycleLength: cycleLength,
        periodLength: periodLength,
        predictedPeriods: predictedPeriods,
        nextPeriodInfo: getDaysUntilNextPeriod(),
        actualPeriods: actualPeriods,
        delayedPeriods: delayedPeriods
    };



    // Simpan ke localStorage
    const savedData = localStorage.getItem('menstrualData');
    const existingData = savedData ? JSON.parse(savedData) : {};

    // Simpan ke database
    await saveToDatabase(dataToSave);
    
    // Juga simpan ke localStorage sebagai fallback
    localStorage.setItem('menstrualData', JSON.stringify(dataToSave));
    
    setEditMode(false);
    generateCalendar(currentDate);

    localStorage.setItem('menstrualData', JSON.stringify({
        ...existingData,
        lastPeriod: lastPeriodInput.value,
        cycleLength: cycleLength,
        periodLength: periodLength,
        predictedPeriods: predictedPeriods,
        nextPeriodInfo: getDaysUntilNextPeriod(),
        actualPeriods: existingData.actualPeriods || [],
        delayedPeriods: existingData.delayedPeriods || []
    }));
}

function getDaysUntilNextPeriod() {
    if (!predictedPeriods || predictedPeriods.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const period of predictedPeriods) {
        const periodStart = new Date(period.startDate);
        periodStart.setHours(0, 0, 0, 0);
        
        const isTodayInPeriod = period.periodDays.includes(today.toISOString().split('T')[0]);
        
        if (isTodayInPeriod) {
            return {
                days: 0,
                startDate: period.startDate,
                isToday: true
            };
        }
        
        if (periodStart > today) {
            const diffTime = periodStart - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                days: diffDays,
                startDate: period.startDate,
                isToday: false
            };
        }
    }
    return null;
}

function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                       "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    calendarBody.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0);
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    let dateNum = 1;
    let nextMonthDateNum = 1;
    
    for (let i = 0; i < 6; i++) {
        if (dateNum > daysInMonth && i > 0) break;
        
        const row = document.createElement('tr');
        
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            let cellDate = null;
            
            if (i === 0 && j < daysFromPrevMonth) {
                const prevDate = prevMonthLastDay.getDate() - (daysFromPrevMonth - j - 1);
                cell.innerHTML = `<div class="day-number other-month">${prevDate}</div>`;
                cell.classList.add('other-month');
            } 
            else if (dateNum <= daysInMonth) {
                cellDate = new Date(year, month, dateNum);
                const dateStr = cellDate.toISOString().split('T')[0];
                cell.innerHTML = `<div class="day-number">${dateNum}</div>`;
                
                if (isCurrentMonth && dateNum === today.getDate()) {
                    cell.classList.add('today');
                }
                
                if (isPeriodDay(cellDate)) {
                    cell.classList.add('period-day');
                }
                
                dateNum++;
            } 
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

function isPeriodDay(date) {
    const savedData = localStorage.getItem('menstrualData');
    if (!savedData) return false;
    
    const data = JSON.parse(savedData);
    const dateStr = date.toISOString().split('T')[0];
    
    // 1. Cek periode aktual
    if (data.actualPeriods) {
        for (const period of data.actualPeriods) {
            if (period.periodDays.includes(dateStr)) {
                return true;
            }
        }
    }
    
    // 2. Cek prediksi yang belum ditandai sebagai telat
    if (data.predictedPeriods) {
        for (const period of data.predictedPeriods) {
            if (period.periodDays.includes(dateStr)) {
                // Jika tidak ada daftar delayedPeriods atau periode ini tidak termasuk dalam delayedPeriods
                if (!data.delayedPeriods || !data.delayedPeriods.includes(period.startDate)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function updatePredictionInfo() {
    const savedData = localStorage.getItem('menstrualData');
    if (!savedData) {
        predictionText.textContent = "Masukkan data menstruasi Anda untuk melihat prediksi.";
        return;
    }
    
    const data = JSON.parse(savedData);
    const periods = data.predictedPeriods || [];
    
    if (periods.length === 0) {
        predictionText.textContent = "Masukkan data menstruasi Anda untuk melihat prediksi.";
        return;
    }
    
    let infoText = "Prediksi menstruasi Anda untuk 6 siklus berikutnya:<br><br>";
    
    for (let i = 0; i < periods.length; i++) {
        const startDate = new Date(periods[i].startDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(data.periodLength) - 1);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const startDateStr = startDate.toLocaleDateString('id-ID', options);
        const endDateStr = endDate.toLocaleDateString('id-ID', options);
        
        // Tambahkan status
        let status = "";
        if (data.delayedPeriods && data.delayedPeriods.includes(periods[i].startDate)) {
            status = " (Belum terjadi)";
        } else if (data.actualPeriods && data.actualPeriods.some(p => p.startDate === periods[i].startDate)) {
            status = " (Sudah terjadi)";
        }
        
        infoText += `<strong>Siklus ${i + 1}:</strong> ${startDateStr} - ${endDateStr}${status}<br>`;
    }
    
    infoText += "<br>Hari-hari menstruasi ditandai dengan garis merah pada kalender.";
    predictionText.innerHTML = infoText;
}

// Fungsi untuk menyimpan data ke database
// Ganti dengan path yang benar ke API endpoint
const API_BASE_URL = 'http://localhost/rubby_project/api/menstruasi/';

async function saveToDatabase(data) {
    try {
        let response = await fetch("http://localhost/rubby_project/frontend/Kalender/save_data.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let result = await response.json();
        console.log("Data saved successfully:", result);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}



// Fungsi untuk mengambil data dari database
async function loadFromDatabase() {
    try {
        const response = await fetch(`${API_BASE_URL}get_data.php?user_id=1`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        return result.data || null;
    } catch (error) {
        console.log("Menggunakan data dari localStorage:", error);
        const savedData = localStorage.getItem('menstrualData');
        return savedData ? JSON.parse(savedData) : null;
    }
}
