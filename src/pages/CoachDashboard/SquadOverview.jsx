import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { useConfigStore } from '../../store/useConfigStore';
import { Users, X, User, Video, Plus, ChevronDown, ChevronRight, PlaySquare } from 'lucide-react';

const SquadOverview = () => {
  const { dashboardData = {}, onboardingData = {}, addUpload } = useCoachStore();
  const { allocatedPlayers = [], myUploads = [] } = dashboardData;
  const { ageGroups } = useConfigStore();
  
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSubFilter, setActiveSubFilter] = useState('All');

  const filters = ['All', 'Juniors', 'Open', 'Masters'];
  
  const availableSubCats = activeFilter === 'All' 
    ? [] 
    : ageGroups.filter(ag => ag.cat === activeFilter).map(ag => ag.sub);

  const displayedPlayers = allocatedPlayers.filter(p => {
    if (activeFilter !== 'All' && p.category !== activeFilter) return false;
    if (activeSubFilter !== 'All' && p.subCategory !== activeSubFilter) return false;
    return true;
  });

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setActiveSubFilter('All');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-1">My Squad</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Welcome Coach {onboardingData.name || ''}. Here are your allocated players and uploads.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--brand-primary)', color: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          <Users size={18} />
          {allocatedPlayers.length} / 16 Players
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: availableSubCats.length > 0 ? '0.5rem' : '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeFilter === f ? 'var(--brand-primary)' : 'var(--bg-surface)',
              color: activeFilter === f ? 'var(--bg-surface)' : 'var(--text-secondary)',
              border: `1px solid ${activeFilter === f ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)'}`,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sub Filters */}
      {availableSubCats.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveSubFilter('All')}
            style={{
              padding: '0.35rem 1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeSubFilter === 'All' ? 'var(--brand-accent)' : 'var(--bg-surface)',
              color: activeSubFilter === 'All' ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeSubFilter === 'All' ? 'var(--brand-accent)' : 'var(--bg-surface-elevated)'}`,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            All {activeFilter}
          </button>
          {availableSubCats.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubFilter(sub)}
              style={{
                padding: '0.35rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeSubFilter === sub ? 'var(--brand-accent)' : 'var(--bg-surface)',
                color: activeSubFilter === sub ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeSubFilter === sub ? 'var(--brand-accent)' : 'var(--bg-surface-elevated)'}`,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Players */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {displayedPlayers.map((player) => {
          const liveColor = ageGroups.find(ag => ag.sub === player.subCategory)?.color || player.color;
          return (
          <div 
            key={player.id} 
            onClick={() => setSelectedPlayer({ ...player, color: liveColor })}
            style={{ 
              backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--bg-surface-elevated)', display: 'flex', gap: '1rem', alignItems: 'center',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = liveColor}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--bg-surface-elevated)'}
          >
            <img src={player.profilePic} alt={player.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${liveColor}` }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {player.name}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: liveColor }}></div>
              </h3>
              <p className="text-small text-secondary" style={{ marginBottom: '0.5rem' }}>{player.subCategory} | Age: {player.age}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  {player.battingStyle}
                </span>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  {player.bowlingStyle}
                </span>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Detailed Player Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPlayer(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
              <button onClick={() => setSelectedPlayer(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-secondary)' }}><X size={24} /></button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                <img src={selectedPlayer.profilePic} alt={selectedPlayer.name} style={{ width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${selectedPlayer.color}`, marginBottom: '1rem' }} />
                <h2 className="heading-2" style={{ marginBottom: '0.25rem' }}>{selectedPlayer.name}</h2>
                <span style={{ backgroundColor: selectedPlayer.color, color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>{selectedPlayer.subCategory}</span>
                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Player ID: {selectedPlayer.id}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small text-secondary" style={{ marginBottom: '0.25rem' }}>Age</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedPlayer.age} Years</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small text-secondary" style={{ marginBottom: '0.25rem' }}>Height</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedPlayer.height} cm</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                  <p className="text-small text-secondary" style={{ marginBottom: '0.25rem' }}>Matches Played</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--brand-primary)' }}>{selectedPlayer.matchesPlayed}</p>
                </div>
              </div>

              <h4 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Playing Style</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="text-secondary">Batting</span><span style={{ fontWeight: 600 }}>{selectedPlayer.battingStyle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="text-secondary">Bowling</span><span style={{ fontWeight: 600 }}>{selectedPlayer.bowlingStyle || 'None'}</span>
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
