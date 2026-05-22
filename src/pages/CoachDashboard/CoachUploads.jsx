import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { Video, PlaySquare } from 'lucide-react';

const CoachUploads = () => {
  const { dashboardData, addUpload } = useCoachStore();
  const { myUploads = [] } = dashboardData || {};
  
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const handleUpload = () => {
    if (uploadTitle.trim() && uploadUrl.trim()) {
      addUpload(uploadTitle, uploadUrl);
      setUploadTitle('');
      setUploadUrl('');
    } else {
      alert("Please provide both title and URL");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">My Uploads</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Upload training videos to share them directly with your players' tutorial library.</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--brand-primary)', marginBottom: '2rem' }}>
        <h3 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <PlaySquare size={20} color="var(--brand-primary)" /> Add New Video
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input className="form-input" placeholder="Video Title" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
          <input className="form-input" placeholder="YouTube/Instagram URL" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} style={{ flex: 2, minWidth: '250px' }} />
          <button className="btn-primary" onClick={handleUpload} style={{ width: 'auto', padding: '0 2rem' }}>Upload</button>
        </div>
      </div>

      <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Previously Uploaded</h3>
      {myUploads.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {myUploads.map(upload => (
            <div key={upload.id} style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--bg-surface-elevated)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={20} color="var(--brand-primary)" />
                </div>
                <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{upload.title}</p>
              </div>
              <p className="text-small text-secondary" style={{ wordBreak: 'break-all' }}>{upload.url}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary text-small">No videos uploaded yet.</p>
      )}
    </motion.div>
  );
};

export default CoachUploads;
