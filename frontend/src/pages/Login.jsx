import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLock,
  FiMail,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiSearch,
  FiShield,
  FiHeart,
  FiHelpCircle,
  FiUser,
  FiStar,
  FiClock,
  FiXCircle,
  FiClipboard,
  FiInbox
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('parent'); // 'parent' or 'admin'
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Parent Tracking State
  const [appNumber, setAppNumber] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Handle Admin / Staff Sign In
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      await login(adminEmail, adminPassword);
      const redirectPath = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setAdminError(
        err.response?.data?.message || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setAdminLoading(false);
    }
  };

  // Handle Parent Application Tracking
  const handleParentTrack = async (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackResult(null);

    if (!appNumber.trim() || !parentContact.trim()) {
      setTrackingError('Please enter both Application Number and registered Phone or Email.');
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await API.post('/admissions/track', {
        applicationNumber: appNumber.trim().toUpperCase(),
        contact: parentContact.trim()
      });

      if (res.data.success) {
        setTrackResult(res.data.data);
      } else {
        setTrackingError(res.data.message || 'No application record found.');
      }
    } catch (err) {
      setTrackingError(
        err.response?.data?.message ||
        'Application not found. Please double check your Application Number (e.g. CKP-2026-XXXXX).'
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'login-badge--approved';
      case 'shortlisted': return 'login-badge--shortlisted';
      case 'under_review':
      case 'reviewed': return 'login-badge--review';
      case 'rejected': return 'login-badge--rejected';
      case 'waitlisted': return 'login-badge--waitlisted';
      default: return 'login-badge--submitted';
    }
  };

  const getStatusBadgeContent = (status) => {
    switch (status) {
      case 'approved': return <><FiCheckCircle size={13} aria-hidden="true" /> Approved / Admission Offered</>;
      case 'shortlisted': return <><FiStar size={13} aria-hidden="true" /> Shortlisted for Mentor Interaction</>;
      case 'under_review':
      case 'reviewed': return <><FiClock size={13} aria-hidden="true" /> Under Committee Review</>;
      case 'rejected': return <><FiXCircle size={13} aria-hidden="true" /> Not Accepted</>;
      case 'waitlisted': return <><FiClipboard size={13} aria-hidden="true" /> Placed on Waitlist</>;
      default: return <><FiInbox size={13} aria-hidden="true" /> Application Submitted</>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Portal & Application Status — Chittukurumbakam Play School</title>
        <meta
          name="description"
          content="Access the Chittukurumbakam Play School portal to track your child's admission status or sign in as an authorized school administrator."
        />
      </Helmet>

      <div className="login-page">
        <div className="container login-page__container">
          <div className="login-card">
            {/* Left Hero Column */}
            <div className="login-card__visual">
              <div className="login-card__visual-overlay"></div>
              <div className="login-card__visual-content">
                <Link to="/" className="login-card__brand">
                  <img
                    src="/logo.jpg"
                    alt="Chittukurumbakam Play School"
                    className="login-card__logo"
                  />
                  <div>
                    <h2 className="login-card__brand-title">Chittukurumbakam</h2>
                    <span className="login-card__brand-tag">Play School & Daycare</span>
                  </div>
                </Link>

                <div className="login-card__headline">
                  <h3>Where Every Child Blossoms With Joy</h3>
                  <p>
                    Track your child's admission journey or manage our happy campus community with confidence and care.
                  </p>
                </div>

                <div className="login-card__perks">
                  <div className="login-card__perk-item">
                    <FiShield className="login-card__perk-icon" />
                    <span>Safe & Monitored Campus</span>
                  </div>
                  <div className="login-card__perk-item">
                    <FiHeart className="login-card__perk-icon" />
                    <span>Montessori & Play-Based Learning</span>
                  </div>
                  <div className="login-card__perk-item">
                    <FiCheckCircle className="login-card__perk-icon" />
                    <span>Direct Transparent Parent Updates</span>
                  </div>
                </div>

                <div className="login-card__visual-footer">
                  <p>Admissions Open for Academic Year 2026–2027</p>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="login-card__form-wrapper">
              {/* Tab Selector */}
              <div className="login-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'parent'}
                  className={`login-tab ${activeTab === 'parent' ? 'login-tab--active' : ''}`}
                  onClick={() => { setActiveTab('parent'); setAdminError(''); }}
                >
                  <FiSearch /> <span>Track Admission</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'admin'}
                  className={`login-tab ${activeTab === 'admin' ? 'login-tab--active' : ''}`}
                  onClick={() => { setActiveTab('admin'); setTrackingError(''); setTrackResult(null); }}
                >
                  <FiLock /> <span>Staff & Admin Sign In</span>
                </button>
              </div>

              {/* PARENT APPLICATION TRACKER TAB */}
              {activeTab === 'parent' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="login-tab-content"
                >
                  <div className="login-header">
                    <h3>Track Your Child's Admission</h3>
                    <p>Enter your Application Reference Number and registered phone or email to view real-time status.</p>
                  </div>

                  {trackingError && (
                    <div className="login-alert login-alert--error" role="alert">
                      {trackingError}
                    </div>
                  )}

                  <form onSubmit={handleParentTrack} className="login-form">
                    <div className="login-form__group">
                      <label className="login-form__label">
                        Application Reference Number <span className="login-required">*</span>
                      </label>
                      <div className="login-input-wrap">
                        <FiSearch className="login-input-icon" />
                        <input
                          type="text"
                          required
                          value={appNumber}
                          onChange={(e) => setAppNumber(e.target.value)}
                          placeholder="e.g. CKP-2026-48192"
                          className="login-input"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                      <span className="login-field-hint">Sent via email and SMS on submission.</span>
                    </div>

                    <div className="login-form__group">
                      <label className="login-form__label">
                        Registered Mobile Number or Email <span className="login-required">*</span>
                      </label>
                      <div className="login-input-wrap">
                        <FiPhone className="login-input-icon" />
                        <input
                          type="text"
                          required
                          value={parentContact}
                          onChange={(e) => setParentContact(e.target.value)}
                          placeholder="e.g. 9952285838 or parent@example.com"
                          className="login-input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="btn btn--primary login-submit-btn"
                    >
                      {trackingLoading ? 'Checking Application...' : 'Track Application Status'}
                      <FiArrowRight />
                    </button>
                  </form>

                  {/* Tracking Result Card */}
                  <AnimatePresence>
                    {trackResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="login-track-card"
                      >
                        <div className="login-track-card__header">
                          <div>
                            <span className="login-track-card__id">{trackResult.applicationNumber}</span>
                            <h4 className="login-track-card__name">{trackResult.childName}</h4>
                          </div>
                          <span className={`login-badge ${getStatusBadgeClass(trackResult.status)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            {getStatusBadgeContent(trackResult.status)}
                          </span>
                        </div>

                        <div className="login-track-card__grid">
                          <div className="login-track-card__item">
                            <span>Program</span>
                            <strong>{trackResult.program}</strong>
                          </div>
                          <div className="login-track-card__item">
                            <span>Academic Year</span>
                            <strong>{trackResult.academicYear}</strong>
                          </div>
                          <div className="login-track-card__item">
                            <span>Submitted On</span>
                            <strong>{new Date(trackResult.submissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                          </div>
                        </div>

                        {trackResult.statusHistory && trackResult.statusHistory.length > 0 && (
                          <div className="login-timeline">
                            <span className="login-timeline__title">Status History</span>
                            <ul className="login-timeline__list">
                              {trackResult.statusHistory.map((step, idx) => (
                                <li key={idx} className="login-timeline__item">
                                  <span className="login-timeline__dot"></span>
                                  <div className="login-timeline__content">
                                    <div className="login-timeline__status-row">
                                      <strong>{step.status.toUpperCase()}</strong>
                                      <small>{new Date(step.changedAt).toLocaleDateString('en-IN')}</small>
                                    </div>
                                    <p>{step.note}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="login-track-card__actions">
                          <Link to="/contact" className="btn btn--outline btn--sm">
                            Need Assistance? Contact School
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="login-footer-hint">
                    <span>New parent? </span>
                    <Link to="/admission" className="login-link">
                      Submit an Admission Application →
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ADMINISTRATOR / STAFF LOGIN TAB */}
              {activeTab === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="login-tab-content"
                >
                  <div className="login-header">
                    <h3>Staff & Admin Sign In</h3>
                    <p>Enter your authorized school credentials to access the administrative portal.</p>
                  </div>

                  {adminError && (
                    <div className="login-alert login-alert--error" role="alert">
                      {adminError}
                    </div>
                  )}

                  <form onSubmit={handleAdminSubmit} className="login-form">
                    <div className="login-form__group">
                      <label className="login-form__label">
                        Staff Email Address <span className="login-required">*</span>
                      </label>
                      <div className="login-input-wrap">
                        <FiMail className="login-input-icon" />
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="admin@chittukurumbakam.com"
                          className="login-input"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="login-form__group">
                      <div className="login-form__label-row">
                        <label className="login-form__label">
                          Password <span className="login-required">*</span>
                        </label>
                        <button
                          type="button"
                          className="login-forgot-link"
                          onClick={() => setShowForgotModal(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="login-input-wrap">
                        <FiLock className="login-input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="login-input"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="login-eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="btn btn--primary login-submit-btn"
                    >
                      {adminLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
                      <FiArrowRight />
                    </button>
                  </form>

                  <div className="login-security-notice">
                    <FiShield size={14} />
                    <span>Role-protected secure portal. IP and access attempts are monitored.</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Assistance Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="login-modal-backdrop" onClick={() => setShowForgotModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="login-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Password Reset Assistance</h3>
              <p>
                To maintain campus security, administrative credentials must be reset directly by the Super Administrator or IT department.
              </p>
              <div className="login-modal__contacts">
                <p><strong>School IT Desk:</strong> it@chittukurumbakam.com</p>
                <p><strong>Principal's Desk:</strong> principal@chittukurumbakam.com</p>
                <p><strong>Telephone:</strong> +91 99522 85838</p>
              </div>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => setShowForgotModal(false)}
              >
                Close Notice
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Login;
