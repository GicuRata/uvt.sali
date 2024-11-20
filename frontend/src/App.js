import React, { useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import AdminPanel from './AdminPanel';
import UserAccount from './UserAccount';

function App() {
  const [currentPage, setCurrentPage] = useState('main');

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage navigate={setCurrentPage} />;
      case 'admin':
        return <AdminPanel navigate={setCurrentPage} />;
      case 'user':
        return <UserAccount navigate={setCurrentPage} />;
      default:
        return <MainPage navigate={setCurrentPage} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
