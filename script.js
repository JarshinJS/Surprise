// --- Config ---
const CONFIG = {
  name: "Rethisha",
  bdayMonth: 1, // Feb (0-indexed)
  bdayDay: 21,
  bdayYear: 2006
};

// --- Init & Intersection Observer ---
document.addEventListener("DOMContentLoaded", () => {
  checkLogin(); // Ensure login check runs first
  initScrollAnimations();
  initTypingEffect();
});

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: Stop observing once revealed
        // observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    // Add the class specified in data-animate
    el.classList.add(el.dataset.animate);
    observer.observe(el);
  });
}

function initTypingEffect() {
  const title = document.querySelector('.typing-text');
  // Simple CSS animation fallback or add JS typing if needed later
  // Currently handled by CSS fade-in
}

// --- Login System ---
function login() {
  const nameInput = document.getElementById("username").value.trim();
  const dateInput = document.getElementById("user-birthday").value;

  if (!nameInput || !dateInput) return alert("Please fill in both! 🎀");

  const inputDate = new Date(dateInput);
  const today = new Date();

  // Verify User Credentials (Name & Birth Date Match)
  // Note: Just checking Month/Day match for "Identity Verification"
  if (nameInput.toLowerCase() !== CONFIG.name.toLowerCase()) {
    return alert(`Sorry, this is only for ${CONFIG.name}! 🚫`);
  }

  if (inputDate.getDate() !== CONFIG.bdayDay || inputDate.getMonth() !== CONFIG.bdayMonth) {
    return alert("That's not your birthday! Are you really Rethisha? 🧐");
  }

  // Identity Verified! Now check if it's TIME for the surprise.
  const currentYear = today.getFullYear();
  let targetBirthday = new Date(currentYear, CONFIG.bdayMonth, CONFIG.bdayDay, 0, 0, 0); // Month is 0-indexed

  // If birthday has passed this year, strict check? 
  // User said "time remaining for birthday". Assuming upcoming.
  // If today is BEFORE targetBirthday: Show Countdown.

  if (today < targetBirthday) {
    // Show Countdown
    localStorage.setItem("user", nameInput);
    document.getElementById("login-overlay").style.opacity = '0';
    setTimeout(() => {
      document.getElementById("login-overlay").classList.add("hidden");
      document.getElementById("countdown-overlay").classList.remove("hidden");
      startCountdown(targetBirthday);
    }, 500);
  } else {
    // Determine if it's THE day or after
    // If it's the exact day (or we just allow access after)
    // Show Main App
    localStorage.setItem("user", nameInput);
    document.getElementById("login-overlay").style.opacity = '0';
    setTimeout(() => {
      document.getElementById("login-overlay").classList.add("hidden");
      document.getElementById("main-app").classList.remove("hidden");
    }, 500);
  }
}

function startCountdown(targetDate) {
  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      // Time's up! UNLOCK
      document.getElementById("countdown-overlay").innerHTML = "<h2>It's Time! 🎉</h2><p>Entering...</p>";
      setTimeout(() => {
        document.getElementById("countdown-overlay").classList.add("hidden");
        document.getElementById("main-app").classList.remove("hidden");
      }, 2000);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

    requestAnimationFrame(updateTimer);
  }

  updateTimer();
}

function checkLogin() {
  // Always show login on refresh for safety/surprise factor
  document.getElementById("main-app").classList.add("hidden");
  document.getElementById("login-overlay").classList.remove("hidden");
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// --- Card Logic ---
function toggleCard(id) {
  const card = document.getElementById(`card-${id}`);

  // Check lock for #3
  if (id === 3 && !card.classList.contains('flipped')) {
    const today = new Date();
    const isBday = today.getDate() === CONFIG.bdayDay && today.getMonth() === CONFIG.bdayMonth;
    if (!isBday) {
      card.classList.add('locked');
      alert("Wait for the special day! 🎂");
      return;
    }
  }

  // Close others if opening a new one (Optional, but good for focus)
  if (!card.classList.contains('flipped')) {
    document.querySelectorAll('.card-wrapper.flipped').forEach(el => {
      if (el !== card) el.classList.remove('flipped');
    });
  }

  card.classList.toggle('flipped');
}

// --- Game & Media (Adapted from original) ---
// ... (Keeping the logic simple and inline with new HTML)

// Media Data
const media = {
  images: Array.from({ length: 28 }, (_, i) => `images/img${i + 1}.jpg`), // img1 to img28
  videos: ["images/vid1.mp4", "images/vid2.mp4"]
};

// Gallery
function openGallery() {
  const container = document.getElementById("gallery-container");
  container.innerHTML = "";
  media.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    // Styles now handled by CSS class .gallery-container img
    img.onclick = () => showFullScreen(src);
    container.appendChild(img);
  });
  document.getElementById("gallery-modal").classList.remove("hidden");
}

function showFullScreen(src) {
  document.getElementById("fullscreen-img").src = src;
  document.getElementById("fullscreen-view").classList.remove("hidden");
}

function closeFullScreen() {
  document.getElementById("fullscreen-view").classList.add("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
  if (id === 'video-modal') {
    const v = document.getElementById("modal-video");
    v.pause();
  }
}

// Video
let currentVid = 0;
function openVideo() {
  const v = document.getElementById("modal-video");
  if (media.videos.length > 0) {
    v.src = media.videos[0];
    document.getElementById("video-modal").classList.remove("hidden");
  } else {
    alert("No videos found! 🎥");
  }
}

function changeVideo(dir) {
  currentVid = (currentVid + dir + media.videos.length) % media.videos.length;
  const v = document.getElementById("modal-video");
  v.src = media.videos[currentVid];
  v.play();
}

// Audio
let audio = null;
function toggleAudio(src) {
  const btn = document.getElementById("audio-controls-btn");

  if (!audio) {
    audio = new Audio(src);
    audio.onended = () => {
      btn.innerText = "🎧 Voice Note";
      audio = null; // Reset to allow fresh start or keep instance if you prefer replay
    };
  }

  if (!audio.paused) {
    audio.pause();
    btn.innerText = "▶️ Play Voice Note";
  } else {
    audio.play();
    btn.innerText = "⏸️ Pause Voice Note";
  }
}

// Game
const icons = ['🌟', '🎈', '🎁', '🍰', '🦄', '🎵', '🍦', '🌹'];
let flipped = [];
let solved = 0;

function openGame() {
  document.getElementById("game-modal").classList.remove("hidden");
  initGame();
}

function initGame() {
  const grid = document.getElementById("game-grid");
  grid.innerHTML = "";
  solved = 0;
  flipped = [];
  document.getElementById("game-message").classList.add("hidden");

  let cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
  cards.forEach(icon => {
    const tile = document.createElement("div");
    tile.className = "game-tile";
    tile.innerHTML = "❓";
    tile.onclick = () => flipTile(tile, icon);
    grid.appendChild(tile);
  });
}

function flipTile(tile, icon) {
  if (tile.classList.contains("revealed") || flipped.length >= 2) return;

  tile.classList.add("revealed");
  tile.innerHTML = icon;
  flipped.push({ tile, icon });

  if (flipped.length === 2) {
    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  const [a, b] = flipped;
  if (a.icon === b.icon) {
    a.tile.classList.add("matched");
    b.tile.classList.add("matched");
    solved++;
    if (solved === icons.length) {
      document.getElementById("game-message").classList.remove("hidden");
      makeConfetti();
    }
  } else {
    a.tile.classList.remove("revealed"); a.tile.innerHTML = "❓";
    b.tile.classList.remove("revealed"); b.tile.innerHTML = "❓";
  }
  flipped = [];
}

function makeConfetti() {
  for (let i = 0; i < 100; i++) {
    const conf = document.createElement("div");
    conf.innerHTML = ["🎉", "❤️", "✨", "🎂"][Math.floor(Math.random() * 4)];
    conf.style.position = "fixed";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.top = "-10vh";
    conf.style.fontSize = Math.random() * 20 + 10 + "px";
    conf.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
    conf.style.zIndex = 10000;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 5000);
  }
  const style = document.createElement('style');
  style.innerHTML = `@keyframes fall { to { top: 110vh; transform: rotate(720deg); } }`;
  document.head.appendChild(style);
}



function resetApp() {
  if (confirm("Restart the journey?")) {
    localStorage.clear();
    location.reload();
  }
}
