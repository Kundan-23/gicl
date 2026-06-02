import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import { User, Award, Activity, Star, Info, Shirt, Users, Video } from 'lucide-react';

const PlayerDashboard = () => {
  const { basicInfo, playerProfile, media, dashboardState, updateDashboard } = useFormStore();
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
            <p className="text-secondary">{playerProfile.cricketType || 'Cricket'} Player | ID: {basicInfo.giclId || 'PENDING'}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{playerProfile.battingStyle || 'BAT'}</span>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{playerProfile.bowlingStyle || 'BOWL'}</span>
              {(playerProfile.clubsDetails && playerProfile.clubsDetails.length > 0) && (
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,199,44,0.2)', color: 'var(--brand-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  Club Player
                </span>
              )}
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

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Personal Details Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} color="var(--brand-primary)" />
            Personal Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Gender / Age</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.gender || 'N/A'} / {playerProfile.age || 'N/A'} Years</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Height / Weight</span>
              <span style={{ fontWeight: 500 }}>{playerProfile.height || 'N/A'} cm / {playerProfile.weight || 'N/A'} kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Location</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.state || 'N/A'}, {basicInfo.district || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Referred By Code</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.referralCodeUsed || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Cricket & Club Details Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--brand-primary)" />
            Cricket Profile
          </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
                <span className="text-small text-secondary">Ball Types</span>
                <span style={{ fontWeight: 500 }}>{(playerProfile.ballsSelected || []).join(', ') || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
                <span className="text-small text-secondary">Clubs & Permissions</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(playerProfile.clubsDetails && playerProfile.clubsDetails.length > 0) ? (
                    playerProfile.clubsDetails.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ fontWeight: 500 }}>{c.name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Outside? <strong style={{ color: c.allowedOutside === 'yes' ? 'var(--success)' : 'var(--error)' }}>{c.allowedOutside.toUpperCase()}</strong></span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>None</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span className="text-small text-secondary">Fielding</span>
                <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {(playerProfile.fieldPositions || []).join(', ') || 'N/A'}
                </span>
              </div>
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Kit & Gear Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shirt size={20} color="var(--brand-primary)" />
            Kit & Gear
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Jersey Name</span>
              <span style={{ fontWeight: 500, textTransform: 'uppercase' }}>{basicInfo.jerseyName || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Jersey Size</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.jerseySize || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Lower Size</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.lowerSize || 'N/A'}</span>
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
