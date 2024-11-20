import React, { useState } from 'react';
import MainPage from './MainPage';
import AdminPanel from './AdminPanel';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserAccount from './UserAccount';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Начальная страница - логин

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      {currentPage === 'login' && <LoginPage navigate={navigate} />}
      {currentPage === 'register' && <RegisterPage navigate={navigate} />}
      {currentPage === 'main' && <MainPage navigate={navigate} />}
      {currentPage === 'admin' && <AdminPanel navigate={navigate} />}
      {currentPage === 'user' && <UserAccount navigate={navigate} />}
    </div>
  );
}

export default App;