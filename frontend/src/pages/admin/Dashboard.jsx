import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiMessageSquare,
  FiArrowRight,
  FiDownload,
  FiPlusCircle,
  FiBarChart2,
  FiZap,
  FiInbox
} from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    underReview: 0,
    shortlisted: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0,
    enquiriesTotal: 0,
    enquiriesNew: 0
  });
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          totalRes,
          submittedRes,
          reviewRes,
          shortlistRes,
          approvedRes,
          rejectedRes,
          enqTotalRes,
          enqNewRes,
          recentRes
        ] = await Promise.all([
          API.get('/admissions?limit=1'),
          API.get('/admissions?status=submitted&limit=1'),
          API.get('/admissions?status=under_review&limit=1'),
          API.get('/admissions?status=shortlisted&limit=1'),
          API.get('/admissions?status=approved&limit=1'),
          API.get('/admissions?status=rejected&limit=1'),
          API.get('/enquiries?limit=1'),
          API.get('/enquiries?status=new&limit=1'),
          API.get('/admissions?limit=5')
        ]);

        setStats({
          total: totalRes.data.pagination?.total || 0,
          submitted: submittedRes.data.pagination?.total || 0,
          underReview: reviewRes.data.pagination?.total || 0,
          shortlisted: shortlistRes.data.pagination?.total || 0,
          approved: approvedRes.data.pagination?.total || 0,
          rejected: rejectedRes.data.pagination?.total || 0,
          enquiriesTotal: enqTotalRes.data.pagination?.total || 0,
          enquiriesNew: enqNewRes.data.pagination?.total || 0
        });

        setRecentAdmissions(recentRes.data.data || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const applicationCards = [
    {
      label: 'Total Applications',
      count: stats.total,
      icon: <FiUsers />,
      color: '#2563eb',
      desc: 'All submitted student applications',
      link: '/admin/admissions'
    },
    {
      label: 'New Applications',
      count: stats.submitted,
      icon: <FiClock />,
      color: '#f59e0b',
      desc: 'Awaiting initial team review',
      link: '/admin/admissions?status=submitted'
    },
    {
      label: 'Under Review',
      count: stats.underReview,
      icon: <FiClock />,
      color: '#0d9488',
      desc: 'Currently in committee evaluation',
      link: '/admin/admissions?status=under_review'
    },
    {
      label: 'Approved Applications',
      count: stats.approved,
      icon: <FiCheckCircle />,
      color: '#16a34a',
      desc: 'Formal admission offers extended',
      link: '/admin/admissions?status=approved'
    },
    {
      label: 'Rejected Applications',
      count: stats.rejected,
      icon: <FiXCircle />,
      color: '#dc2626',
      desc: 'Ineligible or declined',
      link: '/admin/admissions?status=rejected'
    },
    {
      label: 'Parent Enquiries',
      count: stats.enquiriesTotal,
      icon: <FiMessageSquare />,
      color: '#7c3aed',
      desc: `${stats.enquiriesNew} new enquiries pending`,
      link: '/admin/enquiries'
    }
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiBarChart2 style={{ color: 'var(--color-primary)' }} /> Admissions & School Overview
          </h2>
          <p>Real-time metrics calculated directly from database records.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admission" target="_blank" className="btn btn--outline btn--sm">
            <FiPlusCircle /> New Admission Form
          </Link>
          <a
            href="/api/admissions/export/csv"
            className="btn btn--secondary btn--sm"
            download
          >
            <FiDownload /> Export Applications CSV
          </a>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {applicationCards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            className="admin-stat-card"
            style={{ borderLeftColor: card.color }}
          >
            <div className="admin-stat-card__icon" style={{ background: `${card.color}18`, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <span className="admin-stat-card__count">{loading ? '...' : card.count}</span>
              <span className="admin-stat-card__label">{card.label}</span>
              <small style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                {card.desc}
              </small>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-quick-actions" style={{ margin: '28px 0' }}>
        <h3 style={{ marginBottom: '14px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiZap style={{ color: '#f59e0b' }} /> Quick Management Navigation
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/admin/admissions" className="btn btn--primary btn--sm">
            <FiUsers /> Review Admissions
          </Link>
          <Link to="/admin/enquiries" className="btn btn--outline btn--sm">
            <FiMessageSquare /> View Parent Enquiries
          </Link>
          <Link to="/admin/gallery" className="btn btn--outline btn--sm">
            Manage Campus Gallery
          </Link>
          <Link to="/admin/announcements" className="btn btn--secondary btn--sm">
            Post School Announcement
          </Link>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="admin-card-section" style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiInbox style={{ color: 'var(--color-primary)' }} /> Recent Admission Applications
          </h3>
          <Link to="/admin/admissions" style={{ fontSize: '0.86rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            View All Applications →
          </Link>
        </div>

        {recentAdmissions.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No recent applications logged yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref No.</th>
                  <th>Student Name</th>
                  <th>Program</th>
                  <th>Parent Contact</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map(adm => (
                  <tr key={adm._id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: '#1d4ed8' }}>
                        {adm.applicationNumber || adm._id.slice(-6).toUpperCase()}
                      </strong>
                    </td>
                    <td><strong>{adm.childName}</strong></td>
                    <td><span className="badge badge--blue">{adm.program}</span></td>
                    <td>
                      {adm.primaryContactName || adm.fatherName || 'Parent'}<br />
                      <small style={{ color: '#64748b' }}>{adm.guardianPhone}</small>
                    </td>
                    <td>
                      <span className={`admin-status admin-status--${adm.status}`}>
                        {adm.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(adm.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <Link to="/admin/admissions" className="btn btn--outline btn--sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
