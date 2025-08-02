// Global state
let currentStep = 1;
let secretCatchphrase = "";

// Loader
function simulateLoading() {
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".loader-progress");
  const body = document.body;

  body.classList.add("loading");
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
        document.querySelector(".main-content")?.classList.add("visible");
      }, 50);
    }
  }, 20);
}

// Carousel duplicator
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

// Animated stats
function animateCounters() {
  const counters = document.querySelectorAll(".hero-stats-number");
  const speed = 10000;

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-count");
    let count = 0;
    const increment = target / speed;

    const formatNumber = (num) => {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
      if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
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

// Section navigation
function navigateTo(sectionId) {
  document.querySelectorAll(".main-content").forEach((section) => {
    section.classList.remove("visible");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("visible");
    const backButton = document.getElementById("back-button");
    if (backButton) {
      backButton.style.display = sectionId === "home" ? "none" : "block";
    }
    window.scrollTo(0, 0);
  }
}

function backToHome() {
  // Check if we're on a standalone page (buy.html/success.html) or index.html
  if (document.getElementById("home")) {
    // We're on index.html - show home section
    document.querySelectorAll(".main-content").forEach((section) => {
      section.classList.remove("visible");
    });
    document.getElementById("home")?.classList.add("visible");
    window.scrollTo(0, 0);
  } else {
    // We're on a standalone page - redirect to index
    window.location.href = "../index.html";
  }
}

// Turbo logic
function showStep(stepNumber) {
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
  });

  let stepElement;
  switch (stepNumber) {
    case 1: stepElement = document.getElementById("step-tos"); break;
    case 2: stepElement = document.getElementById("step-catchphrase"); break;
    case 3: stepElement = document.getElementById("step-payment"); break;
  }

  if (stepElement) {
    stepElement.classList.add("active");
    if (stepNumber === 3 && secretCatchphrase) {
      document.getElementById("payment-catchphrase").textContent = secretCatchphrase;
    }
  }

  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    const percentage = stepNumber === 1 ? 0 : stepNumber === 2 ? 50 : 100;
    progressBar.style.width = `${percentage}%`;
  }

  document.querySelectorAll(".step-bubble").forEach((bubble, index) => {
    bubble.classList.toggle("active", index < stepNumber);
  });

  currentStep = stepNumber;
}

function initTurboPurchase() {
  const tosScroll = document.getElementById("tos-scroll");
  const agreeButton = document.getElementById("agree-btn");

  if (tosScroll && agreeButton) {
    agreeButton.disabled = true;
    setTimeout(() => { tosScroll.scrollTop = 0; }, 100);

    tosScroll.addEventListener("scroll", () => {
      const atBottom = tosScroll.scrollTop + tosScroll.clientHeight >= tosScroll.scrollHeight - 5;
      agreeButton.disabled = !atBottom;
    });

    agreeButton.addEventListener("click", () => showStep(2));
  }

  function updateBackButtonBehavior() {
    const backButton = document.getElementById("goToHome");
    if (!backButton) return;

    const newBackButton = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBackButton, backButton);

    newBackButton.addEventListener("click", () => {
      if (currentStep === 1) backToHome();
      else showStep(currentStep - 1);
    });
  }

  updateBackButtonBehavior();

  const originalShowStep = showStep;
  showStep = function (stepNumber) {
    originalShowStep(stepNumber);
    updateBackButtonBehavior();
  };

  const catchphraseInput = document.getElementById("catchphrase-input");
  const continueButton = document.getElementById("continue-to-payment");

  if (catchphraseInput && continueButton) {
    catchphraseInput.addEventListener("input", function () {
      const isValid = /^[a-z0-9-]{4,12}$/.test(this.value);
      continueButton.disabled = !isValid;

      if (isValid) {
        secretCatchphrase = this.value;
        this.classList.remove("is-invalid");
      } else {
        this.classList.add("is-invalid");
      }
    });

    continueButton.addEventListener("click", () => {
      if (!secretCatchphrase) {
        alert("Please create a valid secret catchphrase");
        return;
      }
      showStep(3);
    });
  }

  const payButton = document.getElementById("pay-now");
  if (payButton) {
    payButton.addEventListener("click", () => {
      if (!secretCatchphrase) {
        alert("Please create a secret catchphrase first");
        showStep(2);
        return;
      }

      const modalHTML = `
      <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Important: Enter Your Secret Phrase</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-warning">
                <strong>Follow these steps:</strong>
                <ol class="mt-2">
                  <li>We're opening the Stripe payment page</li>
                  <li>Look for the <strong>"Condom Secret Key"</strong> field</li>
                  <li>Copy your secret phrase below:</li>
                </ol>
                <div class="input-group mt-3">
                  <input type="text" class="form-control" id="modal-catchphrase" value="${secretCatchphrase}" readonly>
                  <button class="btn btn-primary" id="copy-catchphrase">
                    <i class="fa-regular fa-copy"></i> Copy
                  </button>
                </div>
                <p class="mt-3 mb-0">After copying, paste it into the Stripe form</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="proceed-to-payment">Proceed to Payment</button>
            </div>
          </div>
        </div>
      </div>`;

      document.body.insertAdjacentHTML("beforeend", modalHTML);

      const paymentModal = new bootstrap.Modal(document.getElementById("paymentModal"));
      paymentModal.show();

      document.getElementById("copy-catchphrase").addEventListener("click", function () {
        const copyText = document.getElementById("modal-catchphrase");
        copyText.select();
        document.execCommand("copy");
        const original = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { this.innerHTML = original; }, 2000);
      });

      document.getElementById("proceed-to-payment").addEventListener("click", function () {
        window.open("https://buy.stripe.com/test_3cI5kDb1v65V5Kl7y6g3601", "_blank");
        paymentModal.hide();
      });

      document.getElementById("paymentModal").addEventListener("hidden.bs.modal", function () {
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
        this.remove();
      });
    });
  }
}

// Accordion initialization
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion-button');
  accordions.forEach(accordion => {
    accordion.addEventListener('click', () => {
      accordion.classList.toggle('active');
    });
  });
}

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  simulateLoading();

  setTimeout(() => {
    initCarousel();
    
    // Initialize accordion if it exists
    if (document.querySelector('.accordion')) {
      initAccordion();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);

    if (document.getElementById("turbo")) {
      initTurboPurchase();
    }

    document.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        navigateTo(target);
      });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener("click", backToHome);
    });
    
    // Handle standalone back buttons
    const goToHome = document.getElementById("goToHome");
    if (goToHome) {
      goToHome.addEventListener("click", backToHome);
    }
  }, 1000);
});