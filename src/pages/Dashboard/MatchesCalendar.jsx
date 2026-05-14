import React from 'react';
import { motion } from 'framer-motion';
import { useFormStore } from '../../store/useFormStore';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const MatchesCalendar = () => {
  const { dashboardState } = useFormStore();
  const { upcomingMatches } = dashboardState;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1">GICL Match Calendar</h1>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>View upcoming matches synced from the global calendar.</p>
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
                <div style={{ flex: 1 }}>
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

export default MatchesCalendar;
