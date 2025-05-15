const questions = [
    "Saya pernah mengalami gangguan menstruasi seperti haid tidak teratur atau tidak datang sama sekali",
    "Saya merasa nyaman dengan kondisi tubuh saya saat menstruasi",
    "Saya menjaga pola makan sehat sebelum dan selama menstruasi",
    "Saya rutin berolahraga minimal 2 kali seminggu",
    "Saya tidur cukup dan berkualitas selama masa menstruasi",
    "Saya mengalami perubahan suasana hati menjelang menstruasi",
    "Siklus menstruasi saya biasanya teratur setiap bulan",
    "Saya dapat memperkirakan kapan menstruasi saya akan datang",
    "Saya merasakan nyeri perut saat menstruasi berlangsung",
    "Saya mengalami jerawat atau perubahan kulit menjelang menstruasi",
    "Saya merasa kelelahan atau lemas selama menstruasi",
    "Nafsu makan saya meningkat sebelum atau sesudah menstruasi",
    "Rasa nyeri saat menstruasi mengganggu aktivitas harian saya",
    "Saya merasa cemas atau stres lebih biasanya menjelang menstruasi",
    "Saya merasa lebih sensitif atau mudah marah selama periode haid"
  ];
  
  const slidesContainer = document.getElementById("slides-container");
  let currentSlide = 0;
  let scores = [];
  
  questions.forEach((q, index) => {
    const slide = document.createElement("div");
    slide.className = "main slide";
    slide.id = `slide-${index + 1}`;
    slide.innerHTML = `
      <div class="question-box">${q}</div>
      <div class="options">
        <button onclick="answerQuestion(5)">Sangat Setuju</button>
        <button onclick="answerQuestion(4)">Setuju</button>
        <button onclick="answerQuestion(3)">Netral</button>
        <button onclick="answerQuestion(2)">Tidak Setuju</button>
        <button onclick="answerQuestion(1)">Sangat Tidak Setuju</button>
      </div>
      <button class="btn-back" onclick="prevSlide()">← Kembali</button>
    `;
    slidesContainer.appendChild(slide);
  });
  
  function showSlide(index) {
    window.scrollTo(0, 0);
    document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`slide-${index}`);
    if (target) target.classList.add("active");
    else if (index === questions.length + 1) {
      document.getElementById("slide-result").classList.add("active");
      showScore();
    }
    currentSlide = index;
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    if (currentSlide === questions.length + 1) {
      showSlide(questions.length);
    } else if (currentSlide > 0) {
      showSlide(currentSlide - 1);
      scores.pop();
    }
  }
  
  function answerQuestion(score) {
    // Hapus kelas 'selected' dari semua tombol di slide aktif
    const activeSlide = document.querySelector(".slide.active");
    const buttons = activeSlide.querySelectorAll(".options button");
    buttons.forEach(btn => btn.classList.remove("selected"));
  
    // Tambah kelas 'selected' ke tombol yang diklik
    const clickedButton = event.target;
    clickedButton.classList.add("selected");
  
    // Simpan skor dan lanjut slide setelah delay
    scores.push(score);
    setTimeout(() => {
      nextSlide();
    }, 400);
  }
  
  function showScore() {
    const total = scores.reduce((a, b) => a + b, 0);
    document.getElementById("score-value").innerText = total;
  
    let result = "";
    if (total >= 50) {
      result = `
        <div class="result-box alert-high">
          <strong>Kategori:</strong> Perlu Perhatian Khusus<br/>
          <strong>Saran:</strong> Siklus dan kondisi menstruasimu menunjukkan banyak gejala yang bisa mengganggu keseharian. Disarankan untuk mulai mencatat siklus dengan rutin, jaga pola makan dan tidur. Jika keluhan terus berlanjut, pertimbangkan konsultasi ke dokter atau ahli gizi.
        </div>`;
    } else if (total >= 25) {
      result = `
        <div class="result-box alert-medium">
          <strong>Kategori:</strong> Cukup Stabil, Tapi Perlu Perbaikan<br/>
          <strong>Saran:</strong> Kondisi tubuhmu masih dalam batas wajar, tapi ada beberapa gejala atau kebiasaan yang bisa diperbaiki. Coba fokus ke olahraga ringan, tidur cukup, dan hindari stres berlebihan. Bisa mulai coba teknik relaksasi atau journaling untuk mengenali pola PMS kamu.
        </div>`;
    } else {
      result = `
        <div class="result-box alert-low">
          <strong>Kategori:</strong> Sehat dan Terjaga<br/>
          <strong>Saran:</strong> Kondisi tubuhmu secara umum baik dan kamu sudah cukup mengenali pola menstruasimu. Pertahankan gaya hidup sehatmu, dan tetap pantau perubahan kecil. Jangan ragu tetap cek rutin jika ada perubahan besar pada siklus atau gejala.
        </div>`;
    }
  
    document.getElementById("score-result").innerHTML = result;
  }
  
  showSlide(0);
  
