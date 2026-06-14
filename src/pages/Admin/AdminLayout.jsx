import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import {
  LayoutDashboard, Users, CreditCard, Share2, Wallet,
  UserCog, Calendar, Settings, LogOut, Menu, X, ShieldCheck,
  ChevronRight, Video, Users2, Bell
} from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import NotificationDropdown from '../../components/layout/NotificationDropdown';

const SIDEBAR_WIDTH = 240;

const navLinks = [
  { name: 'Dashboard',    path: '/admin2',              icon: LayoutDashboard, end: true },
  { name: 'Players',      path: '/admin2/players',      icon: Users },
  { name: 'Cashouts',     path: '/admin2/cashouts',     icon: Wallet },
  { name: 'Coaches',      path: '/admin2/coaches',      icon: UserCog },
  { name: 'Matches',      path: '/admin2/matches',      icon: Calendar },
  { name: 'Allotment',    path: '/admin2/allotment',    icon: Users2 },
  { name: 'Video Review', path: '/admin2/scrutiny',     icon: Video },
  { name: 'Training Approvals', path: '/admin2/training', icon: ShieldCheck },
  { name: 'Configuration',path: '/admin2/config',       icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { appLogoUrl } = useConfig();
  const navigate = useNavigate();
  const { unreadCount } = useNotificationStore();

  // Auth guard
  const raw = localStorage.getItem('gicl_user');
  let user = null;
  try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('gicl_token');
    localStorage.removeItem('gicl_user');
    navigate('/admin-login');
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: `${SIDEBAR_WIDTH}px`,
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50,
    transition: 'transform 0.3s ease',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...sidebarStyle,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          {appLogoUrl ? (
            <div style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
              <img src={appLogoUrl} alt="App Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--brand-primary), #F0A500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(249,203,26,0.35)',
              }}>
                <ShieldCheck size={20} color="#121A3F" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1 }}>GICL</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 600, letterSpacing: '0.1em' }}>ADMIN PANEL</div>
              </div>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-close-btn"
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-secondary)', display: 'none' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {navLinks.map(({ name, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                color: isActive ? '#121A3F' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                boxShadow: isActive ? '0 4px 12px rgba(249,203,26,0.25)' : 'none',
                transition: 'all 0.18s',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} color={isActive ? '#121A3F' : 'currentColor'} />
                  <span style={{ flex: 1 }}>{name}</span>
                  {isActive && <ChevronRight size={14} color="#121A3F" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin Info + Logout */}
          <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
                {user.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name || 'Admin'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
            </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)',
              background: 'rgba(239,68,68,0.08)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)', fontWeight: 600,
              fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.18s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {/* Top header (mobile only) */}
        <header className="admin-topbar" style={{ display: 'none', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', color: 'var(--text-primary)', display: 'flex' }}>
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--brand-primary)" />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>GICL Admin</span>
          </div>
        </header>

        {/* Global Floating Notification Bell */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 50 }} className="notif-trigger">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{ 
              background: 'var(--bg-surface-elevated)', 
              border: '1px solid var(--border-subtle)', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: 'var(--error)', color: '#fff', fontSize: '11px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} roleId={user?.id} roleType="admin" />
        </div>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', minHeight: 0 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-close-btn { display: none !important; }
          .admin-main { margin-left: ${SIDEBAR_WIDTH}px; }
          .admin-topbar { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-close-btn { display: flex !important; }
          .admin-topbar { display: flex !important; }
          .admin-main { margin-left: 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
