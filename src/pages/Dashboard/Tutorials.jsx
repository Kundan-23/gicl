import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormStore } from '../../store/useFormStore';
import { PlayCircle, CheckCircle, Upload, Lock } from 'lucide-react';

const mockTutorials = [
  { id: 1, title: 'Basic Stance & Grip', duration: '5:20', watched: false },
  { id: 2, title: 'Front Foot Defense', duration: '8:45', watched: false },
  { id: 3, title: 'Running Between Wickets', duration: '4:15', watched: false }
];

const Tutorials = () => {
  const { dashboardState, unlockDashboard } = useFormStore();
  const [tutorials, setTutorials] = useState(mockTutorials);
  const [attemptLink, setAttemptLink] = useState('');

  const allWatched = tutorials.every(t => t.watched);

  const markWatched = (id) => {
    setTutorials(tutorials.map(t => t.id === id ? { ...t, watched: true } : t));
  };

  const handleUploadAttempt = () => {
    if (!allWatched) {
      alert("Please watch all tutorials before submitting your attempt.");
      return;
    }
    if (attemptLink.trim().length > 5) {
      alert("Attempt submitted successfully! Your dashboard is now fully unlocked.");
      unlockDashboard();
    } else {
      alert("Please enter a valid link to your attempt video.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Training Tutorials</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
          {dashboardState.isDashboardUnlocked 
            ? "Re-watch training materials to perfect your game." 
            : "You must complete these tutorials and upload your attempt to unlock the full dashboard."}
        </p>
      </div>

      {!dashboardState.isDashboardUnlocked && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Lock color="var(--error)" />
          <p style={{ color: 'var(--error)', fontWeight: 500, fontSize: '0.875rem' }}>Full dashboard access is restricted. Watch the videos and submit your attempt below to unlock Matches and Referrals.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {tutorials.map(tutorial => (
          <div key={tutorial.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--bg-surface-elevated)' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <PlayCircle size={48} color="var(--brand-accent)" opacity={0.8} />
            </div>
            <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{tutorial.title}</h3>
            <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Duration: {tutorial.duration}</p>
            
            <button 
              className={tutorial.watched ? "btn-secondary" : "btn-primary"} 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={() => markWatched(tutorial.id)}
              disabled={tutorial.watched}
            >
              {tutorial.watched ? <><CheckCircle size={18} color="var(--success)" /> Watched</> : "Mark as Watched"}
            </button>
          </div>
        ))}
      </div>

      {!dashboardState.isDashboardUnlocked && (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-primary)' }}>
          <h2 className="heading-2" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload color="var(--brand-primary)" /> Upload Your Attempt
          </h2>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Record yourself practicing the techniques shown above and upload the link here.
          </p>

          <div className="form-group">
            <label className="form-label">Video Link (YouTube, Instagram, or Drive)</label>
            <input 
              className="form-input" 
              placeholder="https://..." 
              value={attemptLink}
              onChange={(e) => setAttemptLink(e.target.value)}
              disabled={!allWatched}
            />
            {!allWatched && <span className="form-error" style={{ marginTop: '0.5rem', display: 'block' }}>You must watch all videos first.</span>}
          </div>

          <button 
            className="btn-primary" 
            style={{ marginTop: '1rem' }}
            onClick={handleUploadAttempt}
            disabled={!allWatched || attemptLink.trim().length === 0}
          >
            Submit & Unlock Dashboard
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Tutorials;
