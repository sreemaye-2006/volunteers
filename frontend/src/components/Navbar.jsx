import React from 'react';
import { Heart, ShieldAlert, LogOut, ArrowRight, UserPlus } from 'lucide-react';

const Navbar = ({ currentView, setView, adminToken, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">
          <Heart size={20} fill="currentColor" />
        </div>
        <span>Naye Pankh</span>
      </div>

      <div className="nav-links">
        <span 
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setView('home')}
        >
          Home
        </span>
        <span 
          className={`nav-link ${currentView === 'register' ? 'active' : ''}`}
          onClick={() => setView('register')}
        >
          Join Us
        </span>

        {adminToken ? (
          <>
            <span 
              className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setView('admin')}
              style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}
            >
              Dashboard
            </span>
            <button className="btn-secondary" onClick={onLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <button 
            className="btn-secondary" 
            onClick={() => setView('login')}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            <ShieldAlert size={16} />
            Admin Access
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
