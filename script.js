// Main application entry point
import { initializeNaicsSearch } from './naics-search.js';
import { calculateTax } from './tax-calculator.js';
import { initializeDeadlineCountdown } from './deadline-manager.js';
import { initializeRevenueStreams } from './revenue-stream-manager.js';

let currentTheme = localStorage.getItem('theme') || 'dark';

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNaicsSearch();
    initializeRevenueStreams();
    calculateTax();
    initializeDeadlineCountdown();
    setupThemeToggle();
    setupSparkAnimation();
});

function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        toggleTheme();
        triggerSparkAnimation();
    });
}

function toggleTheme() {
    const themes = ['dark', 'light', 'night'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    
    currentTheme = themes[nextIndex];
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (!themeIcon) return;

    const icons = {
        dark: '🌙',
        light: '☀️',
        night: '🌟'
    };

    themeIcon.textContent = icons[currentTheme];
}

function setupSparkAnimation() {
    const canvas = document.getElementById('spark-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    window.sparkAnimation = {
        canvas,
        ctx,
        particles: [],
        animationId: null
    };
}

function triggerSparkAnimation() {
    const { canvas, ctx, particles } = window.sparkAnimation;
    if (!canvas || !ctx) return;

    // Clear existing particles and animation
    particles.length = 0;
    if (window.sparkAnimation.animationId) {
        cancelAnimationFrame(window.sparkAnimation.animationId);
    }

    // Create spark particles
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 20; i++) {
        particles.push({
            x: centerX,
            y: centerY,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            decay: Math.random() * 0.02 + 0.02,
            size: Math.random() * 3 + 1,
            hue: Math.random() * 60 + (currentTheme === 'night' ? 240 : currentTheme === 'light' ? 200 : 220)
        });
    }

    animateSparkles();
}

function animateSparkles() {
    const { canvas, ctx, particles } = window.sparkAnimation;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        const alpha = particle.life;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 70%)`;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    if (particles.length > 0) {
        window.sparkAnimation.animationId = requestAnimationFrame(animateSparkles);
    }
}
