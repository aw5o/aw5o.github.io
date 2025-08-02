document.addEventListener('DOMContentLoaded', () => {
  simulateLoading();
  
  // Initialize only if we're on the purchase page
  if (document.getElementById("step-tos")) {
    initTurboPurchase();
  }
  
  // Add navigation event listeners
  const goToHomeBtn = document.getElementById("goToHome");
  if (goToHomeBtn) {
    goToHomeBtn.addEventListener("click", function() {
      window.location.href = "../index.html";
    });
  }
  
  const goHomeBtn = document.getElementById("go-home");
  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", function() {
      window.location.href = "../index.html";
    });
  }
});

let currentStep = 1;
let secretCatchphrase = '';

function simulateLoading() {
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".loader-progress");
  const body = document.body;

  // Start loading state
  body.classList.add("loading");

  // Simulate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        body.classList.remove("loading");
        body.classList.add("loaded");

        const mainContent = document.querySelector(".main-content");
        if (mainContent) {
          mainContent.classList.add("visible");
        }
      }, 50);
    }
  }, 20);
}

function initCarousel() {
  const track = document.querySelector(".game-slider-track");
  if (track) {
    const slides = track.querySelectorAll(".game-logo");
    slides.forEach((slide) => {
      track.appendChild(slide.cloneNode(true));
    });
    
    track.style.animation = "scroll 30s linear infinite";
  }
}

function animateCounters() {
  const counters = document.querySelectorAll(".hero-stats-number");
  const speed = 10000;

  counters.forEach(counter => {
    const target = +counter.getAttribute("data-count");
    let count = 0;
    const increment = target / speed;

    const formatNumber = (num) => {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
      return Math.floor(num).toString();
    };

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = formatNumber(count);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = formatNumber(target);
      }
    };

    updateCount();
  });
}

// Navigation System
function navigateTo(sectionId) {
  // Hide all sections
  document.querySelectorAll('.main-content').forEach(section => {
    section.classList.remove('visible');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('visible');
    
    // Show back button if not on home
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.style.display = sectionId === 'home' ? 'none' : 'block';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
}

// Back to Home
function backToHome() {
    document.querySelectorAll('.main-content').forEach(section => {
    section.classList.remove('visible');
  });
  
  // Show home section
  document.getElementById('home').classList.add('visible');
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Accordion initialization
document.addEventListener('DOMContentLoaded', function() {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.querySelector('i').classList.toggle('fa-chevron-down');
      this.querySelector('i').classList.toggle('fa-chevron-up');
    });
  });
});

// Turbo purchase flow
function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show requested step
  let stepElement;
  switch(stepNumber) {
    case 1: stepElement = document.getElementById('step-tos'); break;
    case 2: stepElement = document.getElementById('step-catchphrase'); break;
    case 3: stepElement = document.getElementById('step-payment'); break;
  }
  
  if (stepElement) {
    stepElement.classList.add('active');
    
    // Update payment step with current catchphrase
    if (stepNumber === 3 && secretCatchphrase) {
      document.getElementById('payment-catchphrase').textContent = secretCatchphrase;
    }
  }
  
  // Update progress bar
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    const percentage = stepNumber === 1 ? 0 : stepNumber === 2 ? 50 : 100;
    progressBar.style.width = `${percentage}%`;
  }
  
  // Update step indicators
  document.querySelectorAll('.step-bubble').forEach((bubble, index) => {
    bubble.classList.toggle('active', index < stepNumber);
  });
  
  currentStep = stepNumber;
}

function initTurboPurchase() {
  // Step 1: TOS agreement
  const tosScroll = document.getElementById('tos-scroll');
  const agreeButton = document.getElementById('agree-btn');
  
  if (tosScroll && agreeButton) {
    // Create a sentinel element at the bottom of the TOS
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    tosScroll.appendChild(sentinel);
    
    // Use Intersection Observer to detect when sentinel is visible
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      agreeButton.disabled = !entry.isIntersecting;
    }, {
      root: tosScroll,
      threshold: 1.0
    });
    
    observer.observe(sentinel);
    
    // Add event listener for agreement
    agreeButton.addEventListener('click', function() {
      showStep(2);
    });
  }

  // Step 2: Catchphrase
  const catchphraseInput = document.getElementById('catchphrase-input');
  const continueButton = document.getElementById('continue-to-payment');
  
  if (catchphraseInput && continueButton) {
    catchphraseInput.addEventListener('input', function() {
      const isValid = /^[a-z0-9-]{4,12}$/.test(this.value);
      continueButton.disabled = !isValid;
      
      if (isValid) {
        secretCatchphrase = this.value;
        this.classList.remove('is-invalid');
      } else {
        this.classList.add('is-invalid');
      }
    });
    
    // Add event listener for continue button
    continueButton.addEventListener('click', function() {
      if (!secretCatchphrase) {
        alert('Please create a valid secret catchphrase');
        return;
      }
      showStep(3);
    });
  }
  
  // Step 3: Payment - UPDATED SOLUTION
  const payButton = document.getElementById('pay-now');
  if (payButton) {
    payButton.addEventListener('click', function() {
      if (!secretCatchphrase) {
        alert('Please create a secret catchphrase first');
        showStep(2);
        return;
      }
      
      // Direct redirect with correct field ID
      const paymentUrl = 'https://buy.stripe.com/test_3cI5kDb1v65V5Kl7y6g3601';
      const fullUrl = `${paymentUrl}?prefilled_fields[condomsecretkey]=${encodeURIComponent(secretCatchphrase)}`;
      window.location.href = fullUrl;
    });
  }
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', function() {
  simulateLoading();
  
  // Initialize purchase flow only if on purchase page
  if (document.getElementById("turbo")) {
    initTurboPurchase();
  }
  
  // Navigation handlers
  const goToHome = document.getElementById("goToHome");
  if (goToHome) {
    goToHome.addEventListener("click", function() {
      window.location.href = "../index.html";
    });
  }
  
  const goHome = document.getElementById("go-home");
  if (goHome) {
    goHome.addEventListener("click", function() {
      window.location.href = "../index.html";
    });
  }
});