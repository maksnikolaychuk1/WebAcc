const headers = Array.from(document.querySelectorAll('.accordion .acc-header'));

headers.forEach((button) => {
  button.addEventListener('click', () => togglePanel(button));
  button.addEventListener('keydown', handleKeydown);
});

function togglePanel(button) {
  const panelId = button.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);
  const expanded = button.getAttribute('aria-expanded') === 'true';

  button.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
}

function handleKeydown(event) {
  const currentIndex = headers.indexOf(event.currentTarget);
  let nextIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % headers.length;
      event.preventDefault();
      headers[nextIndex].focus();
      break;
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + headers.length) % headers.length;
      event.preventDefault();
      headers[nextIndex].focus();
      break;
    case 'Home':
      event.preventDefault();
      headers[0].focus();
      break;
    case 'End':
      event.preventDefault();
      headers[headers.length - 1].focus();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      togglePanel(event.currentTarget);
      break;
  }
}