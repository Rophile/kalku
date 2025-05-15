function toggleForm() {
  document.querySelector('.login').classList.toggle('hidden');
  document.querySelector('.signup').classList.toggle('hidden');
}

document.getElementById('birthdate').addEventListener('change', function () {
  const birthDate = new Date(this.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  document.getElementById('age').value = age;
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("email_or_username", document.getElementById("loginUsername").value);
  formData.append("password", document.getElementById("loginPassword").value);

  fetch("../api/user/login.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      if (data.user_id) {
        window.location.href = "home.html";
      }
    });
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("email", document.getElementById("signupEmail").value);
  formData.append("username", document.getElementById("signupUsername").value);
  formData.append("full_name", document.getElementById("signupFullname").value);
  formData.append("dob", document.getElementById("birthdate").value);
  formData.append("password", document.getElementById("signupPassword").value);

  fetch("../api/user/signup.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      if (data.message.includes("berhasil")) {
        toggleForm();
      }
    });
});
