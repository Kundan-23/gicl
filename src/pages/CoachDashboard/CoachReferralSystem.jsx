import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { Share2, Copy, CheckCircle, Gift, Users } from 'lucide-react';

const CoachReferralSystem = () => {
  const { dashboardData, simulateCoachReferral } = useCoachStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dashboardData.myReferralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEncash = () => {
    if (dashboardData.referralPoints > 0) {
      alert(`Successfully sent request to encash ${dashboardData.referralPoints} points! Our team will contact you.`);
    } else {
      alert("You need at least 0.5 points to encash.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Refer GICL Sports</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Invite other coaches to join GICL and earn rewards when they successfully register.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Generate Code Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-primary)', textAlign: 'center' }}>
          <Gift size={48} color="var(--brand-primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Your Referral Code</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Share this code with your network.</p>
          
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed var(--brand-primary)' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-primary)' }}>
              {dashboardData.myReferralCode}
            </span>
            <button onClick={handleCopy} style={{ background: 'none', color: 'var(--brand-accent)' }}>
              {copied ? <CheckCircle size={20} color="var(--success)" /> : <Copy size={20} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
              <Share2 size={18} /> Share Link
            </button>
          </div>
        </div>

        {/* Encash & Stats */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 className="heading-3">Points Balance</h3>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{dashboardData.referralPoints}</span>
          </div>

          <p className="text-small" style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            Points can be encashed for real rewards. You earn 0.5 points when someone registers using your code.
          </p>

          <button className="btn-secondary" style={{ marginTop: 'auto' }} onClick={handleEncash} disabled={dashboardData.referralPoints === 0}>
            Encash Points
          </button>
        </div>

      </div>

      {/* Referral Tracking Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--brand-primary)" />
            My Network
          </h3>
          <button onClick={simulateCoachReferral} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--brand-accent)', color: '#fff', borderRadius: 'var(--radius-sm)' }}>
            Simulate Signup (Dev)
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Referred Person</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Points Earned</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.referrals.length > 0 ? (
                dashboardData.referrals.map((ref, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{ref.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                        {ref.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--brand-primary)', fontWeight: 600 }}>+{ref.pointsEarned} Pts</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    You haven't referred anyone yet. Share your code to start earning!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};

export default CoachReferralSystem;
