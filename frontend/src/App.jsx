import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import { loginAdmin } from './api';
import { 
  Heart, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, 
  XCircle, Lock, BookOpen, Smile, Gift
} from 'lucide-react';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [adminUser, setAdminUser] = useState(localStorage.getItem('adminUser') || '');
  const [notification, setNotification] = useState(null);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Auto clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const data = await loginAdmin(username, password);
      setAdminToken(data.token);
      setAdminUser(data.username);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', data.username);
      showNotification('Successfully logged in as administrator!');
      setView('admin');
      setUsername('');
      setPassword('');
    } catch (err) {
      showNotification(err.message || 'Authentication failed', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminUser('');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    showNotification('Logged out successfully');
    setView('home');
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar 
        currentView={view} 
        setView={setView} 
        adminToken={adminToken} 
        onLogout={handleLogout} 
      />

      {/* Global Notifications */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Areas */}
      <main>
        {view === 'home' && (
          <div>
            {/* Hero Section */}
            <div className="hero-container">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1rem', borderRadius: '20px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  <Sparkles size={14} />
                  <span>Join the movement</span>
                </div>
                <h1 className="hero-title">
                  Spread Your Wings. <br />
                  <span>Empower the Future.</span>
                </h1>
                <p className="hero-subtitle">
                  Naye Pankh Foundation is dedicated to providing education, health, and career opportunities to underprivileged children. Be the change you want to see in the world.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => setView('register')}>
                    Register as Volunteer
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => setView('login')}>
                    Admin Access
                  </button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-circle"></div>
                <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '400px', width: '100%' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Why Volunteer?</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Smile size={20} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Spread Happiness:</strong> Directly impact youth development and education.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <BookOpen size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Learn & Grow:</strong> Gain leadership, collaboration and technical skills.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Gift size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Earn Credentials:</strong> Receive standard volunteer certifications and recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0 5%' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>Our Cumulative Impact</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Every volunteer counts towards achieving these numbers.</p>
            </div>
            <StatsCard />
          </div>
        )}

        {view === 'register' && (
          <RegistrationForm 
            onSuccess={(msg) => {
              showNotification(msg, 'success');
              setView('home');
            }} 
            onError={(msg) => showNotification(msg, 'error')} 
          />
        )}

        {view === 'login' && (
          <div className="glass-panel login-card">
            <div className="login-header">
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', marginBottom: '1rem' }}>
                <Lock size={24} />
              </div>
              <h2>Admin Portal</h2>
              <p>Sign in to manage volunteer registrations</p>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loginLoading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {loginLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        )}

        {view === 'admin' && (
          adminToken ? (
            <AdminDashboard 
              token={adminToken} 
              onSuccess={(msg) => showNotification(msg, 'success')} 
              onError={(msg) => showNotification(msg, 'error')} 
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please log in to access the administrator panel.</p>
              <button className="btn-primary" onClick={() => setView('login')}>Sign In</button>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;
