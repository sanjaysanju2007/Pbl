import { useState, useEffect } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      const res = await API.get('/enquiries', { params });
      setEnquiries(res.data.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, [filter.status]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/enquiries/${id}`, { status });
      fetchEnquiries();
    } catch (err) { console.error(err); }
  };

  const statusColors = { new: '#FF8A80', contacted: '#FFD54F', closed: '#66BB6A' };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiMessageSquare style={{ color: 'var(--color-primary)' }} /> Manage Enquiries</h2>
      <div className="admin-filters">
        <input type="text" placeholder="Search by name, email, phone..." value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} onKeyDown={e => e.key === 'Enter' && fetchEnquiries()} className="form-input" style={{ maxWidth: '300px' }} />
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} className="form-select" style={{ maxWidth: '180px' }}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={fetchEnquiries} className="btn btn--primary btn--sm">Search</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Email</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No enquiries found</td></tr>
              ) : enquiries.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.phone}</td>
                  <td>{e.email}</td>
                  <td style={{ maxWidth: '200px' }}><p style={{ fontSize: '0.8rem', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{e.message}</p></td>
                  <td><span className="admin-status" style={{ background: `${statusColors[e.status]}30`, color: statusColors[e.status] }}>{e.status}</span></td>
                  <td>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <select value={e.status} onChange={ev => updateStatus(e._id, ev.target.value)} className="form-select" style={{ minWidth: '120px', padding: '6px 10px', fontSize: '0.8rem' }}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEnquiries;
