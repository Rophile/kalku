// Fungsi untuk menavigasi antar screen
function goToScreen(screenNumber) {
  // Sembunyikan semua screen
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Tampilkan screen sesuai nomor
  const targetScreen = document.getElementById(`screen${screenNumber}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

// Event listener untuk logo dan teks RUBBY di screen 1
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('#screen1 .logo img');
  const rubbyTitle = document.querySelector('.rubby-title');

  if (logo) logo.addEventListener('click', () => goToScreen(2));
  if (rubbyTitle) rubbyTitle.addEventListener('click', () => goToScreen(2));
});
