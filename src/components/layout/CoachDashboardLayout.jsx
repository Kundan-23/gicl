import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, Video, ShieldPlus, CalendarDays, LogOut, Bell } from 'lucide-react';
import { useCoachStore } from '../../store/useCoachStore';

const CoachDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { dashboardData, markNotificationsRead, resetCoachForm } = useCoachStore();

  const unreadCount = dashboardData.notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    resetCoachForm();
    navigate('/');
  };

  const navLinks = [
    { name: 'My Squad', path: '/coach-dashboard', icon: <Users size={20} />, end: true },
    { name: 'Video Scrutiny', path: '/coach-dashboard/scrutiny', icon: <Video size={20} /> },
    { name: 'Team Builder', path: '/coach-dashboard/teams', icon: <ShieldPlus size={20} /> },
    { name: 'Upcoming Matches', path: '/coach-dashboard/matches', icon: <CalendarDays size={20} /> },
    { name: 'Refer a Coach', path: '/coach-dashboard/referral', icon: <Users size={20} /> },
  ];

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      markNotificationsRead();
    }
  };

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
        className="sidebar-desktop"
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
              onClick={() => setIsSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? 'var(--bg-surface)' : 'var(--text-secondary)',
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
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--error)', background: 'none', fontWeight: 500, marginTop: 'auto' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, transition: 'margin-left 0.4s' }} className="main-content">
        
        {/* Top Header (Mobile + Desktop Notification) */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', color: 'var(--text-primary)' }}>
              <Menu size={24} />
            </button>
            <h2 className="heading-3" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldPlus size={20} color="var(--brand-accent)" /> Coach Portal
            </h2>
          </div>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={handleNotifClick} style={{ background: 'none', color: 'var(--text-primary)', position: 'relative' }}>
              <Bell size={24} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, backgroundColor: 'var(--brand-accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', right: 0, top: '120%', width: '300px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-xl)', zIndex: 30 }}
                >
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Notifications</h4>
                  {dashboardData.notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                      {dashboardData.notifications.map(n => (
                        <div key={n.id} style={{ fontSize: '0.875rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <p style={{ margin: 0, color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.message}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--brand-accent)' }}>{new Date(n.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-small">No new notifications.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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

export default CoachDashboardLayout;
