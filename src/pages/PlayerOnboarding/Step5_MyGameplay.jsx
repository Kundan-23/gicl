import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormStore } from '../../store/useFormStore';
import { Camera, Plus, Link as LinkIcon, Trash2, CheckCircle, Video } from 'lucide-react';

const categories = [
  { id: 'batting', label: 'Batting' },
  { id: 'bowling', label: 'Bowling' },
  { id: 'fielding', label: 'Fielding' },
  { id: 'wk', label: 'Wicket Keeping' }
];

const Step5_MyGameplay = () => {
  const navigate = useNavigate();
  const { media, updateMedia } = useFormStore();
  
  const [links, setLinks] = useState(media.gameplayLinks || {
    batting: [],
    bowling: [],
    fielding: [],
    wk: []
  });
  
  const [currentCategory, setCurrentCategory] = useState('batting');
  const [currentLink, setCurrentLink] = useState('');

  const handleAddLink = () => {
    if (links[currentCategory].length >= 2) {
      alert(`You can only upload a maximum of 2 videos for ${categories.find(c => c.id === currentCategory).label}.`);
      return;
    }
    
    if (currentLink.trim() && currentLink.includes('instagram.com')) {
      setLinks({
        ...links,
        [currentCategory]: [...links[currentCategory], currentLink.trim()]
      });
      setCurrentLink('');
    } else {
      alert("Please enter a valid Instagram post or reel link.");
    }
  };

  const handleRemoveLink = (category, index) => {
    const updatedCategoryLinks = links[category].filter((_, i) => i !== index);
    setLinks({
      ...links,
      [category]: updatedCategoryLinks
    });
  };

  const onSubmit = () => {
    const totalLinks = Object.values(links).reduce((acc, curr) => acc + curr.length, 0);
    if (totalLinks === 0) {
      alert("Please upload at least one gameplay link in any category.");
      return;
    }
    updateMedia({ gameplayLinks: links });
    // This is the final onboarding step. Proceed to dashboard.
    navigate('/dashboard');
  };

  const totalLinksCount = Object.values(links).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">My Gameplay</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Link your best Instagram cricket photos and videos across categories.</p>
        
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
            Paste the links to your Instagram posts or reels. Max 2 links per category.
          </p>

          {/* Category Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCurrentCategory(cat.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${currentCategory === cat.id ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)'}`,
                  backgroundColor: currentCategory === cat.id ? 'rgba(255,199,44,0.1)' : 'var(--bg-color)',
                  color: currentCategory === cat.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem',
                  fontWeight: currentCategory === cat.id ? 600 : 400
                }}
              >
                {cat.label} ({links[cat.id].length}/2)
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', border: '1px solid var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '0 1rem' }}>
                <LinkIcon size={18} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={`https://www.instagram.com/p/...`} 
                  value={currentLink}
                  onChange={(e) => setCurrentLink(e.target.value)}
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                  disabled={links[currentCategory].length >= 2}
                />
              </div>
            </div>
            <button 
              className="btn-secondary" 
              onClick={handleAddLink} 
              disabled={links[currentCategory].length >= 2}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0 2rem' }}
            >
              <Plus size={18} /> Add
            </button>
          </div>

          {/* Uploaded Previews - Categorized */}
          {totalLinksCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
              {categories.map(cat => {
                if (links[cat.id].length === 0) return null;
                
                return (
                  <div key={cat.id}>
                    <h4 className="text-small" style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-primary)' }}>
                      <Video size={16} /> {cat.label} Videos
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                      {links[cat.id].map((link, idx) => (
                        <div key={idx} style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-surface-elevated)', overflow: 'hidden', position: 'relative' }}>
                          
                          {/* Actual Instagram Embed Preview */}
                          <div style={{ aspectRatio: '4/5', backgroundColor: '#18181b', position: 'relative', overflow: 'hidden' }}>
                            <iframe 
                              src={`${link.split('?')[0].replace(/\/?$/, '')}/embed`} 
                              width="100%" 
                              height="100%" 
                              frameBorder="0" 
                              scrolling="no" 
                              allowTransparency="true"
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                              title={`${cat.label} Preview ${idx + 1}`}
                            ></iframe>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderTop: '1px solid var(--bg-surface-elevated)' }}>
                            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)' }}>
                              <CheckCircle size={14} /> Linked
                            </span>
                            <button onClick={() => handleRemoveLink(cat.id, idx)} style={{ background: 'none', color: 'var(--error)' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button 
          className="btn-primary" 
          onClick={onSubmit}
          disabled={totalLinksCount === 0}
        >
          Complete Registration & Go to Dashboard
        </button>

      </div>
    </motion.div>
  );
};

export default Step5_MyGameplay;
