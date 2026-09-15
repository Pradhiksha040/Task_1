/**
 * Client-Side Inline Form Validation, Password Strength & Dynamic Interactions
 * (Cognifyz Internship - Task 2 & Task 4)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('complexForm') || document.getElementById('contactForm');
  if (!form) return;

  // Form Fields
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const dob = document.getElementById('dob');
  const gender = document.getElementById('gender');
  const address = document.getElementById('address');
  const city = document.getElementById('city');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const termsAccepted = document.getElementById('termsAccepted');
  const resetBtn = document.getElementById('resetBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  // Dynamic Elements (Task 4)
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');
  const passwordStrengthContainer = document.getElementById('passwordStrengthContainer');
  const strengthMeterFill = document.getElementById('strengthMeterFill');
  const strengthText = document.getElementById('strengthText');
  const addressCharCount = document.getElementById('addressCharCount');
  const formAlert = document.getElementById('formAlert');

  // Regex Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{7,15}$/;

  // Helper: Show Inline Error
  function showError(inputElement, message) {
    if (!inputElement) return;
    const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    
    let errorDisplay = formGroup.querySelector('.invalid-feedback');
    if (!errorDisplay) {
      errorDisplay = document.createElement('div');
      errorDisplay.className = 'invalid-feedback';
      formGroup.appendChild(errorDisplay);
    }
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
  }

  // Helper: Clear Inline Error
  function clearError(inputElement) {
    if (!inputElement) return;
    const formGroup = inputElement.closest('.form-group') || inputElement.parentElement;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    
    const errorDisplay = formGroup.querySelector('.invalid-feedback');
    if (errorDisplay) {
      errorDisplay.textContent = '';
      errorDisplay.style.display = 'none';
    }
  }

  // Field Validations
  function validateFullName() {
    if (!fullName) return true;
    const val = fullName.value.trim();
    if (!val) {
      showError(fullName, 'Full Name is required.');
      return false;
    }
    if (val.length < 2) {
      showError(fullName, 'Full Name must be at least 2 characters.');
      return false;
    }
    clearError(fullName);
    return true;
  }

  function validateEmail() {
    if (!email) return true;
    const val = email.value.trim();
    if (!val) {
      showError(email, 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      showError(email, 'Please enter a valid email address (e.g. user@example.com).');
      return false;
    }
    clearError(email);
    return true;
  }

  function validatePhone() {
    if (!phone) return true;
    const val = phone.value.trim();
    if (!val) {
      showError(phone, 'Phone number is required.');
      return false;
    }
    if (!phoneRegex.test(val)) {
      showError(phone, 'Please enter a valid phone number (7-15 digits).');
      return false;
    }
    clearError(phone);
    return true;
  }

  function validateDob() {
    if (!dob) return true;
    const val = dob.value;
    if (!val) {
      showError(dob, 'Date of birth is required.');
      return false;
    }
    const dobDate = new Date(val);
    if (isNaN(dobDate.getTime()) || dobDate >= new Date()) {
      showError(dob, 'Please select a valid past date of birth.');
      return false;
    }
    clearError(dob);
    return true;
  }

  function validateGender() {
    if (!gender) return true;
    if (!gender.value) {
      showError(gender, 'Please select your gender.');
      return false;
    }
    clearError(gender);
    return true;
  }

  function validateAddress() {
    if (!address) return true;
    const val = address.value.trim();
    if (!val) {
      showError(address, 'Address is required.');
      return false;
    }
    if (val.length < 5) {
      showError(address, 'Address must be at least 5 characters.');
      return false;
    }
    clearError(address);
    return true;
  }

  function validateCity() {
    if (!city) return true;
    const val = city.value.trim();
    if (!val) {
      showError(city, 'City is required.');
      return false;
    }
    clearError(city);
    return true;
  }

  // Task 4: Calculate & Render Password Strength
  function calculatePasswordStrength(pass) {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: '#e2e8f0', width: '0%' };

    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (pass.length < 8) {
      return { score: 1, label: 'Weak (Min 8 characters required)', color: '#ef4444', width: '25%' };
    }

    switch (score) {
      case 1:
      case 2:
        return { score: 2, label: 'Weak', color: '#ef4444', width: '33%' };
      case 3:
      case 4:
        return { score: 3, label: 'Medium', color: '#f59e0b', width: '66%' };
      case 5:
        return { score: 4, label: 'Strong', color: '#10b981', width: '100%' };
      default:
        return { score: 1, label: 'Weak', color: '#ef4444', width: '25%' };
    }
  }

  function validatePassword() {
    if (!password) return true;
    const val = password.value;
    if (!val) {
      showError(password, 'Password is required.');
      updateStrengthMeter('');
      return false;
    }

    const strength = calculatePasswordStrength(val);
    updateStrengthMeter(val);

    if (val.length < 8) {
      showError(password, 'Password must be at least 8 characters long.');
      return false;
    }
    if (!/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/[0-9]/.test(val) || !/[^A-Za-z0-9]/.test(val)) {
      showError(password, 'Password requires uppercase, lowercase, number, and special symbol.');
      return false;
    }

    clearError(password);
    return true;
  }

  function updateStrengthMeter(val) {
    if (!strengthMeterFill || !strengthText) return;
    const strength = calculatePasswordStrength(val);
    if (!val) {
      strengthMeterFill.style.width = '0%';
      strengthText.textContent = '';
      return;
    }
    strengthMeterFill.style.width = strength.width;
    strengthMeterFill.style.backgroundColor = strength.color;
    strengthText.textContent = `Strength: ${strength.label}`;
    strengthText.style.color = strength.color;
  }

  function validateConfirmPassword() {
    if (!confirmPassword || !password) return true;
    const passVal = password.value;
    const confirmVal = confirmPassword.value;
    if (!confirmVal) {
      showError(confirmPassword, 'Please confirm your password.');
      return false;
    }
    if (passVal !== confirmVal) {
      showError(confirmPassword, 'Passwords do not match.');
      return false;
    }
    clearError(confirmPassword);
    return true;
  }

  function validateTerms() {
    if (!termsAccepted) return true;
    if (!termsAccepted.checked) {
      showError(termsAccepted, 'You must accept the Terms & Conditions.');
      return false;
    }
    clearError(termsAccepted);
    return true;
  }

  // Real-time Event Listeners
  if (fullName) fullName.addEventListener('blur', validateFullName);
  if (email) email.addEventListener('blur', validateEmail);
  if (phone) phone.addEventListener('blur', validatePhone);
  if (dob) dob.addEventListener('change', validateDob);
  if (gender) gender.addEventListener('change', validateGender);
  
  if (address) {
    address.addEventListener('input', () => {
      validateAddress();
      if (addressCharCount) {
        addressCharCount.textContent = `${address.value.length} / 250 characters`;
      }
    });
  }
  
  if (city) city.addEventListener('blur', validateCity);
  
  if (password) {
    password.addEventListener('input', () => {
      validatePassword();
      if (confirmPassword && confirmPassword.value) validateConfirmPassword();
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener('input', validateConfirmPassword);
  }

  if (termsAccepted) {
    termsAccepted.addEventListener('change', validateTerms);
  }

  // Show/Hide Password Toggle
  if (togglePasswordBtn && password) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      togglePasswordBtn.innerHTML = type === 'password' 
        ? '<i class="bi bi-eye"></i>' 
        : '<i class="bi bi-eye-slash"></i>';
    });
  }

  if (toggleConfirmPasswordBtn && confirmPassword) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPassword.setAttribute('type', type);
      toggleConfirmPasswordBtn.innerHTML = type === 'password' 
        ? '<i class="bi bi-eye"></i>' 
        : '<i class="bi bi-eye-slash"></i>';
    });
  }

  // Reset Button Handler
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      form.reset();
      [fullName, email, phone, dob, gender, address, city, password, confirmPassword, termsAccepted].forEach(el => {
        if (el) {
          el.classList.remove('is-invalid', 'is-valid');
          clearError(el);
        }
      });
      updateStrengthMeter('');
      if (formAlert) {
        formAlert.style.display = 'none';
        formAlert.className = 'alert';
      }
      if (addressCharCount) addressCharCount.textContent = '0 / 250 characters';
    });
  }

  // Form Submit Handler (Client Validation & AJAX submission)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();
    const isAddressValid = validateAddress();
    const isCityValid = validateCity();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isDobValid && 
                        isGenderValid && isAddressValid && isCityValid && 
                        isPasswordValid && isConfirmPasswordValid && isTermsValid;

    if (!isFormValid) {
      if (formAlert) {
        formAlert.className = 'alert alert-danger';
        formAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Please correct the errors in the form before submitting.';
        formAlert.style.display = 'block';
      }
      return;
    }

    // Set Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Submitting...';
    }

    if (formAlert) formAlert.style.display = 'none';

    // Prepare Payload
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.termsAccepted = termsAccepted ? termsAccepted.checked : true;

    try {
      // Post to Task 2 temp-submit route or Task 5 / 6 register endpoint
      const targetEndpoint = window.location.pathname === '/register' || form.dataset.endpoint === 'auth'
        ? '/api/auth/register'
        : '/api/temp-submit';

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (formAlert) {
          formAlert.className = 'alert alert-success';
          formAlert.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${result.message}`;
          formAlert.style.display = 'block';
        }

        // Reset form after successful submission
        form.reset();
        updateStrengthMeter('');
        [fullName, email, phone, dob, gender, address, city, password, confirmPassword, termsAccepted].forEach(el => {
          if (el) el.classList.remove('is-valid', 'is-invalid');
        });

        // Refresh dynamic user tables/lists if present (Task 4/5)
        if (window.fetchUsersList) {
          window.fetchUsersList();
        }
        if (window.fetchTempSubmissions) {
          window.fetchTempSubmissions();
        }
      } else {
        // Display Server-Side Validation Errors
        if (formAlert) {
          formAlert.className = 'alert alert-danger';
          formAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${result.message || 'Validation failed.'}`;
          formAlert.style.display = 'block';
        }

        if (result.errors) {
          Object.keys(result.errors).forEach(field => {
            const inputEl = document.getElementById(field);
            if (inputEl) {
              showError(inputEl, result.errors[field]);
            }
          });
        }
      }
    } catch (err) {
      console.error('Submission Error:', err);
      if (formAlert) {
        formAlert.className = 'alert alert-danger';
        formAlert.innerHTML = '<i class="bi bi-wifi-off me-2"></i>Network error while submitting form. Please check server connection.';
        formAlert.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Submit Registration</span> <i class="bi bi-send-fill ms-2"></i>';
      }
    }
  });
});
