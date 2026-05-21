import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, CheckCircle, Gift, Users, Trophy, IndianRupee } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';

const mockHighestReferrers = [
  { name: 'Rahul Sharma', amount: 15400 },
  { name: 'Vikram Singh', amount: 12200 },
  { name: 'Amit Kumar', amount: 9800 }
];

const ReferralSystem = () => {
  const { dashboardState, simulateFriendRegistration } = useFormStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dashboardState.myReferralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEncash = () => {
    if (dashboardState.referralBalance >= 500) {
      alert(`Withdrawal request for ₹${dashboardState.referralBalance} submitted successfully!`);
    } else {
      alert("You need a minimum balance of ₹500 to withdraw.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Refer & Earn Cash</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Invite your friends to GICL using your unique static code and earn real cash rewards!</p>
      </div>

      {/* Rewards Structure Banner */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ minWidth: '200px', backgroundColor: 'var(--brand-primary)', color: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>1st Referral</h3>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹50</span>
        </div>
        <div style={{ minWidth: '200px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--brand-primary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--brand-primary)' }}>2nd Referral</h3>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹20</span>
        </div>
        <div style={{ minWidth: '200px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>3rd Onwards</h3>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹10 <span style={{ fontSize: '1rem', fontWeight: 500 }}>each</span></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Generate Code Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-primary)', textAlign: 'center' }}>
          <Gift size={48} color="var(--brand-primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Your Unique Referral Code</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>This code is permanent. Share it infinitely.</p>
          
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed var(--brand-primary)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-primary)' }}>
              {dashboardState.myReferralCode}
            </span>
            <button onClick={handleCopy} style={{ background: 'none', color: 'var(--brand-accent)' }}>
              {copied ? <CheckCircle size={24} color="var(--success)" /> : <Copy size={24} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
              <Share2 size={18} /> Share via WhatsApp
            </button>
          </div>
        </div>

        {/* Encash & Stats */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 className="heading-3">Wallet Balance</h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>₹{dashboardState.referralBalance}</span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Minimum Withdrawal</span>
              <span className="text-small" style={{ fontWeight: 600 }}>₹500</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${Math.min((dashboardState.referralBalance / 500) * 100, 100)}%`, backgroundColor: dashboardState.referralBalance >= 500 ? 'var(--success)' : 'var(--brand-accent)' }}></div>
            </div>
          </div>

          <button 
            className="btn-secondary" 
            style={{ marginTop: 'auto', backgroundColor: dashboardState.referralBalance >= 500 ? 'var(--success)' : '', color: dashboardState.referralBalance >= 500 ? '#fff' : '' }} 
            onClick={handleEncash} 
            disabled={dashboardState.referralBalance < 500}
          >
            {dashboardState.referralBalance >= 500 ? 'Withdraw to Bank' : 'Reach ₹500 to Withdraw'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (minWidth: 1024px)': { gridTemplateColumns: '2fr 1fr' } }}>
        
        {/* Referral Tracking Table */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--brand-primary)" />
              My Network
            </h3>
            <button onClick={simulateFriendRegistration} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--brand-accent)', color: '#fff', borderRadius: 'var(--radius-sm)' }}>
              Simulate Signup (Dev)
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>Referred Person</th>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 500 }}>Earned</th>
                </tr>
              </thead>
              <tbody>
                {dashboardState.referrals.length > 0 ? (
                  dashboardState.referrals.map((ref, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{ref.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                          {ref.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 600 }}>+₹{ref.amountEarned}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      You haven't referred anyone yet. Share your code to start earning cash!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highest Referrers Leaderboard */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-accent)', display: 'flex', flexDirection: 'column' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="var(--brand-accent)" />
            GICL Top Referrers
          </h3>
          <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            The highest referrers get special VIP benefits, extra matches, and exclusive GICL kits!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockHighestReferrers.map((referrer, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: idx === 0 ? '1px solid var(--brand-accent)' : '1px solid transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: idx === 0 ? 'var(--brand-accent)' : 'var(--text-secondary)' }}>#{idx + 1}</span>
                  <span style={{ fontWeight: 600 }}>{referrer.name}</span>
                </div>
                <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={14} />{referrer.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default ReferralSystem;
