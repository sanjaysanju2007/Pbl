import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCompass, FiArrowLeft } from 'react-icons/fi';
import './PageStyles.css';

const NotFound = () => {
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
            <p style={{ margin: '0 auto 32px', maxWidth: '500px' }}>
              It looks like this page has fluttered away! Don't worry — let's get you back home.
            </p>
            <Link to="/" className="btn btn--primary btn--lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FiArrowLeft aria-hidden="true" /> Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
