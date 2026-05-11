import React from 'react';
import A11yPanel from './A11yPanel';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* ПАНЕЛЬ МАЄ БУТИ ПЕРШОЮ В КОДІ ДЛЯ ПРАВИЛЬНОГО TAB-ORDER */}
      <A11yPanel />

      <header>
        <h1>Мій доступний вебдодаток</h1>
      </header>
      
      <main>
        <section>
          <h2>Приклад тексту для перевірки</h2>
          <p>
            Цей текст буде змінюватися, коли ви активуєте налаштування в панелі доступності. 
          </p>
          <a href="#">Тестове посилання</a>
        </section>

        <section>
          <h2>Тестування зупинки анімацій</h2>
          <div className="animations-container">
            <div className="spinning-box">Обертаюсь</div>
            <div className="pulsing-circle">Пульсую</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;