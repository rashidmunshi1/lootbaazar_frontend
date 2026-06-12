import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer animate-fade">
      <div>
        <span>&copy; {currentYear} </span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>LootBaazar</span>
        <span>. All rights reserved.</span>
      </div>
      
      <div className="footer-links">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-success)',
            display: 'inline-block'
          }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>System Operational</span>
        </span>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ color: 'var(--text-muted)' }}>v1.0.0</span>
      </div>
    </footer>
  );
}
