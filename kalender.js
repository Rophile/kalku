// global
let currentDate = new Date();
let predictedPeriods = [];
let actualPeriods = [];
let delayedPeriods = [];
let isEditMode = false;

// DOM
const monthYearEl = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const actionBtn = document.getElementById('action-btn');
const lastInput = document.getElementById('last-period');
const cycleInput = document.getElementById('cycle-length');
const periodInput = document.getElementById('period-length');
const predictionText = document.getElementById('prediction-text');
const formContainer = document.getElementById('form-container');

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('today-date').textContent = `Tanggal hari ini: ${formattedDate}`;
});

  // load from localStorage
  const saved = JSON.parse(localStorage.getItem('menstrualData') || 'null');
  if (saved) {
    lastInput.value = saved.lastPeriod;
    cycleInput.value = saved.cycleLength;
    periodInput.value = saved.periodLength;
    predictedPeriods = saved.predictedPeriods;
    actualPeriods    = saved.actualPeriods;
    delayedPeriods   = saved.delayedPeriods;
    setEditMode(false);
  } else {
    setEditMode(true);
  }

  generateCalendar(currentDate);

  prevBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth()-1); generateCalendar(currentDate); });
  nextBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth()+1); generateCalendar(currentDate); });
  actionBtn.addEventListener('click', () => isEditMode ? calculatePeriods() : setEditMode(true) );
});

function setEditMode(edit) {
  isEditMode = edit;
  formContainer.classList.toggle('visible', edit);
  actionBtn.textContent = edit ? 'Hitung Prediksi' : 'Ubah Data';
  lastInput.disabled = !edit;
  cycleInput.disabled = !edit;
  periodInput.disabled = !edit;
  if (!edit) updatePredictionInfo();
}

function calculatePeriods() {
  const lastDate = new Date(lastInput.value);
  const cycleLen = +cycleInput.value;
  const periodLen= +periodInput.value;
  if (isNaN(lastDate) || cycleLen<20||cycleLen>45||periodLen<2||periodLen>10) {
    return alert('Input tidak valid.');
  }
  predictedPeriods = [];
  for (let i=0; i<6; i++) {
    let d = new Date(lastDate);
    d.setDate(d.getDate() + i*cycleLen);
    let days = [];
    for (let j=0; j<periodLen; j++){
      let dd = new Date(d);
      dd.setDate(dd.getDate()+j);
      days.push(dd.toISOString().split('T')[0]);
    }
    predictedPeriods.push({ startDate: d.toISOString().split('T')[0], periodDays: days });
  }
  // save
  const data = { lastPeriod:lastInput.value, cycleLength:cycleLen, periodLength:periodLen,
    predictedPeriods, actualPeriods, delayedPeriods };
  localStorage.setItem('menstrualData', JSON.stringify(data));
  setEditMode(false);
  generateCalendar(currentDate);
}

function getDaysUntilNext() {
  const today = new Date(); today.setHours(0,0,0,0);
  for (let p of predictedPeriods) {
    let d = new Date(p.startDate);
    d.setHours(0,0,0,0);
    if (d>=today) {
      let diff = Math.ceil((d - today)/(1000*60*60*24));
      return diff;
    }
  }
  return null;
}

function generateCalendar(date){
  const y=date.getFullYear(), m=date.getMonth();
  const names=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  monthYearEl.textContent = `${names[m]} ${y}`;
  calendarBody.innerHTML = '';
  const firstDay=new Date(y,m,1).getDay(), daysInMonth=new Date(y,m+1,0).getDate();
  let dateNum=1; 
  for(let row=0; row<6; row++){
    const tr=document.createElement('tr');
    for(let col=0; col<7; col++){
      const td=document.createElement('td'), cn=document.createElement('div');
      cn.className='day-number';
      if ((row===0&&col<firstDay) || dateNum>daysInMonth) {
        cn.textContent=''; 
      } else {
        cn.textContent=dateNum;
        let cellDate=`${y}-${String(m+1).padStart(2,'0')}-${String(dateNum).padStart(2,'0')}`;
        if (predictedPeriods.some(p=>p.periodDays.includes(cellDate))) {
          td.classList.add('period-day');
        }
        dateNum++;
      }
      td.appendChild(cn);
      tr.appendChild(td);
    }
    calendarBody.appendChild(tr);
    if (dateNum>daysInMonth) break;
  }
}

function updatePredictionInfo(){
  if (!predictedPeriods.length) return predictionText.textContent='Masukkan data...';
  let html='Prediksi siklus berikutnya:<br>';
  predictedPeriods.forEach((p,i)=>{
    let s=new Date(p.startDate), e=new Date(p.startDate);
    e.setDate(e.getDate()+ (+periodInput.value)-1);
    const fmt=n=>n.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
    html+=`<strong>Siklus ${i+1}:</strong> ${fmt(s)} - ${fmt(e)}<br>`;
  });
  predictionText.innerHTML=html;
}
