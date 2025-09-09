import { useEffect, useState } from 'react';
import { db, Gym } from './db';
import { nanoid } from 'nanoid';

type FormState = { name: string; city: string; notes: string };
const empty: FormState = { name: '', city: '', notes: '' };

export default function App() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [form, setForm] = useState<FormState>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  async function loadGyms() {
    const rows = await db.gyms.orderBy('createdAt').reverse().toArray();
    setGyms(rows);
  }

  useEffect(() => { loadGyms(); }, []);

  function onChange<K extends keyof FormState>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const name = form.name.trim();
    if (!name) { setError('Name is required'); return; }

    if (editingId) {
      await db.gyms.put({
        id: editingId,
        name,
        city: form.city.trim() || undefined,
        notes: form.notes.trim() || undefined,
        createdAt: gyms.find(g => g.id === editingId)?.createdAt || new Date().toISOString(),
      });
      setEditingId(null);
    } else {
      await db.gyms.add({
        id: nanoid(),
        name,
        city: form.city.trim() || undefined,
        notes: form.notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      });
    }
    setForm(empty);
    await loadGyms();
  }

  function startEdit(g: Gym) {
    setEditingId(g.id);
    setForm({ name: g.name, city: g.city || '', notes: g.notes || '' });
  }

  async function del(id: string) {
    if (!confirm('Delete this gym?')) return;
    await db.gyms.delete(id);
    if (editingId === id) { setEditingId(null); setForm(empty); }
    await loadGyms();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
    setError('');
  }

  return (
    <div style={container}>
      <h1 style={h1}>WT Mobile — Gyms</h1>

      <form onSubmit={onSubmit} style={card}>
        <h2 style={h2}>{editingId ? 'Edit gym' : 'Add a gym'}</h2>

        <label style={label}>
          <span>Name *</span>
          <input
            style={input}
            value={form.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="e.g., Anytime Madrid Centro"
          />
        </label>

        <label style={label}>
          <span>City</span>
          <input
            style={input}
            value={form.city}
            onChange={e => onChange('city', e.target.value)}
            placeholder="Madrid"
          />
        </label>

        <label style={label}>
          <span>Notes</span>
          <textarea
            style={textarea}
            value={form.notes}
            onChange={e => onChange('notes', e.target.value)}
            placeholder="24/7, great racks"
          />
        </label>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={btnPrimary}>
            {editingId ? 'Save changes' : 'Add gym'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={btnGhost}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ ...card, marginTop: 16 }}>
        <h2 style={h2}>Your gyms ({gyms.length})</h2>
        {gyms.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No gyms yet. Add your first above.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {gyms.map(g => (
              <li key={g.id} style={row}>
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {g.city || '—'} · added {new Date(g.createdAt).toLocaleDateString()}
                  </div>
                  {g.notes && <div style={{ fontSize: 12, color: '#374151' }}>{g.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(g)} style={btnSmall}>Edit</button>
                  <button onClick={() => del(g.id)} style={btnSmallDanger}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#6b7280', marginTop: 16 }}>
        Data is saved in your browser (IndexedDB). It persists across refreshes.
      </p>
    </div>
  );
}

/* --- tiny inline styles to avoid adding CSS libs --- */
const container: React.CSSProperties = { maxWidth: 760, margin: '24px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' };
const h1: React.CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 16 };
const h2: React.CSSProperties = { fontSize: 18, fontWeight: 600, margin: '0 0 12px' };
const card: React.CSSProperties = { background: '#fff', padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,.04)' };
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10, fontSize: 14 };
const input: React.CSSProperties = { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 };
const textarea: React.CSSProperties = { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 70, resize: 'vertical' };
const btnPrimary: React.CSSProperties = { background: '#111827', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' };
const btnGhost: React.CSSProperties = { background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' };
const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' };
const btnSmall: React.CSSProperties = { background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' };
const btnSmallDanger: React.CSSProperties = { ...btnSmall, background: '#fee2e2', borderColor: '#fecaca' };
const errorStyle: React.CSSProperties = { color: '#b91c1c', margin: '4px 0 8px', fontSize: 13 };
