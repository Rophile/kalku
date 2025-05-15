function previewPhoto(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profile-pic').src = e.target.result;
      localStorage.setItem('profileImage', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}
  
  function updateAge() {
    const dob = new Date(document.querySelector('[name="dob"]').value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    document.getElementById("age").value = `${age}th`;
  }
  
  document.getElementById("editForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Informasi berhasil diperbarui!");
    // Tambahkan logika simpan data ke backend di sini jika diperlukan
  });
  