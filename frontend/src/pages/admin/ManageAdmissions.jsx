import { useState, useEffect } from 'react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPhone,
  FiMail,
  FiEye,
  FiCheck,
  FiX,
  FiEdit3,
  FiFileText,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiClipboard,
  FiUser,
  FiUsers,
  FiMapPin,
  FiChevronRight
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import API from '../../api';
import './Admin.css';

const statusConfig = {
  submitted: { label: 'New', color: '#2563eb', bg: '#eff6ff' },
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
  under_review: { label: 'Under Review', color: '#0d9488', bg: '#f0fdfa' },
  shortlisted: { label: 'Shortlisted', color: '#7c3aed', bg: '#f5f3ff' },
  approved: { label: 'Approved', color: '#16a34a', bg: '#f0fdf4' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' },
  waitlisted: { label: 'Waitlisted', color: '#64748b', bg: '#f8fafc' }
};

const ManageAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');

  // Status edit state for drawer
  const [editStatus, setEditStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchAdmissions = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (programFilter) params.program = programFilter;
      if (academicYearFilter) params.academicYear = academicYearFilter;

      const res = await API.get('/admissions', { params });
      const rawData = res.data.data || [];
      const seen = new Set();
      const uniqueAdmissions = [];
      rawData.forEach(item => {
        const key = item.applicationNumber || item._id || item.id;
        if (!key || !seen.has(key)) {
          if (key) seen.add(key);
          uniqueAdmissions.push(item);
        }
      });
      setAdmissions(uniqueAdmissions);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to fetch admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions(1);
  }, [statusFilter, programFilter, academicYearFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdmissions(1);
  };

  // Open detail drawer
  const openDetail = (adm) => {
    setSelectedAdmission(adm);
    setEditStatus(adm.status);
    setAdminNotes(adm.adminNotes || '');
    setUpdateMsg('');
    setIsDrawerOpen(true);
  };

  // Save status & admin notes
  const handleStatusUpdate = async () => {
    if (!selectedAdmission) return;
    setUpdating(true);
    setUpdateMsg('');
    try {
      const res = await API.patch(`/admissions/${selectedAdmission._id || selectedAdmission.id}`, {
        status: editStatus,
        adminNotes: adminNotes
      });

      if (res.data.success) {
        setSelectedAdmission(res.data.data);
        setUpdateMsg('Status & notes successfully saved!');
        fetchAdmissions(pagination.page);
      }
    } catch (err) {
      console.error('Update failed:', err);
      setUpdateMsg('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header with Title & Export Action */}
      <div className="admin-page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiClipboard style={{ color: 'var(--color-primary)' }} /> Manage Student Admissions
          </h2>
          <p>Review, filter, shortlist, and contact applicants.</p>
        </div>
        <div className="admin-page-head__actions">
          <a
            href={`/api/admissions/export/csv?status=${statusFilter}&program=${programFilter}`}
            className="btn btn--outline btn--sm"
            download
            title="Download applications to CSV"
          >
            <FiDownload /> Export CSV
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card-section" style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSearchSubmit} className="admin-filter-bar">
          <div className="admin-search-input-wrap">
            <FiSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search kid name, ref number, parents name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="admin-filter-selects">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="submitted">New / Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="Playgroup">Playgroup</option>
              <option value="Nursery">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="Daycare">Daycare</option>
            </select>

            <button type="submit" className="btn btn--primary btn--sm">
              Search
            </button>

            {(search || statusFilter || programFilter || academicYearFilter) && (
              <button
                type="button"
                onClick={() => { setSearch(''); setStatusFilter(''); setProgramFilter(''); setAcademicYearFilter(''); }}
                className="btn btn--outline btn--sm"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Quick Horizontal Status Chips on Mobile */}
        <div className="admin-mobile-quick-chips admin-mobile-only">
          {[
            { val: '', label: 'All' },
            { val: 'submitted', label: 'New' },
            { val: 'under_review', label: 'Review' },
            { val: 'shortlisted', label: 'Shortlist' },
            { val: 'approved', label: 'Approved' }
          ].map(chip => (
            <button
              key={chip.val}
              type="button"
              className={`admin-filter-chip ${statusFilter === chip.val ? 'active' : ''}`}
              onClick={() => setStatusFilter(chip.val)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Section */}
      <div className="admin-card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
            Showing <strong>{admissions.length}</strong> of <strong>{pagination.total}</strong> applications
          </span>
        </div>

        {loading ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading applications...</p>
        ) : admissions.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
            <FiFileText size={40} style={{ opacity: 0.4, marginBottom: '10px' }} />
            <h4>No applications match your filter criteria</h4>
            <p>Try clearing filters or searching with a different keyword.</p>
          </div>
        ) : (
          <>
            {/* 1. Desktop / Tablet Table View */}
            <div className="admin-table-wrap admin-desktop-only">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref Number</th>
                    <th>Kid Name</th>
                    <th>Category & Timing</th>
                    <th>Parents & Location</th>
                    <th>Contact Details</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map(adm => {
                    const cfg = statusConfig[adm.status] || statusConfig.submitted;
                    const refNo = adm.applicationNumber || `CKP-${(adm._id || adm.id).slice(-6).toUpperCase()}`;
                    const phoneClean = (adm.guardianPhone || '').replace(/\D/g, '');

                    return (
                      <tr key={adm._id || adm.id}>
                        <td>
                          <strong style={{ fontFamily: 'monospace', color: '#1d4ed8' }}>
                            {refNo}
                          </strong>
                        </td>
                        <td>
                          <strong>{adm.childName}</strong>
                          {adm.age && <small style={{ display: 'block', color: '#64748b' }}>Age: {adm.age}</small>}
                        </td>
                        <td>
                          <span className="badge badge--blue">{adm.program}</span>
                          {adm.timing && <small style={{ display: 'block', color: '#475569', marginTop: '3px', fontWeight: 600 }}>⏰ {adm.timing}</small>}
                        </td>
                        <td>
                          <strong>{adm.parentName || adm.primaryContactName || adm.fatherName || 'Parent'}</strong>
                          {(adm.location || adm.city) && <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>📍 {adm.location || adm.city}</small>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.82rem' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <a href={`tel:${adm.guardianPhone}`} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FiPhone size={12} /> {adm.guardianPhone}
                              </a>
                              {phoneClean && (
                                <a
                                  href={`https://wa.me/91${phoneClean}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#16a34a', textDecoration: 'none' }}
                                  title="WhatsApp"
                                >
                                  <FaWhatsapp size={13} />
                                </a>
                              )}
                            </div>
                            <a href={`mailto:${adm.guardianEmail}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FiMail size={12} /> {adm.guardianEmail}
                            </a>
                          </div>
                        </td>
                        <td>
                          <span
                            className="admin-status"
                            style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td>
                          <small>{adm.createdAt ? new Date(adm.createdAt).toLocaleDateString('en-IN') : 'N/A'}</small>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => openDetail(adm)}
                            className="btn btn--outline btn--sm"
                            style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                          >
                            <FiEye /> Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. Mobile Cards View (Optimized for One-Hand Phone Use) */}
            <div className="admin-mobile-cards-feed admin-mobile-only">
              {admissions.map(adm => {
                const cfg = statusConfig[adm.status] || statusConfig.submitted;
                const refNo = adm.applicationNumber || `CKP-${(adm._id || adm.id).slice(-6).toUpperCase()}`;
                const phoneClean = (adm.guardianPhone || '').replace(/\D/g, '');

                return (
                  <div key={adm._id || adm.id} className="admin-mobile-app-card">
                    {/* Top Row: Ref ID + Status */}
                    <div className="admin-mobile-app-card__head">
                      <span className="admin-mobile-app-card__ref">{refNo}</span>
                      <span
                        className="admin-status"
                        style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Kid Name & Category */}
                    <div className="admin-mobile-app-card__main" onClick={() => openDetail(adm)}>
                      <h4 className="admin-mobile-app-card__name">{adm.childName}</h4>
                      <div className="admin-mobile-app-card__tags">
                        <span className="badge badge--blue">{adm.program}</span>
                        {adm.timing && <span className="badge badge--yellow">⏰ {adm.timing}</span>}
                        {adm.age && <span className="admin-tag-sub">Age: {adm.age}</span>}
                      </div>
                    </div>

                    {/* Parent & Location */}
                    <div className="admin-mobile-app-card__meta">
                      <div>
                        <span className="admin-mobile-label">Parent:</span>{' '}
                        <strong>{adm.parentName || adm.primaryContactName || 'Parent'}</strong>
                      </div>
                      {(adm.location || adm.city) && (
                        <div className="admin-mobile-location">
                          <FiMapPin size={12} /> {adm.location || adm.city}
                        </div>
                      )}
                    </div>

                    {/* Quick Touch Action Buttons */}
                    <div className="admin-mobile-app-card__actions">
                      <a
                        href={`tel:${adm.guardianPhone}`}
                        className="btn btn--outline btn--sm admin-mobile-action-btn"
                        title="Call parent"
                      >
                        <FiPhone /> Call
                      </a>

                      {phoneClean && (
                        <a
                          href={`https://wa.me/91${phoneClean}?text=Hello%20from%20Chittukurumbakam%20Play%20School%20regarding%20${encodeURIComponent(adm.childName)}%27s%20admission`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--outline btn--sm admin-mobile-action-btn admin-mobile-wa-btn"
                          title="WhatsApp parent"
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => openDetail(adm)}
                        className="btn btn--primary btn--sm admin-mobile-action-btn"
                      >
                        <FiEye /> Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchAdmissions(pagination.page - 1)}
              className="btn btn--outline btn--sm"
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '0.85rem' }}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchAdmissions(pagination.page + 1)}
              className="btn btn--outline btn--sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detailed Application Modal / Mobile Sheet */}
      {isDrawerOpen && selectedAdmission && (
        <div className="admin-modal-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="admin-modal-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-drawer__head">
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {selectedAdmission.applicationNumber || selectedAdmission._id || selectedAdmission.id}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem' }}>
                  {selectedAdmission.childName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="admin-modal-close"
                aria-label="Close details"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-drawer__body">
              {/* Status Update Quick Panel */}
              <div className="admin-drawer-card admin-drawer-card--highlight">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#1e3a8a', fontSize: '0.95rem' }}>Review & Update Status</h4>
                  {updateMsg && (
                    <span style={{ fontSize: '0.78rem', color: updateMsg.includes('success') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                      {updateMsg}
                    </span>
                  )}
                </div>

                <div className="admin-drawer-status-controls">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="form-select"
                    style={{ flex: 1, background: '#fff' }}
                  >
                    <option value="submitted">New / Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted for Interaction</option>
                    <option value="approved">Approved / Seat Offered</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="rejected">Rejected / Ineligible</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="btn btn--primary btn--sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {updating ? 'Saving...' : 'Save Status'}
                  </button>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Internal Admin Notes:
                  </label>
                  <textarea
                    rows="2"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes from parent call, fee discussions, special instructions..."
                    className="form-textarea"
                    style={{ background: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Kid Profile */}
              <div className="admin-drawer-card">
                <h4 style={{ margin: '0 0 12px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiUser /> Kid Profile
                </h4>
                <div className="admin-details-grid">
                  <div><span>Kid Name:</span> <strong>{selectedAdmission.childName}</strong></div>
                  <div><span>Category:</span> <strong>{selectedAdmission.program}</strong></div>
                  <div>
                    <span>Date of Birth:</span>{' '}
                    <strong>
                      {selectedAdmission.dateOfBirth
                        ? (typeof selectedAdmission.dateOfBirth === 'string'
                            ? selectedAdmission.dateOfBirth.split('T')[0]
                            : new Date(selectedAdmission.dateOfBirth).toLocaleDateString('en-IN'))
                        : 'N/A'}
                    </strong>
                  </div>
                  <div><span>Age:</span> <strong>{selectedAdmission.age || 'N/A'}</strong></div>
                  <div><span>Preferred Timing:</span> <strong>{selectedAdmission.timing || '9:00-12:30'}</strong></div>
                  <div>
                    <span>Previous School:</span>{' '}
                    <strong>
                      {selectedAdmission.hasPreviousSchool === 'Yes'
                        ? (selectedAdmission.previousSchoolName || selectedAdmission.previousSchool || 'Yes')
                        : (selectedAdmission.previousSchool || 'No')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Parent Details with Immediate Phone Call & WhatsApp */}
              <div className="admin-drawer-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUsers /> Parents & Location
                  </h4>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`tel:${selectedAdmission.guardianPhone}`}
                      className="btn btn--outline btn--sm"
                      style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                    >
                      <FiPhone /> Call
                    </a>
                    {(selectedAdmission.guardianPhone || '').replace(/\D/g, '') && (
                      <a
                        href={`https://wa.me/91${(selectedAdmission.guardianPhone || '').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline btn--sm admin-mobile-wa-btn"
                        style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                      >
                        <FaWhatsapp /> Chat
                      </a>
                    )}
                  </div>
                </div>

                <div className="admin-details-grid">
                  <div><span>Parents Name:</span> <strong>{selectedAdmission.parentName || selectedAdmission.primaryContactName || 'Parent'}</strong></div>
                  <div><span>Mobile:</span> <strong>{selectedAdmission.guardianPhone}</strong></div>
                  <div><span>Mail ID:</span> <strong>{selectedAdmission.guardianEmail}</strong></div>
                  <div><span>Location:</span> <strong>{selectedAdmission.location || selectedAdmission.address || 'Tiruppur'}</strong></div>
                </div>
              </div>

              {/* Additional Comments or Questions */}
              {selectedAdmission.additionalComments && (
                <div className="admin-drawer-card">
                  <h4 style={{ margin: '0 0 10px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiFileText /> Additional Comments or Questions
                  </h4>
                  <p style={{ color: '#334155', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                    {selectedAdmission.additionalComments}
                  </p>
                </div>
              )}

              {/* Status History */}
              <div className="admin-drawer-card">
                <h4 style={{ margin: '0 0 10px', color: '#1e3a8a' }}>⏱️ Status Timeline</h4>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>Submission Date: <strong>{selectedAdmission.createdAt ? new Date(selectedAdmission.createdAt).toLocaleString('en-IN') : 'N/A'}</strong></span>
                </div>
                {selectedAdmission.statusHistory && selectedAdmission.statusHistory.length > 0 && (
                  <ul style={{ paddingLeft: '16px', margin: '8px 0 0', fontSize: '0.82rem' }}>
                    {selectedAdmission.statusHistory.map((h, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>
                        <strong>{h.status.toUpperCase()}</strong>: {h.note} — <small style={{ color: '#64748b' }}>{new Date(h.changedAt).toLocaleString('en-IN')}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmissions;
