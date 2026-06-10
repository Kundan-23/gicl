import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Calendar, Users, Target } from 'lucide-react';
import { coachAPI } from '../../services/api';
import { useCoachStore } from '../../store/useCoachStore';

const CreateSlot = () => {
  const { players } = useCoachStore();
  const [slotType, setSlotType] = useState('practice_match'); // 'practice_match' or 'training'
  const [practiceMatches, setPracticeMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  
  // Training Slot specific
  const [trainingType, setTrainingType] = useState('batting');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slotType === 'practice_match') {
      loadPracticeMatches();
    }
  }, [slotType]);

  const loadPracticeMatches = async () => {
    try {
      const res = await coachAPI.getPracticeMatches();
      setPracticeMatches(res.data?.matches || []);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load practice matches' });
    }
  };

  const togglePlayer = (id) => {
    setSelectedPlayers(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPlayers.length === 0) {
      return Swal.fire({ icon: 'warning', title: 'Wait!', text: 'Please select at least one player.' });
    }

    setLoading(true);
    try {
      if (slotType === 'practice_match') {
        if (!selectedMatch) return Swal.fire({ icon: 'warning', title: 'Wait!', text: 'Please select a practice match.' });
        await coachAPI.submitMatchSquad({
          matchId: selectedMatch,
          playerIds: selectedPlayers
        });
        Swal.fire({ icon: 'success', title: 'Success', text: 'Squad submitted for the match!' });
      } else {
        if (!scheduledTime) return Swal.fire({ icon: 'warning', title: 'Wait!', text: 'Please select a date and time.' });
        await coachAPI.submitTrainingSlot({
          trainingType,
          scheduledTime,
          playerIds: selectedPlayers
        });
        Swal.fire({ icon: 'success', title: 'Success', text: 'Training slot submitted for approval!' });
      }
      setSelectedPlayers([]);
      setSelectedMatch('');
      setScheduledTime('');
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1 className="heading-1">Create Practice Slot</h1>
      <p className="text-secondary" style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
        Schedule your players for practice matches or focused training sessions.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setSlotType('practice_match')}
          style={{
            flex: 1, padding: '1rem', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: slotType === 'practice_match' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
            color: slotType === 'practice_match' ? '#121A3F' : 'var(--text-primary)',
            border: `1px solid ${slotType === 'practice_match' ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <Calendar size={20} /> Practice Match
        </button>
        <button
          type="button"
          onClick={() => setSlotType('training')}
          style={{
            flex: 1, padding: '1rem', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: slotType === 'training' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
            color: slotType === 'training' ? '#121A3F' : 'var(--text-primary)',
            border: `1px solid ${slotType === 'training' ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <Target size={20} /> Player Training
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
        <form onSubmit={handleSubmit}>
          
          {slotType === 'practice_match' ? (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Select Practice Match</label>
              <select 
                value={selectedMatch} 
                onChange={e => setSelectedMatch(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '0.875rem', backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <option value="">-- Choose a match --</option>
                {practiceMatches.map(m => (
                  <option key={m.id} value={m.id}>
                    {new Date(m.date).toLocaleString()} - {m.title || m.opponent} ({m.venue})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Training Type</label>
                <select 
                  value={trainingType} 
                  onChange={e => setTrainingType(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '0.875rem', backgroundColor: 'rgba(0,0,0,0.2)' }}
                >
                  <option value="batting">Batting Practice</option>
                  <option value="bowling">Bowling Practice</option>
                  <option value="fielding">Fielding Drills</option>
                  <option value="fitness">Fitness & Conditioning</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduledTime} 
                  onChange={e => setScheduledTime(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '0.875rem', backgroundColor: 'rgba(0,0,0,0.2)', colorScheme: 'dark' }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              <Users size={18} color="var(--brand-primary)" /> Select Players for Squad
            </label>
            
            {players.length === 0 ? (
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>No players allotted to your squad yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {players.map(player => (
                  <div 
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: `1px solid ${selectedPlayers.includes(player.id) ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: selectedPlayers.includes(player.id) ? 'rgba(249, 203, 26, 0.1)' : 'rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '4px', border: `2px solid ${selectedPlayers.includes(player.id) ? 'var(--brand-primary)' : '#555'}`, backgroundColor: selectedPlayers.includes(player.id) ? 'var(--brand-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedPlayers.includes(player.id) && <div style={{ width: '8px', height: '8px', backgroundColor: '#000', borderRadius: '1px' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{player.first_name} {player.last_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{player.gicl_id}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={loading || selectedPlayers.length === 0}
              className="btn-primary"
              style={{ opacity: loading || selectedPlayers.length === 0 ? 0.6 : 1 }}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateSlot;
