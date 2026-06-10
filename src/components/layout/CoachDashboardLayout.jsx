import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, Video, ShieldPlus, CalendarDays, LogOut, Bell, PlaySquare } from 'lucide-react';
import { useCoachStore } from '../../store/useCoachStore';

const CoachDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, fetchProfile, fetchPlayers, fetchVideos, fetchMatches, fetchReferrals, resetCoach } = useCoachStore();

  useEffect(() => {
    fetchProfile();
    fetchPlayers();
    fetchVideos();
    fetchMatches();
    fetchReferrals();
  }, []);

  const handleLogout = () => {
    resetCoach();
    localStorage.removeItem('gicl_token');
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/coach-dashboard', icon: <ShieldPlus size={20} />, end: true },
    { name: 'Create Practice Slot', path: '/coach-dashboard/create-slot', icon: <CalendarDays size={20} /> },
    { name: 'My Squad', path: '/coach-dashboard/squad', icon: <Users size={20} /> },
    { name: 'Team Builder', path: '/coach-dashboard/teams', icon: <Users size={20} /> },
    { name: 'My Uploads', path: '/coach-dashboard/uploads', icon: <PlaySquare size={20} /> },
    { name: 'Player Videos', path: '/coach-dashboard/scrutiny', icon: <Video size={20} /> },
    { name: 'Upcoming Matches', path: '/coach-dashboard/matches', icon: <CalendarDays size={20} /> },
    { name: 'Refer GICL Sports', path: '/coach-dashboard/referral', icon: <Users size={20} /> },
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

          {/* Coach name pill */}
          {profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {profile.profile_photo_url
                ? <img src={profile.profile_photo_url} alt="coach" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }} />
                : <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(249,203,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{profile.first_name?.[0]}{profile.last_name?.[0]}</div>
              }
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{profile.first_name} {profile.last_name}</span>
            </div>
          )}
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
