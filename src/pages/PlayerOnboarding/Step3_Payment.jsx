import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Step3_Payment = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMockPayment = () => {
    setIsProcessing(true);
    // Simulate Razorpay mock delay
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/onboarding/step4');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="heading-2">Registration Fee</h2>
        <p className="text-body" style={{ marginTop: '1rem' }}>
          To complete your registration and proceed to building your player profile, please complete the payment.
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        marginBottom: '2rem',
        border: '1px solid var(--bg-surface-elevated)'
      }}>
        <p className="text-secondary" style={{ marginBottom: '0.5rem' }}>Amount to Pay</p>
        <h1 className="heading-1" style={{ color: 'var(--brand-primary)' }}>₹ 999.00</h1>
      </div>

      <button 
        className="btn-primary" 
        onClick={handleMockPayment}
        disabled={isProcessing}
        style={{ position: 'relative' }}
      >
        {isProcessing ? 'Processing...' : 'Pay with Razorpay (Mock)'}
      </button>

      <p className="text-small" style={{ marginTop: '1.5rem', opacity: 0.6 }}>
        *This is a mock payment gateway for development purposes.
      </p>
    </motion.div>
  );
};

export default Step3_Payment;
