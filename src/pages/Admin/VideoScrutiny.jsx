import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { Video, Check, X, Search, Clock } from 'lucide-react';

const VideoScrutiny = () => {
  const { dashboardData, updateUploadStatus } = useCoachStore();
  const uploads = dashboardData.myUploads || [];

  const [activeTab, setActiveTab] = useState('pending');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredUploads = uploads.filter(u => u.status === activeTab || (activeTab === 'pending' && !u.status));

  const handleApprove = (id) => {
    updateUploadStatus(id, 'approved', '');
  };

  const handleRejectClick = (id) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const submitReject = (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    updateUploadStatus(id, 'rejected', rejectReason);
    setRejectingId(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Video Scrutiny</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Review and approve tutorial videos uploaded by coaches.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('pending')}
          style={{ padding: '0.5rem 1rem', background: 'none', color: activeTab === 'pending' ? 'var(--brand-primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'pending' ? '2px solid var(--brand-primary)' : '2px solid transparent', fontWeight: activeTab === 'pending' ? 600 : 400 }}
        >
          Pending Review ({uploads.filter(u => u.status === 'pending' || !u.status).length})
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          style={{ padding: '0.5rem 1rem', background: 'none', color: activeTab === 'approved' ? 'var(--brand-primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'approved' ? '2px solid var(--brand-primary)' : '2px solid transparent', fontWeight: activeTab === 'approved' ? 600 : 400 }}
        >
          Approved
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          style={{ padding: '0.5rem 1rem', background: 'none', color: activeTab === 'rejected' ? 'var(--brand-primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'rejected' ? '2px solid var(--brand-primary)' : '2px solid transparent', fontWeight: activeTab === 'rejected' ? 600 : 400 }}
        >
          Rejected
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredUploads.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)' }}>
            <Video size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p className="text-secondary">No videos found for this status.</p>
          </div>
        ) : (
          filteredUploads.map(video => (
            <div key={video.id} style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="heading-3">{video.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <span className="text-small text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> Uploaded {new Date(video.date).toLocaleDateString()}
                    </span>
                  </div>
                  <a href={video.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--brand-primary)', fontSize: '0.875rem' }}>
                    View Video Link ↗
                  </a>
                </div>

                {activeTab === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleApprove(video.id)}
                      style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <Check size={18} /> Approve
                    </button>
                    <button 
                      onClick={() => handleRejectClick(video.id)}
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <X size={18} /> Reject
                    </button>
                  </div>
                )}
                
                {activeTab === 'rejected' && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', maxWidth: '400px' }}>
                    <p className="text-small" style={{ fontWeight: 600, color: 'var(--error)' }}>Rejection Reason:</p>
                    <p className="text-small" style={{ color: 'var(--error)', marginTop: '0.25rem' }}>{video.rejectReason}</p>
                  </div>
                )}
              </div>

              {/* Rejection Input Form inline */}
              <AnimatePresence>
                {rejectingId === video.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ backgroundColor: 'var(--bg-color)', borderTop: '1px solid var(--bg-surface-elevated)', padding: '1.5rem', overflow: 'hidden' }}
                  >
                    <label className="form-label">Reason for Rejection *</label>
                    <textarea 
                      className="form-input" 
                      placeholder="e.g., Lighting is too poor, audio unclear, incorrect technique..." 
                      style={{ minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => setRejectingId(null)} style={{ background: 'none', color: 'var(--text-secondary)' }}>Cancel</button>
                      <button onClick={() => submitReject(video.id)} className="btn-primary" style={{ backgroundColor: 'var(--error)', color: '#fff' }}>Submit Rejection</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

    </motion.div>
  );
};

export default VideoScrutiny;
