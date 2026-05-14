import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';

const Step5_MediaTutorials = () => {
  const navigate = useNavigate();
  const { media, updateMedia, resetForm } = useFormStore();
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [step, setStep] = useState(media.instagramMediaApproved ? 'gallery' : 'initial'); // initial -> gallery -> tutorials

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: media,
  });

  const onSubmitInitial = (data) => {
    updateMedia(data);
    setShowInstagramModal(true);
  };

  const handleInstagramApprove = () => {
    updateMedia({ instagramMediaApproved: true });
    setShowInstagramModal(false);
    setStep('gallery');
  };

  const handleInstagramDecline = () => {
    setShowInstagramModal(false);
    // If declined, they don't get gallery/tutorials. End onboarding? Or just skip?
    alert("Without Instagram collaboration, some features are restricted.");
    navigate('/');
    resetForm();
  };

  const handleComplete = () => {
    alert("Registration Complete!");
    resetForm();
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Media & Tutorials</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Upload your gameplay videos and learn from the pros.</p>
        
        {/* Progress Bar */}
        <div className="progress-container" style={{ marginTop: '1rem' }}>
          <div className="progress-bar" style={{ width: step === 'initial' ? '80%' : '100%' }}></div>
        </div>
      </div>

      {step === 'initial' && (
        <form onSubmit={handleSubmit(onSubmitInitial)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Your Introduction Video</h3>
            
            <Controller
              name="videoLink"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Upload Video Link *</label>
                  <input {...field} className="form-input" placeholder="YouTube or Drive link" />
                  {errors.videoLink && <span className="form-error">{errors.videoLink.message}</span>}
                </div>
              )}
            />
          </div>

          <button type="submit" className="btn-primary">
            Next Step
          </button>
        </form>
      )}

      {step === 'gallery' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <h3 className="heading-3" style={{ marginBottom: '1rem', color: 'var(--brand-primary)' }}>Player Gallery Unlocked!</h3>
            <p className="text-body" style={{ marginBottom: '1rem' }}>Upload your images and videos of you playing cricket here to be featured.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ aspectRatio: '1', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>+</div>
              <div style={{ aspectRatio: '1', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}></div>
              <div style={{ aspectRatio: '1', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}></div>
            </div>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Upload Media</button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Pro Tutorials</h3>
            <p className="text-body" style={{ marginBottom: '1rem' }}>Watch the tutorial below and upload a video of yourself playing in that style.</p>
            
            {/* Mock Video Player */}
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                ▶
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Attempt (Video Link)</label>
              <input className="form-input" placeholder="Paste link here..." />
            </div>
          </div>

          <button className="btn-primary" onClick={handleComplete}>
            Complete Registration
          </button>
        </motion.div>
      )}

      {/* Instagram Approval Modal */}
      <AnimatePresence>
        {showInstagramModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="heading-2" style={{ color: 'var(--brand-accent)', marginBottom: '1rem' }}>Instagram Collaboration</h3>
              <p className="text-body" style={{ marginBottom: '2rem' }}>
                Every activity under GICL should be tagged and collaborated on Instagram. Do you agree to participate?
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={handleInstagramDecline}
                >
                  No
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleInstagramApprove}
                >
                  Yes, Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Step5_MediaTutorials;
