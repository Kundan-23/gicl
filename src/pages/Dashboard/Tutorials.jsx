import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormStore } from '../../store/useFormStore';
import { useCoachStore } from '../../store/useCoachStore';
import { PlayCircle, CheckCircle, Upload, Lock, Video, CreditCard, Unlock } from 'lucide-react';

const mockBasicTutorials = [
  { id: 1, title: 'Basic Stance & Grip', duration: '5:20', watched: false },
  { id: 2, title: 'Front Foot Defense', duration: '8:45', watched: false },
  { id: 3, title: 'Running Between Wickets', duration: '4:15', watched: false }
];

const mockAdvanceTutorials = [
  { id: 4, title: 'Advanced Sweep Shot', duration: '10:20' },
  { id: 5, title: 'Reverse Swing Mechanics', duration: '12:45' },
  { id: 6, title: 'Reading the Googly', duration: '8:15' }
];

const Tutorials = () => {
  const { dashboardState, unlockDashboard } = useFormStore();
  const coachUploads = useCoachStore(state => state.dashboardData?.myUploads || []);
  
  const [watchedIds, setWatchedIds] = useState([]);
  const [attemptLink, setAttemptLink] = useState('');
  
  // Mock State for Advance Tutorials
  const [isEligibleForAdvance, setIsEligibleForAdvance] = useState(false); // Simulates coach remark
  const [hasPaidForAdvance, setHasPaidForAdvance] = useState(false); // Simulates payment

  const allBasicTutorials = [...mockBasicTutorials];

  const approvedCoachVideos = coachUploads
    .filter(u => u.status === 'approved')
    .map(u => ({ id: u.id, title: u.title, duration: 'Coach Upload', isCoach: true, url: u.url }));

  const allAdvanceTutorials = [
    ...approvedCoachVideos,
    ...mockAdvanceTutorials
  ];

  const allWatched = allBasicTutorials.every(t => watchedIds.includes(t.id));

  const markWatched = (id) => {
    if (!watchedIds.includes(id)) {
      setWatchedIds([...watchedIds, id]);
    }
  };

  const handleUploadAttempt = () => {
    if (!allWatched) {
      alert("Please watch all Basic Tutorials before submitting your attempt.");
      return;
    }
    if (attemptLink.trim().length > 5) {
      alert("Attempt submitted successfully! Your dashboard is now fully unlocked.");
      unlockDashboard();
    } else {
      alert("Please enter a valid link to your attempt video.");
    }
  };

  const handleMockPayment = () => {
    alert("Redirecting to Razorpay... Payment Successful!");
    setHasPaidForAdvance(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Training Tutorials</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
          {dashboardState.isDashboardUnlocked 
            ? "Re-watch training materials to perfect your game." 
            : "You must complete the Basic Tutorials and upload your attempt to unlock the full dashboard."}
        </p>
      </div>

      {!dashboardState.isDashboardUnlocked && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Lock color="var(--error)" />
          <p style={{ color: 'var(--error)', fontWeight: 500, fontSize: '0.875rem' }}>Full dashboard access is restricted. Watch the videos and submit your attempt below to unlock Matches and Referrals.</p>
        </div>
      )}

      {/* --- Basic Tutorials Section --- */}
      <h2 className="heading-2" style={{ marginBottom: '1.5rem', color: 'var(--brand-primary)' }}>Basic Tutorials</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {allBasicTutorials.map(tutorial => {
          const isWatched = watchedIds.includes(tutorial.id);
          return (
            <div key={tutorial.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: `1px solid ${tutorial.isCoach ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)'}` }}>
              <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
                <PlayCircle size={48} color={tutorial.isCoach ? 'var(--brand-primary)' : 'var(--brand-accent)'} opacity={0.8} />
                {tutorial.isCoach && (
                  <span style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'var(--brand-primary)', color: 'var(--bg-color)', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Video size={12} /> Coach Video
                  </span>
                )}
              </div>
              <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{tutorial.title}</h3>
              <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Duration: {tutorial.duration}</p>
              
              <button 
                className={isWatched ? "btn-secondary" : "btn-primary"} 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => markWatched(tutorial.id)}
                disabled={isWatched}
              >
                {isWatched ? <><CheckCircle size={18} color="var(--success)" /> Watched</> : "Mark as Watched"}
              </button>
            </div>
          )
        })}
      </div>

      {!dashboardState.isDashboardUnlocked && (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-primary)', marginBottom: '3rem' }}>
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
            {!allWatched && <span className="form-error" style={{ marginTop: '0.5rem', display: 'block' }}>You must watch all basic videos first.</span>}
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

      {/* --- Advance Tutorials Section --- */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--bg-surface-elevated)', margin: '3rem 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ color: 'var(--brand-accent)' }}>Advance Tutorials</h2>
        
        {/* Mock Dev Toggle for Eligibility */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
          <span className="text-small" style={{ color: 'var(--text-secondary)' }}>Dev: Coach Remark Toggle</span>
          <input 
            type="checkbox" 
            checked={isEligibleForAdvance} 
            onChange={(e) => setIsEligibleForAdvance(e.target.checked)} 
            style={{ accentColor: 'var(--brand-primary)' }}
          />
        </div>
      </div>

      {!isEligibleForAdvance ? (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px dashed var(--bg-surface-elevated)' }}>
          <Lock size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 className="heading-3">Locked by Coach</h3>
          <p className="text-secondary" style={{ marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0' }}>
            Advance tutorials are locked until your coach reviews your basic attempts and marks you as eligible.
          </p>
        </div>
      ) : !hasPaidForAdvance ? (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--brand-accent)' }}>
          <Unlock size={48} color="var(--brand-accent)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 className="heading-3">You are Eligible!</h3>
          <p className="text-secondary" style={{ marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            Congratulations! Your coach has unlocked Advance Tutorials for you. A small one-time fee is required to access this premium content.
          </p>
          <button className="btn-primary" onClick={handleMockPayment} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 2rem' }}>
            <CreditCard size={20} /> Pay ₹499 to Unlock
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {allAdvanceTutorials.map(tutorial => (
            <div key={tutorial.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: `1px solid ${tutorial.isCoach ? 'var(--brand-primary)' : 'var(--brand-accent)'}` }}>
              <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
                <PlayCircle size={48} color={tutorial.isCoach ? 'var(--brand-primary)' : 'var(--brand-accent)'} opacity={0.8} />
                {tutorial.isCoach && (
                  <span style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'var(--brand-primary)', color: 'var(--bg-color)', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Video size={12} /> Coach Video
                  </span>
                )}
              </div>
              <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{tutorial.title}</h3>
              <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Duration: {tutorial.duration}</p>
              {tutorial.url && tutorial.isCoach ? (
                <a href={tutorial.url} target="_blank" rel="noreferrer" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--bg-color)', backgroundColor: 'var(--brand-primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600 }}>
                  <PlayCircle size={18} /> Watch on Link
                </a>
              ) : (
                <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--brand-accent)', borderColor: 'var(--brand-accent)' }}>
                  <PlayCircle size={18} /> Watch Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </motion.div>
  );
};

export default Tutorials;
