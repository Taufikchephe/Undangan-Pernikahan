document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambil Nama Tamu dari parameter URL (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    const elGuest = document.getElementById('guest-name');
    if (elGuest) elGuest.innerText = guestName;
    const rsvpNameField = document.getElementById('rsvp-name');
    if (rsvpNameField) rsvpNameField.value = guestName;
  }

  // 2. Tombol Buka Undangan & Autoplay Musik (Mulai dari detik ke-56)
  const btnOpen = document.getElementById('btn-open');
  const cover = document.getElementById('cover');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isPlaying = false;

  // Set detik awal lagu (detik ke-56: "Di situlah mengapa jatuh cinta...")
  const REFF_START_SECONDS = 00;

  if (btnOpen && cover) {
    btnOpen.addEventListener('click', () => {
      cover.classList.add('hide');

      if (bgMusic) {
        // Loncat ke menit 00:56
        bgMusic.currentTime = REFF_START_SECONDS;

        bgMusic.play().then(() => {
          isPlaying = true;
          if (musicToggle) {
            const icon = musicToggle.querySelector('i');
            if (icon) icon.classList.add('spin');
          }
        }).catch(err => {
          console.warn("Autoplay audio tertahan izin browser:", err);
        });
      }
    });
  }

  // 3. Tombol Toggle Musik Mengambang
  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      const icon = musicToggle.querySelector('i');
      if (isPlaying) {
        bgMusic.pause();
        if (icon) icon.classList.remove('spin');
        isPlaying = false;
      } else {
        bgMusic.play();
        if (icon) icon.classList.add('spin');
        isPlaying = true;
      }
    });
  }

  // 4. Hitung Mundur Menuju Hari H (26 November 2026, 09.00 WIB)
  const targetDate = new Date("November 26, 2026 09:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const dEl = document.getElementById('days');
      const hEl = document.getElementById('hours');
      const mEl = document.getElementById('minutes');
      const sEl = document.getElementById('seconds');

      if (dEl) dEl.innerText = String(days).padStart(2, '0');
      if (hEl) hEl.innerText = String(hours).padStart(2, '0');
      if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
      if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. Animasi Saat di-Scroll (Intersection Observer)
  const scrollElements = document.querySelectorAll('.anim-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15 // Animasi aktif saat 15% elemen sudah masuk layar
  });

  scrollElements.forEach(el => observer.observe(el));

  // 6. Fitur Buku Tamu / Konfirmasi Kehadiran
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');

  let wishes = JSON.parse(localStorage.getItem('wedding_wishes_taufik_ayuk')) || [
    { name: "Keluarga Besar", status: "Hadir", message: "Ndherek mangayubagya Mas Taufik & Mbak Ayuk, mugi lancar sedayanipun lan berkah tansah pinaringan." }
  ];

  function renderWishes() {
    if (!wishesList) return;
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

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const message = document.getElementById('rsvp-message').value.trim();

      if (name && message) {
        wishes.push({ name, status, message });
        localStorage.setItem('wedding_wishes_taufik_ayuk', JSON.stringify(wishes));
        renderWishes();
        document.getElementById('rsvp-message').value = '';
        alert('Matur nuwun, doa restu panjenengan sampun katampi!');
      }
    });
  }

  renderWishes();
});

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
