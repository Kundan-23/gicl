import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';
import { Camera, CheckCircle2 } from 'lucide-react';

const mockClubs = [
  "Mumbai Strikers - Andheri",
  "Delhi Royals - Rohini",
  "Pune Peshwas - Kothrud",
  "Bangalore Blasters - Indiranagar",
  "Chennai Super Kings Academy - Chepauk",
  "Kolkata Knight Riders Academy - Eden Gardens",
  "GICL Official Training Center - Mumbai",
  "None / Independent"
];

const ballTypes = [
  { id: 'red', name: 'Red Leather', color: '#dc2626' },
  { id: 'white', name: 'White Leather', color: '#f8fafc' },
  { id: 'pink', name: 'Pink Leather', color: '#f472b6' },
  { id: 'tennis', name: 'Tennis Ball', color: '#bef264' }
];

const Step4_PlayerProfile = () => {
  const navigate = useNavigate();
  const { basicInfo, playerProfile, updatePlayerProfile } = useFormStore();
  
  // Calculate age from dob
  const [calculatedAge, setCalculatedAge] = useState('');
  useEffect(() => {
    if (basicInfo.dob) {
      const birthDate = new Date(basicInfo.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setCalculatedAge(age);
    }
  }, [basicInfo.dob]);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { 
      ...playerProfile, 
      age: calculatedAge,
      instagramLink: playerProfile.instagramLink || '',
      height: playerProfile.height || '',
      weight: playerProfile.weight || '',
      battingStyle: playerProfile.battingStyle || '',
      bowlingStyle: playerProfile.bowlingStyle || '',
      clubAssociated: playerProfile.clubAssociated || 'no',
      clubName: playerProfile.clubName || '',
      ballsSelected: playerProfile.ballsSelected || [],
      fieldPositions: playerProfile.fieldPositions || [],
      cricketHistory: playerProfile.cricketHistory || [
        { level: 'International', matches: 0 }, 
        { level: 'National', matches: 0 }, 
        { level: 'State', matches: 0 }, 
        { level: 'District', matches: 0 }, 
        { level: 'Taluka', matches: 0 }
      ]
    },
    mode: 'onBlur'
  });

  const watchBallsSelected = watch('ballsSelected') || [];
  const watchClubAssociated = watch('clubAssociated');

  const toggleBall = (id) => {
    if (id === 'none') {
      setValue('ballsSelected', ['none']);
      return;
    }
    let newSelected = [...watchBallsSelected].filter(b => b !== 'none');
    if (newSelected.includes(id)) {
      newSelected = newSelected.filter(b => b !== id);
    } else {
      newSelected.push(id);
    }
    setValue('ballsSelected', newSelected);
  };

  const onSubmit = (data) => {
    updatePlayerProfile({ ...data, age: calculatedAge });
    navigate('/onboarding/step5');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Player Profile</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Help us understand your cricketing skills.</p>
        <div className="progress-container" style={{ marginTop: '1rem' }}>
          <div className="progress-bar" style={{ width: '75%' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Social Media & Physical Stats */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>Essential Details</h3>
          
          <Controller
            name="instagramLink"
            control={control}
            rules={{ required: 'Instagram Link is compulsory for tracking gameplay videos' }}
            render={({ field }) => (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={18} color="#E1306C" /> Instagram Link *
                </label>
                <input {...field} className="form-input" placeholder="https://instagram.com/yourprofile" />
                <span className="text-small" style={{ marginTop: '0.25rem', opacity: 0.7 }}>
                  Required for featured player gallery and video scrutiny
                </span>
                {errors.instagramLink && <span className="form-error">{errors.instagramLink.message}</span>}
              </div>
            )}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="text" className="form-input" value={`${calculatedAge} Years`} disabled style={{ opacity: 0.7, backgroundColor: 'var(--bg-color)' }} />
              <span className="text-small" style={{ marginTop: '0.25rem', opacity: 0.5 }}>Auto-calculated from DOB</span>
            </div>
            
            <Controller
              name="height"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Height (cm) *</label>
                  <input type="number" {...field} className="form-input" placeholder="e.g. 175" />
                  {errors.height && <span className="form-error">{errors.height.message}</span>}
                </div>
              )}
            />
            
            <Controller
              name="weight"
              control={control}
              rules={{ required: 'Required' }}
              render={({ field }) => (
                <div className="form-group">
                  <label className="form-label">Weight (kg) *</label>
                  <input type="number" {...field} className="form-input" placeholder="e.g. 70" />
                  {errors.weight && <span className="form-error">{errors.weight.message}</span>}
                </div>
              )}
            />
          </div>
        </div>

        {/* BCCI Styles */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>Playing Styles (BCCI Classifications)</h3>
          
          <Controller
            name="battingStyle"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Batting Style *</label>
                <select {...field} className="form-input">
                  <option value="">--Select--</option>
                  <option value="RHB">Right-Handed Batter (RHB)</option>
                  <option value="LHB">Left-Handed Batter (LHB)</option>
                  <option value="None">None / Bowler Only</option>
                </select>
                {errors.battingStyle && <span className="form-error">{errors.battingStyle.message}</span>}
              </div>
            )}
          />

          <Controller
            name="bowlingStyle"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Bowling Style *</label>
                <select {...field} className="form-input">
                  <option value="">--Select--</option>
                  <optgroup label="Pace / Fast">
                    <option value="Right-Arm Fast">Right-Arm Fast</option>
                    <option value="Right-Arm Medium">Right-Arm Medium</option>
                    <option value="Left-Arm Fast">Left-Arm Fast</option>
                    <option value="Left-Arm Medium">Left-Arm Medium</option>
                  </optgroup>
                  <optgroup label="Spin">
                    <option value="Right-Arm Off Spin">Right-Arm Off Spin</option>
                    <option value="Right-Arm Leg Spin">Right-Arm Leg Spin</option>
                    <option value="Left-Arm Orthodox">Left-Arm Orthodox</option>
                    <option value="Left-Arm Unorthodox">Left-Arm Unorthodox (Chinaman)</option>
                  </optgroup>
                  <option value="None">None / Batter Only</option>
                </select>
                {errors.bowlingStyle && <span className="form-error">{errors.bowlingStyle.message}</span>}
              </div>
            )}
          />
        </div>

        {/* Ball Selection */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>Ball Types Played With</h3>
          <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Select all that apply.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
            {ballTypes.map((ball) => {
              const isSelected = watchBallsSelected.includes(ball.id);
              return (
                <div 
                  key={ball.id} 
                  onClick={() => toggleBall(ball.id)}
                  style={{
                    border: `2px solid ${isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(255,199,44,0.05)' : 'var(--bg-color)',
                    position: 'relative'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: ball.color, boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.2)' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ball.name}</span>
                  {isSelected && <CheckCircle2 size={16} color="var(--brand-primary)" style={{ position: 'absolute', top: 5, right: 5 }} />}
                </div>
              );
            })}
            
            {/* None Option */}
            <div 
              onClick={() => toggleBall('none')}
              style={{
                border: `2px solid ${watchBallsSelected.includes('none') ? 'var(--brand-accent)' : 'var(--bg-surface-elevated)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: watchBallsSelected.includes('none') ? 'rgba(239,68,68,0.05)' : 'var(--bg-color)',
                gridColumn: '1 / -1' // Span full width if needed, or just let it flow
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>None of the above</span>
            </div>
          </div>
          {watchBallsSelected.length === 0 && <span className="form-error" style={{ display: 'block', marginTop: '0.5rem' }}>Please select at least one option.</span>}
        </div>

        {/* Field Positions */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>Preferred Fielding Positions</h3>
          
          <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--bg-surface-elevated)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/* Placeholder for actual image */}
            <div style={{ width: '100%', maxWidth: '300px', aspectRatio: '1', backgroundColor: '#2f855a', borderRadius: '50%', border: '4px solid #fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '100px', backgroundColor: '#d4d4d8', position: 'absolute' }}></div>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.8rem', zIndex: 10 }}>[Field Map Placeholder]</span>
            </div>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Click on the zones to select your preferred fielding positions.</p>
            
            <Controller
              name="fieldPositions"
              control={control}
              render={({ field }) => (
                <select 
                  multiple 
                  className="form-input" 
                  style={{ height: '100px', backgroundColor: 'var(--bg-surface)' }}
                  onChange={(e) => field.onChange(Array.from(e.target.selectedOptions, option => option.value))}
                >
                  <option value="slip">Slip</option>
                  <option value="gully">Gully</option>
                  <option value="point">Point</option>
                  <option value="cover">Cover</option>
                  <option value="mid-off">Mid Off</option>
                  <option value="mid-on">Mid On</option>
                  <option value="mid-wicket">Mid Wicket</option>
                  <option value="square-leg">Square Leg</option>
                  <option value="fine-leg">Fine Leg</option>
                  <option value="third-man">Third Man</option>
                </select>
              )}
            />
          </div>
        </div>

        {/* Cricket History */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>Cricket History</h3>
          <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Enter the number of matches played at each level (Enter 0 if none).</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(playerProfile.cricketHistory || [
              { level: 'International', matches: 0 }, 
              { level: 'National', matches: 0 }, 
              { level: 'State', matches: 0 }, 
              { level: 'District', matches: 0 }, 
              { level: 'Taluka', matches: 0 }
            ]).map((item, index) => (
              <div key={item.level || index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: 600 }}>{item.level}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="text-small" style={{ color: 'var(--text-secondary)' }}>Matches:</span>
                  <Controller
                    name={`cricketHistory.${index}.matches`}
                    control={control}
                    render={({ field }) => (
                      <input 
                        type="number" 
                        {...field} 
                        className="form-input" 
                        style={{ width: '80px', padding: '0.5rem', textAlign: 'center' }} 
                        min="0"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Club Details */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>Club Details</h3>
          
          <Controller
            name="clubAssociated"
            control={control}
            render={({ field }) => (
              <div className="form-group">
                <label className="form-label">Are you associated with a club?</label>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" value="yes" checked={field.value === 'yes'} onChange={(e) => field.onChange(e.target.value)} /> Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" value="no" checked={field.value === 'no'} onChange={(e) => field.onChange(e.target.value)} /> No
                  </label>
                </div>
              </div>
            )}
          />

          {watchClubAssociated === 'yes' && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <Controller
                  name="clubName"
                  control={control}
                  rules={{ required: 'Please select a club' }}
                  render={({ field }) => (
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Select Club *</label>
                      <select {...field} className="form-input">
                        <option value="">-- Select from predefined list --</option>
                        {mockClubs.map(club => (
                          <option key={club} value={club}>{club}</option>
                        ))}
                      </select>
                      {errors.clubName && <span className="form-error">{errors.clubName.message}</span>}
                    </div>
                  )}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={watchBallsSelected.length === 0}>
          Continue to Gameplay Upload
        </button>
      </form>
    </motion.div>
  );
};

export default Step4_PlayerProfile;
