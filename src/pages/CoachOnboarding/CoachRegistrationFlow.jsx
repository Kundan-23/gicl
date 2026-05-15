import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useCoachStore } from '../../store/useCoachStore';

const CoachRegistrationFlow = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useCoachStore();
  const [step, setStep] = useState(1);

  const { control, handleSubmit, formState: { errors }, trigger } = useForm({
    defaultValues: onboardingData,
    mode: 'onBlur'
  });

  const nextStep = async (fieldsToValidate) => {
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
  };

  const onSubmit = (data) => {
    updateOnboardingData(data);
    alert('Coach Registration Successful!');
    navigate('/coach-dashboard');
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '480px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="heading-2">Coach Application</h2>
          <p className="text-small" style={{ marginTop: '0.5rem' }}>Step {step} of 3</p>
          <div className="progress-container" style={{ marginTop: '1rem' }}>
            <div className="progress-bar" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Basic Details</h3>
              
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input {...field} className="form-input" placeholder="John Doe" />
                    {errors.name && <span className="form-error">{errors.name.message}</span>}
                  </div>
                )}
              />

              <Controller
                name="age"
                control={control}
                rules={{ required: 'Required', min: 18 }}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input type="number" {...field} className="form-input" placeholder="30" />
                    {errors.age && <span className="form-error">Valid age required</span>}
                  </div>
                )}
              />

              <Controller
                name="referralPhone"
                control={control}
                render={({ field }) => (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Referral Phone Number (Optional)</label>
                    <input {...field} className="form-input" placeholder="Referral code" />
                  </div>
                )}
              />

              <button type="button" className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => nextStep(['name', 'age'])}>
                Next: Cricket History
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Cricket Playing History</h3>
              
              <Controller
                name="cricketHistory"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Describe your experience as a player *</label>
                    <textarea {...field} className="form-input" rows={5} placeholder="Highest level played, teams represented, key achievements..." />
                    {errors.cricketHistory && <span className="form-error">{errors.cricketHistory.message}</span>}
                  </div>
                )}
              />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-primary" onClick={() => nextStep(['cricketHistory'])}>Next: Coaching History</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Coaching Experience</h3>
              
              <Controller
                name="coachingHistory"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Describe your coaching history *</label>
                    <textarea {...field} className="form-input" rows={5} placeholder="Certifications, previous clubs coached, years of experience..." />
                    {errors.coachingHistory && <span className="form-error">{errors.coachingHistory.message}</span>}
                  </div>
                )}
              />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </motion.div>
          )}

        </form>
      </motion.div>
    </div>
  );
};

export default CoachRegistrationFlow;
