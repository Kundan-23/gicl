import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';

const Step2_BasicRegistration = () => {
  const navigate = useNavigate();
  const { basicInfo, updateBasicInfo } = useFormStore();
  const [showInstagramModal, setShowInstagramModal] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: basicInfo,
    mode: 'onBlur'
  });

  const instagramLink = watch('instagramLink');

  const onSubmit = (data) => {
    // If user filled Instagram but didn't approve the modal yet, show modal
    if (data.instagramLink && !data.instagramApproved) {
      setShowInstagramModal(true);
      return;
    }

    updateBasicInfo(data);
    // Proceed to Payment Mock
    navigate('/onboarding/payment');
  };

  const handleInstagramApprove = () => {
    updateBasicInfo({ instagramApproved: true });
    setShowInstagramModal(false);
    handleSubmit(onSubmit)(); // Re-trigger submit now that it's approved
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Registration Form</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Enter your personal details.</p>
        
        {/* Progress Bar */}
        <div className="progress-container" style={{ marginTop: '1rem' }}>
          <div className="progress-bar" style={{ width: '25%' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Referral Details</h3>
          
          <Controller
            name="referralPhone"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ paddingTop: '0.75rem', color: 'var(--text-secondary)' }}>
                  Referral Phone Number <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex' }}>
                    <div className="form-input" style={{ width: '80px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>IN +91</div>
                    <input {...field} className="form-input" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1 }} />
                  </div>
                  <p className="text-small" style={{ opacity: 0.8 }}>If Not Available! Please use " 9152570595" as Referral Code.</p>
                  {errors.referralPhone && <span className="form-error">{errors.referralPhone.message}</span>}
                </div>
              </div>
            )}
          />

          <Controller
            name="referralFirstName"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ paddingTop: '0.75rem', color: 'var(--text-secondary)' }}>
                  Referral First Name <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input {...field} className="form-input" />
                  <p className="text-small" style={{ opacity: 0.8 }}>If Not Available! Please use " GICL" as Referral First Name.</p>
                  {errors.referralFirstName && <span className="form-error">{errors.referralFirstName.message}</span>}
                </div>
              </div>
            )}
          />

          <Controller
            name="referralLastName"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ paddingTop: '0.75rem', color: 'var(--text-secondary)' }}>
                  Referral Last Name <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input {...field} className="form-input" />
                  <p className="text-small" style={{ opacity: 0.8 }}>If Not Available! Please use " SPORTS" as Referral Last Name.</p>
                  {errors.referralLastName && <span className="form-error">{errors.referralLastName.message}</span>}
                </div>
              </div>
            )}
          />
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Personal Info</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input {...field} className="form-input" placeholder="John" />
                  {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input {...field} className="form-input" placeholder="Doe" />
                  {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                </div>
              )}
            />
          </div>

          <Controller
            name="dob"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Date Of Birth *</label>
                <input type="date" {...field} className="form-input" />
                {errors.dob && <span className="form-error">{errors.dob.message}</span>}
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ 
              required: 'Required',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "invalid email address" }
            }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input type="email" {...field} className="form-input" placeholder="john@example.com" />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>
            )}
          />

          <Controller
            name="whatsapp"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">WhatsApp Number *</label>
                <input {...field} className="form-input" />
                {errors.whatsapp && <span className="form-error">{errors.whatsapp.message}</span>}
              </div>
            )}
          />

          <Controller
            name="jerseySize"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Jersey / T-Shirt Size *</label>
                <select {...field} className="form-input">
                  <option value="">--Select--</option>
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                  <option value="XXL">XXL</option>
                </select>
                {errors.jerseySize && <span className="form-error">{errors.jerseySize.message}</span>}
              </div>
            )}
          />
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Address Details</h3>
          
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Residential Full Address *</label>
                <textarea {...field} className="form-input" rows={3} placeholder="Flat, Building, Street..." />
                {errors.address && <span className="form-error">{errors.address.message}</span>}
              </div>
            )}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input {...field} className="form-input" />
                  {errors.city && <span className="form-error">{errors.city.message}</span>}
                </div>
              )}
            />
            <Controller
              name="pincode"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input {...field} className="form-input" />
                  {errors.pincode && <span className="form-error">{errors.pincode.message}</span>}
                </div>
              )}
            />
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Social Media</h3>
          
          <Controller
            name="instagramLink"
            control={control}
            render={({ field }) => (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Instagram ID / Link (Optional)</label>
                <input {...field} className="form-input" placeholder="https://instagram.com/yourid" />
                <span className="text-small" style={{ marginTop: '0.25rem', opacity: 0.7 }}>
                  Required for featured player gallery
                </span>
              </div>
            )}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Proceed to Payment
        </button>
      </form>

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
              <h3 className="heading-2" style={{ color: 'var(--brand-accent)', marginBottom: '1rem' }}>Collaboration Required</h3>
              <p className="text-body" style={{ marginBottom: '2rem' }}>
                Every activity under GICL should be tagged and collaborated on Instagram. Do you agree to these terms?
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowInstagramModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleInstagramApprove}
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Step2_BasicRegistration;
