// ===== TABS (Залишаються без змін) =====
const tablist = document.querySelector('[role="tablist"]');
const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

function activateTab(tab) {
  tabs.forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });

  panels.forEach(p => p.hidden = true);

  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');

  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  panel.hidden = false;

  tab.focus();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => activateTab(tab));
});

tablist.addEventListener('keydown', (e) => {
  const current = document.activeElement;
  if (current.getAttribute('role') !== 'tab') return;

  const index = Array.from(tabs).indexOf(current);

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    activateTab(tabs[(index + 1) % tabs.length]);
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    activateTab(tabs[(index - 1 + tabs.length) % tabs.length]);
  }

  if (e.key === 'Home') {
    e.preventDefault();
    activateTab(tabs[0]);
  }

  if (e.key === 'End') {
    e.preventDefault();
    activateTab(tabs[tabs.length - 1]);
  }
});

// ===== MODAL =====
const openBtn = document.getElementById('open-dialog-btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const mainContent = document.getElementById('main-content'); // Отримуємо main контейнер

let previousFocusedElement = null;

// Шукаємо всі фокусовані елементи [cite: 120-122]
function getFocusableElements() {
  return modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

// ВІДКРИТТЯ
function showModal() {
  previousFocusedElement = document.activeElement; // Зберігаємо тригер [cite: 95]

  modal.hidden = false;
  document.body.classList.add('modal-open');
  
  // КРИТИЧНЕ ДОДАВАННЯ: Робимо основний контент інертним [cite: 144]
  mainContent.inert = true; 

  const focusable = getFocusableElements();
  if (focusable.length) {
    focusable[0].focus();
  } else {
    modal.focus(); // Фокусуємо сам діалог [cite: 96]
  }

  document.addEventListener('keydown', handleKeyDown);
}

// ЗАКРИТТЯ
function hideModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');

  // КРИТИЧНЕ ДОДАВАННЯ: Знімаємо інертність з основного контенту [cite: 149]
  mainContent.inert = false;

  document.removeEventListener('keydown', handleKeyDown);

  if (previousFocusedElement) {
    previousFocusedElement.focus(); // Повертаємо фокус [cite: 105]
  }
}

// ЛОГІКА КЛАВІАТУРИ
function handleKeyDown(e) {
  // ESC — закриття [cite: 112, 115]
  if (e.key === 'Escape') {
    e.preventDefault();
    hideModal();
    return;
  }

  // Пастка фокуса (Focus Trap) [cite: 125-134]
  if (e.key === 'Tab') {
    const focusable = getFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) { // Поведінка Shift + Tab [cite: 125]
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else { // Поведінка Tab [cite: 130]
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
}

// ОБРОБНИКИ ПОДІЙ
openBtn.addEventListener('click', showModal);
closeBtn.addEventListener('click', hideModal);

// Клік по фону (щоб працювало коректно, у CSS modal має розтягуватися на весь екран)
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideModal();
  }
});