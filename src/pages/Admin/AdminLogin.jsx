import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminId === 'admin' && password === 'admin123') {
      navigate('/admin');
    } else {
      alert("Invalid Admin Credentials. Try admin / admin123");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)'
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--brand-accent)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <ShieldCheck size={32} color="var(--brand-accent)" />
          </div>
          <h1 className="heading-2">System Admin</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Secure Access Portal</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Admin ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--brand-accent)' }}>
            Authenticate
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
