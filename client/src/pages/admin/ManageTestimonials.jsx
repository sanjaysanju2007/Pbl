import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const ManageTestimonials = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ parentName: '', childName: '', program: '', message: '', rating: 5, isApproved: false });

  const fetchItems = async () => { try { const res = await API.get('/testimonials/all'); setItems(res.data.data || []); } catch (err) { console.error(err); } };
  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/testimonials/${editId}`, form); else await API.post('/testimonials', form);
      setForm({ parentName: '', childName: '', program: '', message: '', rating: 5, isApproved: false }); setShowForm(false); setEditId(null); fetchItems();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const toggleApproval = async (item) => {
    try { await API.put(`/testimonials/${item._id}`, { ...item, isApproved: !item.isApproved }); fetchItems(); } catch (err) { console.error(err); }
  };

  const handleEdit = (item) => { setForm({ parentName: item.parentName, childName: item.childName, program: item.program, message: item.message, rating: item.rating, isApproved: item.isApproved }); setEditId(item._id); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/testimonials/${id}`); fetchItems(); } catch (err) { console.error(err); } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>⭐ Manage Testimonials</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ parentName: '', childName: '', program: '', message: '', rating: 5, isApproved: false }); }} className="btn btn--primary btn--sm"><FiPlus /> New</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-inline-form" style={{ flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" placeholder="Parent Name" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} className="form-input" required />
            <input type="text" placeholder="Child Name" value={form.childName} onChange={e => setForm({ ...form, childName: e.target.value })} className="form-input" />
            <select value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} className="form-select"><option value="">Program</option><option value="Playgroup">Playgroup</option><option value="Nursery">Nursery</option><option value="LKG">LKG</option><option value="UKG">UKG</option></select>
          </div>
          <textarea placeholder="Testimonial message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="form-textarea" required rows="3" />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Rating: <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })} style={{ width: '60px' }} className="form-input" /></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="checkbox" checked={form.isApproved} onChange={e => setForm({ ...form, isApproved: e.target.checked })} /> Approved</label>
            <button type="submit" className="btn btn--primary btn--sm">{editId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn--outline btn--sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-cards-list">
        {items.map(i => (
          <div key={i._id} className="admin-item-card">
            <div>
              <h4>{i.parentName} <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#636E72' }}>— {i.childName} ({i.program})</span></h4>
              <p style={{ fontSize: '0.85rem', color: '#636E72', marginTop: '4px', fontStyle: 'italic' }}>"{i.message?.substring(0, 120)}..."</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge badge--yellow">{'⭐'.repeat(i.rating)}</span>
                <span className={`badge ${i.isApproved ? 'badge--green' : 'badge--coral'}`}>{i.isApproved ? 'Approved' : 'Pending'}</span>
              </div>
            </div>
            <div className="admin-item-card__actions">
              <button onClick={() => toggleApproval(i)} className="btn btn--sm" style={{ background: i.isApproved ? '#FF8A8020' : '#66BB6A20', color: i.isApproved ? '#E05A50' : '#43A047', border: 'none', padding: '6px 12px' }}>{i.isApproved ? <FiX /> : <FiCheck />}</button>
              <button onClick={() => handleEdit(i)} className="btn btn--sm btn--outline" style={{ padding: '6px 12px' }}><FiEdit /></button>
              <button onClick={() => handleDelete(i._id)} className="btn btn--sm" style={{ background: '#FF8A8020', color: '#E05A50', border: 'none', padding: '6px 12px' }}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTestimonials;
