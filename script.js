document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambil Nama Tamu dari URL (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    document.getElementById('guest-name').innerText = guestName;
    const rsvpNameField = document.getElementById('rsvp-name');
    if (rsvpNameField) {
      rsvpNameField.value = guestName;
    }
  }

  // 2. Tombol Buka Undangan & Autoplay Audio
  const btnOpen = document.getElementById('btn-open');
  const cover = document.getElementById('cover');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isPlaying = false;

  btnOpen.addEventListener('click', () => {
    cover.classList.add('hide');
    
    // Putar musik saat user menekan tombol (sesuai aturan browser)
    bgMusic.play().then(() => {
      isPlaying = true;
    }).catch(err => {
      console.log("Audio autoplay dicegah browser:", err);
    });
  });

  // 3. Tombol Toggle Musik Mengambang
  musicToggle.addEventListener('click', () => {
    const icon = musicToggle.querySelector('i');
    if (isPlaying) {
      bgMusic.pause();
      icon.classList.remove('spin');
      isPlaying = false;
    } else {
      bgMusic.play();
      icon.classList.add('spin');
      isPlaying = true;
    }
  });

  // 4. Hitung Mundur (Target: 12 Desember 2027)
  const targetDate = new Date("December 12, 2027 08:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('days').innerText = String(days).padStart(2, '0');
      document.getElementById('hours').innerText = String(hours).padStart(2, '0');
      document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
      document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. Fitur Buku Tamu / RSVP (Tersimpan di LocalStorage browser)
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');

  let wishes = JSON.parse(localStorage.getItem('wedding_wishes')) || [
    { name: "Budi Santoso", status: "Hadir", message: "Selamat menempuh hidup baru! Semoga samawa." }
  ];

  function renderWishes() {
    wishesList.innerHTML = '';
    wishes.slice().reverse().forEach(item => {
      let badgeClass = 'hadir';
      if (item.status === 'Ragu-ragu') badgeClass = 'ragu';
      if (item.status === 'Tidak Hadir') badgeClass = 'tidak';

      const div = document.createElement('div');
      div.className = 'wish-item';
      div.innerHTML = `
        <h5>${escapeHtml(item.name)} <span class="badge ${badgeClass}">${item.status}</span></h5>
        <p>${escapeHtml(item.message)}</p>
      `;
      wishesList.appendChild(div);
    });
  }

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value.trim();
    const status = document.getElementById('rsvp-status').value;
    const message = document.getElementById('rsvp-message').value.trim();

    if (name && message) {
      wishes.push({ name, status, message });
      localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
      renderWishes();
      document.getElementById('rsvp-message').value = '';
      alert('Terima kasih atas doa restu Anda!');
    }
  });

  renderWishes();
});

// 6. Fungsi Salin Nomor Rekening
function salinRekening(elementId) {
  const nomor = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(nomor).then(() => {
    alert("Nomor rekening berhasil disalin: " + nomor);
  }).catch(() => {
    alert("Gagal menyalin. Silakan salin manual.");
  });
}

// Pencegah XSS sederhana untuk formulir
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}