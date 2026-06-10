import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';

const thStyle = { padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' };
const tdStyle = { padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' };
const inputStyle = { width: '100%', padding: '0.7rem 0.875rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.875rem' };
const labelStyle = { display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 };

const MATCH_TYPES = ['League', 'Friendly', 'Tournament', 'Practice'];
const EMPTY = { opponent: '', date: '', venue: '', match_type: 'League', description: '', price_per_slot: 0, total_slots: 0 };

const MatchModal = ({ match, onClose, onSave }) => {
  const [form, setForm] = useState(match ? {
    opponent: match.opponent || '', date: match.date ? match.date.slice(0, 16) : '',
    venue: match.venue || '', match_type: match.match_type || 'League', description: match.description || '',
    price_per_slot: match.price_per_slot || 0, total_slots: match.total_slots || 0,
  } : { ...EMPTY });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave({ ...form }); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', padding: '2rem', width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="heading-2">{match ? 'Edit Match' : 'Schedule Match'}</h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Opponent *</label>
            <input required value={form.opponent} onChange={e => set('opponent', e.target.value)} style={inputStyle} placeholder="Team name" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Date & Time *</label>
              <input required type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Match Type</label>
              <select value={form.match_type} onChange={e => set('match_type', e.target.value)} style={{ ...inputStyle, appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em', paddingRight: '2.5rem' }}>
                {MATCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Price per Slot (₹)</label>
              <input type="number" min="0" value={form.price_per_slot} onChange={e => set('price_per_slot', Number(e.target.value))} style={inputStyle} placeholder="0 for free" />
            </div>
            <div>
              <label style={labelStyle}>Total Slots</label>
              <input type="number" min="0" value={form.total_slots} onChange={e => set('total_slots', Number(e.target.value))} style={inputStyle} placeholder="0 for unlimited" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Venue</label>
            <input value={form.venue} onChange={e => set('venue', e.target.value)} style={inputStyle} placeholder="Ground / location" />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Optional notes…" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', color: '#121A3F', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', border: 'none' }}>
              {saving ? 'Saving…' : match ? 'Save Changes' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TypeBadge = ({ type }) => {
  const colorMap = { League: '#3b82f6', Friendly: '#10b981', Tournament: '#f59e0b', Practice: '#a78bfa' };
  const col = colorMap[type] || '#94a3b8';
  return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: `${col}22`, color: col, border: `1px solid ${col}44` }}>{type}</span>;
};

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await adminAPI.getMatches();
      setMatches(r.data?.matches || r.data || []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to load matches.', background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: 'var(--brand-primary)' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal && modal !== 'add') {
        await adminAPI.updateMatch(modal.id, data);
        Swal.fire({ icon: 'success', title: 'Match Updated!', timer: 1200, showConfirmButton: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });
      } else {
        await adminAPI.createMatch(data);
        Swal.fire({ icon: 'success', title: 'Match Scheduled!', timer: 1200, showConfirmButton: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });
      }
      setModal(null);
      load();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Operation failed.', background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: 'var(--brand-primary)' });
      throw err;
    }
  };

  const handleDelete = async (m) => {
    const result = await Swal.fire({
      title: 'Delete Match?',
      text: `vs ${m.opponent} on ${new Date(m.date).toLocaleDateString('en-IN')}`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: 'transparent',
      confirmButtonText: 'Delete', background: 'var(--bg-surface)', color: 'var(--text-primary)',
    });
    if (!result.isConfirmed) return;
    try {
      await adminAPI.deleteMatch(m.id);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1000, showConfirmButton: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });
      load();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to delete.', background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: 'var(--brand-primary)' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-1">Matches</h1>
          <p className="text-secondary" style={{ marginTop: '0.35rem' }}>Schedule and manage GICL matches.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', color: '#121A3F', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(249,203,26,0.25)', transition: 'all 0.15s' }}
        >
          <Plus size={18} /> Schedule Match
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading matches…</div>
          ) : matches.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No matches scheduled yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={thStyle}>Opponent</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Venue</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Price (₹)</th>
                  <th style={thStyle}>Slots</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={m.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ ...tdStyle, fontWeight: 700 }}>vs {m.opponent}</td>
                    <td style={tdStyle}>{m.date ? new Date(m.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{m.venue || '—'}</td>
                    <td style={tdStyle}><TypeBadge type={m.match_type} /></td>
                    <td style={tdStyle}>{m.price_per_slot || 'Free'}</td>
                    <td style={tdStyle}>{m.booked_slots || 0} / {m.total_slots || '∞'}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.description || '—'}</td>
                    <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setModal(m)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', background: 'rgba(96,165,250,0.1)', color: 'var(--brand-accent)', border: '1px solid rgba(96,165,250,0.25)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(m)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && <MatchModal match={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
};

export default Matches;
