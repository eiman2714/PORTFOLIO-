// ==================== LOADER ====================
window.addEventListener('load', () => {
    document.getElementById('loader').classList.add('hidden');
});

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .project-card, .skill-card-3d').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
});

// ==================== NAV TOGGLE ====================
document.querySelector('.menu-icon').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('open');
    });
});

// ==================== PARTICLES ====================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 139, 160, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update();
        p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ==================== TYPING EFFECT ====================
const typeText = document.getElementById('typeText');
const phrases = ['Computer Science Student | Front-End Developer', 'Creative Problem Solver', 'UI/UX Enthusiast', 'Lifelong Learner'];
let phraseIndex = 0,
    charIndex = 0,
    isDeleting = false;

function typeEffect() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typeText.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) { isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeEffect, 500); return; }
        setTimeout(typeEffect, 60);
    } else {
        typeText.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) { isDeleting = true;
            setTimeout(typeEffect, 1500); return; }
        setTimeout(typeEffect, 100);
    }
}
setTimeout(typeEffect, 1000);

// ==================== SKILLS PROGRESS ====================
const skillSection = document.querySelector('.skills');
let animated = false;
window.addEventListener('scroll', () => {
    const rect = skillSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100 && !animated) {
        animated = true;
        document.querySelectorAll('.progress').forEach(el => {
            el.style.width = el.dataset.width;
        });
    }
});

// ==================== CALCULATOR ====================
let calcDisplay = document.getElementById('calcDisplay');
let calcExpression = '';

function updateCalcDisplay() {
    calcDisplay.textContent = calcExpression || '0';
}

function calcNumber(num) {
    calcExpression += num;
    updateCalcDisplay();
}

function calcOperator(op) {
    calcExpression += ' ' + op + ' ';
    updateCalcDisplay();
}

function calcClear() {
    calcExpression = '';
    updateCalcDisplay();
}

function calcDelete() {
    calcExpression = calcExpression.slice(0, -1);
    updateCalcDisplay();
}

function calcResult() {
    try {
        calcExpression = eval(calcExpression.replace(/×/g, '*').replace(/÷/g, '/')).toString();
    } catch {
        calcExpression = 'Error';
    }
    updateCalcDisplay();
}

function openCalculator(e) {
    e.preventDefault();
    document.getElementById('calculatorModal').classList.add('active');
}

function closeCalculator() {
    document.getElementById('calculatorModal').classList.remove('active');
}

// ==================== MUSIC PLAYER ====================
let musicPlaying = false;
let musicCurrent = 0;
const tracks = [
    { title: 'Soft Melody', artist: 'Eiman\'s Pick', duration: 210 },
    { title: 'Chill Vibes', artist: 'Study Beats', duration: 180 },
    { title: 'Dreamy Night', artist: 'Relaxation', duration: 240 }
];

function updateMusicUI() {
    const t = tracks[musicCurrent];
    document.getElementById('musicTitle').textContent = t.title;
    document.getElementById('musicArtist').textContent = t.artist;
    document.getElementById('musicDuration').textContent = Math.floor(t.duration / 60) + ':' + String(t.duration % 60).padStart(2, '0');
}

function musicToggle() {
    musicPlaying = !musicPlaying;
    document.getElementById('playBtn').innerHTML = musicPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    if (musicPlaying) {
        let progress = 0;
        const interval = setInterval(() => {
            if (!musicPlaying) { clearInterval(interval); return; }
            progress += 0.5;
            if (progress > 100) { progress = 0;
                musicNext(); }
            document.getElementById('musicProgressFill').style.width = progress + '%';
            const totalSec = tracks[musicCurrent].duration;
            const currentSec = Math.floor(progress / 100 * totalSec);
            document.getElementById('musicCurrentTime').textContent =
                Math.floor(currentSec / 60) + ':' + String(currentSec % 60).padStart(2, '0');
        }, 500);
        window._musicInterval = interval;
    } else {
        if (window._musicInterval) clearInterval(window._musicInterval);
    }
}

function musicPrev() {
    musicCurrent = (musicCurrent - 1 + tracks.length) % tracks.length;
    updateMusicUI();
    if (musicPlaying) { musicToggle();
        musicToggle(); }
}

function musicNext() {
    musicCurrent = (musicCurrent + 1) % tracks.length;
    updateMusicUI();
    if (musicPlaying) { musicToggle();
        musicToggle(); }
}

function openMusicPlayer(e) {
    e.preventDefault();
    document.getElementById('musicModal').classList.add('active');
    updateMusicUI();
}

function closeMusicPlayer() {
    document.getElementById('musicModal').classList.remove('active');
    if (musicPlaying) musicToggle();
}

// ==================== OTHER PROJECT DEMOS ====================
function openMarket(e) {
    e.preventDefault();
    alert('🚀 Full Omni Market demo coming soon!');
}

function openQuiz(e) {
    e.preventDefault();
    alert('🧠 Quiz Web demo coming soon!');
}

function openWeather(e) {
    e.preventDefault();
    alert('🌤️ Weather Web demo coming soon!');
}

// ==================== CONTACT FORM ====================
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ Thank you! Your message has been sent. I\'ll get back to you soon.');
    this.reset();
});

// ==================== RESUME ====================
document.getElementById('resumeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    alert('📄 Download Resume: Your resume will be available soon.');
});

// ==================== VOLUME SLIDER ====================
document.getElementById('volumeSlider').addEventListener('input', function() {
    // Visual feedback only
});