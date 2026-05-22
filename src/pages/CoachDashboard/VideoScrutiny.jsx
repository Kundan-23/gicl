import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { Video, CheckCircle, MessageSquare } from 'lucide-react';

const VideoScrutiny = () => {
  const { dashboardData, submitVideoReview } = useCoachStore();
  const { videos } = dashboardData;
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewFlag, setReviewFlag] = useState(''); // 'red', 'yellow', 'green'

  const pendingVideos = videos.filter(v => v.status === 'Pending');
  const reviewedVideos = videos.filter(v => v.status === 'Reviewed');

  const handleReviewSubmit = () => {
    if (!reviewText.trim() || !reviewFlag) {
      alert("Please enter feedback and select a flag.");
      return;
    }
    submitVideoReview(selectedVideo.id, reviewText, reviewFlag);
    setSelectedVideo(null);
    setReviewText('');
    setReviewFlag('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Video Scrutiny</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Review gameplay footage uploaded by your allocated players.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Pending Reviews */}
        <div>
          <h3 className="heading-3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={20} color="var(--brand-accent)" /> Pending ({pendingVideos.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingVideos.map(video => (
              <div key={video.id} onClick={() => setSelectedVideo(video)} style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--brand-accent)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <img src={video.thumbnail} alt="thumbnail" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{video.playerName}</p>
                    <p className="text-small" style={{ opacity: 0.8 }}>{video.title}</p>
                    <p className="text-small" style={{ color: 'var(--brand-accent)', marginTop: '0.25rem' }}>Needs Review</p>
                  </div>
                </div>
              </div>
            ))}
            {pendingVideos.length === 0 && <p className="text-secondary text-small">No pending videos.</p>}
          </div>
        </div>

        {/* Reviewed */}
        <div>
          <h3 className="heading-3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} color="var(--success)" /> Reviewed ({reviewedVideos.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviewedVideos.map(video => (
              <div key={video.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--bg-surface-elevated)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <img src={video.thumbnail} alt="thumbnail" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', opacity: 0.5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{video.playerName}</p>
                      {video.reviewFlag && (
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: video.reviewFlag === 'red' ? '#ef4444' : video.reviewFlag === 'yellow' ? '#eab308' : '#10b981' }} />
                      )}
                    </div>
                    <p className="text-small" style={{ opacity: 0.8 }}>{video.title}</p>
                    <div style={{ marginTop: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontStyle: 'italic', borderLeft: `3px solid ${video.reviewFlag === 'red' ? '#ef4444' : video.reviewFlag === 'yellow' ? '#eab308' : '#10b981'}` }}>
                      "{video.reviewComment}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ maxWidth: '600px', width: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="heading-2">Reviewing: {selectedVideo.playerName}</h3>
                <button onClick={() => setSelectedVideo(null)} style={{ background: 'none', color: 'var(--text-secondary)' }}>Close</button>
              </div>

              {/* Mock Video Player */}
              <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <img src={selectedVideo.thumbnail} alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                <div style={{ position: 'absolute', width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={16} /> Coach Feedback
                </label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  placeholder="Leave detailed text feedback regarding footwork, bat speed, or general technique..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Video Tag / Flag</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setReviewFlag('red')} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `2px solid ${reviewFlag === 'red' ? '#ef4444' : 'transparent'}`, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 600, transition: 'all 0.2s' }}>Needs Work</button>
                  <button onClick={() => setReviewFlag('yellow')} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `2px solid ${reviewFlag === 'yellow' ? '#eab308' : 'transparent'}`, backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', fontWeight: 600, transition: 'all 0.2s' }}>Good, Improve</button>
                  <button onClick={() => setReviewFlag('green')} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `2px solid ${reviewFlag === 'green' ? '#10b981' : 'transparent'}`, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, transition: 'all 0.2s' }}>Excellent</button>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={handleReviewSubmit} disabled={!reviewText.trim() || !reviewFlag}>
                Submit Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoScrutiny;
