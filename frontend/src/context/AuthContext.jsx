import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = (access, userRole) => {
    localStorage.setItem('access', access);
    localStorage.setItem('role', userRole);
    setToken(access);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    navigate('/'); // Redirect to splash/login
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
