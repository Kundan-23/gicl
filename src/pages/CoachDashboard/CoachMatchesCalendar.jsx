import React from 'react';
import { motion } from 'framer-motion';
import { useCoachStore } from '../../store/useCoachStore';
import { Calendar as CalendarIcon, MapPin, Clock, Share2 } from 'lucide-react';

const CoachMatchesCalendar = () => {
  const { dashboardData } = useCoachStore();
  const { upcomingMatches } = dashboardData;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">Coach Match Calendar</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>View upcoming matches scheduled for your team.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {upcomingMatches && upcomingMatches.length > 0 ? (
          upcomingMatches.map((match) => {
            const matchDate = new Date(match.date);
            
            return (
              <div 
                key={match.id}
                style={{ 
                  backgroundColor: 'var(--bg-surface)', 
                  border: '1px solid var(--bg-surface-elevated)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Date Badge */}
                <div style={{ 
                  backgroundColor: 'var(--brand-primary)', 
                  color: 'var(--bg-surface)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '0.5rem 1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  minWidth: '80px'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {matchDate.toLocaleString('default', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, marginTop: '0.25rem' }}>
                    {matchDate.getDate()}
                  </span>
                </div>

                {/* Match Details */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ color: 'var(--brand-accent)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{match.type}</p>
                    <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>vs {match.opponent}</h3>
                    
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <Clock size={16} />
                        {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <MapPin size={16} />
                        {match.location}
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `GICL Match: vs ${match.opponent}`,
                          text: `Join us for the ${match.type} match against ${match.opponent} on ${matchDate.toLocaleString()} at ${match.location}!`,
                          url: window.location.href,
                        }).catch(console.error);
                      } else {
                        alert("Sharing is not supported on this device/browser.");
                      }
                    }}
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
            <CalendarIcon size={48} color="var(--bg-surface-elevated)" style={{ margin: '0 auto 1rem' }} />
            <p className="text-secondary">No upcoming matches at this time.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CoachMatchesCalendar;
