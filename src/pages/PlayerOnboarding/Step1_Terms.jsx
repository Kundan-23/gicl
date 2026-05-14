import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormStore } from '../../store/useFormStore';

const Step1_Terms = () => {
  const navigate = useNavigate();
  const { updateBasicInfo } = useFormStore();

  const handleAccept = () => {
    updateBasicInfo({ acceptedTerms: true });
    navigate('/onboarding/step2');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Terms & Conditions</h2>
        <p className="text-small" style={{ marginTop: '0.5rem' }}>Please read and accept to proceed.</p>
      </div>

      <div style={{
        flex: 1,
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        overflowY: 'auto',
        marginBottom: '1.5rem',
        border: '1px solid var(--bg-surface-elevated)'
      }}>
        <h3 className="heading-3" style={{ marginBottom: '1rem' }}>GICL Sports Registration Agreement</h3>
        <p className="text-body" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          Welcome to GICL Sports. By registering as a player, you agree to abide by the rules and regulations set forth by the organization.
        </p>
        <ul className="text-body" style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li>All players must maintain a high standard of sportsmanship.</li>
          <li>Registration fees are non-refundable once paid.</li>
          <li>GICL reserves the right to use media (images/video) captured during events for promotional purposes.</li>
          <li>Players must collaborate and tag GICL on social media platforms as required by the organization.</li>
          <li>The provided information must be accurate. Falsification will lead to immediate disqualification.</li>
        </ul>
        {/* Mock long text */}
        <p className="text-body" style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
        </p>
      </div>

      <button className="btn-primary" onClick={handleAccept}>
        I Accept the Terms & Conditions
      </button>
    </motion.div>
  );
};

export default Step1_Terms;
