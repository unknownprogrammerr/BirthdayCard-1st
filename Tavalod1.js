// --- Main Content Display Logic ---
function showMainContent() {
  const intro = document.getElementById('intro');
  const main = document.getElementById('main');

  // Hide the intro screen
  intro.style.display = 'none';

  // Show the main content
  main.classList.remove('hidden');

  // Set the default theme background when the main content loads
  document.body.classList.add('theme-default');

  startMessageLoop();
  document.getElementById('music').play();
}


// --- Confetti Animation ---
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  for (let i = 0; i < 250; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height, // Start above screen
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      tilt: Math.random() * 10 - 10,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
  }

  function update() {
    confetti.forEach(c => {
      c.y += Math.cos(c.d) + 2; // Make them fall
      c.x += Math.sin(c.d);
      if (c.y > canvas.height) { // Reset when they go off screen
        c.y = 0;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  loop();
}

// --- Balloon Animation ---
function launchBalloons() {
  const container = document.getElementById('balloons');
  container.innerHTML = ''; // Clear existing balloons before launching new ones
  for (let i = 0; i < 20; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon'); // Applies base styling (top, width, height, border-radius)
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
    // Apply the falling animation, duration, and infinite loop
    balloon.style.animation = `fallBalloon ${Math.random() * 5 + 5}s linear infinite`;
    // Add a random delay so they don't all start falling at the exact same moment
    balloon.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(balloon);
  }
}

// --- Message Loop ---
const messages = [
  "Wishing you a day filled with love and joy! 🎈",
  "You're amazing and deserve all the happiness! 🥳",
  "May all your dreams come true! 🌟",
  "Here's to laughter and unforgettable memories! 🧁",
  "Sending hugs, smiles, and lots of cake! 🎂",
  "Hope this year brings you endless light and love! 💖",
  "You're a gift to everyone who knows you! 🎁"
];

let msgIndex = 0;
function startMessageLoop() {
  const msgEl = document.getElementById("messages");
  // Ensure the message changes immediately on load, then loop
  msgEl.innerHTML = `<p>${messages[msgIndex]}</p>`;
  setInterval(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    msgEl.innerHTML = `<p>${messages[msgIndex]}</p>`;
  }, 4000);
}

// --- Replay Button ---
document.getElementById('replay').addEventListener('click', () => {
  document.getElementById('music').currentTime = 0;
  document.getElementById('music').play();
  launchBalloons(); // Start balloons
  startConfetti(); // Start confetti
});

// --- Theme Switcher ---
document.getElementById("theme-selector").addEventListener("change", function () {
  const theme = this.value;
  const body = document.body;

  // Remove all possible theme classes to ensure only one is active
  body.classList.remove('theme-default', 'theme-funny', 'theme-calm');

  switch (theme) {
    case "funny":
      body.classList.add('theme-funny');
      break;
    case "calm":
      body.classList.add('theme-calm');
      break;
    default: // This corresponds to the 'Sweet & Sparkly' option value
      body.classList.add('theme-default');
      break;
  }
});


// --- Funny Click Game Intro Logic ---
const funnyButton = document.getElementById('funny-button');
const clickCounter = document.getElementById('click-counter');
const introScreen = document.getElementById('intro'); // Get the intro screen element
const clickGameContainer = document.querySelector('.click-game-container'); // Get the game container for positioning hearts

let clicksRemaining = 10; // Number of clicks required

funnyButton.addEventListener('click', (event) => {
  if (clicksRemaining > 0) {
    clicksRemaining--;
    clickCounter.textContent = `Clicks: ${10 - clicksRemaining} / 10`;

    // Basic animation feedback for each click
    funnyButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      funnyButton.style.transform = 'scale(1)';
    }, 100);

    // --- Generate Heart Sparkle ---
    const heart = document.createElement('span');
    heart.classList.add('heart-sparkle');
    heart.textContent = '❤️'; // Unicode heart emoji

    // Get the position of the click relative to the click-game-container
    const containerRect = clickGameContainer.getBoundingClientRect();
    const clickX = event.clientX - containerRect.left;
    const clickY = event.clientY - containerRect.top;

    // Position the heart relative to the click-game-container
    heart.style.left = `${clickX}px`;
    heart.style.top = `${clickY}px`;

    // Random end position for the heart for a scattered effect relative to its starting point
    const randomXOffset = (Math.random() - 0.5) * 100; // -50 to +50px horizontal displacement
    const randomYOffset = -50 - (Math.random() * 50); // -50 to -100px vertical displacement (always upwards)
    heart.style.setProperty('--end-x-offset', `${randomXOffset}px`);
    heart.style.setProperty('--end-y-offset', `${randomYOffset}px`);

    clickGameContainer.appendChild(heart); // Append the heart to the container

    // Remove the heart after its animation finishes
    heart.addEventListener('animationend', () => {
      heart.remove();
    });
    // --- End Heart Sparkle ---

    if (clicksRemaining === 0) {
      // Game completed!
      clickCounter.textContent = "Let's go!";
      funnyButton.textContent = "🥳"; // Change button text to an emoji

      // Trigger final animation (e.g., button shrinks and intro fades)
      funnyButton.style.transform = 'scale(0)';
      funnyButton.style.opacity = '0';
      funnyButton.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

      introScreen.style.opacity = '0'; // Start fading out the intro screen
      introScreen.style.visibility = 'hidden'; // Hide it after fade

      // After a short delay (to allow animation to play), show main content
      setTimeout(() => {
        showMainContent();
      }, 1000); // 1 second delay for the intro fade-out animation
    }
  }
});