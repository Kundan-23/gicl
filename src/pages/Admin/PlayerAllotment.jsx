import React from 'react';
import { motion } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { useConfigStore } from '../../store/useConfigStore';
import { UserPlus, Users, AlertCircle } from 'lucide-react';

const PlayerAllotment = () => {
  const { dashboardData, simulateAdminAllotment, onboardingData, updateMaxSquadSize } = useCoachStore();
  
  const currentCount = dashboardData.allocatedPlayers?.length || 0;
  const maxSquadSize = dashboardData.maxSquadSize || 20;
  const isFull = currentCount >= maxSquadSize;

  const handleAllot = () => {
    if (isFull) {
      alert("Squad limit reached!");
      return;
    }
    simulateAdminAllotment();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Player Allotment (Mock Admin)</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Simulate assigning players to the logged-in coach.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Allotment Panel */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <UserPlus size={24} color="#3b82f6" />
            </div>
            <div>
              <h3 className="heading-3">Assign New Player</h3>
              <p className="text-small text-secondary">Target: Coach {onboardingData.name || 'Demo'}</p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <p className="text-body">
                Current Squad Size: <strong>{currentCount} / {maxSquadSize}</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-small text-secondary">Set Max Limit:</span>
                <input 
                  type="number" 
                  value={maxSquadSize} 
                  onChange={(e) => updateMaxSquadSize(Number(e.target.value))} 
                  className="input-field" 
                  style={{ width: '80px', padding: '0.25rem 0.5rem', textAlign: 'center' }}
                  min={currentCount}
                />
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${(currentCount / maxSquadSize) * 100}%`,
                  backgroundColor: isFull ? 'var(--error)' : 'var(--brand-primary)',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isFull ? 0.5 : 1 }}
            onClick={handleAllot}
            disabled={isFull}
          >
            <UserPlus size={20} /> 
            {isFull ? 'Squad is Full' : 'Allot Random Player'}
          </button>
          
          {isFull && (
            <p className="text-small" style={{ color: 'var(--error)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
              <AlertCircle size={14} /> Max limit of {maxSquadSize} reached. Increase it above.
            </p>
          )}
        </div>

        {/* Info Panel */}
        <div style={{ backgroundColor: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users size={20} color="var(--brand-accent)" /> How it works
          </h3>
          <p className="text-secondary text-body" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
            In production, this module will fetch the pool of registered players who have cleared trials and allow the admin to manually drag-and-drop or auto-distribute them across multiple teams.
          </p>
          <p className="text-secondary text-body" style={{ lineHeight: 1.6 }}>
            Currently, this mock button generates a random player profile adhering to the age group constraints and pushes them directly into the current coach's state.
          </p>
        </div>

      </div>

    </motion.div>
  );
};

export default PlayerAllotment;
