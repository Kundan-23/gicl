import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';

const thStyle = { padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' };
const tdStyle = { padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' };

const EMPTY_FORM = { first_name: '', last_name: '', email: '', whatsapp: '', password: '' };

const CoachModal = ({ coach, onClose, onSave }) => {
  const [form, setForm] = useState(coach ? { first_name: coach.first_name || '', last_name: coach.last_name || '', email: coach.email || '', whatsapp: coach.whatsapp || '', password: '' } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (coach && !payload.password) delete payload.password;
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.7rem 0.875rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.875rem' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', padding: '2rem', width: '100%', maxWidth: 500, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="heading-2">{coach ? 'Edit Coach' : 'Add Coach'}</h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input required value={form.first_name} onChange={e => set('first_name', e.target.value)} style={inputStyle} placeholder="First name" />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input required value={form.last_name} onChange={e => set('last_name', e.target.value)} style={inputStyle} placeholder="Last name" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="coach@example.com" />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp</label>
            <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} style={inputStyle} placeholder="+91 XXXXXXXXXX" />
          </div>
          <div>
            <label style={labelStyle}>{coach ? 'New Password (leave blank to keep)' : 'Password *'}</label>
            <input required={!coach} type="password" value={form.password} onChange={e => set('password', e.target.value)} style={inputStyle} placeholder={coach ? 'Leave blank to keep current' : 'Min 8 characters'} minLength={coach ? 0 : 8} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', color: '#121A3F', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', border: 'none' }}>
              {saving ? 'Saving…' : coach ? 'Save Changes' : 'Add Coach'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | coach object

  const load = async () => {
    setLoading(true);
    try {
      const r = await adminAPI.getCoaches();
      setCoaches(r.data?.coaches || r.data || []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to load coaches.', background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: 'var(--brand-primary)' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal && modal !== 'add') {
        await adminAPI.updateCoach(modal.id, data);
        Swal.fire({ icon: 'success', title: 'Coach Updated!', timer: 1200, showConfirmButton: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });
      } else {
        await adminAPI.createCoach(data);
        Swal.fire({ icon: 'success', title: 'Coach Added!', timer: 1200, showConfirmButton: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });
      }
      setModal(null);
      load();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Operation failed.', background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: 'var(--brand-primary)' });
      throw err;
    }
  };

  const handleDelete = async (coach) => {
    const result = await Swal.fire({
      title: `Delete ${coach.first_name} ${coach.last_name}?`,
      text: 'This action cannot be undone.',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: 'transparent',
      confirmButtonText: 'Delete', background: 'var(--bg-surface)', color: 'var(--text-primary)',
    });
    if (!result.isConfirmed) return;
    try {
      await adminAPI.deleteCoach(coach.id);
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
          <h1 className="heading-1">Coaches</h1>
          <p className="text-secondary" style={{ marginTop: '0.35rem' }}>Manage all GICL coaches.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', color: '#121A3F', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(249,203,26,0.25)', transition: 'all 0.15s' }}
        >
          <Plus size={18} /> Add Coach
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading coaches…</div>
          ) : coaches.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No coaches found. Add one!</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>WhatsApp</th>
                  <th style={thStyle}>Players</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{i + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{c.first_name} {c.last_name}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td style={tdStyle}>{c.whatsapp || '—'}</td>
                    <td style={tdStyle}>{c.player_count ?? c.players ?? '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: c.is_active !== false ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: c.is_active !== false ? '#10b981' : '#ef4444', border: `1px solid ${c.is_active !== false ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                        {c.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setModal(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', background: 'rgba(96,165,250,0.1)', color: 'var(--brand-accent)', border: '1px solid rgba(96,165,250,0.25)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}>
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

      {modal && <CoachModal coach={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
};

export default Coaches;
