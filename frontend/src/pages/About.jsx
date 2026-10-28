import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const timeline = [
  { year: '2009', title: 'Founded with Love', desc: 'Chittukurumbakam was born in a small classroom with 12 curious toddlers and a vision to make quality early education accessible to every family.', emoji: '🌱', color: 'green' },
  { year: '2012', title: 'Growing Bigger', desc: 'Expanded to a dedicated campus with dedicated classrooms, an outdoor play area, and our first batch of UKG graduates heading to primary school.', emoji: '🏫', color: 'blue' },
  { year: '2016', title: 'Excellence Recognized', desc: 'Received the "Best Play School in Coimbatore" award. Introduced our signature activity-based curriculum and parent communication app.', emoji: '🏆', color: 'yellow' },
  { year: '2019', title: '500 Families & Growing', desc: 'Celebrated 10 years with 500+ active families. Launched the CCTV safety system and GPS-tracked transportation for all routes.', emoji: '💯', color: 'coral' },
  { year: '2024', title: 'Digital Transformation', desc: 'Introduced online admission portal, digital progress tracking, and our new enhanced curriculum blending STEM, arts, and mindfulness.', emoji: '💻', color: 'lavender' },
  { year: '2025', title: 'Today & Beyond', desc: 'Continuing our mission to nurture every little one with love, care, and world-class early childhood education. Admissions open for 2025-26!', emoji: '🌟', color: 'green' },
];

const management = [
  { name: 'Mrs. Lakshmi Devi', role: 'Founder & Director', emoji: '👩‍💼', desc: 'A passionate educator with 20+ years in early childhood education, Mrs. Lakshmi founded Chittukurumbakam to bring world-class pre-primary education to every child.', color: 'blue', badge: '20+ Years' },
  { name: 'Mr. Rajan Kumar', role: 'Co-Director & Operations', emoji: '👨‍💼', desc: 'With a background in school administration, Mr. Rajan ensures our infrastructure, safety protocols, and day-to-day operations run seamlessly.', color: 'green', badge: 'Operations Expert' },
  { name: 'Mrs. Priya Sharma', role: 'Academic Head', emoji: '👩‍🏫', desc: 'A certified Montessori and early childhood specialist, Mrs. Priya designs our curriculum to balance structured learning with creative exploration.', color: 'coral', badge: 'Montessori Certified' },
];

const values = [
  { emoji: '❤️', title: 'Love & Care', desc: 'Every child deserves unconditional love and individual attention.', color: 'coral' },
  { emoji: '🌱', title: 'Growth Mindset', desc: 'We celebrate every small win and encourage curiosity above all.', color: 'green' },
  { emoji: '🎨', title: 'Creativity', desc: 'Art, music, and play are not extras — they are the core.', color: 'yellow' },
  { emoji: '🤝', title: 'Community', desc: 'We build a warm family between school, children, and parents.', color: 'blue' },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us — Chittukurumbakam Play School</title>
        <meta name="description" content="Learn about Chittukurumbakam Play School's history, management, and commitment to nurturing young minds since 2009." />
      </Helmet>

      <section className="page-hero page-hero--about">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">🏫 About Us</span>
            <h1>Our Story of Nurturing Young Minds</h1>
            <p>For over 15 years, Chittukurumbakam Play School has been a second home where children discover the joy of learning.</p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div className="content-grid">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="section-header__badge" style={{ marginBottom: 'var(--space-lg)' }}>🌟 Our Legacy</span>
              <h2>A Legacy of Love & Learning</h2>
              <p>Founded in 2009, Chittukurumbakam Play School was born from a simple yet powerful belief — that every child deserves a nurturing space where they can grow, explore, and bloom at their own pace.</p>
              <p>What started as a small classroom with just 12 curious toddlers has blossomed into one of the most trusted early-childhood institutions in the community. Today, we serve over 500 families, and our alumni continue to thrive in top schools across the city.</p>
              <p>Our name, "Chittukurumbakam," means <em>"little precious one"</em> — and that's exactly how we treat every child who walks through our doors. Each day is filled with wonder, creativity, and the warmth of a close-knit family.</p>
              <div className="about-quick-stats">
                {[{ n: '500+', l: 'Families' }, { n: '15+', l: 'Years' }, { n: '98%', l: 'Satisfaction' }].map(s => (
                  <div key={s.l} className="about-quick-stat">
                    <span className="about-quick-stat__num">{s.n}</span>
                    <span className="about-quick-stat__label">{s.l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <div className="content-image-placeholder">
                <span>🏫</span>
                <p>Our Beautiful Campus</p>
                <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Est. 2009</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">💎 Our Values</span>
            <h2 className="section-header__title">What We Stand For</h2>
          </div>
          <div className="grid grid-4 stagger">
            {values.map((v, i) => (
              <motion.div key={v.title} className={`card card--colored ${v.color} card--shine`} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="value-card">
                  <div className={`value-card__icon value-card__icon--${v.color}`}>{v.emoji}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">📅 Our Journey</span>
            <h2 className="section-header__title">15 Years of Growing Together</h2>
            <p className="section-header__subtitle">Every milestone is a testament to the trust parents have placed in us.</p>
          </div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className={`timeline-card card card--colored ${item.color}`}>
                  <span className="timeline-card__emoji">{item.emoji}</span>
                  <h3 className="timeline-card__title">{item.title}</h3>
                  <p className="timeline-card__desc">{item.desc}</p>
                </div>
                <div className={`timeline-dot timeline-dot--${item.color}`}>
                  <span className="timeline-year">{item.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">👥 Our Management</span>
            <h2 className="section-header__title">Led by Passion & Experience</h2>
          </div>
          <div className="grid grid-3 stagger">
            {management.map((person, i) => (
              <motion.div key={person.name} className={`card card--colored ${person.color} card--shine`} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="team-card-new">
                  <div className={`team-card-new__avatar team-card-new__avatar--${person.color}`}>
                    <span>{person.emoji}</span>
                  </div>
                  <h3>{person.name}</h3>
                  <span className={`badge badge--${person.color}`}>{person.role}</span>
                  <span className="team-card-new__badge2">{person.badge}</span>
                  <p>{person.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
