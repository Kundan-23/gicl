import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldAlert } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Welcome to GICL</h1>
        <p className="text-body">Select your role to continue onboarding.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--brand-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
        >
          <User size={48} color="var(--brand-primary)" />
          <span className="heading-2">I am a Player</span>
        </button>

        <button 
          onClick={() => navigate('/login', { state: { role: 'coach' } })}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--brand-accent)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
        >
          <ShieldAlert size={48} color="var(--brand-accent)" />
          <span className="heading-2">I am a Coach</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Landing;
