// Preview & simpan foto ke sessionStorage
function previewPhoto(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('profile-pic').src = e.target.result;
      sessionStorage.setItem('profileImage', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// Update usia otomatis dari tanggal lahir
function updateAge() {
  const dobInput = document.querySelector('[name="dob"]').value;
  const dob = new Date(dobInput);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  document.getElementById("age").value = `${age}th`;
}

// Load data dari sessionStorage ke form saat halaman dibuka
window.addEventListener("DOMContentLoaded", () => {
  const userData = sessionStorage.getItem("user_aktif");
  if (userData) {
    const user = JSON.parse(userData);
    document.querySelector('[name="fullname"]').value = user.fullname || "";
    document.querySelector('[name="email"]').value = user.email || "";
    document.querySelector('[name="username"]').value = user.username || "";
    document.querySelector('[name="dob"]').value = user.dob || "";
    document.getElementById("age").value = user.age || "";
    document.querySelector('[name="password"]').value = user.password || "";

    // Update foto profil jika ada
    const savedImage = sessionStorage.getItem("profileImage");
    if (savedImage) {
      document.getElementById("profile-pic").src = savedImage;
    }
  }
});

// Simpan perubahan ke sessionStorage saat form disubmit
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const oldUserData = JSON.parse(sessionStorage.getItem("user_aktif")) || {};

  const updatedUser = {
    fullname: document.querySelector('[name="fullname"]').value,
    email: document.querySelector('[name="email"]').value,
    username: document.querySelector('[name="username"]').value,
    dob: document.querySelector('[name="dob"]').value,
    age: document.getElementById("age").value,
  };

  sessionStorage.setItem("user_aktif", JSON.stringify(updatedUser));
  window.location.href = "me.html"; // kembali ke halaman profil
});

// Toggle visibility password
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}
