import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Calendar, MapPin, IndianRupee, ShieldCheck, Share2, CheckCircle2, Users, Tag } from 'lucide-react';
import { playerAPI } from '../../services/api';

const TYPE_COLORS = {
  league:     '#3b82f6',
  friendly:   '#10b981',
  tournament: '#f59e0b',
};

const MatchBookings = () => {
  const [matches,  setMatches]  = useState([]);
  const [booked,   setBooked]   = useState(new Set()); // Set of match_ids already booked
  const [loading,  setLoading]  = useState(true);
  const [bookingId, setBookingId] = useState(null); // match id currently being processed

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [matchRes, bookingRes] = await Promise.all([
        playerAPI.getAvailableMatches(),
        playerAPI.getMyBookings(),
      ]);
      setMatches(matchRes.data?.matches || []);
      const bookedIds = new Set((bookingRes.data?.bookings || []).map(b => b.match_id));
      setBooked(bookedIds);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleBook = async (match) => {
    if (booked.has(match.id)) return;
    setBookingId(match.id);
    try {
      const res = await playerAPI.createBookingOrder({ matchId: match.id });
      const { orderId, amount, currency, matchTitle } = res.data;

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      amount,
        currency:    currency,
        name:        'GICL Sports',
        description: `Slot booking — ${matchTitle}`,
        order_id:    orderId,
        prefill: {
          name:  localStorage.getItem('gicl_user') ? JSON.parse(localStorage.getItem('gicl_user') || '{}')?.name : '',
          email: '',
        },
        theme: { color: '#F9CB1A' },
        modal: {
          ondismiss: () => setBookingId(null),
        },
        handler: async function (response) {
          try {
            await playerAPI.verifyBookingPayment({
              matchId:              match.id,
              razorpay_order_id:    response.razorpay_order_id,
              razorpay_payment_id:  response.razorpay_payment_id,
              razorpay_signature:   response.razorpay_signature,
            });
            setBooked(prev => new Set([...prev, match.id]));
            setMatches(prev => prev.map(m =>
              m.id === match.id ? { ...m, booked_slots: (m.booked_slots || 0) + 1 } : m
            ));
            Swal.fire({
              icon: 'success',
              title: '🎉 Slot Confirmed!',
              html: `<p>Your slot for <strong>${matchTitle}</strong> is confirmed.</p><p style="margin-top:0.5rem;color:#94a3b8;font-size:0.875rem;">Payment ID: ${response.razorpay_payment_id}</p>`,
              background: '#1a2340',
              color: '#fff',
              confirmButtonColor: '#F9CB1A',
            });
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Verification Failed', text: err.response?.data?.message || 'Please contact support.', background: '#1a2340', color: '#fff' });
          } finally {
            setBookingId(null);
          }
        },
      };

      if (!window.Razorpay) {
        Swal.fire({ icon: 'error', title: 'Payment Error', text: 'Razorpay failed to load. Please refresh and try again.', background: '#1a2340', color: '#fff' });
        setBookingId(null);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        Swal.fire({ icon: 'error', title: 'Payment Failed', text: response.error.description, background: '#1a2340', color: '#fff' });
        setBookingId(null);
      });
      rzp.open();

    } catch (err) {
      setBookingId(null);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || 'Could not initiate booking. Please try again.',
        background: '#1a2340',
        color: '#fff',
        confirmButtonColor: '#F9CB1A',
      });
    }
  };

  const handleShare = async (match) => {
    const text = `🏏 ${match.match_type?.toUpperCase()} | ${match.title}\n📅 ${new Date(match.date).toLocaleString('en-IN')}\n📍 ${match.venue}\n\nBook your slot on GICL Sports!`;
    if (navigator.share) {
      try { await navigator.share({ title: match.title, text }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      Swal.fire({ icon: 'success', title: 'Copied!', text: 'Match details copied to clipboard.', timer: 1500, showConfirmButton: false, background: '#1a2340', color: '#fff' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 200, backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.6 }} />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Match Bookings</h1>
        <p className="text-secondary" style={{ marginTop: '0.35rem' }}>Book your slot for upcoming matches. Payment is secured via Razorpay.</p>
      </div>

      {matches.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '5rem 2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <Calendar size={52} color="var(--text-secondary)" style={{ margin: '0 auto 1.25rem', opacity: 0.4 }} />
          <h3 className="heading-3">No Upcoming Matches</h3>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Check back soon — new matches will appear here once scheduled by the admin.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {matches.map(match => {
            const isFull     = match.total_slots > 0 && (match.booked_slots || 0) >= match.total_slots;
            const isBooked   = booked.has(match.id);
            const isLoading  = bookingId === match.id;
            const slotsLeft  = match.total_slots > 0 ? match.total_slots - (match.booked_slots || 0) : null;
            const typeColor  = TYPE_COLORS[(match.match_type || '').toLowerCase()] || '#94a3b8';
            const typeLabel  = (match.match_type || '').toUpperCase();

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: isBooked ? '1px solid rgba(16,185,129,0.4)' : '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: isBooked ? '0 0 20px rgba(16,185,129,0.1)' : 'none',
                  transition: 'box-shadow 0.3s',
                }}
              >
                {/* Header stripe */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${typeColor}, ${typeColor}88)` }} />

                {/* Already booked ribbon */}
                {isBooked && (
                  <div style={{ position: 'absolute', top: 16, right: -28, background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 2.5rem', transform: 'rotate(45deg)', transformOrigin: 'center', zIndex: 2, letterSpacing: '0.05em' }}>
                    BOOKED
                  </div>
                )}

                {/* Card top */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ padding: '0.25rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}44`, letterSpacing: '0.06em' }}>
                      {typeLabel}
                    </span>
                    {isFull ? (
                      <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid rgba(239,68,68,0.3)' }}>● FULL</span>
                    ) : slotsLeft !== null ? (
                      <span style={{ fontSize: '0.78rem', color: slotsLeft <= 5 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{slotsLeft} slots left</span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Open</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{match.title}</h3>
                  {match.age_category && match.age_category !== 'Open (All Ages)' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                      <Tag size={12} /> {match.age_category}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={15} />
                    <span style={{ fontSize: '0.875rem' }}>{new Date(match.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={15} />
                    <span style={{ fontSize: '0.875rem' }}>{match.venue || '—'}</span>
                  </div>
                  {match.total_slots > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
                      <Users size={15} />
                      <span style={{ fontSize: '0.875rem' }}>{match.booked_slots || 0} / {match.total_slots} slots filled</span>
                      {/* progress bar */}
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, ((match.booked_slots || 0) / match.total_slots) * 100)}%`, background: isFull ? '#ef4444' : typeColor, transition: 'width 0.4s ease', borderRadius: 9999 }} />
                      </div>
                    </div>
                  )}
                  {match.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '0.65rem 0.875rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', lineHeight: 1.5 }}>
                      {match.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <IndianRupee size={18} color="var(--brand-primary)" />
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', lineHeight: 1 }}>
                        {match.price_per_slot > 0 ? match.price_per_slot : '—'}
                      </span>
                      {match.price_per_slot > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', alignSelf: 'flex-end', marginBottom: 2 }}>/slot</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {/* Share button */}
                      <button
                        onClick={() => handleShare(match)}
                        title="Share"
                        style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Share2 size={16} />
                      </button>

                      {/* Book button */}
                      {isBooked ? (
                        <button disabled style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700, fontSize: '0.875rem', cursor: 'default' }}>
                          <CheckCircle2 size={16} /> Booked
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBook(match)}
                          disabled={isFull || isLoading}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)',
                            background: isFull ? 'rgba(255,255,255,0.06)' : 'var(--brand-primary)',
                            color: isFull ? 'var(--text-secondary)' : '#121A3F',
                            fontWeight: 700, fontSize: '0.875rem', border: 'none',
                            cursor: isFull || isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s',
                            opacity: isLoading ? 0.7 : 1,
                          }}
                        >
                          {isLoading ? (
                            <>Processing…</>
                          ) : isFull ? (
                            'Fully Booked'
                          ) : (
                            <><ShieldCheck size={16} /> Book Slot — ₹{match.price_per_slot}</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default MatchBookings;
