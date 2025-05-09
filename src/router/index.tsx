import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/Home';
import Content from '../pages/content/Content';
import ContentDetail from '../pages/contentDetail/ContentDetail';
import Login from '../pages/login/Login';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route
      path="/contenido"
      element={
        <PrivateRoute>
          <Content />
        </PrivateRoute>
      }
    />
    <Route
      path="/contenido/:categoryId/:subcategoryId"
      element={
        <PrivateRoute>
          <ContentDetail />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes; 