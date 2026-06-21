import React, { useState } from 'react';
import logo from "../assets/logo.png"
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/frontend';
const API_KEY = process.env.REACT_APP_API_KEY || 'lootbaazarV5kAYC7SJhFGWEnWynVjHW0UU7kA8N9x';

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

    fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        setIsLoading(false);
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.error || data.message || 'Invalid email or password');
          });
        }
        return res.json();
      })
      .then(data => {
        onLoginSuccess(data.user);
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const handleQuickFill = () => {
    setEmail('admin@lootbaazar.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-wrapper" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      {/* 🚀 Optimized Shatter-and-Reassemble Core Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shatterAndCombineTL {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            15% { transform: translate(-70px, -40px) rotate(-35deg) scale(0.75); opacity: 0.9; filter: blur(1px); }
            35% { transform: translate(-90px, -50px) rotate(-45deg) scale(0.65); opacity: 0.4; filter: blur(2px); }
            65% { transform: translate(-40px, -20px) rotate(-20deg) scale(0.85); opacity: 0.8; filter: blur(0.5px); }
            85%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; filter: blur(0); }
          }

          @keyframes shatterAndCombineTR {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            15% { transform: translate(75px, -35px) rotate(40deg) scale(0.75); opacity: 0.9; filter: blur(1px); }
            35% { transform: translate(95px, -45px) rotate(55deg) scale(0.65); opacity: 0.4; filter: blur(2px); }
            65% { transform: translate(45px, -15px) rotate(25deg) scale(0.85); opacity: 0.8; filter: blur(0.5px); }
            85%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; filter: blur(0); }
          }

          @keyframes shatterAndCombineBL {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            15% { transform: translate(-65px, 35px) rotate(25deg) scale(0.75); opacity: 0.9; filter: blur(1px); }
            35% { transform: translate(-85px, 45px) rotate(35deg) scale(0.65); opacity: 0.4; filter: blur(2px); }
            65% { transform: translate(-35px, 15px) rotate(15deg) scale(0.85); opacity: 0.8; filter: blur(0.5px); }
            85%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; filter: blur(0); }
          }

          @keyframes shatterAndCombineBR {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            15% { transform: translate(70px, 40px) rotate(-30deg) scale(0.75); opacity: 0.9; filter: blur(1px); }
            35% { transform: translate(90px, 50px) rotate(-40deg) scale(0.65); opacity: 0.4; filter: blur(2px); }
            65% { transform: translate(40px, 20px) rotate(-15deg) scale(0.85); opacity: 0.8; filter: blur(0.5px); }
            85%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; filter: blur(0); }
          }
          
          @keyframes finalLockReveal {
            0%, 78% { opacity: 0; transform: scale(0.85); }
            82% { opacity: 1; transform: scale(1.05); filter: brightness(1.4) drop-shadow(0 0 15px rgba(255,101,0,0.6)); }
            90% { transform: scale(0.98); filter: brightness(1.05); }
            100% { opacity: 1; transform: scale(1); filter: brightness(1) drop-shadow(0 4px 12px rgba(255,101,0,0.2)); }
          }

          @keyframes fusionNova {
            0%, 76% { opacity: 0; transform: scale(0.2); }
            82% { opacity: 0.8; transform: scale(1); filter: blur(1px); }
            100% { opacity: 0; transform: scale(1.4); filter: blur(4px); }
          }

          @keyframes finishingSwipe {
            0%, 86% { left: -150%; }
            96%, 100% { left: 150%; }
          }

          @keyframes spin { 
            to { transform: rotate(360deg); } 
          }
        `
      }} />

      <div className="login-glow"></div>

      <div className="login-card" style={{ padding: '24px 24px 20px 24px', margin: '0 auto' }}>
        <div className="login-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* --- LOGO CONTAINER FIXED: Changed height to 55px to prevent text overlap --- */}
          <div className="login-logo" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', position: 'relative', height: '55px', width: '100%' }}>
            <div className="relative w-[115px] h-full flex items-center justify-center">
              
              {/* Piece 1: Top Left Fragment */}
              <img
                src={logo}
                alt=""
                className="absolute w-[115px] h-auto object-contain pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 0%, 55% 0%, 45% 55%, 0% 45%)',
                  animation: 'shatterAndCombineTL 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                  zIndex: 2
                }}
              />

              {/* Piece 2: Top Right Fragment */}
              <img
                src={logo}
                alt=""
                className="absolute w-[115px] h-auto object-contain pointer-events-none"
                style={{
                  clipPath: 'polygon(55% 0%, 100% 0%, 100% 50%, 45% 55%)',
                  animation: 'shatterAndCombineTR 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                  zIndex: 2
                }}
              />

              {/* Piece 3: Bottom Left Fragment */}
              <img
                src={logo}
                alt=""
                className="absolute w-[115px] h-auto object-contain pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 45%, 45% 55%, 52% 100%, 0% 100%)',
                  animation: 'shatterAndCombineBL 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                  zIndex: 2
                }}
              />

              {/* Piece 4: Bottom Right Fragment */}
              <img
                src={logo}
                alt=""
                className="absolute w-[115px] h-auto object-contain pointer-events-none"
                style={{
                  clipPath: 'polygon(45% 55%, 100% 50%, 100% 100%, 52% 100%)',
                  animation: 'shatterAndCombineBR 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                  zIndex: 2
                }}
              />

              {/* Fusion Nova Ring Flare */}
              <div 
                className="absolute w-10 h-10 bg-gradient-to-r from-orange-500 via-white to-amber-400 rounded-full pointer-events-none"
                style={{ 
                  animation: 'fusionNova 1.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
                  zIndex: 1
                }}
              />

              {/* Final Solid Complete Logo Asset */}
              <div 
                className="relative overflow-hidden rounded-md"
                style={{
                  animation: 'finalLockReveal 2.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                  zIndex: 3
                }}
              >
                {/* Horizontal glare wipe component */}
                <div 
                  className="absolute top-0 -left-[150%] w-[40%] h-full skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                  style={{
                    animation: 'finishingSwipe 2.1s ease-in-out forwards'
                  }}
                />

                <img
                  src={logo}
                  alt="Loot Bazaar"
                  className="logo-login w-[115px] h-auto object-contain"
                  style={{ display: 'block' }}
                />
              </div>

            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px', color: '#000' }}>Welcome Back</h2>
          <p className="login-subtitle" style={{ marginBottom: '14px', fontSize: '13px' }}>Admin Control Panel</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {error && (
            <div className="login-error" style={{ marginBottom: '4px', padding: '8px 12px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px' }}>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0px' }}>
            <label className="form-label" htmlFor="login-email" style={{ marginBottom: '4px', fontSize: '12px' }}>Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="form-input-icon" size={16} />
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="admin@lootbaazar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{ height: '38px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '4px' }}>
            <label className="form-label" htmlFor="login-password" style={{ marginBottom: '4px', fontSize: '12px' }}>Password</label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={16} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{ paddingRight: '44px', height: '38px', fontSize: '14px' }}
              />
              <button
                type="button"
                className="form-input-icon"
                style={{ left: 'auto', right: '14px', cursor: 'pointer', pointerEvents: 'auto' }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            style={{ height: '40px', fontSize: '14px', marginTop: '4px' }}
          >
            {isLoading ? (
              <>
                <div className="loader" style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleQuickFill}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px', width: '100%', justifyContent: 'center', height: '34px' }}
          >
            Demo Quick Log In
          </button>
        </div>
      </div>
    </div>
  );
}