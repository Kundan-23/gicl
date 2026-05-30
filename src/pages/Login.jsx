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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Steps: 'phone', 'otp', 'password', 'set-password'
  const [step, setStep] = useState('phone'); 
  const [role, setRole] = useState(location.state?.role || 'player'); // player, coach
  const [coachId, setCoachId] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      // Mock Check: If phone starts with '99', treat as Returning User. Else, New User.
      if (phone.startsWith('99')) {
        setIsNewUser(false);
        setStep('password');
      } else {
        setIsNewUser(true);
        setStep('otp');
        console.log('OTP sent to new user', phone);
      }
    } else {
      alert("Please enter a valid 10-digit phone number");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP validation
      setStep('set-password');
    } else {
      alert("Invalid OTP. Hint: use 1234");
    }
  };

  const handleSetPassword = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    // Save to store
    updateBasicInfo({ phoneNumber: phone, password: password });
    
    if (isNewUser) {
      navigate('/onboarding/step1');
    } else {
      // It was a forgot password flow for a returning user
      navigate('/dashboard');
    }
  };

  const handlePlayerPasswordLogin = (e) => {
    e.preventDefault();
    if (password === '123456') { // Mock password check
      navigate('/dashboard');
    } else {
      alert("Invalid password. Hint: use 123456");
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

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setStep('otp');
    console.log('OTP sent for password reset to', phone);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px', border: '1px solid var(--bg-surface-elevated)' }}>
        
        {/* Role Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-color)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setRole('player'); setStep('phone'); setIsForgotPassword(false); setPassword(''); setOtp(''); }}
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: role === 'player' ? 'var(--bg-surface)' : 'transparent', color: role === 'player' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Player
          </button>
          <button 
            onClick={() => { setRole('coach'); setStep('phone'); setIsForgotPassword(false); setPassword(''); }}
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: role === 'coach' ? 'var(--bg-surface)' : 'transparent', color: role === 'coach' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Coach
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-1" style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
            {role === 'player' ? 'Player Login' : 'Coach Login'}
          </h1>
          <p className="text-secondary text-small">
            {role === 'coach' && 'Enter your Coach ID and Password'}
            {role === 'player' && step === 'phone' && 'Enter your phone number to continue'}
            {role === 'player' && step === 'password' && 'Enter your password to login'}
            {role === 'player' && step === 'otp' && `Enter the 4-digit code sent to ${phone}`}
            {role === 'player' && step === 'set-password' && 'Set a secure password for future logins'}
          </p>
        </div>

        {/* Coach Flow */}
        {role === 'coach' && (
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
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/coach-onboarding" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                Don't have a Coach account? Apply here.
              </Link>
            </div>
          </form>
        )}

        {/* Player Flow */}
        {role === 'player' && step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              <span className="text-small" style={{ opacity: 0.7, marginTop: '0.25rem' }}>Hint: Start with 99 to simulate returning user.</span>
            </div>
            <button type="submit" className="btn-primary" disabled={phone.length < 10}>
              Continue
            </button>
          </form>
        )}

        {role === 'player' && step === 'password' && (
          <form onSubmit={handlePlayerPasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input 
                type="password" className="form-input" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" disabled={!password}>
              Login
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-0.5rem' }}>
              <button type="button" onClick={() => { setStep('phone'); setPassword(''); }} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Change Phone
              </button>
              <button type="button" onClick={handleForgotPassword} style={{ background: 'none', color: 'var(--brand-accent)', fontSize: '0.875rem' }}>
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {role === 'player' && step === 'otp' && (
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
            <button type="button" onClick={() => { setStep('phone'); setOtp(''); setIsForgotPassword(false); }} style={{ background: 'none', color: 'var(--brand-accent)', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
              Change Phone Number
            </button>
          </form>
        )}

        {role === 'player' && step === 'set-password' && (
          <form onSubmit={handleSetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Create Password</label>
              <input 
                type="password" className="form-input" placeholder="Min 6 characters" value={password}
                onChange={(e) => setPassword(e.target.value)} autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" className="form-input" placeholder="Repeat password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={!password || !confirmPassword}>
              {isNewUser ? 'Save & Continue Registration' : 'Reset & Login'}
            </button>
          </form>
        )}

      </div>
    </motion.div>
  );
};

export default Login;
