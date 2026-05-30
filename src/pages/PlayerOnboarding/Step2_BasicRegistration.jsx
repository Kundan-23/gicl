import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';
import { useConfigStore } from '../../store/useConfigStore';

const Step2_BasicRegistration = () => {
  const navigate = useNavigate();
  const { basicInfo, updateBasicInfo, playerProfile, updatePlayerProfile } = useFormStore();
  const { jerseySizes } = useConfigStore();
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: basicInfo,
    mode: 'onBlur'
  });

  const dobValue = watch('dob');
  const referralCode = watch('referralCodeUsed');

  // Calculate age when DOB changes
  useEffect(() => {
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      // Store in playerProfile so it can be used later
      updatePlayerProfile({ age: age.toString() });
    }
  }, [dobValue, updatePlayerProfile]);

  // Mock Referral Code Autofill
  useEffect(() => {
    if (referralCode && referralCode.toUpperCase() === 'GICL-9999') {
      setValue('referralFirstName', 'John');
      setValue('referralLastName', 'Doe');
    } else if (referralCode && referralCode.length > 5) {
      // Clear if invalid
      setValue('referralFirstName', '');
      setValue('referralLastName', '');
    }
  }, [referralCode, setValue]);

  const currentAge = parseInt(playerProfile.age || '0', 10);
  const isKidSize = currentAge > 0 && currentAge < 16;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('profilePhotoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    updateBasicInfo(data);
    // Proceed to Payment Mock
    navigate('/onboarding/payment');
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
        
        {/* Profile Photo */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Profile Photo</h3>
          <Controller
            name="profilePhotoUrl"
            control={control}
            render={({ field }) => (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed var(--brand-primary)' }}>
                  {field.value ? (
                    <img src={field.value} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>👤</span>
                  )}
                </div>
                <label className="btn-secondary" style={{ width: 'auto', cursor: 'pointer', padding: '0.5rem 1rem' }}>
                  Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </label>
              </div>
            )}
          />
        </div>

        {/* Referral */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Referral Details</h3>
          
          <Controller
            name="referralCodeUsed"
            control={control}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Referral Code (Optional)</label>
                <input {...field} className="form-input" placeholder="e.g. GICL-9999" />
                <p className="text-small" style={{ opacity: 0.8 }}>Hint: Try GICL-9999 to see auto-fill in action.</p>
              </div>
            )}
          />

          {referralCode && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Controller
                name="referralFirstName"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="form-label">Referrer First Name</label>
                    <input {...field} className="form-input" readOnly style={{ opacity: 0.7 }} />
                  </div>
                )}
              />
              <Controller
                name="referralLastName"
                control={control}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="form-label">Referrer Last Name</label>
                    <input {...field} className="form-input" readOnly style={{ opacity: 0.7 }} />
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {/* Personal Info */}
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
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="date" 
                    {...field} 
                    className="form-input" 
                    style={{ colorScheme: 'dark', cursor: 'pointer', flex: 1 }} 
                  />
                  {currentAge > 0 && (
                    <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', color: 'var(--brand-primary)', fontWeight: 'bold' }}>
                      {currentAge} Yrs
                    </div>
                  )}
                </div>
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
                  {jerseySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.jerseySize && <span className="form-error">{errors.jerseySize.message}</span>}
                <button type="button" onClick={() => setShowMeasureModal(true)} style={{ background: 'none', color: 'var(--brand-accent)', textAlign: 'left', fontSize: '0.875rem', marginTop: '0.25rem', textDecoration: 'underline' }}>
                  How to measure yourself?
                </button>
              </div>
            )}
          />
        </div>

        {/* Address */}
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

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Proceed to Payment
        </button>
      </form>

      {/* Measure Size Modal */}
      <AnimatePresence>
        {showMeasureModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowMeasureModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="heading-2" style={{ marginBottom: '1rem' }}>How to Measure</h2>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1rem', border: '1px dashed var(--brand-primary)' }}>
                <span style={{ fontSize: '3rem' }}>📏</span>
                <p style={{ marginTop: '1rem' }}>Placeholder Image: Measurement Guide</p>
                <p className="text-small" style={{ marginTop: '0.5rem' }}>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <button className="btn-primary" onClick={() => setShowMeasureModal(false)}>Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Step2_BasicRegistration;
