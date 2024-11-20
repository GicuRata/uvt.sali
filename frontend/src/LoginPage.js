import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ navigate }) {
  const [emailOrUserId, setEmailOrUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (emailOrUserId && password) {
      alert('Логин успешен!');
      navigate('main'); // Переход на главную страницу
    } else {
      alert('Пожалуйста, заполните все поля!');
    }
  };

  const handleRegister = () => {
    navigate('register'); // Переход на страницу регистрации
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="text-dynamic">Добро пожаловать!</h2>
        <label className="text-dynamic">
          User ID или Email:
          <input
            type="text"
            value={emailOrUserId}
            onChange={(e) => setEmailOrUserId(e.target.value)}
            placeholder="Введите User ID или Email"
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
        <div className="button-container">
          <button className="login-button text-dynamic" onClick={handleLogin}>
            Логин
          </button>
          <button className="register-button text-dynamic" onClick={handleRegister}>
            Регистрация
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;