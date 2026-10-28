import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiCalendar } from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const ManageEvents = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', type: 'celebration', isPublished: true });

  const fetchItems = async () => { try { const res = await API.get('/events/all'); setItems(res.data.data || []); } catch (err) { console.error(err); } };
  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/events/${editId}`, form); else await API.post('/events', form);
      setForm({ title: '', description: '', date: '', type: 'celebration', isPublished: true }); setShowForm(false); setEditId(null); fetchItems();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (item) => { setForm({ title: item.title, description: item.description, date: item.date?.split('T')[0] || '', type: item.type, isPublished: item.isPublished }); setEditId(item._id); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/events/${id}`); fetchItems(); } catch (err) { console.error(err); } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCalendar style={{ color: 'var(--color-primary)' }} /> Manage Events</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', description: '', date: '', type: 'celebration', isPublished: true }); }} className="btn btn--primary btn--sm"><FiPlus /> New</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-inline-form" style={{ flexDirection: 'column' }}>
          <input type="text" placeholder="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-textarea" required rows="3" />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" style={{ maxWidth: '200px' }} required />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-select" style={{ maxWidth: '180px' }}><option value="celebration">Celebration</option><option value="competition">Competition</option><option value="workshop">Workshop</option><option value="field-trip">Field Trip</option><option value="holiday">Holiday</option><option value="other">Other</option></select>
            <button type="submit" className="btn btn--primary btn--sm">{editId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn--outline btn--sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-cards-list">
        {items.map(i => (
          <div key={i._id} className="admin-item-card">
            <div>
              <h4>{i.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#636E72', marginTop: '4px' }}>{i.description?.substring(0, 100)}...</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge badge--blue">{i.type}</span>
                <span className="badge badge--yellow">{new Date(i.date).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
            <div className="admin-item-card__actions">
              <button onClick={() => handleEdit(i)} className="btn btn--sm btn--outline" style={{ padding: '6px 12px' }}><FiEdit /></button>
              <button onClick={() => handleDelete(i._id)} className="btn btn--sm" style={{ background: '#FF8A8020', color: '#E05A50', border: 'none', padding: '6px 12px' }}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEvents;
