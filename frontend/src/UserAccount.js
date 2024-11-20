import React, { useState, useEffect } from 'react';
import './UserAccount.css';

function UserAccount({ navigate }) {
  const [user, setUser] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    status: 'Студент',
    userId: 'U123456',
  });

  const [bookings, setBookings] = useState([
    { id: 1, date: '2024-02-10', time: '14:00-16:00', room: 'Конференц-зал' },
    { id: 2, date: '2024-02-15', time: '10:00-12:00', room: 'Мастерская' },
  ]);

  const handleCancelBooking = (id) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

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
    <div className="user-account">
      <div className="left-section">
        <h2 className="text-dynamic">Личный кабинет</h2>
        <p className="text-dynamic">Имя: {user.firstName}</p>
        <p className="text-dynamic">Фамилия: {user.lastName}</p>
        <p className="text-dynamic">Статус: {user.status}</p>
        <p className="text-dynamic">ID пользователя: {user.userId}</p>
        <p className="text-dynamic">Сегодня: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>

        <h3 className="text-dynamic">Ваши бронирования:</h3>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item text-dynamic">
              <p>Дата: {booking.date}</p>
              <p>Время: {booking.time}</p>
              <p>Комната: {booking.room}</p>
              <button onClick={() => handleCancelBooking(booking.id)}>
                Отменить бронь
              </button>
            </div>
          ))
        ) : (
          <p className="text-dynamic">Нет активных бронирований</p>
        )}

        <button className="back-button text-dynamic" onClick={() => navigate('main')}>
          В главное меню
        </button>
      </div>
      <div className="right-section">
        <h3 className="text-dynamic">Ваш календарь:</h3>
       {/*
       <iframe
          title="User Calendar"
          src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Europe/Moscow"
          style={{
            width: '100%',
            height: '80%',
            border: 'none',
          }}
        ></iframe>
        */}
      </div>
    </div>
  );
}

export default UserAccount;