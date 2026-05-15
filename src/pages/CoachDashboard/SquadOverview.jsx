import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { Users, Activity, X, User } from 'lucide-react';

const SquadOverview = () => {
  const { dashboardData, onboardingData } = useCoachStore();
  const { allocatedPlayers } = dashboardData;
  
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-1">My Squad</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Welcome Coach {onboardingData.name || ''}. Here are your {allocatedPlayers.length} allocated players.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--brand-primary)', color: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          <Users size={18} />
          {allocatedPlayers.length} / 22 Players
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {allocatedPlayers.map((player) => (
          <div 
            key={player.id} 
            onClick={() => setSelectedPlayer(player)}
            style={{ 
              backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--bg-surface-elevated)', display: 'flex', gap: '1rem', alignItems: 'center',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-accent)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--bg-surface-elevated)'}
          >
            <img src={player.profilePic} alt={player.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-accent)' }} />
            
            <div style={{ flex: 1 }}>
              <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{player.name}</h3>
              <p className="text-small" style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Age: {player.age} | {player.height}cm</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-surface-elevated)' }}>
                  {player.battingStyle}
                </span>
                {player.bowlingStyle !== 'None' && (
                  <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-surface-elevated)' }}>
                    {player.bowlingStyle}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Player Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlayer(null)} 
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-secondary)' }}
              >
                <X size={24} />
              </button>

              {/* Profile Header */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                <img 
                  src={selectedPlayer.profilePic} 
                  alt={selectedPlayer.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--brand-primary)', marginBottom: '1rem' }} 
                />
                <h2 className="heading-2" style={{ marginBottom: '0.25rem' }}>{selectedPlayer.name}</h2>
                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> Player ID: {selectedPlayer.id}
                </p>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Age</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedPlayer.age} Years</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Height</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedPlayer.height} cm</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Matches Played</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--brand-primary)' }}>{selectedPlayer.matchesPlayed}</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--success)' }}>Active</p>
                </div>
              </div>

              {/* Play Styles */}
              <h4 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Playing Style</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="text-secondary">Batting</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlayer.battingStyle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="text-secondary">Bowling</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlayer.bowlingStyle || 'None'}</span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SquadOverview;
