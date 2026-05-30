import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConfigStore } from '../../store/useConfigStore';
import { Save, AlertCircle } from 'lucide-react';

const AppConfig = () => {
  const { ageGroups, referralPoints, maxSquadSize, matchTeamSize, updateAgeGroups, updateReferralPoints, updateMaxSquadSize, updateMatchTeamSize } = useConfigStore();
  
  // Local state for editing
  const [localAgeGroups, setLocalAgeGroups] = useState([...ageGroups]);
  const [refPoints, setRefPoints] = useState(referralPoints.perUser);
  const [squadSize, setSquadSize] = useState(maxSquadSize || 20);
  const [teamSize, setTeamSize] = useState(matchTeamSize || 11);
  
  const [savedMsg, setSavedMsg] = useState('');

  const handleColorChange = (id, newColor) => {
    setLocalAgeGroups(prev => prev.map(ag => ag.id === id ? { ...ag, color: newColor } : ag));
  };

  const handleSave = () => {
    updateAgeGroups(localAgeGroups);
    updateReferralPoints(refPoints);
    updateMaxSquadSize(squadSize);
    updateMatchTeamSize(teamSize);
    
    setSavedMsg('Global configuration updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">App Configuration</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Manage global settings, pricing, and system variables.</p>
        </div>
        <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      {savedMsg && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--success)' }}>
          <AlertCircle size={20} />
          {savedMsg}
        </div>
      )}

      <div style={{ display: 'grid', gap: '2rem' }}>
        
        {/* Age Groups & Colors */}
        <section style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h2 className="heading-3" style={{ marginBottom: '1.5rem' }}>Age Groups & Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {localAgeGroups.map((ag) => (
              <div key={ag.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)' }}>
                <div>
                  <span className="text-small text-secondary">{ag.cat}</span>
                  <p style={{ fontWeight: 600 }}>{ag.sub}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="color" 
                    value={ag.color} 
                    onChange={(e) => handleColorChange(ag.id, e.target.value)}
                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
                  />
                  <span className="text-small" style={{ fontFamily: 'monospace' }}>{ag.color.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Referrals & Squad Limits */}
        <section style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h2 className="heading-3" style={{ marginBottom: '1.5rem' }}>System Variables</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Points Per Successful Referral</label>
              <input 
                type="number" 
                step="0.1"
                className="form-input" 
                value={refPoints} 
                onChange={(e) => setRefPoints(Number(e.target.value))} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Squad Size (Coach)</label>
              <input 
                type="number" 
                className="form-input" 
                value={squadSize} 
                onChange={(e) => setSquadSize(Number(e.target.value))} 
                min="11"
                max="50"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Match Team Size</label>
              <input 
                type="number" 
                className="form-input" 
                value={teamSize} 
                onChange={(e) => setTeamSize(Number(e.target.value))} 
                min="5"
                max="15"
              />
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default AppConfig;
