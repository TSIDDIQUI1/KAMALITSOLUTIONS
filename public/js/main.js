/* Kamal IT Solutions - Main JavaScript File */

// ============================================
// DOM CONTENT LOADED
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initNavigation();
  initScrollEffects();
  initAnimations();
  initContactForm();
  initSmoothScroll();
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const header = document.querySelector(".header");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (mobileToggle) {
        mobileToggle.classList.remove("active");
      }
      if (navMenu) {
        navMenu.classList.remove("active");
      }
    });
  });

  // Header scroll effect
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Active link based on scroll position
  updateActiveNavLink();
}

// Update active navigation link
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    },
    { passive: true }
  );
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initScrollEffects() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .service-card, .team-card, .testimonial-card"
  );
  animatedElements.forEach((el) => observer.observe(el));

  // Parallax effect for hero shapes
  const heroShapes = document.querySelectorAll(".hero-shape");
  if (heroShapes.length > 0) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      heroShapes.forEach((shape, index) => {
        const speed = 0.1 * (index + 1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }
}

// ============================================
// ANIMATIONS
// ============================================

function initAnimations() {
  // Counter animation for stats
  const counters = document.querySelectorAll(".hero-stat-number");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }
}

// Animate counter
function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/\D/g, ""));
  const suffix = element.textContent.replace(/[0-9]/g, "");
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuad = (t) => t * (2 - t);
    const current = Math.floor(
      start + (target - start) * easeOutQuad(progress)
    );

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!validateForm(data)) {
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      const response = await submitForm(data);

      if (response.success) {
        showNotification(
          "success",
          "Message sent successfully! We will get back to you soon."
        );
        contactForm.reset();
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Real-time validation
  const inputs = contactForm.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.parentElement.classList.contains("error")) {
        validateField(this);
      }
    });
  });
}

// Validate form data
function validateForm(data) {
  let isValid = true;
  const requiredFields = ["name", "email", "subject", "message"];

  requiredFields.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

// Validate individual field
function validateField(input) {
  const formGroup = input.closest(".form-group");
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Remove previous error/success states
  formGroup.classList.remove("error", "success");
  const existingError = formGroup.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Required validation
  if (input.hasAttribute("required") && !value) {
    isValid = false;
    errorMessage = "This field is required";
  }

  // Email validation
  if (input.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
  }

  // Phone validation (if present)
  if (input.type === "tel" && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid phone number";
    }
  }

  // Min length validation
  if (input.minLength && value.length < input.minLength) {
    isValid = false;
    errorMessage = `Must be at least ${input.minLength} characters`;
  }

  // Apply validation result
  if (!isValid) {
    formGroup.classList.add("error");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = errorMessage;
    formGroup.appendChild(errorDiv);
  } else if (value) {
    formGroup.classList.add("success");
  }

  return isValid;
}

// Submit form to server
async function submitForm(data) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const headerHeight =
          document.querySelector(".header")?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(type, message) {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${
              type === "success" ? "✓" : "✕"
            }</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 20px;
        background-color: ${type === "success" ? "#34a853" : "#ea4335"};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

  // Add animation keyframes
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Add to document
  document.body.appendChild(notification);

  // Close button event
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Get viewport dimensions
function getViewport() {
  return {
    width: Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    ),
    height: Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    ),
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );

  images.forEach((img) => imageObserver.observe(img));
}

// ============================================
// ACCESSIBILITY
// ============================================

// Initialize accessibility features
function initAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main";
  skipLink.className = "skip-link";
  skipLink.textContent = "Skip to main content";
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #1a73e8;
        color: white;
        padding: 8px 16px;
        z-index: 10000;
        transition: top 0.3s;
    `;

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "0";
  });

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // Focus trap for modals (if needed)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal.active");
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

// Initialize accessibility on load
document.addEventListener("DOMContentLoaded", initAccessibility);

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initNavigation,
    initScrollEffects,
    initAnimations,
    initContactForm,
    initSmoothScroll,
    showNotification,
    validateForm,
    validateField,
  };
}
