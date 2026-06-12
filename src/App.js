import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import UsersView from './views/UsersView';
import CategoryView from './views/CategoryView';
import SubcategoryView from './views/SubcategoryView';
import BusinessView from './views/BusinessView';
import BannersView from './views/BannersView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setIsLoggedIn(false);
      setUser(null);
      setActiveTab('users');
    }
  };

  // Render current active panel
  const renderActiveView = () => {
    switch (activeTab) {
      case 'users':
        return <UsersView />;
      case 'category':
        return <CategoryView />;
      case 'subcategory':
        return <SubcategoryView />;
      case 'business':
        return <BusinessView />;
      case 'banners':
        return <BannersView />;
      default:
        return <UsersView />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Content shell */}
      <div className="main-wrapper">
        <Header 
          activeTab={activeTab} 
          user={user} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
        
        <main className="content-area">
          {renderActiveView()}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
