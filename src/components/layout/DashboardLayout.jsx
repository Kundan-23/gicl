import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, CalendarDays, Users, User, LogOut, Video } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();
  const { resetForm, dashboardState } = useFormStore();
  const { isDashboardUnlocked } = dashboardState;

  const handleLogout = () => {
    resetForm();
    navigate('/');
  };

  const navLinks = isDashboardUnlocked 
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} />, end: true },
        { name: 'Matches', path: '/dashboard/matches', icon: <CalendarDays size={20} /> },
        { name: 'Tutorials', path: '/dashboard/tutorials', icon: <Video size={20} /> },
        { name: 'Refer a Friend', path: '/dashboard/referral', icon: <Users size={20} /> },
        { name: 'Profile', path: '/dashboard/profile', icon: <User size={20} /> },
      ]
    : [
        { name: 'Tutorials', path: '/dashboard/tutorials', icon: <Video size={20} />, end: false },
      ];

  const banners = [
    { id: 1, text: "GICL Mega Tournament Registration Open!", color: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
    { id: 2, text: "Refer a Friend & Earn ₹50 Cash!", color: "linear-gradient(135deg, #b45309, #f59e0b)" },
    { id: 3, text: "New Training Videos Uploaded", color: "linear-gradient(135deg, #064e3b, #10b981)" }
  ];

  // Auto-scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

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
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                pointerEvents: (!isDashboardUnlocked && link.path !== '/dashboard/tutorials') ? 'none' : 'auto',
                opacity: (!isDashboardUnlocked && link.path !== '/dashboard/tutorials') ? 0.5 : 1
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
        
        {/* Top Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', color: 'var(--text-primary)' }}>
              <Menu size={24} />
            </button>
            <h2 className="heading-3" style={{ margin: 0 }}>Player Portal</h2>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', overflow: 'hidden', border: '2px solid var(--brand-primary)' }}>
            {dashboardState.profilePhotoUrl ? (
              <img src={dashboardState.profilePhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="var(--text-secondary)" />
              </div>
            )}
          </div>
        </header>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          
          {/* Web Banners Carousel */}
          {isDashboardUnlocked && (
            <div style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', height: '120px' }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: banners[currentBanner].color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center'
                  }}
                >
                  <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {banners[currentBanner].text}
                  </h2>
                </motion.div>
              </AnimatePresence>
              
              {/* Carousel Indicators */}
              <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {banners.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentBanner(idx)}
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: currentBanner === idx ? '#fff' : 'rgba(255,255,255,0.3)',
                      border: 'none',
                      padding: 0
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

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

export default DashboardLayout;
