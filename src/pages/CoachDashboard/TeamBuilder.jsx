import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { useConfig } from '../../context/ConfigContext';
import { ShieldPlus, CheckCircle, Trash2, Users, Plus, X } from 'lucide-react';

const TeamBuilder = () => {
  const { allocatedPlayers = [], teams = [], createTeam } = useCoachStore();
  const { age_groups: ageGroups } = useConfig();
  
  const [teamName, setTeamName] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [filterAgeGroup, setFilterAgeGroup] = useState('All');

  const handleDragStart = (e, player) => {
    e.dataTransfer.setData('playerId', player.id);
  };

  // Generate exact 11 slots
  const slots = Array.from({ length: 11 }, (_, i) => {
    const playerId = selectedPlayerIds[i];
    return {
      index: i,
      player: playerId ? allocatedPlayers.find(p => p.id === playerId) : null
    };
  });

  const allSubCats = Array.from(new Set(allocatedPlayers.map(p => p.subCategory)));

  const availablePlayers = allocatedPlayers.filter(p => 
    !selectedPlayerIds.includes(p.id) && 
    (filterAgeGroup === 'All' || p.subCategory === filterAgeGroup)
  );

  const addPlayer = (id) => {
    if (selectedPlayerIds.length < 11) {
      setSelectedPlayerIds([...selectedPlayerIds, id]);
    } else {
      alert("Your Playing 11 is already full!");
    }
  };

  const removePlayer = (id) => {
    setSelectedPlayerIds(selectedPlayerIds.filter(pid => pid !== id));
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      alert("Please enter a team name.");
      return;
    }
    if (selectedPlayerIds.length !== 11) {
      alert(`You must select exactly 11 players. Currently selected: ${selectedPlayerIds.length}`);
      return;
    }
    createTeam(teamName, selectedPlayerIds);
    setTeamName('');
    setSelectedPlayerIds([]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Team Builder</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Draft your custom starting lineup from the allocated squad.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (minWidth: 1024px)': { gridTemplateColumns: '1fr 350px' } }}>
        
        {/* Left Column: Playing 11 & Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Team Name Input */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-primary)', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldPlus size={18} color="var(--brand-primary)" /> Team Name
              </label>
              <input 
                className="form-input" 
                placeholder="e.g., Match 1 Starting XI" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
              />
            </div>
            <button 
              className="btn-primary" 
              onClick={handleCreateTeam}
              disabled={selectedPlayerIds.length !== 11 || !teamName.trim()}
              style={{ padding: '0.75rem 1.5rem', height: 'fit-content' }}
            >
              Save Lineup
            </button>
          </div>

          {/* Playing 11 Slots */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="heading-3">Playing 11</h3>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: selectedPlayerIds.length === 11 ? 'var(--success)' : 'var(--brand-accent)', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                {selectedPlayerIds.length} / 11 Selected
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              <AnimatePresence>
                {slots.map((slot) => {
                  const liveColor = slot.player ? (ageGroups.find(ag => ag.sub === slot.player.subCategory)?.color || slot.player.color) : 'var(--bg-surface-elevated)';
                  return (
                    <motion.div 
                      key={slot.index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ 
                        aspectRatio: '1', 
                        backgroundColor: slot.player ? 'var(--bg-color)' : 'rgba(255,255,255,0.02)', 
                        border: `1px ${slot.player ? 'solid' : 'dashed'} ${slot.player ? liveColor : 'var(--bg-surface-elevated)'}`,
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '1rem',
                        textAlign: 'center'
                      }}
                    >
                      {slot.player ? (
                        <>
                          <button 
                            onClick={() => removePlayer(slot.player.id)}
                            style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '0.2rem', color: '#fff' }}
                          >
                            <X size={14} />
                          </button>
                          <img src={slot.player.profilePic} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '0.5rem', border: `2px solid ${liveColor}` }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{slot.player.name}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{slot.player.battingStyle}</span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '2rem', color: 'var(--bg-surface-elevated)', fontWeight: 800 }}>{slot.index + 1}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Empty Slot</span>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Existing Teams below */}
          {teams.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
              <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} /> Saved Teams ({teams.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {teams.map(team => (
                  <div key={team.id} style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--brand-primary)' }}>{team.name}</h4>
                    <p className="text-small" style={{ color: 'var(--text-secondary)' }}>11 Players assigned</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Available Squad Sidebar */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)', display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: 'calc(100vh - 100px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 className="heading-3">Available Squad</h3>
              <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Click to add players.</p>
            </div>
            <select 
              className="form-input" 
              style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
              value={filterAgeGroup}
              onChange={(e) => setFilterAgeGroup(e.target.value)}
            >
              <option value="All">All Age Groups</option>
              {allSubCats.map(sc => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>
          
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem' }}>
            {availablePlayers.length > 0 ? (
              availablePlayers.map((player) => {
                const liveColor = ageGroups.find(ag => ag.sub === player.subCategory)?.color || player.color;
                return (
                  <div 
                    key={player.id} 
                    onClick={() => addPlayer(player.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, player)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', 
                      borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s',
                      backgroundColor: 'var(--bg-color)', border: '1px solid var(--bg-surface-elevated)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--bg-surface-elevated)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={player.profilePic} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${liveColor}` }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {player.name}
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: liveColor }}></div>
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{player.subCategory} | {player.battingStyle}</span>
                      </div>
                    </div>
                    <Plus size={16} color="var(--brand-accent)" />
                  </div>
                );
              })
            ) : (
              <p className="text-small text-secondary text-center" style={{ padding: '2rem 0' }}>All 11 slots are filled!</p>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default TeamBuilder;
