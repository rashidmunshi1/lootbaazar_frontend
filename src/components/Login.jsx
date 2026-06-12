import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Mock network request delay
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@lootbaazar.com' && password === 'admin123') {
        onLoginSuccess({ email, name: 'LootBaazar Admin', role: 'Super Admin' });
      } else {
        setError('Invalid email or password. Hint: admin@lootbaazar.com / admin123');
      }
    }, 1200);
  };

  const handleQuickFill = () => {
    setEmail('admin@lootbaazar.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-glow"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">
              <Sparkles size={22} fill="currentColor" />
            </div>
            <span className="login-logo-text">LootBaazar</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Welcome Back</h2>
          <p className="login-subtitle">Admin Control Panel</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="form-input-icon" size={18} />
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="admin@lootbaazar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                className="form-input-icon"
                style={{ left: 'auto', right: '14px', cursor: 'pointer', pointerEvents: 'auto' }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loader" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes spin { to { transform: rotate(360deg); } }
                `}} />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleQuickFill} 
            className="btn btn-secondary" 
            style={{ fontSize: '12px', padding: '8px 12px', width: '100%', justifyContent: 'center' }}
          >
            Demo Quick Log In
          </button>
        </div>
      </div>
    </div>
  );
}
