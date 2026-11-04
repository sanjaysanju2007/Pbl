import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSend, FiCheck, FiMessageSquare, FiFileText, FiArrowRight } from 'react-icons/fi';
import API from '../api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import NextStep from '../components/sections/NextStep';
import siteConfig from '../data/siteConfig';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Enquiry = () => {
  useDocumentTitle('Admission Enquiry');
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic');

  const [form, setForm] = useState({ name: '', phone: '', email: '', childAge: '', programInterest: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-select fee schedule enquiry if topic=fees query param is present
  useEffect(() => {
    if (topic === 'fees') {
      setForm(prev => ({
        ...prev,
        message: prev.message || 'I would like to request the official fee schedule and payment structure for the upcoming academic year.'
      }));
    }
  }, [topic]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit mobile number required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email is required';
    if (!form.message.trim()) e.message = 'Please tell us how we can help';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await API.post('/enquiries', form);
      if (response.data && response.data.success) {
        setSuccess(true);
      } else {
        setErrors({ submit: response.data?.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Something went wrong. Please try again.' });
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <>
        <Helmet><title>Enquiry Sent — Chittukurumbakam Play School</title></Helmet>
        <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container container--narrow text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="success-card">
              <span className="success-card__icon"><FiCheck size={48} /></span>
              <h2>Thank You for Your Enquiry!</h2>
              <p>We've received your message and will get back to you within 24-48 hours. A confirmation email has been sent to <strong>{form.email}</strong>.</p>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Enquire Now — Chittukurumbakam Play School</title>
        <meta name="description" content="Have questions? Send us an enquiry and our team will get back to you within 24-48 hours." />
      </Helmet>

      <section className="page-hero page-hero--enquiry">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiMessageSquare aria-hidden="true" /> Enquire</span>
            <h1>We'd Love to Hear from You</h1>
            <p>Have questions about our programs, admissions, or facilities? Drop us a message!</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <form onSubmit={handleSubmit} className="enquiry-form card" style={{ padding: '40px' }}>
            {topic === 'fees' && (
              <div style={{ background: 'var(--color-primary-light)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(31, 122, 184, 0.25)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiFileText style={{ color: 'var(--color-primary)', fontSize: '1.25rem', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  <strong>Fee Schedule Request:</strong> Our admissions desk will send the complete fee breakdown and optional transportation costs to your email {siteConfig.admission.expectedEnquiryReplyTime}.
                </span>
              </div>
            )}
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiSend aria-hidden="true" /> Send Us Your Enquiry
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name <span className="required">*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Full name" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="10-digit mobile" />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@email.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Child's Age</label>
                <input type="text" name="childAge" value={form.childAge} onChange={handleChange} className="form-input" placeholder="e.g. 2.5 years" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Program of Interest</label>
              <select name="programInterest" value={form.programInterest} onChange={handleChange} className="form-select">
                <option value="">Select (optional)</option>
                <option value="Playgroup">Playgroup</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Not Sure">Not Sure Yet</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Your Message <span className="required">*</span></label>
              <textarea name="message" value={form.message} onChange={handleChange} className={`form-textarea ${errors.message ? 'error' : ''}`} placeholder="Tell us what you'd like to know..." rows="4" />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>
            {errors.submit && <div className="form-error" style={{ textAlign: 'center', marginBottom: '16px' }}>{errors.submit}</div>}
            <button type="submit" className="btn btn--primary btn--lg" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Sending...' : <><FiSend /> Send Enquiry</>}
            </button>
          </form>
        </div>
      </section>

      {/* Relevant Next Step Block */}
      <NextStep
        icon={<FiMessageSquare aria-hidden="true" />}
        badge="Direct Admission"
        title="Ready to Apply Directly?"
        description="Skip the enquiry queue and submit an online application form directly to our admissions committee."
        primaryAction={{
          label: 'Start Online Application',
          to: '/admission',
          icon: <FiArrowRight aria-hidden="true" />
        }}
        secondaryAction={{
          label: 'Explore Our Programs',
          to: '/programs'
        }}
      />
    </>
  );
};

export default Enquiry;
