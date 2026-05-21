import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import { User, Award, Activity, Star } from 'lucide-react';

const PlayerDashboard = () => {
  const { basicInfo, playerProfile, dashboardState, updateDashboard } = useFormStore();
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDashboard({ profilePhotoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!dashboardState.isDashboardUnlocked) {
    return <Navigate to="/dashboard/tutorials" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1 className="heading-1" style={{ marginBottom: '1.5rem' }}>Dashboard</h1>

      {/* Profile Header & Points */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Profile Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                border: '2px solid var(--brand-primary)'
              }}
            >
              {dashboardState.profilePhotoUrl ? (
                <img src={dashboardState.profilePhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="var(--text-secondary)" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                position: 'absolute', bottom: -5, right: -5, backgroundColor: 'var(--brand-accent)', 
                color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-surface)' 
              }}
            >
              +
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
          </div>
          <div>
            <h2 className="heading-2">{basicInfo.firstName || 'Player Name'} {basicInfo.lastName}</h2>
            <p className="text-secondary">{playerProfile.cricketType || 'Cricket'} Player</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{playerProfile.battingHand} Bat</span>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{playerProfile.bowlingType} Bowl</span>
            </div>
          </div>
        </div>

        {/* Points Card */}
        <div style={{ backgroundColor: 'var(--brand-primary)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
            <Award size={150} />
          </div>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Referral Balance</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{dashboardState.referralPoints}</h1>
            <span style={{ fontWeight: 600 }}>Pts</span>
          </div>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>Keep referring to earn more!</p>
        </div>

      </div>

      {/* Details & Mini Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Registration Details Grid */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--brand-primary)" />
            Player Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p className="text-small">Height</p>
              <p style={{ fontWeight: 500 }}>{playerProfile.height || 'N/A'} cm</p>
            </div>
            <div>
              <p className="text-small">Highest Level</p>
              <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{playerProfile.levelPlayed || 'N/A'}</p>
            </div>
            <div>
              <p className="text-small">Wicketkeeper</p>
              <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{playerProfile.wicketkeeping || 'N/A'}</p>
            </div>
            <div>
              <p className="text-small">Matches Played</p>
              <p style={{ fontWeight: 500 }}>{playerProfile.matchesPlayed || '0'}</p>
            </div>
          </div>
        </div>

        {/* Mini Calendar Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="var(--brand-primary)" />
            Next Match
          </h3>
          
          {dashboardState.upcomingMatches && dashboardState.upcomingMatches.length > 0 ? (
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--brand-accent)', fontWeight: 600 }}>{dashboardState.upcomingMatches[0].type}</span>
                <span className="text-small">{new Date(dashboardState.upcomingMatches[0].date).toLocaleDateString()}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>vs {dashboardState.upcomingMatches[0].opponent}</p>
              <p className="text-small">📍 {dashboardState.upcomingMatches[0].location}</p>
            </div>
          ) : (
             <p className="text-secondary">No upcoming matches scheduled.</p>
          )}
        </div>

      </div>

    </motion.div>
  );
};

export default PlayerDashboard;
