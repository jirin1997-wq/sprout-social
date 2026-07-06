import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InboxPage from './pages/InboxPage';
import Layout from './components/Layout';
import './App.css';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/content"
          element={isAuthenticated ? <Layout><ContentPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <Layout><AnalyticsPage /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/inbox"
          element={isAuthenticated ? <Layout><InboxPage /></Layout> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}
