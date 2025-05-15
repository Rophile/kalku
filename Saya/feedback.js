function kirimUmpanBalik() {
    const feedback = document.getElementById("feedback").value;
    if (feedback.trim() === "") {
      alert("Silakan isi umpan balik terlebih dahulu.");
    } else {
      alert("Terima kasih atas umpan balik Anda!");
      // Di sini bisa ditambahkan logika kirim ke server
      document.getElementById("feedback").value = "";
    }
  }
  
  function kembali() {
    window.history.back();
  }
  