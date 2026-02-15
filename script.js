const levels = {
  1: {
    title: "When You're Happy 😊",
    message: "Seeing you happy makes everything brighter. Keep smiling — you deserve every bit of joy! 💖",
    images: ["images/happy.svg"], // Changed to array
    audio: ""
  },
  2: {
    title: "When You're Sad 😔",
    message: "It's okay to feel this way. Take a deep breath. You are stronger than you think, and you’re never alone. 🤍",
    images: ["images/sad.svg"], // Changed to array
    audio: "images/Aud1.mp3"
  },
  3: {
    title: "Happy Birthday! 🎂",
    message: "The day is finally here! Wishing you the most magical birthday. I'm so grateful for you. Let's make this year amazing! 🎉",
    images: [
      "images/img1.jpg", "images/img2.jpg", "images/img3.jpg", "images/img4.jpg", "images/img5.jpg",
      "images/img6.jpg", "images/img7.jpg", "images/img8.jpg", "images/img9.jpg", "images/img10.jpg",
      "images/img11.jpg", "images/img12.jpg", "images/img13.jpg", "images/img14.jpg", "images/img15.jpg",
      "images/img16.jpg", "images/img17.jpg", "images/img18.jpg", "images/img19.jpg", "images/img20.jpg",
      "images/img21.jpg", "images/img22.jpg", "images/img23.jpg", "images/img24.jpg", "images/img25.jpg",
      "images/img26.jpg", "images/img27.jpg", "images/img28.jpg"
    ],
    video: ["images/vid1.mp4", "images/vid2.mp4"],
    audio: ""
  }
};

const BIRTHDAY_MONTH = 1; // February (0-indexed)
const BIRTHDAY_DAY = 15;

// --- Carousel State --- 
let currentLevelId = null;
let currentSlideIndex = 0;

// --- Login Logic ---
function login() {
  const nameInput = document.getElementById("username").value.trim();
  const dateInput = document.getElementById("user-birthday").value;

  if (!nameInput || !dateInput) {
    alert("Please fill in both to enter! 🎀");
    return;
  }

  // Strict Check for "Rethisha" and "Feb 21, 2006"
  const enteredDate = new Date(dateInput);
  const enteredMonth = enteredDate.getMonth(); // 0-indexed
  const enteredDay = enteredDate.getDate();
  const enteredYear = enteredDate.getFullYear();

  if (nameInput.toLowerCase() !== "rethisha") {
    alert("Sorry, this surprise is only for Rethisha! 🚫");
    return;
  }

  // Check if birthday is Feb 21, 2006
  if (enteredYear !== 2006 || enteredMonth !== 1 || enteredDay !== 15) {
    alert("That doesn't look like the right special day! 🎂 (Hint: Your birthday date and year)");
    return;
  }

  localStorage.setItem("userName", "Rethisha"); // Store proper casing
  localStorage.setItem("userBirthday", dateInput);

  document.getElementById("login-overlay").classList.add("hidden");
  personalizeUI("Rethisha");
  updateLockedState();
}

function checkLogin() {
  localStorage.removeItem("userName");
  localStorage.removeItem("userBirthday");
  document.getElementById("login-overlay").classList.remove("hidden");
}

function personalizeUI(name) {
  document.getElementById("main-title").innerText = `💌 Open When Kuttyma Needs It`;
}

// --- Date & Lock Logic ---
function checkDate() {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentDay = today.getDate();

  // Strict check: Only unlock if TODAY is Feb 21
  if (currentMonth === BIRTHDAY_MONTH && currentDay === BIRTHDAY_DAY) {
    return true;
  }

  return false;
}

function updateLockedState() {
  const isBirthday = checkDate();
  const level3Card = document.getElementById("level-3");
  const statusText = document.getElementById("birthday-status");

  if (isBirthday) {
    level3Card.classList.remove("locked");
    statusText.innerText = "Unlocked!";
    statusText.style.color = "#4CAF50";
    statusText.style.background = "#e8f5e9";
  } else {
    level3Card.classList.add("locked");
    statusText.innerText = "Locked until Feb 21";
  }
}

// --- Flip Interaction ---
function flipCard(levelId) {
  const isBirthday = checkDate();

  if (levelId === 3 && !isBirthday) {
    // Shake effect (handled by CSS on locked card hover usually,
    // but we can add a transient class for mobile tap)
    const card = document.getElementById(`level-${levelId}`);
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);
    return;
  }

  // Toggle Flip
  const card = document.getElementById(`level-${levelId}`);
  card.classList.toggle("flipped");

  // Track open
  if (card.classList.contains("flipped")) {
    localStorage.setItem(`level_${levelId}_opened`, 'true');
  }
}

// --- Specific Actions (Inside Flip Card) ---

// Audio Player
// Audio Player Logic
let currentAudio = null;

function toggleAudio(src) {
  const btn = document.getElementById("audio-controls-btn");

  // If audio is already created and matches source
  if (currentAudio && currentAudio.src.includes(src)) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      btn.innerHTML = "Listen to Voice Note 🎧";
    } else {
      currentAudio.play();
      btn.innerHTML = "Pause Voice Note ⏸️";
    }
  } else {
    // New Audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    currentAudio = new Audio(src);

    // Reset button when audio finishes
    currentAudio.onended = () => {
      btn.innerHTML = "Listen to Voice Note 🎧";
    };

    currentAudio.play();
    btn.innerHTML = "Pause Voice Note ⏸️";
  }
}
// Remove old playAudio if unused or keep as alias if needed anywhere else (removing for now as it was only used here)

// Gallery Modal (Level 3)
function openGallery() {
  const modal = document.getElementById("gallery-modal");
  const content = levels[3];

  document.getElementById("gallery-title").innerText = content.title;

  // Clear previous gallery content
  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = "";

  // Populate Grid
  content.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Birthday Memory";
    img.onclick = () => openFullScreen(src); // Click to view full size
    galleryContainer.appendChild(img);
  });

  modal.classList.remove("hidden");
}

let currentVideoIndex = 0;

// Video Modal (Level 3)
function openVideo() {
  const modal = document.getElementById("video-modal");
  const content = levels[3];
  const videoElement = document.getElementById("modal-video");
  const prevBtn = document.getElementById("prev-video-btn");
  const nextBtn = document.getElementById("next-video-btn");

  currentVideoIndex = 0;

  if (Array.isArray(content.video) && content.video.length > 0) {
    videoElement.src = content.video[currentVideoIndex];
    // Show buttons if more than one video
    if (content.video.length > 1) {
      prevBtn.style.display = "inline-block";
      nextBtn.style.display = "inline-block";
    } else {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }
  } else {
    videoElement.src = content.video;
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }

  modal.classList.remove("hidden");
}

function changeVideo(direction) {
  const content = levels[3];
  const videoElement = document.getElementById("modal-video");

  if (!Array.isArray(content.video) || content.video.length <= 1) return;

  currentVideoIndex += direction;

  // Loop functionality
  if (currentVideoIndex < 0) {
    currentVideoIndex = content.video.length - 1;
  } else if (currentVideoIndex >= content.video.length) {
    currentVideoIndex = 0;
  }

  videoElement.src = content.video[currentVideoIndex];
  videoElement.play();
}


function closeModal(modalId) {
  if (modalId) {
    document.getElementById(modalId).classList.add("hidden");

    // Stop Video if closing video modal
    if (modalId === 'video-modal') {
      const videoElement = document.getElementById("modal-video");
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.src = "";
    }
  } else {
    // Fallback or close all
    document.querySelectorAll('.popup').forEach(el => el.classList.add("hidden"));
  }

  currentLevelId = null;
}

// Full Screen View Logic
function openFullScreen(src) {
  const fsView = document.getElementById("fullscreen-view");
  const fsImg = document.getElementById("fullscreen-img");

  fsImg.src = src;
  fsView.classList.remove("hidden");
}

function closeFullScreen() {
  const fsView = document.getElementById("fullscreen-view");
  fsView.classList.add("hidden");
  setTimeout(() => {
    document.getElementById("fullscreen-img").src = "";
  }, 300); // Clear after transition
}

function resetApp() {
  if (confirm("Are you sure you want to reset? This will clear the name and lock status.")) {
    localStorage.clear();
    location.reload();
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  updateLockedState();
});
