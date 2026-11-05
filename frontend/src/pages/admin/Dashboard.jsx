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
  FiInbox,
  FiPhone,
  FiMapPin,
  FiEye,
  FiCalendar
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
          API.get('/admissions?limit=6')
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

        const rawRecent = recentRes.data.data || [];
        const seenRecent = new Set();
        const uniqueRecent = [];
        rawRecent.forEach(item => {
          const key = item.applicationNumber || item._id || item.id;
          if (!key || !seenRecent.has(key)) {
            if (key) seenRecent.add(key);
            uniqueRecent.push(item);
          }
        });
        setRecentAdmissions(uniqueRecent);
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
      bgLight: '#eff6ff',
      desc: 'All submitted applications',
      link: '/admin/admissions'
    },
    {
      label: 'New Applications',
      count: stats.submitted,
      icon: <FiClock />,
      color: '#f59e0b',
      bgLight: '#fef3c7',
      desc: 'Awaiting team review',
      link: '/admin/admissions?status=submitted'
    },
    {
      label: 'Under Review',
      count: stats.underReview,
      icon: <FiClock />,
      color: '#0d9488',
      bgLight: '#f0fdfa',
      desc: 'In committee evaluation',
      link: '/admin/admissions?status=under_review'
    },
    {
      label: 'Approved Seats',
      count: stats.approved,
      icon: <FiCheckCircle />,
      color: '#16a34a',
      bgLight: '#f0fdf4',
      desc: 'Admission offered',
      link: '/admin/admissions?status=approved'
    },
    {
      label: 'Parent Enquiries',
      count: stats.enquiriesTotal,
      icon: <FiMessageSquare />,
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      desc: `${stats.enquiriesNew} new enquiries`,
      link: '/admin/enquiries'
    },
    {
      label: 'Declined / Ineligible',
      count: stats.rejected,
      icon: <FiXCircle />,
      color: '#dc2626',
      bgLight: '#fef2f2',
      desc: 'Applications declined',
      link: '/admin/admissions?status=rejected'
    }
  ];

  return (
    <div className="admin-page">
      {/* Top Header Card */}
      <div className="admin-page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiBarChart2 style={{ color: 'var(--color-primary)' }} /> Admissions & School Overview
          </h2>
          <p>Real-time metrics calculated directly from database records.</p>
        </div>
        <div className="admin-page-head__actions">
          <Link to="/admission" target="_blank" className="btn btn--outline btn--sm">
            <FiPlusCircle /> New Form
          </Link>
          <a
            href="/api/admissions/export/csv"
            className="btn btn--secondary btn--sm"
            download
          >
            <FiDownload /> Export CSV
          </a>
        </div>
      </div>

      {/* Summary Stat Cards - Responsive Grid (2-cols on mobile, 3-cols on tablet, 6 on desktop) */}
      <div className="admin-stats-grid">
        {applicationCards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            className="admin-stat-card"
            style={{ borderLeftColor: card.color }}
          >
            <div className="admin-stat-card__icon" style={{ background: card.bgLight, color: card.color }}>
              {card.icon}
            </div>
            <div className="admin-stat-card__info">
              <span className="admin-stat-card__count">{loading ? '...' : card.count}</span>
              <span className="admin-stat-card__label">{card.label}</span>
              <small className="admin-stat-card__desc">
                {card.desc}
              </small>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-quick-actions">
        <h3 className="admin-quick-actions__title">
          <FiZap style={{ color: '#f59e0b' }} /> Quick Management
        </h3>
        <div className="admin-quick-actions__pills">
          <Link to="/admin/admissions" className="btn btn--primary btn--sm">
            <FiUsers /> Review Admissions
          </Link>
          <Link to="/admin/enquiries" className="btn btn--outline btn--sm">
            <FiMessageSquare /> View Enquiries
          </Link>
          <Link to="/admin/gallery" className="btn btn--outline btn--sm">
            Campus Gallery
          </Link>
          <Link to="/admin/announcements" className="btn btn--secondary btn--sm">
            Post Announcement
          </Link>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="admin-card-section">
        <div className="admin-section-header-row">
          <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiInbox style={{ color: 'var(--color-primary)' }} /> Recent Applications
          </h3>
          <Link to="/admin/admissions" className="admin-link-accent">
            View All →
          </Link>
        </div>

        {recentAdmissions.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem', padding: '16px 0' }}>No recent applications logged yet.</p>
        ) : (
          <>
            {/* 1. Desktop & Tablet Table (Hidden on small mobile screens) */}
            <div className="admin-table-wrap admin-desktop-only">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref No.</th>
                    <th>Kid Name</th>
                    <th>Category & Timing</th>
                    <th>Parent Contact</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAdmissions.map(adm => {
                    const cfg = statusConfig[adm.status] || statusConfig.submitted;
                    const phoneClean = (adm.guardianPhone || '').replace(/\D/g, '');

                    return (
                      <tr key={adm._id || adm.id}>
                        <td>
                          <strong style={{ fontFamily: 'monospace', color: '#1d4ed8' }}>
                            {adm.applicationNumber || (adm._id || adm.id).slice(-6).toUpperCase()}
                          </strong>
                        </td>
                        <td>
                          <strong>{adm.childName}</strong>
                          {adm.age && <small style={{ display: 'block', color: '#64748b' }}>Age: {adm.age}</small>}
                        </td>
                        <td>
                          <span className="badge badge--blue">{adm.program}</span>
                          {adm.timing && <small style={{ display: 'block', color: '#64748b', marginTop: '2px' }}>{adm.timing}</small>}
                        </td>
                        <td>
                          <strong>{adm.parentName || adm.primaryContactName || 'Parent'}</strong>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                            <a href={`tel:${adm.guardianPhone}`} style={{ color: '#2563eb', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                              <FiPhone size={12} /> {adm.guardianPhone}
                            </a>
                            {phoneClean && (
                              <a
                                href={`https://wa.me/91${phoneClean}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#16a34a', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                                title="Chat on WhatsApp"
                              >
                                <FaWhatsapp size={12} /> WhatsApp
                              </a>
                            )}
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
                          <Link to="/admin/admissions" className="btn btn--outline btn--sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                            <FiEye /> Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. Mobile Cards Feed (Visible only on mobile <= 768px) */}
            <div className="admin-mobile-cards-feed admin-mobile-only">
              {recentAdmissions.map(adm => {
                const cfg = statusConfig[adm.status] || statusConfig.submitted;
                const phoneClean = (adm.guardianPhone || '').replace(/\D/g, '');

                return (
                  <div key={adm._id || adm.id} className="admin-mobile-app-card">
                    {/* Header: Ref No + Status Badge */}
                    <div className="admin-mobile-app-card__head">
                      <span className="admin-mobile-app-card__ref">
                        {adm.applicationNumber || (adm._id || adm.id).slice(-6).toUpperCase()}
                      </span>
                      <span
                        className="admin-status"
                        style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Kid Name & Category */}
                    <div className="admin-mobile-app-card__main">
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

                    {/* One-Tap Mobile Action Bar */}
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

                      <Link
                        to="/admin/admissions"
                        className="btn btn--primary btn--sm admin-mobile-action-btn"
                      >
                        <FiEye /> Review
                      </Link>
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

export default Dashboard;
