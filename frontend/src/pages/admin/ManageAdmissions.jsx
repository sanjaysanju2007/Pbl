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
  FiPaperclip
} from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const statusConfig = {
  submitted: { label: 'Submitted', color: '#2563eb', bg: '#eff6ff' },
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
  under_review: { label: 'Under Review', color: '#0d9488', bg: '#f0fdfa' },
  reviewed: { label: 'Reviewed', color: '#0d9488', bg: '#f0fdfa' },
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
      setAdmissions(res.data.data || []);
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
      const res = await API.patch(`/admissions/${selectedAdmission._id}`, {
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
          <p>Review, filter, shortlist, and track incoming parent admission applications.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={`/api/admissions/export/csv?status=${statusFilter}&program=${programFilter}`}
            className="btn btn--outline btn--sm"
            download
            title="Download matching applications to CSV"
          >
            <FiDownload /> Export CSV
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card-section" style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <form onSubmit={handleSearchSubmit} className="admin-filter-bar">
          <div className="admin-search-input-wrap">
            <FiSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by student name, ref number (CKP-...), phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted / New</option>
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
            <option value="">All Programs</option>
            <option value="Playgroup">Playgroup</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
          </select>

          <select
            value={academicYearFilter}
            onChange={(e) => setAcademicYearFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Years</option>
            <option value="2026-2027">2026–2027</option>
            <option value="2025-2026">2025–2026</option>
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
        </form>
      </div>

      {/* Applications Table */}
      <div className="admin-card-section" style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
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
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref Number</th>
                  <th>Student Name</th>
                  <th>Program</th>
                  <th>Parent / Guardian</th>
                  <th>Contact Details</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map(adm => {
                  const cfg = statusConfig[adm.status] || statusConfig.submitted;
                  const refNo = adm.applicationNumber || `CKP-${adm._id.slice(-6).toUpperCase()}`;

                  return (
                    <tr key={adm._id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: '#1d4ed8' }}>
                          {refNo}
                        </strong>
                      </td>
                      <td>
                        <strong>{adm.childName}</strong>
                        {adm.gender && <small style={{ display: 'block', color: '#64748b' }}>{adm.gender}</small>}
                      </td>
                      <td>
                        <span className="badge badge--blue">{adm.program}</span>
                      </td>
                      <td>
                        {adm.primaryContactName || adm.fatherName || adm.motherName || 'Parent'}
                        {adm.relationship && <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>({adm.relationship})</small>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.82rem' }}>
                          <a href={`tel:${adm.guardianPhone}`} style={{ color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiPhone size={12} /> {adm.guardianPhone}
                          </a>
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
                        <small>{new Date(adm.createdAt).toLocaleDateString('en-IN')}</small>
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

      {/* Detailed Application Modal / Drawer */}
      {isDrawerOpen && selectedAdmission && (
        <div className="admin-modal-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="admin-modal-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-drawer__head">
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {selectedAdmission.applicationNumber || selectedAdmission._id}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.4rem' }}>
                  {selectedAdmission.childName} — Admission Application
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="admin-modal-close"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-drawer__body">
              {updateMsg && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#dcfce7', color: '#166534', marginBottom: '16px', fontSize: '0.88rem' }}>
                  <FiCheck /> {updateMsg}
                </div>
              )}

              {/* Status Update Control Card */}
              <div className="admin-drawer-card" style={{ background: 'var(--color-accent-soft)', border: '1.5px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '1rem', color: 'var(--color-text)' }}>Application Status & Internal Notes</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', alignItems: 'flex-start' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                      Status Workflow:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="form-select"
                      style={{ background: 'var(--color-surface)' }}
                    >
                      <option value="submitted">Submitted (New Application)</option>
                      <option value="under_review">Under Review (In Evaluation)</option>
                      <option value="shortlisted">Shortlisted for Interaction</option>
                      <option value="approved">Approved / Admission Granted</option>
                      <option value="rejected">Rejected / Ineligible</option>
                      <option value="waitlisted">Waitlisted</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Actions:
                    </label>
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="btn btn--primary btn--sm"
                      style={{ width: '100%', height: '38px' }}
                    >
                      {updating ? 'Saving...' : 'Save Status & Notes'}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Internal Administrative Notes (Not visible to parent):
                  </label>
                  <textarea
                    rows="2"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add observations from mentor call, age criteria notes, fee details..."
                    className="form-textarea"
                    style={{ background: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Student Profile */}
              <div className="admin-drawer-card">
                <h4 style={{ margin: '0 0 12px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}><FiUser /> Student Details</h4>
                <div className="admin-details-grid">
                  <div><span>Full Name:</span> <strong>{selectedAdmission.childName}</strong></div>
                  <div><span>Program:</span> <strong>{selectedAdmission.program}</strong></div>
                  <div><span>Date of Birth:</span> <strong>{selectedAdmission.dateOfBirth ? new Date(selectedAdmission.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}</strong></div>
                  <div><span>Gender:</span> <strong>{selectedAdmission.gender}</strong></div>
                  <div><span>Academic Year:</span> <strong>{selectedAdmission.academicYear || '2026-2027'}</strong></div>
                  <div><span>Blood Group:</span> <strong>{selectedAdmission.bloodGroup || 'Not specified'}</strong></div>
                  <div><span>Allergies / Health:</span> <strong>{selectedAdmission.allergies || 'None reported'}</strong></div>
                  <div><span>Previous Daycare:</span> <strong>{selectedAdmission.previousSchool || 'None'}</strong></div>
                </div>
              </div>

              {/* Parent Contact Details */}
              <div className="admin-drawer-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}><FiUsers /> Parent / Guardian Contact</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`tel:${selectedAdmission.guardianPhone}`}
                      className="btn btn--outline btn--sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <FiPhone /> Call Parent
                    </a>
                    <a
                      href={`mailto:${selectedAdmission.guardianEmail}?subject=Chittukurumbakam Play School Application (${selectedAdmission.applicationNumber || ''})`}
                      className="btn btn--outline btn--sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <FiMail /> Send Email
                    </a>
                  </div>
                </div>

                <div className="admin-details-grid">
                  <div><span>Primary Contact:</span> <strong>{selectedAdmission.primaryContactName || selectedAdmission.fatherName || 'Parent'} ({selectedAdmission.relationship || 'Guardian'})</strong></div>
                  <div><span>Father's Name:</span> <strong>{selectedAdmission.fatherName || 'N/A'}</strong></div>
                  <div><span>Mother's Name:</span> <strong>{selectedAdmission.motherName || 'N/A'}</strong></div>
                  <div><span>Phone:</span> <strong>{selectedAdmission.guardianPhone}</strong></div>
                  <div><span>Alternate Phone:</span> <strong>{selectedAdmission.alternatePhone || 'None'}</strong></div>
                  <div><span>Email:</span> <strong>{selectedAdmission.guardianEmail}</strong></div>
                  <div><span>Address:</span> <strong>{selectedAdmission.address}, {selectedAdmission.city} {selectedAdmission.pincode}</strong></div>
                  <div><span>Preferred Contact:</span> <strong>{selectedAdmission.preferredContactMethod || 'Phone Call'}</strong></div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="admin-drawer-card">
                <h4 style={{ margin: '0 0 10px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}><FiPaperclip /> Attached Documents ({selectedAdmission.documents?.length || 0})</h4>
                {!selectedAdmission.documents || selectedAdmission.documents.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>No documents were attached with this online application.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedAdmission.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={`/${doc.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline btn--sm"
                        style={{ fontSize: '0.82rem' }}
                      >
                        <FiFileText /> {doc.name || `Document #${idx + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Status History & Notifications */}
              <div className="admin-drawer-card">
                <h4 style={{ margin: '0 0 10px', color: '#1e3a8a' }}>⏱️ Status Timeline & Email Notifications</h4>
                <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>Submission Date: <strong>{new Date(selectedAdmission.createdAt).toLocaleString('en-IN')}</strong></span>
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
