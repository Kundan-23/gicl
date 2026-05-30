import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      {/* Header/Nav - Full Width */}
      <header style={{ width: '100%', padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--bg-surface-elevated)', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <img 
          src="/logo/logo.png" 
          alt="GICL Sports Logo" 
          style={{ height: '48px', objectFit: 'contain' }}
        />
      </header>

      {/* Main App Container - Constrained Width for Mobile Feel */}
      <div className="app-container" style={{ minHeight: 'auto', flex: 1, boxShadow: 'none' }}>
        <main style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>
        
        {/* Footer Area */}
        <footer style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          © {new Date().getFullYear()} GICL Sports Enterprise
        </footer>
      </div>
    </div>
  );
};

export default MobileLayout;
