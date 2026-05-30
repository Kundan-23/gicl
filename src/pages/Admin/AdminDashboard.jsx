import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import { useConfigStore } from '../../store/useConfigStore';

const AdminDashboard = () => {
  const { plans } = useConfigStore();
  const basicPlan = plans.find(p => p.id === 'p1') || plans[0];
  const elitePlan = plans.find(p => p.id === 'p2') || plans[1] || plans[0];
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Admin Dashboard</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Overview of GICL System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <Users size={24} color="#3b82f6" />
            </div>
            <h3 className="heading-3">Total Players</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>1,248</p>
          <p className="text-small text-secondary">+12% from last month</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <h3 className="heading-3">Total Coaches</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>45</p>
          <p className="text-small text-secondary">+3 new this week</p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(255, 199, 44, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <DollarSign size={24} color="var(--brand-accent)" />
            </div>
            <h3 className="heading-3">Revenue Settings</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">{basicPlan.name}:</span>
              <span style={{ fontWeight: 600 }}>₹{basicPlan.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">{elitePlan.name}:</span>
              <span style={{ fontWeight: 600 }}>₹{elitePlan.price}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
