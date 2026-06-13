import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

export default function Header({ 
  activeTab, 
  user, 
  isCollapsed, 
  setIsCollapsed 
}) {
  // 1. Dark Mode State and Lifecycle handling
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Translate activeTab id to human readable title
  const getTitle = () => {
    switch (activeTab) {
      case 'users': return 'Users Management';
      case 'category': return 'Category Management';
      case 'subcategory': return 'Subcategory Management';
      case 'business': return 'Business Listings';
      case 'banners': return 'Banner Campaigns';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="collapse-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <h1 className="header-title">{getTitle()}</h1>
      </div>

      <div className="header-right">
        {/* Pill-shaped search bar with permanent black border config from app.css */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Find the perfect lot" 
            className="search-input"
          />
          <div className="search-icon-btn">
            <Search size={16} color="#FFFFFF" strokeWidth={3} />
          </div>
        </div>

        {/* 2. Brand New Theme Toggle Button */}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="theme-toggle-btn"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {darkMode ? <Sun size={20} color="#FF5500" /> : <Moon size={20} color="#718096" />}
        </button>

        <button className="header-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Administrator'}</span>
            <span className="user-role">{user?.role || 'Super Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}