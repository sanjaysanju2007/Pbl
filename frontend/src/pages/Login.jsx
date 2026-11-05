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
  FiUsers,
  FiStar,
  FiClock,
  FiXCircle,
  FiX,
  FiClipboard,
  FiInbox,
  FiPrinter,
  FiBookOpen,
  FiMapPin,
  FiCalendar
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
  const [parentContact, setParentContact] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackResultsList, setTrackResultsList] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Handle phone input changes (digits only, max 10 digits)
  const handlePhoneInputChange = (e) => {
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setParentContact(numericOnly);
    if (trackingError) setTrackingError('');
  };

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

  // Handle Parent Application Tracking by Phone Number
  const handleParentTrack = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setTrackingError('');
    setTrackResult(null);
    setTrackResultsList([]);
    setShowDetailsModal(false);

    const rawContact = (parentContact || '').toString().trim();
    const cleanDigits = rawContact.replace(/\D/g, '');
    const standardPhone = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

    if (!cleanDigits) {
      setTrackingError('Please enter your 10-digit registered mobile number.');
      return;
    }

    if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(standardPhone)) {
      setTrackingError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await API.post('/admissions/track', {
        phone: standardPhone,
        mobile: standardPhone,
        contact: standardPhone
      });

      console.log('Admission track response:', res.data);

      if (res.data?.success) {
        const apps = res.data.applications || (Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
        if (apps && apps.length > 0) {
          setTrackResultsList(apps);
          setTrackResult(apps[0]);
          setShowDetailsModal(true); // Open details popup immediately on valid record!
        } else if (res.data.data) {
          setTrackResultsList([res.data.data]);
          setTrackResult(res.data.data);
          setShowDetailsModal(true);
        } else {
          setTrackingError(`No admission record found for mobile number ${standardPhone}. Please verify the number or submit an admission application.`);
        }
      } else {
        setTrackingError(res.data?.message || `No admission record found for mobile number ${standardPhone}.`);
      }
    } catch (err) {
      console.error('Track admission error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setTrackingError(serverMsg);
      } else if (err.message && (err.message.includes('Network Error') || err.code === 'ERR_NETWORK')) {
        setTrackingError('Cannot connect to server. Please verify your backend server is running (cd Pbl/backend && npm start).');
      } else {
        setTrackingError(`No admission record found for mobile number ${standardPhone}. Please verify the 10-digit number or submit an admission application.`);
      }
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
                    <p>Enter your registered 10-digit mobile number to view real-time application status.</p>
                  </div>

                  {trackingError && (
                    <div className="login-alert login-alert--error" role="alert">
                      {trackingError}
                    </div>
                  )}

                  <form onSubmit={handleParentTrack} className="login-form">
                    <div className="login-form__group">
                      <label className="login-form__label">
                        Registered Mobile Number <span className="login-required">*</span>
                      </label>
                      <div className="login-input-wrap">
                        <FiPhone className="login-input-icon" />
                        <input
                          type="tel"
                          required
                          value={parentContact}
                          onChange={handlePhoneInputChange}
                          maxLength={10}
                          placeholder="Enter registered mobile number"
                          className="login-input"
                          autoFocus
                        />
                      </div>
                      <span className="login-field-hint">
                        Enter the 10-digit phone number used when submitting the admission application.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={trackingLoading}
                      onClick={handleParentTrack}
                      className="btn btn--primary login-submit-btn"
                    >
                      {trackingLoading ? 'Checking Application Status...' : 'Track Admission Status'}
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
                        {/* Multiple Children Selector if parent submitted for > 1 child */}
                        {trackResultsList.length > 1 && (
                          <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                              Found {trackResultsList.length} applications under this mobile number:
                            </span>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {trackResultsList.map((app, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setTrackResult(app)}
                                  className={`btn btn--sm ${trackResult?.applicationNumber === app.applicationNumber || trackResult?.id === app.id ? 'btn--primary' : 'btn--outline'}`}
                                  style={{ borderRadius: '20px', padding: '5px 12px', fontSize: '0.8rem' }}
                                >
                                  👶 {app.childName} ({app.program})
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="login-track-card__header">
                          <div>
                            <span className="login-track-card__id" style={{ background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0", fontWeight: "700" }}>
                              📱 {trackResult.guardianPhone || parentContact}
                            </span>
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
                            <span>Timing</span>
                            <strong>{trackResult.timing || '9:00-12:30'}</strong>
                          </div>
                          <div className="login-track-card__item">
                            <span>Parent / Guardian</span>
                            <strong>{trackResult.parentName || 'Parent'}</strong>
                          </div>
                          <div className="login-track-card__item">
                            <span>Academic Year</span>
                            <strong>{trackResult.academicYear || '2026-2027'}</strong>
                          </div>
                          <div className="login-track-card__item">
                            <span>Submitted On</span>
                            <strong>
                              {trackResult.submissionDate || trackResult.createdAt
                                ? new Date(trackResult.submissionDate || trackResult.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                : 'Recent'}
                            </strong>
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

                        <div className="login-track-card__actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setShowDetailsModal(true)}
                            className="btn btn--primary btn--sm"
                          >
                            <FiSearch /> View Admission Popup Details
                          </button>
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
                          placeholder="Enter staff email address"
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
                          placeholder="Enter your password"
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

      {/* PARENT ADMISSION DETAILS POPUP MODAL */}
      <AnimatePresence>
        {showDetailsModal && trackResult && (
          <div className="login-modal-backdrop" onClick={() => setShowDetailsModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="parent-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="parent-details-modal__head">
                <div className="parent-details-modal__badge">
                  <FiCheckCircle /> Admission Record Verified
                </div>
                <button
                  type="button"
                  className="parent-details-modal__close-btn"
                  onClick={() => setShowDetailsModal(false)}
                  aria-label="Close modal"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="parent-details-modal__title-box">
                <div className="parent-details-modal__avatar">
                  👶
                </div>
                <div>
                  <h2 className="parent-details-modal__child-name">{trackResult.childName}</h2>
                  <div className="parent-details-modal__meta">
                    <span className={`login-badge ${getStatusBadgeClass(trackResult.status)}`}>
                      {getStatusBadgeContent(trackResult.status)}
                    </span>
                    <span className="parent-details-modal__phone-tag">
                      <FiPhone size={13} /> {trackResult.guardianPhone || parentContact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Multiple Children Selector inside modal if > 1 child */}
              {trackResultsList.length > 1 && (
                <div className="parent-details-modal__selector">
                  <span>Found {trackResultsList.length} applications under this mobile number:</span>
                  <div className="parent-details-modal__selector-btns">
                    {trackResultsList.map((app, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTrackResult(app)}
                        className={`btn btn--sm ${trackResult.applicationNumber === app.applicationNumber || trackResult.id === app.id ? 'btn--primary' : 'btn--outline'}`}
                        style={{ borderRadius: '20px', padding: '5px 12px', fontSize: '0.8rem' }}
                      >
                        👶 {app.childName} ({app.program})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="parent-details-modal__body">
                <h4 className="parent-details-modal__section-heading">Child & Parent Information</h4>
                <div className="parent-details-grid">
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiUser /> Kid Name</span>
                    <strong className="parent-details-val">{trackResult.childName}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiCalendar /> DOB & Age</span>
                    <strong className="parent-details-val">
                      {trackResult.dateOfBirth || 'N/A'} {trackResult.age ? `(${trackResult.age})` : ''}
                    </strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiUsers /> Parents Name</span>
                    <strong className="parent-details-val">{trackResult.parentName || 'Parent'}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiPhone /> Registered Mobile</span>
                    <strong className="parent-details-val">{trackResult.guardianPhone || parentContact}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiBookOpen /> Category Applying For</span>
                    <strong className="parent-details-val">{trackResult.program || 'Playgroup'}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiClock /> Preferred Timing</span>
                    <strong className="parent-details-val">{trackResult.timing || '9:00-12:30'}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiMapPin /> Location</span>
                    <strong className="parent-details-val">{trackResult.location || 'N/A'}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label"><FiMail /> Mail ID</span>
                    <strong className="parent-details-val">{trackResult.guardianEmail || 'N/A'}</strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label">Previous School / Daycare</span>
                    <strong className="parent-details-val">
                      {trackResult.hasPreviousSchool === 'Yes'
                        ? (trackResult.previousSchoolName || trackResult.previousSchool || 'Yes')
                        : (trackResult.previousSchool && trackResult.previousSchool !== 'None' ? trackResult.previousSchool : 'No')}
                    </strong>
                  </div>
                  <div className="parent-details-item">
                    <span className="parent-details-label">Submission Date</span>
                    <strong className="parent-details-val">
                      {trackResult.submissionDate || trackResult.createdAt
                        ? new Date(trackResult.submissionDate || trackResult.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Recent'}
                    </strong>
                  </div>
                  {trackResult.additionalComments && (
                    <div className="parent-details-item parent-details-item--full">
                      <span className="parent-details-label">Additional Comments / Notes</span>
                      <strong className="parent-details-val">{trackResult.additionalComments}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="parent-details-modal__footer">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn--outline btn--sm"
                >
                  <FiPrinter /> Print / Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="btn btn--primary btn--sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
