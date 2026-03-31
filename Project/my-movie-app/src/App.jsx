import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import './App.css';

// Спеціальний компонент-Охоронець (Protected Route)
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    
    return isLoggedIn ? children : <Navigate to="/register" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Публічні маршрути */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Захищені маршрути (тільки після входу) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Захищена сторінка деталей */}
          <Route 
            path="/movie/:id" 
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            } 
          />

          {/* Якщо користувач ввів якусь нісенітницю в URL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;