import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSend,
  FiCheck,
  FiPrinter,
  FiSearch,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiUsers,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiBookOpen,
  FiMessageSquare,
  FiCheckCircle
} from 'react-icons/fi';
import API from '../api';
import './PageStyles.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const initialForm = {
  childName: '',
  dateOfBirth: '',
  age: '',
  parentName: '',
  guardianPhone: '',
  program: 'Playgroup',
  location: '',
  guardianEmail: '',
  hasPreviousSchool: '', // 'Yes' or 'No' (mandatory)
  previousSchoolName: '',
  timing: '9:00-12:30', // '9:00-12:30' | '9:00-4:00' | '9:00-6:00'
  additionalComments: ''
};

const calculateAge = (dobString) => {
  if (!dobString) return '';
  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) return '';
  const now = new Date();
  if (birth > now) return 'Future date';

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years === 0 && months === 0) return 'Under 1 month';
  if (years === 0) return `${months} Month${months > 1 ? 's' : ''}`;
  if (months === 0) return `${years} Year${years > 1 ? 's' : ''}`;
  return `${years} Year${years > 1 ? 's' : ''} ${months} Month${months > 1 ? 's' : ''}`;
};

const AdmissionForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '', submit: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const numericVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({
      ...prev,
      guardianPhone: numericVal
    }));

    if (errors.guardianPhone || errors.submit) {
      setErrors(prev => ({ ...prev, guardianPhone: '', submit: '' }));
    }
  };

  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    const computedAge = calculateAge(dobValue);
    setForm(prev => ({
      ...prev,
      dateOfBirth: dobValue,
      age: computedAge
    }));

    if (errors.dateOfBirth || errors.age) {
      setErrors(prev => ({ ...prev, dateOfBirth: '', age: '' }));
    }
  };

  const handlePreviousSchoolChoice = (choice) => {
    setForm(prev => ({
      ...prev,
      hasPreviousSchool: choice,
      previousSchoolName: choice === 'No' ? '' : prev.previousSchoolName
    }));

    if (errors.hasPreviousSchool) {
      setErrors(prev => ({ ...prev, hasPreviousSchool: '', previousSchoolName: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.childName.trim()) {
      newErrors.childName = "Kid's full name is required";
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (new Date(form.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    if (!form.age.trim()) {
      newErrors.age = "Child's age is required (auto-calculates from DOB)";
    }

    if (!form.parentName.trim()) {
      newErrors.parentName = "Parents name is required";
    }

    if (!form.guardianPhone.trim()) {
      newErrors.guardianPhone = 'Mobile number is required';
    } else if (!form.guardianPhone.match(/^[6-9]\d{9}$/)) {
      newErrors.guardianPhone = 'Please enter a valid 10-digit mobile number (starting with 6, 7, 8, or 9)';
    }

    if (!form.program) {
      newErrors.program = 'Please select the category applying for';
    }

    if (!form.location.trim()) {
      newErrors.location = 'Location / Area is required';
    }

    if (!form.guardianEmail.trim()) {
      newErrors.guardianEmail = 'Mail ID is required';
    } else if (!form.guardianEmail.match(/^\S+@\S+\.\S+$/)) {
      newErrors.guardianEmail = 'Please enter a valid email address';
    }

    if (!form.hasPreviousSchool) {
      newErrors.hasPreviousSchool = 'Please select whether your child attended previous school or daycare';
    } else if (form.hasPreviousSchool === 'Yes' && !form.previousSchoolName.trim()) {
      newErrors.previousSchoolName = 'Please enter the name of the previous school or daycare';
    }

    if (!form.timing) {
      newErrors.timing = 'Please select a preferred timing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 320, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        childName: form.childName.trim(),
        dateOfBirth: form.dateOfBirth,
        age: form.age.trim(),
        parentName: form.parentName.trim(),
        primaryContactName: form.parentName.trim(),
        guardianPhone: form.guardianPhone.trim(),
        program: form.program,
        location: form.location.trim(),
        address: form.location.trim(),
        guardianEmail: form.guardianEmail.trim().toLowerCase(),
        hasPreviousSchool: form.hasPreviousSchool,
        previousSchoolName: form.hasPreviousSchool === 'Yes' ? form.previousSchoolName.trim() : '',
        previousSchool: form.hasPreviousSchool === 'Yes' ? form.previousSchoolName.trim() : 'None',
        timing: form.timing,
        additionalComments: form.additionalComments.trim()
      };

      const response = await API.post('/admissions', payload);

      if (response.data && response.data.success) {
        setSubmittedData({
          ...payload,
          applicationNumber: response.data.applicationNumber || response.data.data?.applicationNumber,
          submissionDate: new Date()
        });
        window.scrollTo({ top: 80, behavior: 'smooth' });
      } else {
        setErrors({ submit: response.data?.message || 'Submission could not be completed. Please try again.' });
      }
    } catch (err) {
      console.error('Admission submit error:', err);
      const errorMsg = err.response?.data?.message || 'Unable to submit application at this time. Please check your network and try again.';
      if (err.response?.status === 409) {
        setErrors({
          submit: errorMsg,
          guardianPhone: 'This mobile number is already registered'
        });
      } else {
        setErrors({
          submit: errorMsg
        });
      }
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedData) {
    return (
      <>
        <Helmet>
          <title>Application Submitted — {submittedData.applicationNumber} | Chittukurumbakam Play School</title>
        </Helmet>

        <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--color-bg)' }}>
          <div className="container container--narrow">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, type: 'spring' }}
              className="admission-success-card"
            >
              <div className="admission-success-header">
                <span className="admission-success-icon"><FiCheck size={42} /></span>
                <h2>Application Submitted Successfully!</h2>
                <p>
                  Thank you for applying to Chittukurumbakam Play School. We have received the admission details for <strong>{submittedData.childName}</strong>.
                </p>
              </div>

              {/* Registered Mobile Tracking Banner */}
              <div className="admission-mobile-track-banner" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '20px 24px', margin: '20px 0', textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📱 Track Anytime With Your Mobile Number
                </span>
                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '8px 0 6px 0', fontWeight: '800' }}>
                  {submittedData.guardianPhone}
                </h3>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569' }}>
                  No reference code needed! Simply enter this mobile number on our portal to check your child's admission status.
                </p>
              </div>

              {/* Summary Details */}
              <div className="admission-summary-grid">
                <div className="admission-summary-item">
                  <span>Kid Name</span>
                  <strong>{submittedData.childName}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>DOB & Age</span>
                  <strong>{submittedData.dateOfBirth} ({submittedData.age})</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Parents Name</span>
                  <strong>{submittedData.parentName}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Mobile</span>
                  <strong>{submittedData.guardianPhone}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Category Applying For</span>
                  <strong>{submittedData.program}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Timing</span>
                  <strong>{submittedData.timing}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Location</span>
                  <strong>{submittedData.location}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Mail ID</span>
                  <strong>{submittedData.guardianEmail}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Previous School/Daycare</span>
                  <strong>{submittedData.hasPreviousSchool === 'Yes' ? submittedData.previousSchoolName : 'No'}</strong>
                </div>
                {submittedData.additionalComments && (
                  <div className="admission-summary-item" style={{ gridColumn: '1 / -1' }}>
                    <span>Additional Comments</span>
                    <strong>{submittedData.additionalComments}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="admission-success-actions">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn--outline"
                >
                  <FiPrinter /> Print / Save Summary
                </button>
                <Link to="/login" className="btn btn--primary">
                  <FiSearch /> Track Application Online
                </Link>
                <Link to="/" className="btn btn--secondary">
                  Back to Homepage
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Apply Now — Student Admission | Chittukurumbakam Play School</title>
        <meta
          name="description"
          content="Apply online for admission at Chittukurumbakam Play School and Daycare in Tiruppur. Quick and simple registration for Playgroup, Nursery, LKG, UKG, and Daycare."
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="page-hero page-hero--admission">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiCheckCircle /> Admissions Open 2026–2027</span>
            <h1>Apply for Admission</h1>
            <p>
              Take the first joyful step in your child's learning journey. Fill out the quick application below and our admissions team will connect with you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Single-Page Form Section */}
      <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '36px', paddingBottom: '70px' }}>
        <div className="container container--narrow">
          <div className="admission-card">
            <div className="admission-section-head">
              <span className="admission-section-badge">Online Admission Portal</span>
              <h3>Application Form</h3>
              <p>Please enter the required child and parent details below.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {errors.submit && (
                <div className="login-alert login-alert--error" style={{ marginBottom: '22px' }}>
                  <FiAlertCircle /> {errors.submit}
                </div>
              )}

              {/* 1. Kid Name */}
              <div className="form-group">
                <label className="form-label">
                  <FiUser style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Kid Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="childName"
                  value={form.childName}
                  onChange={handleChange}
                  placeholder="Enter child's full name"
                  className={`form-input ${errors.childName ? 'error' : ''}`}
                />
                {errors.childName && <span className="form-error">{errors.childName}</span>}
              </div>

              {/* 2. DOB & Age */}
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    <FiCalendar style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Date of Birth (DOB) <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={handleDobChange}
                    className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                  />
                  {errors.dateOfBirth && <span className="form-error">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    Age <span className="required">*</span>
                    {form.age && <span className="form-label-badge">{form.age}</span>}
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Auto-calculated from DOB"
                    className={`form-input ${errors.age ? 'error' : ''}`}
                  />
                  {errors.age && <span className="form-error">{errors.age}</span>}
                </div>
              </div>

              {/* 3. Parents Name */}
              <div className="form-group">
                <label className="form-label">
                  <FiUsers style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Parents Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="Enter parent / guardian full name"
                  className={`form-input ${errors.parentName ? 'error' : ''}`}
                />
                {errors.parentName && <span className="form-error">{errors.parentName}</span>}
              </div>

              {/* 4. Mobile */}
              <div className="form-group">
                <label className="form-label">
                  <FiPhone style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Mobile <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={form.guardianPhone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  className={`form-input ${errors.guardianPhone ? 'error' : ''}`}
                />
                {errors.guardianPhone && <span className="form-error">{errors.guardianPhone}</span>}
              </div>

              {/* 5. Catagory Applying For */}
              <div className="form-group">
                <label className="form-label">
                  <FiBookOpen style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Catagory Applying For <span className="required">*</span>
                </label>
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  className={`form-select ${errors.program ? 'error' : ''}`}
                >
                  <option value="Playgroup">Playgroup (1.5 – 2.5 Years)</option>
                  <option value="Nursery">Nursery (2.5 – 3.5 Years)</option>
                  <option value="LKG">LKG (3.5 – 4.5 Years)</option>
                  <option value="UKG">UKG (4.5 – 5.5 Years)</option>
                  <option value="Daycare">Daycare (Infants & Toddlers)</option>
                </select>
                {errors.program && <span className="form-error">{errors.program}</span>}
              </div>

              {/* 6. Location */}
              <div className="form-group">
                <label className="form-label">
                  <FiMapPin style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter location / area / town"
                  className={`form-input ${errors.location ? 'error' : ''}`}
                />
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>

              {/* 7. Mail ID */}
              <div className="form-group">
                <label className="form-label">
                  <FiMail style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Mail ID <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={form.guardianEmail}
                  onChange={handleChange}
                  placeholder="Enter parent email address"
                  className={`form-input ${errors.guardianEmail ? 'error' : ''}`}
                />
                {errors.guardianEmail && <span className="form-error">{errors.guardianEmail}</span>}
              </div>

              {/* 8. Previous School or Daycare (Mandatory) */}
              <div className="form-group">
                <label className="form-label">
                  Previous School or Daycare <span className="required">*</span>
                </label>
                <div className="radio-group-row">
                  <label
                    className={`radio-pill-card ${form.hasPreviousSchool === 'Yes' ? 'selected' : ''}`}
                    onClick={() => handlePreviousSchoolChoice('Yes')}
                  >
                    <input
                      type="radio"
                      name="hasPreviousSchool"
                      value="Yes"
                      checked={form.hasPreviousSchool === 'Yes'}
                      onChange={() => handlePreviousSchoolChoice('Yes')}
                    />
                    <span>Yes</span>
                  </label>

                  <label
                    className={`radio-pill-card ${form.hasPreviousSchool === 'No' ? 'selected' : ''}`}
                    onClick={() => handlePreviousSchoolChoice('No')}
                  >
                    <input
                      type="radio"
                      name="hasPreviousSchool"
                      value="No"
                      checked={form.hasPreviousSchool === 'No'}
                      onChange={() => handlePreviousSchoolChoice('No')}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.hasPreviousSchool && <span className="form-error">{errors.hasPreviousSchool}</span>}
              </div>

              {/* 9. If Yes -> Name of the School */}
              <AnimatePresence>
                {form.hasPreviousSchool === 'Yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="form-group"
                    style={{ overflow: 'hidden' }}
                  >
                    <label className="form-label">
                      Name of the School / Daycare <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="previousSchoolName"
                      value={form.previousSchoolName}
                      onChange={handleChange}
                      placeholder="Enter name of previous school or daycare"
                      className={`form-input ${errors.previousSchoolName ? 'error' : ''}`}
                    />
                    {errors.previousSchoolName && <span className="form-error">{errors.previousSchoolName}</span>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 10. Timing */}
              <div className="form-group">
                <label className="form-label">
                  <FiClock style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Timing <span className="required">*</span>
                </label>
                <div className="timing-options-grid">
                  {[
                    { value: '9:00-12:30', label: '9:00 - 12:30', sub: 'Morning Session' },
                    { value: '9:00-4:00', label: '9:00 - 4:00', sub: 'Regular Day' },
                    { value: '9:00-6:00', label: '9:00 - 6:00', sub: 'Extended Daycare' }
                  ].map(t => (
                    <label
                      key={t.value}
                      className={`timing-card ${form.timing === t.value ? 'timing-card--active' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, timing: t.value }))}
                    >
                      <input
                        type="radio"
                        name="timing"
                        value={t.value}
                        checked={form.timing === t.value}
                        onChange={handleChange}
                      />
                      <span className="timing-card__time">{t.label}</span>
                      <span className="timing-card__sub">{t.sub}</span>
                    </label>
                  ))}
                </div>
                {errors.timing && <span className="form-error">{errors.timing}</span>}
              </div>

              {/* 11. Additional Comments or Questions */}
              <div className="form-group">
                <label className="form-label">
                  <FiMessageSquare style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Additional Comments or Questions <span className="form-label-hint">(Optional)</span>
                </label>
                <textarea
                  name="additionalComments"
                  value={form.additionalComments}
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Any questions or special requirements for our admissions team..."
                />
              </div>

              {/* Submit Button */}
              <div className="admission-actions" style={{ justifyContent: 'center', marginTop: '28px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn--primary btn--lg"
                  style={{ minWidth: '260px' }}
                >
                  {submitting ? 'Submitting Application...' : <><FiSend /> Submit Application</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdmissionForm;
