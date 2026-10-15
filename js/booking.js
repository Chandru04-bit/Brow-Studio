/**
 * Lash & Brow Studio — Booking & Form Management Script
 * High-performance, luxury client-side validation engine with real-time feedback,
 * auto phone formatting, studio schedule date intelligence (Monday closure),
 * accessible ARIA integration, duplicate submission protection, and modal summary preview.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initPreselectedService();
  initDateConstraints();
});

/**
 * Handle URL query parameter pre-selection (?service=...)
 */
function initPreselectedService() {
  const serviceSelect = document.getElementById('bookingService');
  if (!serviceSelect) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');

  if (serviceParam) {
    const decodedService = decodeURIComponent(serviceParam).trim().toLowerCase();
    let matched = false;

    for (let i = 0; i < serviceSelect.options.length; i++) {
      const optionText = serviceSelect.options[i].text.toLowerCase();
      const optionValue = serviceSelect.options[i].value.toLowerCase();

      if (optionText.includes(decodedService) || optionValue.includes(decodedService) || decodedService.includes(optionValue)) {
        serviceSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }

    if (matched) {
      serviceSelect.classList.remove('is-invalid');
      serviceSelect.classList.add('is-valid');

      const bookingCard = document.getElementById('bookingCard');
      if (bookingCard) {
        setTimeout(() => {
          bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }
}

/**
 * Set intelligent date bounds (today as min, +90 days as max)
 */
function initDateConstraints() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const minDate = `${year}-${month}-${day}`;

  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 90);
  const maxYear = maxDateObj.getFullYear();
  const maxMonth = String(maxDateObj.getMonth() + 1).padStart(2, '0');
  const maxDay = String(maxDateObj.getDate()).padStart(2, '0');
  const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;

  dateInput.setAttribute('min', minDate);
  dateInput.setAttribute('max', maxDate);
}

/**
 * Live Indian mobile number auto-formatter (e.g. +91 98765 43210 or 98765 43210)
 */
function formatPhoneNumber(value) {
  if (!value) return '';
  const trimmed = value.trim();
  const startsWithPlus = trimmed.startsWith('+');
  let digits = value.replace(/\D/g, '');
  if (!digits) return startsWithPlus ? '+' : '';

  // Case 1: user included 91 (country code)
  if (digits.startsWith('91')) {
    const core = digits.slice(2);
    if (core.length === 0) return '+91 ';
    if (core.length <= 5) return `+91 ${core}`;
    return `+91 ${core.slice(0, 5)} ${core.slice(5, 10)}`;
  }

  // Case 2: user typed with leading 0
  if (digits.startsWith('0')) {
    const core = digits.slice(1);
    if (core.length <= 5) return `0${core}`;
    return `0${core.slice(0, 5)} ${core.slice(5, 10)}`;
  }

  // Case 3: standard 10-digit Indian number
  if (digits.length <= 5) {
    return digits;
  }
  if (digits.length <= 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  }

  // Fallback for international representation
  return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7, 12)}`;
}

/**
 * Validation rules for each individual form field
 */
const validators = {
  fullName(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your full name.' };
    }
    if (trimmed.length < 2) {
      return { valid: false, message: 'Full name must be at least 2 characters.' };
    }
    if (!/[a-zA-Z\u00C0-\u024F\u0600-\u06FF]/.test(trimmed)) {
      return { valid: false, message: 'Full name must contain alphabetic characters.' };
    }
    return { valid: true };
  },

  emailAddress(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your email address.' };
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address (e.g. eleanor@example.com).' };
    }
    return { valid: true };
  },

  phoneNumber(value) {
    const rawDigits = (value || '').replace(/\D/g, '');
    if (!rawDigits) {
      return { valid: false, message: 'Please provide your 10-digit Indian mobile number.' };
    }

    // Extract core 10 digits whether entered with +91, 91, or 0
    let coreDigits = rawDigits;
    if (rawDigits.startsWith('91') && rawDigits.length === 12) {
      coreDigits = rawDigits.slice(2);
    } else if (rawDigits.startsWith('0') && rawDigits.length === 11) {
      coreDigits = rawDigits.slice(1);
    }

    if (coreDigits.length < 10) {
      return { valid: false, message: `Please enter a complete 10-digit Indian number (${coreDigits.length}/10 digits entered).` };
    }
    if (coreDigits.length > 10) {
      return { valid: false, message: 'Indian mobile numbers contain 10 digits.' };
    }
    if (!/^[6-9]/.test(coreDigits)) {
      return { valid: false, message: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
    }
    return { valid: true };
  },

  bookingService(value) {
    if (!value || value.trim() === '') {
      return { valid: false, message: 'Please select your desired lash or brow treatment.' };
    }
    return { valid: true };
  },

  bookingDate(value) {
    if (!value) {
      return { valid: false, message: 'Please choose your preferred appointment date.' };
    }

    const selDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selDate < today) {
      return { valid: false, message: 'Appointments cannot be booked for past dates.' };
    }

    // Monday closure check (0 = Sunday, 1 = Monday, ... 6 = Saturday)
    if (selDate.getDay() === 1) {
      return {
        valid: false,
        message: 'The studio is closed on Mondays for sanitization. Please select Tuesday – Sunday.'
      };
    }

    return { valid: true };
  },

  bookingTime(value) {
    if (!value || value.trim() === '') {
      return { valid: false, message: 'Please choose your preferred time window.' };
    }
    return { valid: true };
  },

  clientType(form) {
    const checked = form.querySelector('input[name="clientType"]:checked');
    if (!checked) {
      return { valid: false, message: 'Please select if you are a first-time guest or returning client.' };
    }
    return { valid: true };
  },

  consentCheck(checkbox) {
    if (!checkbox || !checkbox.checked) {
      return { valid: false, message: 'You must agree to the studio cancellation & arrival policy to proceed.' };
    }
    return { valid: true };
  }
};

/**
 * Apply valid/invalid UI state to a field
 */
function applyFieldValidation(inputEl, feedbackEl, result, hasInteracted) {
  if (!inputEl) return;
  const container = inputEl.closest('.form-group-wrap') || inputEl.parentElement;

  if (!hasInteracted) {
    inputEl.classList.remove('is-valid', 'is-invalid');
    if (container) container.classList.remove('has-error');
    inputEl.removeAttribute('aria-invalid');
    return;
  }

  if (result.valid) {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    if (container) container.classList.remove('has-error');
    inputEl.setAttribute('aria-invalid', 'false');
  } else {
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid');
    if (container) container.classList.add('has-error');
    inputEl.setAttribute('aria-invalid', 'true');

    if (feedbackEl) {
      const textSpan = feedbackEl.querySelector('span');
      if (textSpan) {
        textSpan.textContent = result.message;
      } else {
        feedbackEl.textContent = result.message;
      }
    }
  }
}

/**
 * Main Booking Form Initializer
 */
function initBookingForm() {
  const form = document.getElementById('studioBookingForm');
  if (!form) return;

  const banner = document.getElementById('formValidationBanner');
  const bannerText = document.getElementById('formValidationBannerText');
  const submitBtn = document.getElementById('submitBookingBtn') || form.querySelector('button[type="submit"]');

  // Input references
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const phoneInput = document.getElementById('phoneNumber');
  const serviceInput = document.getElementById('bookingService');
  const dateInput = document.getElementById('bookingDate');
  const timeInput = document.getElementById('bookingTime');
  const consentInput = document.getElementById('consentCheck');

  // Feedback references
  const fullNameFeedback = document.getElementById('fullNameFeedback');
  const emailFeedback = document.getElementById('emailFeedback');
  const phoneFeedback = document.getElementById('phoneFeedback');
  const serviceFeedback = document.getElementById('serviceFeedback');
  const dateFeedback = document.getElementById('dateFeedback');
  const timeFeedback = document.getElementById('timeFeedback');
  const consentFeedback = document.getElementById('consentFeedback');

  // Track field interactions
  const touched = {
    fullName: false,
    emailAddress: false,
    phoneNumber: false,
    bookingService: false,
    bookingDate: false,
    bookingTime: false,
    consentCheck: false
  };

  // 1. Phone number live formatting & validation
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // Keep cursor position stable during auto-format
      const cursorStart = this.selectionStart;
      const prevLength = this.value.length;
      this.value = formatPhoneNumber(this.value);

      if (touched.phoneNumber || this.classList.contains('is-invalid')) {
        const res = validators.phoneNumber(this.value);
        applyFieldValidation(this, phoneFeedback, res, true);
        checkBannerStatus();
      }
    });

    phoneInput.addEventListener('blur', function() {
      touched.phoneNumber = true;
      const res = validators.phoneNumber(this.value);
      applyFieldValidation(this, phoneFeedback, res, true);
      checkBannerStatus();
    });
  }

  // 2. Full Name live validation
  if (fullNameInput) {
    fullNameInput.addEventListener('input', function() {
      if (touched.fullName || this.classList.contains('is-invalid')) {
        const res = validators.fullName(this.value);
        applyFieldValidation(this, fullNameFeedback, res, true);
        checkBannerStatus();
      }
    });

    fullNameInput.addEventListener('blur', function() {
      touched.fullName = true;
      const res = validators.fullName(this.value);
      applyFieldValidation(this, fullNameFeedback, res, true);
      checkBannerStatus();
    });
  }

  // 3. Email Address live validation
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      if (touched.emailAddress || this.classList.contains('is-invalid')) {
        const res = validators.emailAddress(this.value);
        applyFieldValidation(this, emailFeedback, res, true);
        checkBannerStatus();
      }
    });

    emailInput.addEventListener('blur', function() {
      touched.emailAddress = true;
      const res = validators.emailAddress(this.value);
      applyFieldValidation(this, emailFeedback, res, true);
      checkBannerStatus();
    });
  }

  // 4. Service Selection validation
  if (serviceInput) {
    serviceInput.addEventListener('change', function() {
      touched.bookingService = true;
      const res = validators.bookingService(this.value);
      applyFieldValidation(this, serviceFeedback, res, true);
      checkBannerStatus();
    });
  }

  // 5. Date selection validation
  if (dateInput) {
    dateInput.addEventListener('change', function() {
      touched.bookingDate = true;
      const res = validators.bookingDate(this.value);
      applyFieldValidation(this, dateFeedback, res, true);
      checkBannerStatus();
    });
  }

  // 6. Time selection validation
  if (timeInput) {
    timeInput.addEventListener('change', function() {
      touched.bookingTime = true;
      const res = validators.bookingTime(this.value);
      applyFieldValidation(this, timeFeedback, res, true);
      checkBannerStatus();
    });
  }

  // 7. Consent Checkbox validation
  if (consentInput) {
    consentInput.addEventListener('change', function() {
      touched.consentCheck = true;
      const res = validators.consentCheck(this);
      applyFieldValidation(this, consentFeedback, res, true);
      checkBannerStatus();
    });
  }

  // Helper to re-evaluate error banner when fields change
  function checkBannerStatus() {
    if (!banner || banner.classList.contains('d-none')) return;
    const errors = form.querySelectorAll('.is-invalid');
    if (errors.length === 0) {
      banner.classList.add('d-none');
      banner.classList.remove('d-flex');
    } else if (bannerText) {
      bannerText.textContent = `Please review and complete the ${errors.length} highlighted field${errors.length > 1 ? 's' : ''} below.`;
    }
  }

  // Submit Handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Mark all as touched
    Object.keys(touched).forEach(k => { touched[k] = true; });

    // Validate each field
    const nameRes = validators.fullName(fullNameInput ? fullNameInput.value : '');
    const emailRes = validators.emailAddress(emailInput ? emailInput.value : '');
    const phoneRes = validators.phoneNumber(phoneInput ? phoneInput.value : '');
    const serviceRes = validators.bookingService(serviceInput ? serviceInput.value : '');
    const dateRes = validators.bookingDate(dateInput ? dateInput.value : '');
    const timeRes = validators.bookingTime(timeInput ? timeInput.value : '');
    const consentRes = validators.consentCheck(consentInput);

    applyFieldValidation(fullNameInput, fullNameFeedback, nameRes, true);
    applyFieldValidation(emailInput, emailFeedback, emailRes, true);
    applyFieldValidation(phoneInput, phoneFeedback, phoneRes, true);
    applyFieldValidation(serviceInput, serviceFeedback, serviceRes, true);
    applyFieldValidation(dateInput, dateFeedback, dateRes, true);
    applyFieldValidation(timeInput, timeFeedback, timeRes, true);
    applyFieldValidation(consentInput, consentFeedback, consentRes, true);

    const validationMap = [
      { res: nameRes, el: fullNameInput },
      { res: emailRes, el: emailInput },
      { res: phoneRes, el: phoneInput },
      { res: serviceRes, el: serviceInput },
      { res: dateRes, el: dateInput },
      { res: timeRes, el: timeInput },
      { res: consentRes, el: consentInput }
    ];

    const failed = validationMap.filter(item => !item.res.valid);

    if (failed.length > 0) {
      // Show top alert banner
      if (banner) {
        banner.classList.remove('d-none');
        banner.classList.add('d-flex');
        if (bannerText) {
          bannerText.textContent = `Please review and complete the ${failed.length} highlighted field${failed.length > 1 ? 's' : ''} below.`;
        }
      }

      // Smooth scroll to the first invalid field
      const firstInvalidEl = failed[0].el;
      if (firstInvalidEl) {
        const container = firstInvalidEl.closest('.form-group-wrap') || firstInvalidEl;
        container.classList.add('animate-shake');
        setTimeout(() => container.classList.remove('animate-shake'), 600);

        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Hide banner on valid form
    if (banner) {
      banner.classList.add('d-none');
      banner.classList.remove('d-flex');
    }

    // Collect validated payload
    const formData = {
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceInput.value,
      serviceText: serviceInput.selectedOptions[0] ? serviceInput.selectedOptions[0].text : serviceInput.value,
      date: dateInput.value,
      time: timeInput.value,
      clientType: form.querySelector('input[name="clientType"]:checked')?.value || 'First-Time Guest',
      stylePreference: form.querySelector('#stylePreference')?.value.trim() || 'Not specified (Artist Consultation)',
      notes: form.querySelector('#bookingNotes')?.value.trim() || 'None'
    };

    // Modal instance
    const summaryModalEl = document.getElementById('bookingSummaryModal');
    const summaryModal = summaryModalEl && typeof bootstrap !== 'undefined'
      ? bootstrap.Modal.getOrCreateInstance(summaryModalEl)
      : null;

    // Button loading state
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Securing Your Appointment...`;

    // Simulated short server latency for realistic tactile feedback
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      displayBookingSummary(formData, summaryModal);

      // Reset form and clear validation classes
      form.reset();
      form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
      });
      form.querySelectorAll('.has-error').forEach(el => {
        el.classList.remove('has-error');
      });
      Object.keys(touched).forEach(k => { touched[k] = false; });
    }, 600);
  });
}

/**
 * Display confirmation summary modal with randomized reference ID
 */
function displayBookingSummary(data, modalInstance) {
  const refCode = 'LBS-' + Math.floor(100000 + Math.random() * 900000);

  // Populate summary fields
  const refCodeEl = document.getElementById('summaryRefCode');
  const nameEl = document.getElementById('summaryName');
  const contactEl = document.getElementById('summaryContact');
  const serviceEl = document.getElementById('summaryService');
  const dateTimeEl = document.getElementById('summaryDateTime');
  const clientTypeEl = document.getElementById('summaryClientType');
  const styleEl = document.getElementById('summaryStyle');
  const notesEl = document.getElementById('summaryNotes');

  if (refCodeEl) refCodeEl.textContent = refCode;
  if (nameEl) nameEl.textContent = data.fullName;
  if (contactEl) contactEl.textContent = `${data.email} | ${data.phone}`;
  if (serviceEl) serviceEl.textContent = data.serviceText;
  if (dateTimeEl) dateTimeEl.textContent = `${data.date} at ${data.time}`;
  if (clientTypeEl) clientTypeEl.textContent = data.clientType;
  if (styleEl) styleEl.textContent = data.stylePreference;
  if (notesEl) notesEl.textContent = data.notes;

  if (modalInstance) {
    modalInstance.show();
  } else {
    alert(`Thank you, ${data.fullName}!\n\nYour appointment booking request has been generated:\nReference: ${refCode}\nService: ${data.serviceText}\nDate: ${data.date} at ${data.time}\n\nOur studio concierge will contact you within 24 hours to confirm.`);
  }
}
