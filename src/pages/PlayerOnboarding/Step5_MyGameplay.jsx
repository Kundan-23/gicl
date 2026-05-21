import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormStore } from '../../store/useFormStore';
import { Camera, Plus, Link as LinkIcon, Trash2, CheckCircle } from 'lucide-react';

const Step5_MyGameplay = () => {
  const navigate = useNavigate();
  const { media, updateMedia, updateDashboard } = useFormStore();
  const [links, setLinks] = useState(media.gameplayLinks || []);
  const [currentLink, setCurrentLink] = useState('');

  const handleAddLink = () => {
    if (currentLink.trim() && currentLink.includes('instagram.com')) {
      setLinks([...links, currentLink.trim()]);
      setCurrentLink('');
    } else {
      alert("Please enter a valid Instagram post or reel link.");
    }
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    if (links.length === 0) {
      alert("Please upload at least one gameplay link.");
      return;
    }
    updateMedia({ gameplayLinks: links });
    // This is the final onboarding step. Proceed to dashboard.
    // Dashboard unlocks only after completing tutorials, which is handled inside Dashboard.
    navigate('/dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">My Gameplay</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Link your best Instagram cricket photos and videos.</p>
        
        <div className="progress-container" style={{ marginTop: '1rem' }}>
          <div className="progress-bar" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="#E1306C" /> Upload from Instagram
          </h3>
          <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Paste the links to your Instagram posts or reels showing your batting, bowling, or fielding skills.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', border: '1px solid var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '0 1rem' }}>
                <LinkIcon size={18} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://www.instagram.com/p/..." 
                  value={currentLink}
                  onChange={(e) => setCurrentLink(e.target.value)}
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                />
              </div>
            </div>
            <button className="btn-secondary" onClick={handleAddLink} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add
            </button>
          </div>

          {/* Uploaded Previews */}
          {links.length > 0 && (
            <div>
              <h4 className="text-small" style={{ fontWeight: 600, marginBottom: '1rem' }}>Uploaded Media ({links.length})</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {links.map((link, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)', overflow: 'hidden', position: 'relative' }}>
                    
                    {/* Mock Instagram Embed Preview */}
                    <div style={{ aspectRatio: '4/5', backgroundColor: '#18181b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
                      <Camera size={32} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{link.substring(0, 30)}...</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderTop: '1px solid var(--bg-surface-elevated)' }}>
                      <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)' }}>
                        <CheckCircle size={14} /> Linked
                      </span>
                      <button onClick={() => handleRemoveLink(idx)} style={{ background: 'none', color: 'var(--error)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className="btn-primary" 
          onClick={onSubmit}
          disabled={links.length === 0}
        >
          Complete Registration & Go to Dashboard
        </button>

      </div>
    </motion.div>
  );
};

export default Step5_MyGameplay;
