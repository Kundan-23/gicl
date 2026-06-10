import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Calendar, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';
import { playerAPI } from '../../services/api';

const MatchBookings = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const res = await playerAPI.getAvailableMatches();
      setMatches(res.data?.matches || []);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load matches.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (match) => {
    try {
      // Create Order
      const res = await playerAPI.createBookingOrder({ matchId: match.id });

      if (res.data.isFree) {
        Swal.fire({ icon: 'success', title: 'Booked!', text: 'You have successfully joined the match.' });
        loadMatches();
        return;
      }

      const { orderId, amount, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'GICL Sports',
        description: `Booking for ${match.match_type}: vs ${match.opponent}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await playerAPI.verifyBookingPayment({
              matchId: match.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            Swal.fire({ icon: 'success', title: 'Payment Successful', text: 'Your slot is confirmed!' });
            loadMatches();
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Verification Failed', text: 'Payment verification failed.' });
          }
        },
        theme: { color: '#F9CB1A' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        Swal.fire({ icon: 'error', title: 'Payment Failed', text: response.error.description });
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to initiate booking.' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Match Bookings</h1>
          <p className="text-secondary" style={{ marginTop: '0.35rem' }}>Book your slot for upcoming matches.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading matches…</div>
      ) : matches.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '4rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <Calendar size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 className="heading-3">No Upcoming Matches</h3>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>There are no upcoming matches available for booking right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {matches.map(match => {
            const isFull = match.total_slots > 0 && match.booked_slots >= match.total_slots;
            const isFree = !match.price_per_slot || match.price_per_slot === 0;

            return (
              <div key={match.id} style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(249, 203, 26, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(249, 203, 26, 0.2)' }}>
                      {match.match_type.toUpperCase()}
                    </span>
                    {isFull ? (
                      <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Fully Booked</span>
                    ) : match.total_slots > 0 ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{match.total_slots - (match.booked_slots || 0)} slots left</span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Available</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>vs {match.opponent}</h3>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={18} />
                    <span style={{ fontSize: '0.9rem' }}>{new Date(match.date).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={18} />
                    <span style={{ fontSize: '0.9rem' }}>{match.venue}</span>
                  </div>
                  
                  {match.description && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                      {match.description}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <IndianRupee size={20} color={isFree ? '#10b981' : 'var(--brand-primary)'} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isFree ? '#10b981' : 'var(--text-primary)' }}>
                        {isFree ? 'FREE' : match.price_per_slot}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleBook(match)}
                      disabled={isFull}
                      style={{ 
                        padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', 
                        background: isFull ? 'rgba(255,255,255,0.1)' : 'var(--brand-primary)', 
                        color: isFull ? 'var(--text-secondary)' : '#121A3F', 
                        fontWeight: 700, border: 'none', cursor: isFull ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}
                    >
                      <ShieldCheck size={18} /> {isFree ? 'Join Now' : 'Book Slot'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default MatchBookings;
