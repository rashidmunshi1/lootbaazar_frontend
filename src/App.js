import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

// Core imports
import DashboardView from './views/DashboardView';
import UsersView from './views/UsersView';
import CategoryView from './views/CategoryView';
import ProductsView from './views/ProductsView';
import CouponView from './views/CouponView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUser');
      setActiveTab('dashboard');
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'users': return <UsersView />;
      case 'category': return <CategoryView />;
      case 'product': return <ProductsView />;
      case 'coupon': return <CouponView />;
      default: return <DashboardView />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="main-wrapper">
        <Header activeTab={activeTab} user={user} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="content-area">{renderActiveView()}</main>
        <Footer />
      </div>
    </div>
  );
}