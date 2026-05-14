import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, CalendarDays, Users, LogOut } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { resetForm } = useFormStore();

  const handleLogout = () => {
    resetForm();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, end: true },
    { name: 'Matches', path: '/dashboard/matches', icon: <CalendarDays size={20} /> },
    { name: 'Refer a Friend', path: '/dashboard/referral', icon: <Users size={20} /> },
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
          borderRight: '1px solid var(--bg-surface-elevated)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xl)'
        }}
        className="sidebar-desktop" // we can use css media queries to force open on desktop
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <img src="/logo/logo.png" alt="GICL Logo" style={{ height: '32px' }} />
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
              onClick={() => setIsSidebarOpen(false)} // close on mobile after click
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? 'var(--bg-surface)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
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
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--error)', background: 'none', fontWeight: 500, marginTop: 'auto' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, transition: 'margin-left 0.4s' }} className="main-content">
        {/* Mobile Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-surface-elevated)' }} className="mobile-header">
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', color: 'var(--text-primary)' }}>
            <Menu size={24} />
          </button>
          <img src="/logo/logo.png" alt="GICL Logo" style={{ height: '28px' }} />
          <div style={{ width: 24 }} /> {/* placeholder for centering */}
        </header>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Global CSS injected specifically for Dashboard responsiveness */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { transform: translateX(0) !important; }
          .close-btn-mobile { display: none !important; }
          .mobile-header { display: none !important; }
          .main-content { margin-left: 260px; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
