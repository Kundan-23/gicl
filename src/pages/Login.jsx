import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormStore } from '../store/useFormStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateBasicInfo } = useFormStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone/ID, 2 = OTP
  const [role, setRole] = useState(location.state?.role || 'player'); // player, coach
  const [coachId, setCoachId] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep(2);
      // Simulate sending OTP
      console.log('OTP sent to', phone);
    } else {
      alert("Please enter a valid phone number");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP validation
      if (role === 'player') {
        updateBasicInfo({ phoneNumber: phone });
        navigate('/onboarding/step1');
      } else {
        navigate('/coach-dashboard');
      }
    } else {
      alert("Invalid OTP. Hint: use 1234");
    }
  };

  const handleCoachLogin = (e) => {
    e.preventDefault();
    if (coachId && password) {
      navigate('/coach-dashboard');
    } else {
      alert("Please enter Coach ID and Password");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px', border: '1px solid var(--bg-surface-elevated)' }}>
        
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-color)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setRole('player'); setStep(1); setIsForgotPassword(false); }}
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: role === 'player' ? 'var(--bg-surface)' : 'transparent', color: role === 'player' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Player
          </button>
          <button 
            onClick={() => { setRole('coach'); setStep(1); setIsForgotPassword(false); }}
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: role === 'coach' ? 'var(--bg-surface)' : 'transparent', color: role === 'coach' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Coach
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-1" style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
            {role === 'player' ? 'Player Login' : 'Coach Login'}
          </h1>
          <p className="text-secondary text-small">
            {role === 'coach' && !isForgotPassword && 'Enter your Coach ID and Password'}
            {(role === 'player' || isForgotPassword) && step === 1 && 'Enter your phone number to receive an OTP'}
            {(role === 'player' || isForgotPassword) && step === 2 && `Enter the 4-digit code sent to ${phone}`}
          </p>
        </div>

        {role === 'coach' && !isForgotPassword ? (
          <form onSubmit={handleCoachLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Coach ID</label>
              <input type="text" className="form-input" placeholder="e.g. C12345" value={coachId} onChange={e => setCoachId(e.target.value)} autoFocus />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={!coachId || !password}>
              Login
            </button>
            <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', color: 'var(--brand-accent)', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
              Forgot Password? Login with OTP
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/coach-onboarding" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                Don't have a Coach account? Apply here.
              </Link>
            </div>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                  +91
                </span>
                <input 
                  type="tel" className="form-input" placeholder="9876543210" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} autoFocus
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={phone.length < 10}>
              Send OTP
            </button>
            {role === 'coach' && isForgotPassword && (
              <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
                Back to Password Login
              </button>
            )}
            {role === 'player' && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/onboarding/step1" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                  New Player? Register here.
                </Link>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Enter OTP</label>
              <input 
                type="text" className="form-input" placeholder="1234" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))} autoFocus
                style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={otp.length !== 4}>
              Verify & Continue
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', color: 'var(--brand-accent)', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default Login;
