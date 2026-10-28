import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiBell } from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const ManageAnnouncements = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'news', isPublished: true });

  const fetchItems = async () => {
    try { const res = await API.get('/announcements/all'); setItems(res.data.data || []); } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await API.put(`/announcements/${editId}`, form); }
      else { await API.post('/announcements', form); }
      setForm({ title: '', content: '', category: 'news', isPublished: true }); setShowForm(false); setEditId(null); fetchItems();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (item) => { setForm({ title: item.title, content: item.content, category: item.category, isPublished: item.isPublished }); setEditId(item._id); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/announcements/${id}`); fetchItems(); } catch (err) { console.error(err); } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiBell style={{ color: 'var(--color-primary)' }} /> Manage Announcements</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', content: '', category: 'news', isPublished: true }); }} className="btn btn--primary btn--sm"><FiPlus /> New</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-inline-form" style={{ flexDirection: 'column' }}>
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" required />
          <textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="form-textarea" required rows="3" />
          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-select"><option value="news">News</option><option value="update">Update</option><option value="notice">Notice</option><option value="holiday">Holiday</option></select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} /> Published</label>
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
              <p style={{ fontSize: '0.85rem', color: '#636E72', marginTop: '4px' }}>{i.content.substring(0, 100)}...</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge badge--blue">{i.category}</span>
                <span className={`badge ${i.isPublished ? 'badge--green' : 'badge--coral'}`}>{i.isPublished ? 'Published' : 'Draft'}</span>
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

export default ManageAnnouncements;
