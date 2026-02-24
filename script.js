/* ============================================
   GEN AI IN CLIMATE — PRESENTATION SCRIPT
   ============================================ */

(function () {
  'use strict';

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isTransitioning = false;

  const progressBar = document.getElementById('progressBar');
  const slideNav = document.getElementById('slideNav');
  const slideCounter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const keyboardHint = document.getElementById('keyboardHint');

  // ---- Build navigation dots ----
  function buildNav() {
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('title', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      slideNav.appendChild(dot);
    });
  }
  buildNav();

  // ---- Update UI state ----
  function updateUI() {
    // Progress bar
    const pct = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = pct + '%';

    // Dots
    slideNav.querySelectorAll('.slide-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Counter
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

    // Arrow states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
  }

  // ---- Navigate to slide ----
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides || index === currentSlide || isTransitioning) return;

    isTransitioning = true;
    const direction = index > currentSlide ? 'next' : 'prev';
    const oldSlide = slides[currentSlide];
    const newSlide = slides[index];

    // Exit old slide
    oldSlide.classList.remove('active');
    oldSlide.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');

    // Prepare new slide entrance direction
    newSlide.style.transform = direction === 'next' ? 'translateX(60px)' : 'translateX(-60px)';
    newSlide.classList.add('active');

    // Clean up after transition
    setTimeout(() => {
      oldSlide.classList.remove('exit-left', 'exit-right');
      newSlide.style.transform = '';
      isTransitioning = false;
    }, 600);

    currentSlide = index;
    updateUI();

    // Hide keyboard hint after first navigation
    if (keyboardHint) {
      keyboardHint.classList.add('hidden');
    }
  }

  // ---- Expose goToSlide globally (for cover card clicks) ----
  window.goToSlide = goToSlide;

  // ---- Arrow button handlers ----
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // ---- Keyboard navigation ----
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        goToSlide(currentSlide + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        goToSlide(currentSlide - 1);
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  });

  // ---- Touch/swipe support ----
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  }, { passive: true });

  // ---- Mouse wheel navigation ----
  let wheelTimeout = null;
  document.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    
    if (e.deltaY > 30) {
      goToSlide(currentSlide + 1);
    } else if (e.deltaY < -30) {
      goToSlide(currentSlide - 1);
    }

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 800);
  }, { passive: true });

  // ---- Auto-hide keyboard hint ----
  setTimeout(() => {
    if (keyboardHint) {
      keyboardHint.classList.add('hidden');
    }
  }, 6000);

  // Initialize
  updateUI();
})();
