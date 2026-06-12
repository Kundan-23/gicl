import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Settings, Users, LogOut, ShieldCheck, UserPlus, Video, Calendar } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { appLogoUrl } = useConfig();

  const handleLogout = () => {
    navigate('/admin-login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, end: true },
    { name: 'App Config', path: '/admin/config', icon: <Settings size={20} /> },
    { name: 'Player Config', path: '/admin/player-config', icon: <Settings size={20} /> },
    { name: 'Player Mgmt', path: '/admin/players', icon: <Users size={20} /> },
    { name: 'Coach Mgmt', path: '/admin/coaches', icon: <UserPlus size={20} /> },
    { name: 'Matches', path: '/admin/matches', icon: <Calendar size={20} /> },
    { name: 'Player Allotment', path: '/admin/allotment', icon: <UserPlus size={20} /> },
    { name: 'Video Scrutiny', path: '/admin/scrutiny', icon: <Video size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '260px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xl)'
        }}
        className="sidebar-desktop"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          {appLogoUrl ? (
            <img src={appLogoUrl} alt="App Logo" style={{ maxWidth: '100%', maxHeight: '60px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-accent)' }}>
              <ShieldCheck size={28} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ADMIN</span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', color: 'var(--text-secondary)' }} className="close-btn-mobile">
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={() => setIsSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--brand-accent)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s'
              })}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--text-secondary)', background: 'none', fontWeight: 500, marginTop: 'auto' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, transition: 'margin-left 0.4s' }} className="main-content">
        
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', color: 'var(--text-primary)' }}>
              <Menu size={24} />
            </button>
            <h2 className="heading-3" style={{ margin: 0 }}>System Configuration</h2>
          </div>
        </header>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { transform: translateX(0) !important; }
          .close-btn-mobile { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          .main-content { margin-left: 260px; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardLayout;
