document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
      // Menutup semua FAQ yang terbuka lainnya
      document.querySelectorAll('.faq-item').forEach(i => {
          if (i !== item) {
              i.classList.remove('active');
              i.querySelector('.faq-answer').style.display = 'none';
              // Mengubah icon panah
              i.querySelector('.fa-chevron-up').style.display = 'none';
              i.querySelector('.fa-chevron-down').style.display = 'inline';
          }
      });

      // Mengubah status FAQ yang diklik
      item.classList.toggle('active');
      const answer = item.querySelector('.faq-answer');
      
      if (item.classList.contains('active')) {
          answer.style.display = 'block';
          item.querySelector('.fa-chevron-up').style.display = 'inline';
          item.querySelector('.fa-chevron-down').style.display = 'none';
      } else {
          answer.style.display = 'none';
          item.querySelector('.fa-chevron-up').style.display = 'none';
          item.querySelector('.fa-chevron-down').style.display = 'inline';
      }
  });
});
