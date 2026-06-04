/* ============================================
   TIDY & CHIC CLEANING SERVICES - MAIN JS
   ============================================ */

// ============================================
// TYPING ANIMATION
// ============================================

const typingTexts = [
  'Professional Laundry Services',
  'Express Laundry Delivery',
  'Dry Cleaning Services',
  'Bulk Laundry Solutions',
  'Corporate Laundry Services',
  'Ironing & Folding Services',
  'Pickup & Delivery Services',
  'Premium Garment Care',
  'Residential Laundry Services',
  'Commercial Laundry Services'
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 80;
const deletingSpeed = 40;
const delayBetweenWords = 2000;

function typeAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const currentText = typingTexts[currentTextIndex];
  
  if (!isDeleting && currentCharIndex < currentText.length) {
    typingElement.textContent += currentText.charAt(currentCharIndex);
    currentCharIndex++;
    setTimeout(typeAnimation, typingSpeed);
  } else if (isDeleting && currentCharIndex > 0) {
    typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
    currentCharIndex--;
    setTimeout(typeAnimation, deletingSpeed);
  } else if (!isDeleting && currentCharIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeAnimation, delayBetweenWords);
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
    setTimeout(typeAnimation, 500);
  }
}

// ============================================
// NAVIGATION & MOBILE MENU
// ============================================

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================

function updateActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    if (currentPath.includes(href.replace('.html', '')) || 
        (currentPath.endsWith('/') && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phone) {
  // Nigerian phone format or international
  const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showErrorMessage(element, message) {
  const errorDiv = element.querySelector('.error-message') || 
                   (() => {
                     const div = document.createElement('div');
                     div.className = 'error-message';
                     element.appendChild(div);
                     return div;
                   })();
  
  errorDiv.textContent = message;
  errorDiv.classList.add('show');
}

function clearErrorMessage(element) {
  const errorDiv = element.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.classList.remove('show');
  }
}

function showSuccessNotification(message = 'Form submitted successfully!') {
  const notification = document.createElement('div');
  notification.className = 'success-message';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function validateForm(form) {
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;

  inputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    clearErrorMessage(formGroup);
    
    if (!input.value.trim()) {
      showErrorMessage(formGroup, 'This field is required');
      isValid = false;
      return;
    }

    // Email validation
    if (input.type === 'email' || input.name.includes('email')) {
      if (!validateEmail(input.value)) {
        showErrorMessage(formGroup, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Phone validation
    if (input.name.includes('phone') || input.name.includes('Phone')) {
      if (!validatePhoneNumber(input.value)) {
        showErrorMessage(formGroup, 'Please enter a valid phone number');
        isValid = false;
      }
    }
  });

  // Check for at least one selected radio button (for service type)
  const radioGroups = new Set();
  form.querySelectorAll('input[type="radio"]').forEach(radio => {
    radioGroups.add(radio.name);
  });

  radioGroups.forEach(groupName => {
    const checkedRadio = form.querySelector(`input[name="${groupName}"]:checked`);
    if (!checkedRadio) {
      const radioContainer = form.querySelector(`input[name="${groupName}"]`).closest('.service-options') || 
                            form.querySelector(`input[name="${groupName}"]`).parentElement;
      if (radioContainer) {
        showErrorMessage(radioContainer.parentElement, `Please select a ${groupName.replace(/_/g, ' ')}`);
      }
      isValid = false;
    }
  });

  return isValid;
}

// Handle all form submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm(form)) {
      // Prepare form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Log to console (in production, this would be sent to a backend)
      console.log('Form Data:', data);
      
      // Show success message
      const successMsg = form.dataset.successMessage || 'Form submitted successfully!';
      showSuccessNotification(successMsg);
      
      // Reset form
      form.reset();
      
      // Clear any error messages
      form.querySelectorAll('.error-message').forEach(msg => {
        msg.classList.remove('show');
      });
    } else {
      showSuccessNotification.call = () => {};
      // Scroll to first error
      const firstError = form.querySelector('.error-message.show');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.service-card, .feature-item, .testimonial-card').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'all 0.6s ease';
  observer.observe(element);
});

// ============================================
// SMOOTH SCROLLING ENHANCEMENT
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// DATE & TIME INPUT VALIDATION
// ============================================

// Restrict date picker to today and future dates
document.querySelectorAll('input[type="date"]').forEach(input => {
  const today = new Date().toISOString().split('T')[0];
  input.min = today;
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Start typing animation
  typeAnimation();
  
  // Update active navigation
  updateActiveNav();
  
  // Animate hero content on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '1';
  }
});

// ============================================
// SMOOTH FADE-IN ON PAGE LOAD
// ============================================

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// Ensure body starts slightly transparent
if (document.readyState === 'loading') {
  document.body.style.opacity = '0';
} else {
  document.body.style.opacity = '1';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format phone number as user types
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 0) {
    if (value.startsWith('234')) {
      value = '0' + value.slice(3);
    }
    // Format: 0801 234 5678
    if (value.length <= 4) {
      value = value;
    } else if (value.length <= 7) {
      value = value.slice(0, 4) + ' ' + value.slice(4);
    } else {
      value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 11);
    }
  }
  input.value = value;
}

// Apply phone number formatting to phone inputs
document.querySelectorAll('input[name*="phone"], input[name*="Phone"]').forEach(input => {
  input.addEventListener('input', () => formatPhoneNumber(input));
});

// ============================================
// HASH-BASED NAVIGATION SUPPORT
// ============================================

window.addEventListener('hashchange', updateActiveNav);
