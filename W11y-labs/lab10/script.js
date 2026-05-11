// === ЛОГІКА СЛАЙДЕРІВ ===
const daysOfWeek = ["", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

function updateSliderValue(slider, value) {
    const min = parseInt(slider.getAttribute('aria-valuemin'), 10);
    const max = parseInt(slider.getAttribute('aria-valuemax'), 10);
    
    let newValue = parseInt(value, 10);
    if (isNaN(newValue)) newValue = min;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    
    // Оновлюємо значення ARIA [cite: 548, 551]
    slider.setAttribute('aria-valuenow', newValue);
    
    // Оновлюємо позицію візуально
    const percent = ((newValue - min) / (max - min)) * 100;
    slider.style.left = percent + '%';
    
    // Специфічна логіка для різних слайдерів
    if (slider.id === 'day-slider') {
        const dayText = daysOfWeek[newValue];
        slider.setAttribute('aria-valuetext', dayText); // Передаємо текст замість цифри [cite: 580]
        document.getElementById('day-value').textContent = 'День: ' + dayText;
    } else if (slider.id === 'volume-slider') {
        document.getElementById('volume-value').textContent = 'Гучність: ' + newValue + '%';
    }
}

// Обробка подій клавіатури для всіх слайдерів [cite: 595, 596]
document.querySelectorAll('[role="slider"]').forEach(slider => {
    slider.addEventListener('keydown', (event) => {
        const currentValue = parseInt(slider.getAttribute('aria-valuenow'), 10);
        let step = slider.id === 'volume-slider' ? 10 : 1; // PageUp/Down крок

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                updateSliderValue(slider, currentValue - 1);
                event.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                updateSliderValue(slider, currentValue + 1);
                event.preventDefault();
                break;
            case 'PageUp':
                updateSliderValue(slider, currentValue + step);
                event.preventDefault();
                break;
            case 'PageDown':
                updateSliderValue(slider, currentValue - step);
                event.preventDefault();
                break;
            case 'Home':
                updateSliderValue(slider, slider.getAttribute('aria-valuemin'));
                event.preventDefault();
                break;
            case 'End':
                updateSliderValue(slider, slider.getAttribute('aria-valuemax'));
                event.preventDefault();
                break;
        }
    });
});

// Альтернатива перетягуванню: клік по рейці (Критерій WCAG 2.5.7) 
function handleRailClick(event, sliderId) {
    const slider = document.getElementById(sliderId);
    const rail = event.currentTarget;
    const rect = rail.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = clickX / rect.width;
    
    const min = parseInt(slider.getAttribute('aria-valuemin'), 10);
    const max = parseInt(slider.getAttribute('aria-valuemax'), 10);
    const newValue = Math.round(min + percent * (max - min));
    
    updateSliderValue(slider, newValue);
    slider.focus();
}

// === ЛОГІКА ПЕРЕМИКАЧІВ (SWITCH) ===
function toggleSwitch(switchElem) {
    const currentState = switchElem.getAttribute('aria-checked') === 'true';
    const newState = !currentState;
    switchElem.setAttribute('aria-checked', String(newState)); // Зміна стану 

    // Якщо це перемикач теми - змінюємо клас body [cite: 581]
    if (switchElem.id === 'theme-switch') {
        if (newState) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}

document.querySelectorAll('[role="switch"]').forEach(switchElem => {
    // Активація кліком миші
    switchElem.addEventListener('click', () => toggleSwitch(switchElem));
    
    // Активація клавішами Space та Enter 
    switchElem.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault(); // Запобігаємо прокрутці екрана при натисканні пробілу
            toggleSwitch(switchElem);
        }
    });
});