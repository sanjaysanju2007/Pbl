import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEye, FiTarget, FiHeart, FiStar, FiUsers, FiBookOpen, FiSun, FiFeather } from 'react-icons/fi';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const coreValues = [
  { icon: <FiHeart />, title: 'Compassion', desc: 'Every interaction is grounded in kindness, empathy, and genuine care for each child.', color: 'coral' },
  { icon: <FiStar />, title: 'Excellence', desc: 'We strive for the highest standards in teaching, safety, and child development.', color: 'yellow' },
  { icon: <FiUsers />, title: 'Inclusivity', desc: 'We celebrate diversity and ensure every child feels welcome, valued, and included.', color: 'blue' },
  { icon: <FiBookOpen />, title: 'Curiosity', desc: 'We foster a love of learning by encouraging questions, exploration, and discovery.', color: 'green' },
  { icon: <FiSun />, title: 'Joy', desc: 'Learning should be fun! We create joyful experiences that make children excited to come to school.', color: 'yellow' },
  { icon: <FiFeather />, title: 'Integrity', desc: 'We maintain transparency and honesty in all our interactions with children and parents.', color: 'lavender' },
];

const VisionMission = () => {
  return (
    <>
      <Helmet>
        <title>Vision, Mission & Core Values — Chittukurumbakam Play School</title>
        <meta name="description" content="Discover the vision, mission, and core values that guide Chittukurumbakam Play School in nurturing young minds." />
      </Helmet>

      <section className="page-hero page-hero--vision">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">✨ Our Guiding Light</span>
            <h1>Vision, Mission & Core Values</h1>
            <p>The principles that shape everything we do for your child.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="vision-mission-grid">
            <motion.div className="vm-card vm-card--vision" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="vm-card__icon"><FiEye size={32} /></div>
              <h2>Our Vision</h2>
              <p>To be the most trusted and nurturing early-childhood learning community — where every child discovers their unique strengths, develops a lifelong love of learning, and grows into a confident, compassionate individual ready to make the world a brighter place.</p>
            </motion.div>
            <motion.div className="vm-card vm-card--mission" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="vm-card__icon"><FiTarget size={32} /></div>
              <h2>Our Mission</h2>
              <ul className="vm-list">
                <li>Provide a safe, stimulating, and inclusive environment where children thrive.</li>
                <li>Design age-appropriate, play-based curricula that nurture cognitive, social, emotional, and physical development.</li>
                <li>Partner with parents as co-educators in every child's growth journey.</li>
                <li>Employ passionate, qualified educators committed to continuous learning.</li>
                <li>Foster creativity, critical thinking, and a deep respect for self, others, and the environment.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">💎 What We Stand For</span>
            <h2 className="section-header__title">Our Core Values</h2>
            <p className="section-header__subtitle">These values are woven into every classroom, every lesson, and every smile at Chittukurumbakam.</p>
          </div>
          <div className="grid grid-3 stagger">
            {coreValues.map((value, i) => (
              <motion.div key={value.title} className={`card card--colored ${value.color}`} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="value-card">
                  <div className={`value-card__icon value-card__icon--${value.color}`}>{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VisionMission;
