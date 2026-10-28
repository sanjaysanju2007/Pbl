import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSend,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiUploadCloud,
  FiFileText,
  FiX,
  FiPrinter,
  FiSearch,
  FiPhone,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiHeart
} from 'react-icons/fi';
import API from '../api';
import './PageStyles.css';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const initialForm = {
  // Student
  childName: '',
  dateOfBirth: '',
  gender: '',
  program: '',
  academicYear: '2026-2027',
  preferredStartDate: '',
  bloodGroup: '',
  allergies: '',

  // Parent / Guardian
  primaryContactName: '',
  relationship: 'Father',
  fatherName: '',
  motherName: '',
  guardianPhone: '',
  guardianEmail: '',
  alternatePhone: '',
  address: '',
  city: 'Tiruppur',
  pincode: '',

  // Additional Info
  previousSchool: '',
  specialConsiderations: '',
  preferredContactMethod: 'Phone Call',
  additionalComments: '',

  // Parental Consent
  consentConfirmed: false
};

const AdmissionForm = () => {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // File upload handler with validation
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const fileErrors = [];

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    selectedFiles.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        fileErrors.push(`"${file.name}" has an unsupported format. Please upload PDF, JPG, or PNG.`);
      } else if (file.size > maxSizeBytes) {
        fileErrors.push(`"${file.name}" exceeds the 5MB size limit.`);
      } else {
        validFiles.push(file);
      }
    });

    if (fileErrors.length > 0) {
      setErrors(prev => ({ ...prev, documents: fileErrors.join(' ') }));
    } else {
      setErrors(prev => ({ ...prev, documents: '' }));
      setFiles(prev => [...prev, ...validFiles].slice(0, 4)); // max 4 files
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Section validations
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.childName.trim()) newErrors.childName = "Student's full name is required";
      if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!form.gender) newErrors.gender = 'Please select student gender';
      if (!form.program) newErrors.program = 'Please select a program';
      if (!form.academicYear) newErrors.academicYear = 'Academic year is required';
    } else if (currentStep === 2) {
      if (!form.primaryContactName.trim() && !form.fatherName.trim() && !form.motherName.trim()) {
        newErrors.primaryContactName = 'Parent or Guardian full name is required';
      }
      if (!form.guardianPhone.trim()) {
        newErrors.guardianPhone = 'Primary contact number is required';
      } else if (!form.guardianPhone.match(/^[6-9]\d{9}$/)) {
        newErrors.guardianPhone = 'Enter a valid 10-digit Indian mobile number';
      }

      if (!form.guardianEmail.trim()) {
        newErrors.guardianEmail = 'Parent email address is required';
      } else if (!form.guardianEmail.match(/^\S+@\S+\.\S+$/)) {
        newErrors.guardianEmail = 'Enter a valid email address';
      }

      if (!form.address.trim()) {
        newErrors.address = 'Residential street address is required';
      }
    } else if (currentStep === 4) {
      if (!form.consentConfirmed) {
        newErrors.consentConfirmed = 'Please confirm that the information provided is accurate and agree to admission review terms';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Final Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      // Append documents
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await API.post('/admissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSubmittedData({
          ...form,
          applicationNumber: response.data.applicationNumber || response.data.data?.applicationNumber,
          submissionDate: new Date()
        });
        window.scrollTo({ top: 100, behavior: 'smooth' });
      } else {
        setErrors({ submit: response.data.message || 'Submission was not completed. Please try again.' });
      }
    } catch (err) {
      console.error('Admission submit error:', err);
      setErrors({
        submit: err.response?.data?.message || 'Unable to submit application at this time. Please check your network or try again.'
      });
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="admission-success-card"
            >
              <div className="admission-success-header">
                <span className="admission-success-icon"><FiCheck size={42} /></span>
                <h2>Admission Application Submitted! 🎉</h2>
                <p>
                  Thank you for applying to Chittukurumbakam Play School. We have received your application for <strong>{submittedData.childName}</strong>.
                </p>
              </div>

              {/* Unique Reference Number Banner */}
              <div className="admission-ref-box">
                <span className="admission-ref-label">Your Application Reference Number</span>
                <span className="admission-ref-number">{submittedData.applicationNumber}</span>
                <span className="admission-ref-note">Please save this reference number. A confirmation email has been sent to <strong>{submittedData.guardianEmail}</strong>.</span>
              </div>

              {/* Summary Details */}
              <div className="admission-summary-grid">
                <div className="admission-summary-item">
                  <span>Student Name</span>
                  <strong>{submittedData.childName}</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Program Applying For</span>
                  <strong>{submittedData.program} ({submittedData.academicYear})</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Primary Contact</span>
                  <strong>{submittedData.primaryContactName || submittedData.fatherName || 'Parent'} ({submittedData.guardianPhone})</strong>
                </div>
                <div className="admission-summary-item">
                  <span>Initial Status</span>
                  <span className="badge badge--blue">Submitted — Under Review</span>
                </div>
              </div>

              {/* Notice Box */}
              <div className="admission-important-note">
                <FiAlertCircle size={20} className="admission-important-icon" />
                <div>
                  <strong>What Happens Next?</strong>
                  <p>
                    Our admissions committee will carefully review your child's application within <strong>2 to 3 business days</strong>. Our team will reach out to schedule a friendly mentor interaction and campus tour. <em>Please note that application submission does not constitute final confirmation of admission.</em>
                  </p>
                </div>
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
        <title>Student Admission Application Form — Chittukurumbakam Play School</title>
        <meta
          name="description"
          content="Official online admission registration form for Chittukurumbakam Play School. Enroll your toddler in Playgroup, Nursery, LKG, or UKG with a safe, Montessori-inspired curriculum."
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="page-hero page-hero--admission">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">📝 Admissions Open 2026–2027</span>
            <h1>Student Admission Application</h1>
            <p>
              Take the first joyful step in your child's education. Complete our secure online application form below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Multi-Step Form Section */}
      <section className="section" style={{ background: 'var(--color-bg)', paddingTop: '40px' }}>
        <div className="container container--narrow">
          {/* Progress Indicator */}
          <div className="admission-steps-nav">
            {[
              { num: 1, label: 'Student Details', icon: '👶' },
              { num: 2, label: 'Parent Details', icon: '👨‍👩‍👦' },
              { num: 3, label: 'Additional & Docs', icon: '📄' },
              { num: 4, label: 'Review & Submit', icon: '✅' }
            ].map(s => (
              <div
                key={s.num}
                className={`admission-step-pill ${step === s.num ? 'admission-step-pill--current' : ''} ${step > s.num ? 'admission-step-pill--completed' : ''}`}
                onClick={() => { if (step > s.num) setStep(s.num); }}
                role="button"
                tabIndex={step > s.num ? 0 : -1}
              >
                <span className="admission-step-pill__num">
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="admission-step-pill__label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="admission-card">
            <form onSubmit={handleSubmit} noValidate>
              {errors.submit && (
                <div className="login-alert login-alert--error" style={{ marginBottom: '20px' }}>
                  <FiAlertCircle /> {errors.submit}
                </div>
              )}

              {/* ================= STEP 1: STUDENT DETAILS ================= */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                  <div className="admission-section-head">
                    <span className="admission-section-badge">Section A</span>
                    <h3>Student Information</h3>
                    <p>Tell us about your little one.</p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Student's Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="childName"
                        value={form.childName}
                        onChange={handleChange}
                        className={`form-input ${errors.childName ? 'error' : ''}`}
                        placeholder="e.g. Aarav Sharma"
                      />
                      {errors.childName && <span className="form-error">{errors.childName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Date of Birth <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                      />
                      {errors.dateOfBirth && <span className="form-error">{errors.dateOfBirth}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Gender <span className="required">*</span>
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={`form-select ${errors.gender ? 'error' : ''}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Boy (Male)</option>
                        <option value="Female">Girl (Female)</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <span className="form-error">{errors.gender}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Program Applying For <span className="required">*</span>
                      </label>
                      <select
                        name="program"
                        value={form.program}
                        onChange={handleChange}
                        className={`form-select ${errors.program ? 'error' : ''}`}
                      >
                        <option value="">Select Program</option>
                        <option value="Playgroup">🧸 Playgroup (1.5 – 2.5 Years)</option>
                        <option value="Nursery">🎨 Nursery (2.5 – 3.5 Years)</option>
                        <option value="LKG">📚 LKG (3.5 – 4.5 Years)</option>
                        <option value="UKG">🎓 UKG (4.5 – 5.5 Years)</option>
                      </select>
                      {errors.program && <span className="form-error">{errors.program}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Academic Year <span className="required">*</span></label>
                      <select
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="2026-2027">Academic Year 2026–2027 (Current)</option>
                        <option value="2027-2028">Academic Year 2027–2028 (Advance)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Start Date</label>
                      <input
                        type="date"
                        name="preferredStartDate"
                        value={form.preferredStartDate}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Blood Group (Optional)</label>
                      <select
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Known Allergies / Health Notes</label>
                      <input
                        type="text"
                        name="allergies"
                        value={form.allergies}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. Dust allergy, milk allergy, or none"
                      />
                    </div>
                  </div>

                  <div className="admission-actions">
                    <div></div>
                    <button type="button" onClick={nextStep} className="btn btn--primary">
                      Next: Parent Details <FiArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 2: PARENT / GUARDIAN DETAILS ================= */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                  <div className="admission-section-head">
                    <span className="admission-section-badge">Section B</span>
                    <h3>Parent / Guardian Details</h3>
                    <p>Primary contact details for all school communications.</p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Primary Contact Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="primaryContactName"
                        value={form.primaryContactName}
                        onChange={handleChange}
                        className={`form-input ${errors.primaryContactName ? 'error' : ''}`}
                        placeholder="e.g. Ramesh Kumar"
                      />
                      {errors.primaryContactName && <span className="form-error">{errors.primaryContactName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Relationship to Student</label>
                      <select
                        name="relationship"
                        value={form.relationship}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Legal Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Father's Name (Optional if filled above)</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={form.fatherName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Father's full name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mother's Name (Optional if filled above)</label>
                      <input
                        type="text"
                        name="motherName"
                        value={form.motherName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Mother's full name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Primary Mobile Number <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={form.guardianPhone}
                        onChange={handleChange}
                        className={`form-input ${errors.guardianPhone ? 'error' : ''}`}
                        placeholder="10-digit mobile number (e.g. 9876543210)"
                        maxLength={10}
                      />
                      {errors.guardianPhone && <span className="form-error">{errors.guardianPhone}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        name="guardianEmail"
                        value={form.guardianEmail}
                        onChange={handleChange}
                        className={`form-input ${errors.guardianEmail ? 'error' : ''}`}
                        placeholder="parent@example.com"
                      />
                      {errors.guardianEmail && <span className="form-error">{errors.guardianEmail}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Alternate Contact Number (Optional)</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={form.alternatePhone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Optional second number"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Tiruppur"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label">
                        Residential Address <span className="required">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows="2"
                        className={`form-textarea ${errors.address ? 'error' : ''}`}
                        placeholder="House / Flat No., Street, Area, Landmark"
                      />
                      {errors.address && <span className="form-error">{errors.address}</span>}
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Postal PIN Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="641604"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="admission-actions">
                    <button type="button" onClick={prevStep} className="btn btn--outline">
                      <FiArrowLeft /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="btn btn--primary">
                      Next: Additional Info <FiArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 3: ADDITIONAL INFO & DOCUMENTS ================= */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                  <div className="admission-section-head">
                    <span className="admission-section-badge">Section C & D</span>
                    <h3>Additional Information & Optional Documents</h3>
                    <p>Help us prepare a customized and caring introduction for your child.</p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Previous School or Daycare (Optional)</label>
                      <input
                        type="text"
                        name="previousSchool"
                        value={form.previousSchool}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="If attended any playgroup or daycare earlier"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Contact Method</label>
                      <select
                        name="preferredContactMethod"
                        value={form.preferredContactMethod}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Phone Call">📞 Direct Phone Call</option>
                        <option value="WhatsApp">💬 WhatsApp Message</option>
                        <option value="Email">✉️ Email</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Needs, Habits or Considerations (Optional)</label>
                    <textarea
                      name="specialConsiderations"
                      value={form.specialConsiderations}
                      onChange={handleChange}
                      rows="2"
                      className="form-textarea"
                      placeholder="e.g. Favorite activities, comfort items, speech milestones, dietary habits"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Comments or Questions (Optional)</label>
                    <textarea
                      name="additionalComments"
                      value={form.additionalComments}
                      onChange={handleChange}
                      rows="2"
                      className="form-textarea"
                      placeholder="Any specific questions you would like our admissions team to answer"
                    />
                  </div>

                  {/* Document Upload Area */}
                  <div className="admission-upload-section">
                    <label className="form-label">
                      Attach Admission Documents (Optional)
                      <span className="form-label-hint"> — Birth certificate, immunization record, or child photograph</span>
                    </label>

                    <div className="admission-dropzone">
                      <input
                        type="file"
                        id="admission-doc-upload"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="admission-doc-upload" className="admission-dropzone__label">
                        <FiUploadCloud className="admission-dropzone__icon" size={36} />
                        <strong>Click to select documents or photos</strong>
                        <span>PDF, JPG, PNG up to 5MB each (Max 4 files)</span>
                      </label>
                    </div>

                    {errors.documents && (
                      <span className="form-error" style={{ display: 'block', marginTop: '8px' }}>
                        {errors.documents}
                      </span>
                    )}

                    {files.length > 0 && (
                      <div className="admission-file-list">
                        {files.map((file, idx) => (
                          <div key={idx} className="admission-file-chip">
                            <FiFileText className="admission-file-icon" />
                            <span className="admission-file-name">{file.name}</span>
                            <span className="admission-file-size">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="admission-file-remove"
                              aria-label="Remove document"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admission-actions">
                    <button type="button" onClick={prevStep} className="btn btn--outline">
                      <FiArrowLeft /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="btn btn--primary">
                      Next: Review Application <FiArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 4: REVIEW & CONFIRM ================= */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                  <div className="admission-section-head">
                    <span className="admission-section-badge">Section E</span>
                    <h3>Review Your Application Details</h3>
                    <p>Please double-check all details before final submission.</p>
                  </div>

                  <div className="admission-review-box">
                    {/* Student Info Card */}
                    <div className="admission-review-card">
                      <div className="admission-review-card__head">
                        <h4>👶 Student Profile</h4>
                        <button type="button" onClick={() => setStep(1)} className="admission-edit-btn">
                          Edit
                        </button>
                      </div>
                      <div className="admission-review-card__grid">
                        <div><span>Student Name:</span> <strong>{form.childName}</strong></div>
                        <div><span>Date of Birth:</span> <strong>{form.dateOfBirth}</strong></div>
                        <div><span>Gender:</span> <strong>{form.gender}</strong></div>
                        <div><span>Program Applying For:</span> <strong>{form.program}</strong></div>
                        <div><span>Academic Year:</span> <strong>{form.academicYear}</strong></div>
                        {form.bloodGroup && <div><span>Blood Group:</span> <strong>{form.bloodGroup}</strong></div>}
                        {form.allergies && <div><span>Allergies:</span> <strong>{form.allergies}</strong></div>}
                      </div>
                    </div>

                    {/* Parent Info Card */}
                    <div className="admission-review-card">
                      <div className="admission-review-card__head">
                        <h4>👨‍👩‍👧 Parent / Guardian Contact</h4>
                        <button type="button" onClick={() => setStep(2)} className="admission-edit-btn">
                          Edit
                        </button>
                      </div>
                      <div className="admission-review-card__grid">
                        <div><span>Primary Contact:</span> <strong>{form.primaryContactName || form.fatherName || 'Parent'} ({form.relationship})</strong></div>
                        <div><span>Phone:</span> <strong>{form.guardianPhone}</strong></div>
                        <div><span>Email:</span> <strong>{form.guardianEmail}</strong></div>
                        <div><span>Address:</span> <strong>{form.address}, {form.city} {form.pincode}</strong></div>
                        <div><span>Preferred Contact:</span> <strong>{form.preferredContactMethod}</strong></div>
                      </div>
                    </div>

                    {/* Additional & Files Card */}
                    <div className="admission-review-card">
                      <div className="admission-review-card__head">
                        <h4>📄 Documents & Notes</h4>
                        <button type="button" onClick={() => setStep(3)} className="admission-edit-btn">
                          Edit
                        </button>
                      </div>
                      <div className="admission-review-card__grid">
                        <div>
                          <span>Attached Files:</span>{' '}
                          <strong>{files.length > 0 ? `${files.length} document(s) attached` : 'None attached'}</strong>
                        </div>
                        {form.previousSchool && <div><span>Previous School:</span> <strong>{form.previousSchool}</strong></div>}
                        {form.specialConsiderations && <div><span>Considerations:</span> <strong>{form.specialConsiderations}</strong></div>}
                      </div>
                    </div>
                  </div>

                  {/* Parental Consent Checkbox */}
                  <div className="admission-consent-wrap">
                    <label className="admission-consent-label">
                      <input
                        type="checkbox"
                        name="consentConfirmed"
                        checked={form.consentConfirmed}
                        onChange={handleChange}
                        className="admission-consent-checkbox"
                      />
                      <span>
                        I hereby declare that all details provided in this admission application are correct to the best of my knowledge. I understand that submitting this form initiates the admissions review process and does not automatically guarantee admission.
                      </span>
                    </label>
                    {errors.consentConfirmed && (
                      <span className="form-error" style={{ display: 'block', marginTop: '6px' }}>
                        {errors.consentConfirmed}
                      </span>
                    )}
                  </div>

                  <div className="admission-actions">
                    <button type="button" onClick={prevStep} className="btn btn--outline" disabled={submitting}>
                      <FiArrowLeft /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn--primary btn--lg"
                    >
                      {submitting ? 'Submitting Application...' : <><FiSend /> Final Submit Application</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdmissionForm;
