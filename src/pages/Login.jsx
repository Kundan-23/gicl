import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormStore } from '../store/useFormStore';

const Login = () => {
  const navigate = useNavigate();
  const { updateBasicInfo } = useFormStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP

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
      updateBasicInfo({ phoneNumber: phone });
      navigate('/onboarding/step1');
    } else {
      alert("Invalid OTP. Hint: use 1234");
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
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-1" style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Player Login</h1>
          <p className="text-secondary text-small">
            {step === 1 ? 'Enter your phone number to receive an OTP' : `Enter the 4-digit code sent to ${phone}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                  +91
                </span>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={phone.length < 10}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Enter OTP</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                autoFocus
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
