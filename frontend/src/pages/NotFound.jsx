import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCompass, FiHome, FiBookOpen, FiEdit3, FiPhone } from 'react-icons/fi';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './PageStyles.css';

const NotFound = () => {
  useDocumentTitle('Page Not Found');

  return (
    <>
      <Helmet><title>Page Not Found — Chittukurumbakam Play School</title></Helmet>
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: 'var(--color-accent-soft)',
                border: '2px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <FiCompass size={44} aria-hidden="true" />
              </div>
            </div>
            <h1 style={{ marginBottom: '16px' }}>Oops! Page Not Found</h1>
            <p style={{ margin: '0 auto 32px', maxWidth: '520px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              It looks like this page has fluttered away! Don't worry — choose a helpful shortcut below to continue:
            </p>

            {/* Search-Free Helpful Shortcuts */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
              <Link to="/" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FiHome aria-hidden="true" /> Home
              </Link>
              <Link to="/programs" className="btn btn--outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FiBookOpen aria-hidden="true" /> Our Programs
              </Link>
              <Link to="/admission" className="btn btn--secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FiEdit3 aria-hidden="true" /> Apply Now
              </Link>
              <Link to="/contact" className="btn btn--outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FiPhone aria-hidden="true" /> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
