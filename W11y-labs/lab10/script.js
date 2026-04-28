function updatesSliderValue(slider, value) {
    const min = parseInt(slider.getAttribute('aria-valuemin'), 10);
    const max = parseInt(slider.getAttribute('aria-valuemax'), 10);
    let newValue = parseInt(value, 10) || min;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    slider.setAttribute('aria-valuenow', newValue);
    
    // Update slider position visually
    const percent = ((newValue - min) / (max - min)) * 100;
    slider.style.left = percent + '%';
    
    // Update volume display
    const volumeValueElement = document.getElementById('volume-value');
    volumeValueElement.textContent = 'Volume is: ' + newValue + '%';
}

const sliderElement = document.querySelector('[role="slider"]');

// Initialize slider position
updatesSliderValue(sliderElement, sliderElement.getAttribute('aria-valuenow'));

sliderElement.addEventListener('keydown', (event) => {
    const currentValue = parseInt(sliderElement.getAttribute('aria-valuenow'), 10);
    switch (event.key) {
        case 'ArrowLeft':        case 'ArrowDown':
            updatesSliderValue(sliderElement, currentValue - 1);
            event.preventDefault();
            break;
        case 'ArrowRight':        case 'ArrowUp':
            updatesSliderValue(sliderElement, currentValue + 1);
            event.preventDefault();
            break;
        case 'Home':
            updatesSliderValue(sliderElement, sliderElement.getAttribute('aria-valuemin'));
            event.preventDefault();
            break;
        case 'End':
            updatesSliderValue(sliderElement, sliderElement.getAttribute('aria-valuemax'));
            event.preventDefault();
            break;
    }
});