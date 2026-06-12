import React from 'react';
import { 
  Users, 
  Grid, 
  Layers, 
  Building2, 
  Image as ImageIcon, 
  LogOut, 
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  isCollapsed, 
  setIsCollapsed 
}) {
  const menuItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'category', label: 'Category', icon: Grid },
    { id: 'subcategory', label: 'Subcategory', icon: Layers },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Sparkles size={18} fill="currentColor" />
        </div>
        <span className="sidebar-name text-gradient">LootBaazar</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              <span className="menu-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={onLogout} 
          className="logout-button"
          title={isCollapsed ? 'Log Out' : ''}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
