import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel({ navigate }) {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [minCapacity, setMinCapacity] = useState(30);
  const [maxCapacity, setMaxCapacity] = useState(250);

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
    <div className="admin-panel">
      <div className="left-section">
        <button
          className="back-button text-dynamic"
          onClick={() => navigate('main')}
        >
          На главную страницу
        </button>
        <div className="admin-panel__content">
          <h2 className="text-dynamic">Панель администратора</h2>
          <h3 className="text-dynamic">Создание временного слота</h3>
          <label className="text-dynamic">
            Время начала:
            <input
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
            />
          </label>
          <label className="text-dynamic">
            Время окончания:
            <input
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </label>
          <label className="text-dynamic">
            Минимальная вместимость:
            <input
              type="number"
              value={minCapacity}
              min="30"
              max="250"
              onChange={(e) => setMinCapacity(e.target.value)}
            />
          </label>
          <label className="text-dynamic">
            Максимальная вместимость:
            <input
              type="number"
              value={maxCapacity}
              min="30"
              max="250"
              onChange={(e) => setMaxCapacity(e.target.value)}
            />
          </label>
          <button className="text-dynamic">Создать временной слот</button>
        </div>
      </div>
      <div className="right-section">
        <div className="calendar-container">
          <iframe
            title="Google Calendar"
            src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Europe/Moscow"
            frameBorder="0"
            scrolling="no"
            style={{
              width: '100%',
              height: '100%',
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
