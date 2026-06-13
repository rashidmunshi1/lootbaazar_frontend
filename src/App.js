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
import SubcategoryView from './views/SubcategoryView';
import BusinessView from './views/BusinessView';
import BannersView from './views/BannersView';
import EventBannersView from './views/EventBannersView';
import ExcelUploadView from './views/ExcelUploadView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsLoggedIn(false);
      setUser(null);
      setActiveTab('dashboard');
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'users': return <UsersView />;
      case 'category': return <CategoryView />;
      case 'subcategory': return <SubcategoryView />;
      case 'business': return <BusinessView />;
      case 'banners': return <BannersView />;
      case 'eventBanners': return <EventBannersView />;
      case 'excelUpload': return <ExcelUploadView />;
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