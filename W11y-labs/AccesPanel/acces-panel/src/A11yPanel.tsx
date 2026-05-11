import React, { useState, useEffect, useRef } from 'react';
import './A11yPanel.css';

const A11yPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Стани налаштувань
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [monochrome, setMonochrome] = useState(false);
  const [invert, setInvert] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [pauseAnimations, setPauseAnimations] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  // Функція для оновлення CSS-змінних (типографіка)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--a11y-font-size-multiplier', fontSize.toString());
    
    if (fontSize > 1) {
      document.body.classList.add('a11y-typography-active');
    } else {
      document.body.classList.remove('a11y-typography-active');
    }
  }, [fontSize]);

  // Функція для додавання/видалення класів на body (кольори та навігація)
  useEffect(() => {
    const toggleBodyClass = (className: string, condition: boolean) => {
      condition ? document.body.classList.add(className) : document.body.classList.remove(className);
    };

    toggleBodyClass('a11y-high-contrast', highContrast);
    toggleBodyClass('a11y-monochrome', monochrome);
    toggleBodyClass('a11y-invert', invert);
    toggleBodyClass('a11y-highlight-links', highlightLinks);
    toggleBodyClass('a11y-pause-animations', pauseAnimations);
  }, [highContrast, monochrome, invert, highlightLinks, pauseAnimations]);

  // Пастка фокуса (Focus Trap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !panelRef.current) return;

      if (e.key === 'Escape') {
        closePanel();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openPanel = () => {
    setIsOpen(true);
    setTimeout(() => {
      // Фокус на перший елемент панелі при відкритті
      const closeBtn = panelRef.current?.querySelector('.a11y-close-btn') as HTMLElement;
      closeBtn?.focus();
    }, 10);
  };

  const closePanel = () => {
    setIsOpen(false);
    // Повернення фокуса на кнопку-тригер
    triggerBtnRef.current?.focus();
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 0.2, 1.8));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 0.2, 1));

  return (
    <div className="a11y-panel-container">
      {!isOpen && (
        <button
          ref={triggerBtnRef}
          className="a11y-trigger-btn"
          onClick={openPanel}
          aria-label="Відкрити панель доступності"
          aria-expanded={isOpen}
        >
          ♿
        </button>
      )}

      {isOpen && (
        <div 
          className="a11y-panel" 
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-panel-title"
        >
          <button 
            className="a11y-close-btn" 
            onClick={closePanel}
            aria-label="Закрити панель доступності"
          >
            Закрити ✖
          </button>
          
          <h2 id="a11y-panel-title">Налаштування доступності</h2>

          <div className="a11y-section">
            <h3>Візуальна адаптація тексту</h3>
            <button 
              className="a11y-btn" 
              onClick={increaseFontSize}
              aria-label={`Збільшити текст. Поточний масштаб: ${Math.round(fontSize * 100)}%`}
            >
              Збільшити текст (A+)
            </button>
            <button 
              className="a11y-btn" 
              onClick={decreaseFontSize}
              aria-label="Зменшити текст"
              disabled={fontSize <= 1}
            >
              Зменшити текст (A-)
            </button>
          </div>

          <div className="a11y-section">
            <h3>Кольори та контраст</h3>
            <button 
              className={`a11y-btn ${highContrast ? 'active' : ''}`}
              onClick={() => setHighContrast(!highContrast)}
              aria-pressed={highContrast}
              aria-label="Режим високої контрастності"
            >
              Високий контраст
            </button>
            <button 
              className={`a11y-btn ${invert ? 'active' : ''}`}
              onClick={() => setInvert(!invert)}
              aria-pressed={invert}
              aria-label="Інверсія кольорів"
            >
              Інверсія кольорів
            </button>
            <button 
              className={`a11y-btn ${monochrome ? 'active' : ''}`}
              onClick={() => setMonochrome(!monochrome)}
              aria-pressed={monochrome}
              aria-label="Монохромний режим"
            >
              Монохромний режим
            </button>
          </div>

          <div className="a11y-section">
            <h3>Допоміжні інструменти</h3>
            <button 
              className={`a11y-btn ${highlightLinks ? 'active' : ''}`}
              onClick={() => setHighlightLinks(!highlightLinks)}
              aria-pressed={highlightLinks}
              aria-label="Підсвічування посилань"
            >
              Підсвітити посилання
            </button>
            <button 
              className={`a11y-btn ${pauseAnimations ? 'active' : ''}`}
              onClick={() => setPauseAnimations(!pauseAnimations)}
              aria-pressed={pauseAnimations}
              aria-label="Зупинка анімацій"
            >
              Зупинити анімації
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default A11yPanel;