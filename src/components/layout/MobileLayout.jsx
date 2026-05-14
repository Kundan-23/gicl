import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileLayout = () => {
  return (
    <div className="app-container">
      {/* Header/Nav could go here */}
      <header style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--bg-surface-elevated)', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <img 
          src="/logo/logo.png" 
          alt="GICL Sports Logo" 
          style={{ height: '48px', objectFit: 'contain' }}
        />
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      
      {/* Footer Area */}
      <footer style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        © {new Date().getFullYear()} GICL Sports Enterprise
      </footer>
    </div>
  );
};

export default MobileLayout;
