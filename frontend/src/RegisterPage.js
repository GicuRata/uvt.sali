import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        alert('Успешная регистрация!');
        navigate('main'); // Переход на главную страницу
      } else {
        alert('Пароли не совпадают!');
      }
    } else {
      alert('Пожалуйста, заполните все поля!');
    }
  };

  const handleBack = () => {
    navigate('login'); // Переход на страницу логина
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="text-dynamic">Регистрация</h2>
        <label className="text-dynamic">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
          />
        </label>
        <label className="text-dynamic">
          Пароль:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </label>
        <label className="text-dynamic">
          Подтвердите пароль:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Подтвердите пароль"
          />
        </label>
        <div className="button-container">
          <button className="register-button text-dynamic" onClick={handleRegister}>
            Зарегистрироваться
          </button>
          <button className="back-button text-dynamic" onClick={handleBack}>
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;