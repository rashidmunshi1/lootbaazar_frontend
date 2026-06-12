import React from 'react';
import { Menu, Search, Bell, MenuIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Header({ 
  activeTab, 
  user, 
  isCollapsed, 
  setIsCollapsed 
}) {
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
        <div className="search-bar">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            placeholder="Search panels..." 
            className="search-input"
          />
        </div>

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
