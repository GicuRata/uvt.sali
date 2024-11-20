import React, { useEffect } from 'react';
import './MainPage.css';

function MainPage({ navigate }) {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.text-dynamic');
      elements.forEach((el) => {
        const bgColor = window.getComputedStyle(el).backgroundColor;
        el.style.color = bgColor === 'rgb(255, 255, 255)' ? '#000' : '#fff';
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="main-page">
      <div className="left-section">
        <h2 className="text-dynamic">Поиск доступных комнат</h2>
        <div className="filters">
          <label className="text-dynamic">
            Дата:
            <input type="date" />
          </label>
          <label className="text-dynamic">
            Время начала:
            <input type="time" />
          </label>
          <label className="text-dynamic">
            Время окончания:
            <input type="time" />
          </label>
          <label className="text-dynamic">
            Вместимость:
            <input type="number" min="30" max="250" />
          </label>
          <label className="text-dynamic">
            Тип комнаты:
            <select>
              <option value="meeting">Конференц-зал</option>
              <option value="workshop">Мастерская</option>
              <option value="lecture">Лекционная</option>
            </select>
          </label>
          <button className="text-dynamic">Найти комнаты</button>
        </div>
        <button
          className="back-button text-dynamic"
          onClick={() => navigate('admin')}
        >
          Перейти к панели администратора
        </button>
        <button
          className="back-button text-dynamic"
          onClick={() => navigate('user')}
        >
          Перейти в личный кабинет
        </button>
      </div>
      <div className="right-section">
        {/* Логотип уже добавлен */}
      </div>
    </div>
  );
}

export default MainPage;
