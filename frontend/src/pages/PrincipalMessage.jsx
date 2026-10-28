import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiUser } from 'react-icons/fi';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const PrincipalMessage = () => {
  return (
    <>
      <Helmet>
        <title>Principal's Message — Chittukurumbakam Play School</title>
        <meta name="description" content="A warm welcome message from the Principal of Chittukurumbakam Play School." />
      </Helmet>

      <section className="page-hero page-hero--principal">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiMail aria-hidden="true" /> Welcome Note</span>
            <h1>Principal's Message</h1>
            <p>A warm welcome from the heart of our school.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <motion.div className="principal-message" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="principal-photo">
              <div className="principal-photo__avatar">
                <FiUser size={56} style={{ color: 'var(--primary-600)' }} aria-hidden="true" />
              </div>
              <h3>Mrs. Lakshmi Devi</h3>
              <span className="badge badge--blue">Founder & Principal</span>
            </div>
            <div className="principal-text">
              <p className="principal-greeting">Dear Parents and Guardians,</p>
              <p>Welcome to Chittukurumbakam Play School — a place where little feet take their first big steps into the wonderful world of learning!</p>
              <p>As a mother and an educator, I understand the immense trust you place in us when you bring your precious child to our school. This trust is something we never take lightly. Every policy we create, every activity we design, and every smile we share with your child is guided by a single purpose — to help them grow into confident, curious, and compassionate individuals.</p>
              <p>At Chittukurumbakam, we believe that childhood is not just a preparation for the future — it is a beautiful, irreplaceable journey in itself. Our play-based curriculum, warm teaching staff, and safe campus ensure that your child experiences the joy of learning without pressure, the thrill of discovery without fear, and the comfort of belonging without condition.</p>
              <p>We don't just educate — we nurture. We don't just teach — we inspire. And we don't just care — we love, unconditionally.</p>
              <p>I invite you to come visit our campus, meet our team, and see for yourself why hundreds of families have chosen Chittukurumbakam as their child's first school. We would be honored to welcome your little one into our family.</p>
              <p className="principal-signoff">
                With warmth and gratitude,<br />
                <strong>Mrs. Lakshmi Devi</strong><br />
                Founder & Principal
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrincipalMessage;
