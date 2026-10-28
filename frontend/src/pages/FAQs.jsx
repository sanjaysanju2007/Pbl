import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiChevronDown, 
  FiSearch, 
  FiHelpCircle, 
  FiGrid, 
  FiFileText, 
  FiClock, 
  FiShield, 
  FiPhone, 
  FiMail 
} from 'react-icons/fi';
import API from '../api';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

const defaultFAQs = [
  { _id: '1', question: 'What age groups do you accept?', answer: 'We accept children from 1.5 years to 5.5 years of age across four programs: Playgroup (1.5–2.5 yrs), Nursery (2.5–3.5 yrs), LKG (3.5–4.5 yrs), and UKG (4.5–5.5 yrs).', category: 'admissions' },
  { _id: '2', question: 'What are the school timings?', answer: 'Playgroup: 9:00 AM – 12:00 PM | Nursery: 9:00 AM – 1:00 PM | LKG: 9:00 AM – 2:00 PM | UKG: 9:00 AM – 2:30 PM. We operate Monday through Friday, with select Saturdays for special events.', category: 'timings' },
  { _id: '3', question: 'How do I apply for admission?', answer: 'You can apply online through our Admission Registration page or visit our campus. Fill out the application form, submit required documents, and our admissions team will contact you within 3-5 business days.', category: 'admissions' },
  { _id: '4', question: 'What documents are required for admission?', answer: 'Birth certificate, Aadhaar card (child), passport-size photos (4), parent ID proof, address proof, and immunization records. Original documents are returned after verification.', category: 'admissions' },
  { _id: '5', question: 'Is transportation available?', answer: 'Yes! We offer GPS-tracked, air-conditioned mini buses with trained drivers and female attendants on every route. Transportation covers major areas within a 10 km radius.', category: 'general' },
  { _id: '6', question: 'What is your teaching methodology?', answer: 'We follow a play-based, child-centered approach integrating Montessori elements, thematic learning, and experiential activities. No rote memorization — we focus on understanding, creativity, and joyful discovery.', category: 'general' },
  { _id: '7', question: 'How do you handle separation anxiety?', answer: "We have a gentle transition program. New children start with shorter hours and gradually increase to full days. Our trained teachers use positive reinforcement, comfort objects, and engaging activities to help children settle in comfortably. Parents are welcome to stay during the first few days.", category: 'policies' },
  { _id: '8', question: 'Are meals provided?', answer: 'We provide a healthy mid-morning snack. Parents are asked to send a packed lunch for programs that extend past 12 PM. We follow strict hygiene protocols and accommodate dietary restrictions.', category: 'general' },
  { _id: '9', question: "How can I track my child's progress?", answer: 'We provide termly progress reports, regular parent-teacher meetings, and daily activity updates via our communication channel. No formal exams — we use observation-based continuous assessment.', category: 'policies' },
  { _id: '10', question: 'What are the safety measures in place?', answer: 'CCTV surveillance across campus, background-verified staff, controlled entry gates, pick-up authorization protocols, first-aid trained staff, regular fire drills, and a comprehensive child protection policy.', category: 'general' },
];

const categoryConfig = {
  all: { icon: <FiGrid aria-hidden="true" />, label: 'All Questions' },
  admissions: { icon: <FiFileText aria-hidden="true" />, label: 'Admissions' },
  timings: { icon: <FiClock aria-hidden="true" />, label: 'Timings' },
  policies: { icon: <FiShield aria-hidden="true" />, label: 'Policies' },
  general: { icon: <FiHelpCircle aria-hidden="true" />, label: 'General' },
};

const FAQs = () => {
  const [faqs, setFaqs] = useState(defaultFAQs);
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    API.get('/faqs').then(res => {
      if (res.data.data && res.data.data.length > 0) setFaqs(res.data.data);
    }).catch(() => {});
  }, []);

  const categories = ['all', 'admissions', 'timings', 'policies', 'general'];

  const filtered = faqs.filter(f => {
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch = !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggle = (id) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>FAQs — Chittukurumbakam Play School</title>
        <meta name="description" content="Frequently asked questions about admissions, fees, timings, policies, and more at Chittukurumbakam Play School." />
      </Helmet>

      <section className="page-hero page-hero--faqs">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiHelpCircle aria-hidden="true" /> FAQs</span>
            <h1>Frequently Asked Questions</h1>
            <p>Quick answers to help you make an informed decision for your child.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">

          {/* Search */}
          <div className="search-input-wrap">
            <FiSearch size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search FAQs... e.g. timing, fees, admission"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="faq-categories">
            {categories.map(cat => {
              const cfg = categoryConfig[cat] || { icon: <FiHelpCircle aria-hidden="true" />, label: cat };
              const count = cat === 'all' ? faqs.length : faqs.filter(f => f.category === cat).length;
              return (
                <button
                  key={cat}
                  className={`faq-cat-btn ${activeCategory === cat ? 'faq-cat-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="faq-cat-btn__emoji">{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span className="faq-cat-btn__count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Results count */}
          {searchQuery && (
            <p className="faq-results-info">
              {filtered.length === 0
                ? `No results for "${searchQuery}"`
                : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`
              }
            </p>
          )}

          {/* FAQ List */}
          <div className="faq-list">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="empty-state__emoji"><FiSearch size={48} aria-hidden="true" style={{ color: 'var(--neutral-400)' }} /></span>
                  <h3>No FAQs Found</h3>
                  <p>Try a different search term or select a different category.</p>
                </motion.div>
              ) : (
                filtered.map((faq, i) => (
                  <motion.div
                    key={faq._id}
                    className={`faq-item ${openId === faq._id ? 'faq-item--open' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    layout
                  >
                    <button className="faq-item__question" onClick={() => handleToggle(faq._id)}>
                      <div className="faq-item__question-inner">
                        <span className="faq-item__num">Q{i + 1}</span>
                        <span>{faq.question}</span>
                      </div>
                      <div className={`faq-item__icon-wrap ${openId === faq._id ? 'open' : ''}`}>
                        <FiChevronDown />
                      </div>
                    </button>
                    <AnimatePresence>
                      {openId === faq._id && (
                        <motion.div
                          className="faq-item__answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="faq-item__answer-inner">
                            <p>{faq.answer}</p>
                            {faq.category && (
                              <span className="faq-item__category-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {categoryConfig[faq.category]?.icon} {categoryConfig[faq.category]?.label || faq.category}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <div className="faq-cta card text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <p style={{ marginBottom: 'var(--space-md)', maxWidth: 'none', fontWeight: 600 }}>
              Didn't find your answer? We're happy to help!
            </p>
            <div className="flex-center gap-md flex-wrap">
              <a href="tel:+919952285838" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FiPhone aria-hidden="true" /> Call Us</a>
              <a href="mailto:info@chittukurumbakam.com" className="btn btn--outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FiMail aria-hidden="true" /> Email Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQs;
