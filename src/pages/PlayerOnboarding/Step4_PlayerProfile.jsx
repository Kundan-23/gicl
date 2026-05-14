import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';

const Step4_PlayerProfile = () => {
  const navigate = useNavigate();
  const { playerProfile, updatePlayerProfile } = useFormStore();

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: playerProfile,
  });

  const watchCricketType = watch('cricketType');
  const watchClubAssociated = watch('clubAssociated');

  const onSubmit = (data) => {
    updatePlayerProfile(data);
    navigate('/onboarding/step5');
  };

  const cricketTypes = [
    { id: 'tennis', label: 'Tennis' },
    { id: 'synthetic', label: 'Synthetic' },
    { id: 'season', label: 'Season' },
    { id: 'soft_leather', label: 'Soft Leather' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Player Profile</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Tell us about your cricketing experience.</p>
        
        {/* Progress Bar */}
        <div className="progress-container" style={{ marginTop: '1rem' }}>
          <div className="progress-bar" style={{ width: '60%' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Cricket Type Selector */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>What kind of cricket have you played? *</label>
          <div className="selection-grid">
            {cricketTypes.map((type) => (
              <div 
                key={type.id}
                className={`selection-card ${watchCricketType === type.id ? 'active' : ''}`}
                onClick={() => setValue('cricketType', type.id, { shouldValidate: true })}
              >
                <span style={{ fontWeight: 600 }}>{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Batting Profile */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Batting Profile</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Controller
              name="battingHand"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Batting Style *</label>
                  <select {...field} className="form-input">
                    <option value="">Select</option>
                    <option value="rightie">Right Handed</option>
                    <option value="leftie">Left Handed</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="height"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Height (cm) *</label>
                  <input type="number" {...field} className="form-input" placeholder="175" />
                </div>
              )}
            />
          </div>

          <Controller
            name="bowlTypePlayed"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Type of Bowl Played *</label>
                <select {...field} className="form-input">
                  <option value="">Select</option>
                  <option value="season">Season</option>
                  <option value="tennis">Tennis</option>
                  <option value="both">Both</option>
                </select>
              </div>
            )}
          />
        </div>

        {/* Bowling Profile */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Bowling Profile</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Controller
              name="bowlingHand"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Bowling Style *</label>
                  <select {...field} className="form-input">
                    <option value="">Select</option>
                    <option value="rightie">Right Arm</option>
                    <option value="leftie">Left Arm</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="bowlingType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Bowling Type *</label>
                  <select {...field} className="form-input">
                    <option value="">Select</option>
                    <option value="fast">Fast</option>
                    <option value="spin">Spin</option>
                    <option value="pace">Medium Pace</option>
                  </select>
                </div>
              )}
            />
          </div>
        </div>

        {/* Fielding */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Fielding Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Controller
              name="wicketkeeping"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Wicketkeeping Experience? *</label>
                  <select {...field} className="form-input">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="fieldPosition"
              control={control}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Best Field Position</label>
                  <input {...field} className="form-input" placeholder="e.g. Point, Slip" />
                </div>
              )}
            />
          </div>
        </div>

        {/* History */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>History & Experience</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Controller
              name="matchesPlayed"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">No. of Matches Played *</label>
                  <input type="number" {...field} className="form-input" placeholder="50" />
                </div>
              )}
            />
            <Controller
              name="levelPlayed"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Highest Level Played *</label>
                  <select {...field} className="form-input">
                    <option value="">Select</option>
                    <option value="taluka">Taluka Level</option>
                    <option value="district">District Level</option>
                    <option value="state">State Level</option>
                    <option value="national">National Level</option>
                    <option value="international">International Level</option>
                  </select>
                </div>
              )}
            />
          </div>
        </div>

        {/* Club Affiliation */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1rem', fontSize: '1rem' }}>Club Affiliation</h3>
          
          <Controller
            name="clubAssociated"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Are you associated with any club? *</label>
                <select {...field} className="form-input">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            )}
          />

          {watchClubAssociated === 'yes' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Controller
                name="clubDetails"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="form-group">
                    <label className="form-label">List Clubs & Locations *</label>
                    <textarea {...field} className="form-input" rows={2} placeholder="Club Name - Location" />
                  </div>
                )}
              />
              <Controller
                name="playOutsideClub"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Allowed to play outside the club? *</label>
                    <select {...field} className="form-input">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
              />
            </motion.div>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={!watchCricketType}>
          Save & Continue
        </button>
      </form>
    </motion.div>
  );
};

export default Step4_PlayerProfile;
