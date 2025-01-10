import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import AdminRegister from './pages/AdminRegistration';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminRoute';
import BookRoom from './pages/BookRoom';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/create-admin"
          element={<AdminRegister />}
        />
        <Route
          path="/admin/add-room"
          element={<AdminProtectedRoute><AddRoom /></AdminProtectedRoute>}
        />
        <Route
          path="/admin/edit-room/:roomId"
          element={<AdminProtectedRoute><EditRoom /></AdminProtectedRoute>}
        />
        <Route
          path="/admin/bookings"
          element={<AdminProtectedRoute><AdminBookings /></AdminProtectedRoute>}
        />
        <Route
          path="/book-room"
          element={<ProtectedRoute><BookRoom /></ProtectedRoute>}
        />
        <Route
          path="/my-bookings"
          element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
