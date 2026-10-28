import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const ManageGallery = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', type: 'photo', url: '' });

  const fetchItems = async () => {
    try { const res = await API.get('/gallery'); setItems(res.data.data || []); } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post('/gallery', form); setForm({ title: '', category: '', type: 'photo', url: '' }); setShowForm(false); fetchItems(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await API.delete(`/gallery/${id}`); fetchItems(); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiImage style={{ color: 'var(--color-primary)' }} /> Manage Gallery</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn--primary btn--sm"><FiPlus /> Add Item</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" required />
          <input type="text" placeholder="Category (e.g. Events, Classroom)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input" required />
          <input type="url" placeholder="Image/Video URL" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="form-input" required />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-select"><option value="photo">Photo</option><option value="video">Video</option></select>
          <button type="submit" className="btn btn--primary btn--sm">Save</button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn--outline btn--sm">Cancel</button>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Type</th><th>URL</th><th>Actions</th></tr></thead>
          <tbody>
            {items.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No gallery items</td></tr> :
              items.map(i => (
                <tr key={i._id}>
                  <td><strong>{i.title}</strong></td>
                  <td><span className="badge badge--blue">{i.category}</span></td>
                  <td>{i.type}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.url}</td>
                  <td><button onClick={() => handleDelete(i._id)} className="btn btn--sm" style={{ background: '#FF8A8020', color: '#E05A50', border: 'none', padding: '6px 12px' }}><FiTrash2 /></button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageGallery;
