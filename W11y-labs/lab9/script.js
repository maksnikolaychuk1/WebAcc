const form = document.getElementById('feedbackForm');
const summary = document.getElementById('form-summary');

// Поля
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const courseSelect = document.getElementById('course');

// Елементи помилок
const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const courseError = document.getElementById('course-error');

function showError(input, errorEl, message) {
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', `${input.id}-hint ${errorEl.id}`);
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError(input, errorEl) {
  input.setAttribute('aria-invalid', 'false');
  input.setAttribute('aria-describedby', `${input.id}-hint`);
  errorEl.hidden = true;
}

// Валідація окремого поля (для On-Blur)
function validateField(input) {
  let isValid = true;
  
  if (input === usernameInput) {
    if (input.value.trim().length < 3) {
      showError(input, usernameError, 'Ім\'я має містити щонайменше 3 символи.');
      isValid = false;
    } else clearError(input, usernameError);
  }
  
  if (input === emailInput) {
    if (!input.value.includes('@')) {
      showError(input, emailError, 'Введіть коректну адресу з символом @.');
      isValid = false;
    } else clearError(input, emailError);
  }
  
  if (input === passwordInput) {
    if (input.value.length < 8) {
      showError(input, passwordError, 'Пароль повинен містити щонайменше 8 символів.');
      isValid = false;
    } else clearError(input, passwordError);
  }

  if (input === courseSelect) {
    if (input.value === "") {
      showError(input, courseError, 'Будь ласка, оберіть ваш курс.');
      isValid = false;
    } else clearError(input, courseError);
  }

  return isValid;
}

// Подія Blur для кожного поля
[usernameInput, emailInput, passwordInput, courseSelect].forEach(input => {
  input.addEventListener('blur', () => validateField(input));
});

// Подія Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const isUsernameValid = validateField(usernameInput);
  const isEmailValid = validateField(emailInput);
  const isPasswordValid = validateField(passwordInput);
  const isCourseValid = validateField(courseSelect);

  const isValid = isUsernameValid && isEmailValid && isPasswordValid && isCourseValid;

  if (!isValid) {
    const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
    summary.style.color = '#d32f2f';
    summary.textContent = `Виправте помилки (${invalidFields.length}).`;
    
    // Переміщення фокусу на першу помилку
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
    }
  } else {
    summary.style.color = 'green';
    summary.textContent = 'Форму успішно надіслано!';
    form.reset();
  }
});