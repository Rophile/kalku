const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const toggleLink = document.getElementById("toggleRegister");
const formTitle = document.getElementById("formTitle");
const infoProgrammer = document.getElementById("infoProgrammer");

let isRegistering = false;

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (isRegistering) {
    // Simulasi pendaftaran: tampilkan info programmer
    infoProgrammer.classList.remove("hidden");
    errorMsg.textContent = "";
  } else {
    if (username === "rophile" && password === "informatika24") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "landingpage.html";
    } else {
      errorMsg.textContent = "Username atau password salah!";
    }
  }
});

toggleLink.addEventListener("click", function (e) {
  e.preventDefault();
  isRegistering = !isRegistering;
  formTitle.textContent = isRegistering ? "Daftar RUBBY" : "Login RUBBY";
  toggleLink.textContent = isRegistering ? "Kembali ke Login" : "Daftar";
  loginForm.reset();
  errorMsg.textContent = "";
  infoProgrammer.classList.add("hidden");
});
