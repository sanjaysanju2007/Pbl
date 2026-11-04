import { useState, useEffect } from 'react';
import { FiMessageSquare, FiPhone, FiMail, FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filter.status]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/enquiries/${id}`, { status });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    new: { label: 'New', color: '#dc2626', bg: '#fef2f2' },
    contacted: { label: 'Contacted', color: '#d97706', bg: '#fffbeb' },
    closed: { label: 'Closed', color: '#16a34a', bg: '#f0fdf4' }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiMessageSquare style={{ color: 'var(--color-primary)' }} /> Manage Parent Enquiries
          </h2>
          <p>Review and follow up with parents inquiring about admission, curriculum, or daycare.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card-section" style={{ marginBottom: '20px' }}>
        <div className="admin-filter-bar">
          <div className="admin-search-input-wrap">
            <input
              type="text"
              placeholder="Search by parent name, email, phone..."
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && fetchEnquiries()}
              className="form-input"
            />
          </div>
          <div className="admin-filter-selects">
            <select
              value={filter.status}
              onChange={e => setFilter({ ...filter, status: e.target.value })}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="new">New Enquiries</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed / Converted</option>
            </select>
            <button type="button" onClick={fetchEnquiries} className="btn btn--primary btn--sm">
              Search
            </button>
          </div>
        </div>

        {/* Quick Status Chips on Mobile */}
        <div className="admin-mobile-quick-chips admin-mobile-only">
          {[
            { val: '', label: 'All' },
            { val: 'new', label: 'New' },
            { val: 'contacted', label: 'Contacted' },
            { val: 'closed', label: 'Closed' }
          ].map(chip => (
            <button
              key={chip.val}
              type="button"
              className={`admin-filter-chip ${filter.status === chip.val ? 'active' : ''}`}
              onClick={() => setFilter({ ...filter, status: chip.val })}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="admin-card-section">
        {loading ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading enquiries...</p>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
            <FiMessageSquare size={36} style={{ opacity: 0.35, marginBottom: '8px' }} />
            <h4>No parent enquiries found</h4>
            <p>New enquiries from the public website will appear here in real time.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="admin-table-wrap admin-desktop-only">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Parent Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Interest / Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(e => {
                    const cfg = statusColors[e.status] || statusColors.new;
                    const phoneClean = (e.phone || '').replace(/\D/g, '');

                    return (
                      <tr key={e._id || e.id}>
                        <td><strong>{e.name}</strong></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <a href={`tel:${e.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                              {e.phone}
                            </a>
                            {phoneClean && (
                              <a
                                href={`https://wa.me/91${phoneClean}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#16a34a' }}
                                title="WhatsApp"
                              >
                                <FaWhatsapp size={13} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <a href={`mailto:${e.email}`} style={{ color: '#64748b', textDecoration: 'none' }}>
                            {e.email}
                          </a>
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          {e.programInterest && <span className="badge badge--yellow" style={{ marginBottom: '4px' }}>{e.programInterest}</span>}
                          <p style={{ fontSize: '0.82rem', lineHeight: 1.4, margin: '2px 0 0', color: '#334155' }}>
                            {e.message}
                          </p>
                        </td>
                        <td>
                          <span className="admin-status" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}>
                            {cfg.label}
                          </span>
                        </td>
                        <td><small>{e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-IN') : 'N/A'}</small></td>
                        <td>
                          <select
                            value={e.status}
                            onChange={ev => updateStatus(e._id || e.id, ev.target.value)}
                            className="form-select"
                            style={{ minWidth: '120px', padding: '5px 8px', fontSize: '0.8rem' }}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Feed */}
            <div className="admin-mobile-cards-feed admin-mobile-only">
              {enquiries.map(e => {
                const cfg = statusColors[e.status] || statusColors.new;
                const phoneClean = (e.phone || '').replace(/\D/g, '');

                return (
                  <div key={e._id || e.id} className="admin-mobile-app-card">
                    <div className="admin-mobile-app-card__head">
                      <span className="admin-mobile-app-card__name" style={{ fontSize: '1.05rem', margin: 0 }}>
                        {e.name}
                      </span>
                      <span className="admin-status" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>

                    {e.programInterest && (
                      <div style={{ marginTop: '6px' }}>
                        <span className="badge badge--yellow">Interested in: {e.programInterest}</span>
                      </div>
                    )}

                    <div style={{ margin: '8px 0', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', fontSize: '0.86rem', color: '#334155' }}>
                      <p style={{ margin: 0, lineHeight: 1.5 }}>"{e.message}"</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', marginBottom: '10px' }}>
                      <span>Received: {e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
                    </div>

                    {/* Quick Contact & Status Bar */}
                    <div className="admin-mobile-app-card__actions" style={{ alignItems: 'center' }}>
                      <a href={`tel:${e.phone}`} className="btn btn--outline btn--sm admin-mobile-action-btn">
                        <FiPhone /> Call
                      </a>
                      {phoneClean && (
                        <a
                          href={`https://wa.me/91${phoneClean}?text=Hello%20${encodeURIComponent(e.name)}%20from%20Chittukurumbakam%20Play%20School`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--outline btn--sm admin-mobile-action-btn admin-mobile-wa-btn"
                        >
                          <FaWhatsapp /> Chat
                        </a>
                      )}
                      <select
                        value={e.status}
                        onChange={ev => updateStatus(e._id || e.id, ev.target.value)}
                        className="form-select admin-mobile-action-btn"
                        style={{ fontSize: '0.8rem', padding: '6px 8px', height: '36px' }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageEnquiries;
