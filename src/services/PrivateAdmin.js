import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('tokenAdmin');
  return !!token;
};

const PrivateAdmin = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/adminlogin" />;
};

export default PrivateAdmin;
