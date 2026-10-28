import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  FiArrowRight, FiBookOpen, FiHeart, FiShield, FiStar, FiUsers,
  FiAward, FiSmile, FiChevronLeft, FiChevronRight, FiMaximize2, FiX
} from 'react-icons/fi';
import './Home.css';

const heroShowcaseImages = [
  {
    id: 1,
    src: '/images/hero/classroom.jpg',
    title: 'Joyful & Interactive Classrooms',
    subtitle: 'Vibrant spaces with Montessori sensory materials, activity tables & caring mentors',
    badge: '🏫 Modern Campus',
    tag: 'Nursery & LKG',
    stat: '1:8 Teacher Ratio',
    description: 'Bright, welcoming classrooms equipped with Montessori sensory materials, child-sized activity tables, and interactive learning setups designed to spark early wonder and confidence.',
    color: '#1d4ed8'
  },
  {
    id: 2,
    src: '/images/hero/campus.jpg',
    title: 'Safe Green Outdoor Playground',
    subtitle: 'Lush open lawn with certified child-safe slides, sensory tunnels & swings',
    badge: '🌿 Eco Campus',
    tag: 'Safe & Monitored',
    stat: 'CCTV Monitored',
    description: 'Spacious child-safe outdoor play zones with soft premium turf, colorful slides, sensory play equipment, and complete CCTV surveillance for joyful everyday activity.',
    color: '#0d9488'
  },
  {
    id: 3,
    src: '/images/hero/activities.jpg',
    title: 'Creative Arts, Music & Activities',
    subtitle: 'Little artists exploring colorful finger painting, rhythm percussion & group games',
    badge: '🎨 Creative Arts',
    tag: 'Playgroup to UKG',
    stat: '100% Hands-On',
    description: 'Nurturing little minds through hands-on finger painting, musical rhythm instruments, clay modeling, and expressive activities that build fine motor skills.',
    color: '#ea580c'
  },
  {
    id: 4,
    src: '/images/hero/storytime.jpg',
    title: 'Magical Story & Reading Circles',
    subtitle: 'Sparking lifelong curiosity, vocabulary & imagination in cozy beanbag corners',
    badge: '📖 Phonics & Books',
    tag: 'Early Literacy',
    stat: '500+ Books',
    description: 'Cozy beanbag library circles where passionate educators bring fairy tales and picture books to life, nurturing listening skills, curiosity, and language development.',
    color: '#7c3aed'
  }
];

const programs = [
  { name: 'Playgroup', age: '1.5 – 2.5 years', color: 'blue', emoji: '🧸', desc: 'A gentle introduction to social interaction, sensory play, and structured routines in a warm, safe space.', gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
  { name: 'Nursery', age: '2.5 – 3.5 years', color: 'green', emoji: '🎨', desc: 'Creative exploration through art, music, storytelling, and guided play to build foundational skills.', gradient: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)' },
  { name: 'LKG', age: '3.5 – 4.5 years', color: 'yellow', emoji: '📚', desc: 'Structured learning readiness with phonics, number concepts, and collaborative activities.', gradient: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
  { name: 'UKG', age: '4.5 – 5.5 years', color: 'coral', emoji: '🎓', desc: 'Advanced preparation for formal schooling with reading, writing, problem-solving, and leadership.', gradient: 'linear-gradient(135deg, #eff6ff, #e0e7ff)' },
];

const highlights = [
  { icon: <FiHeart />, title: 'Nurturing Care', desc: 'Every child is treated with warmth, patience, and individual attention.', color: 'coral' },
  { icon: <FiShield />, title: 'Safe Environment', desc: 'CCTV-monitored campus with trained staff and strict safety protocols.', color: 'blue' },
  { icon: <FiBookOpen />, title: 'Play-Based Learning', desc: 'Curriculum designed around exploration, creativity, and joyful discovery.', color: 'green' },
  { icon: <FiStar />, title: 'Experienced Teachers', desc: 'Qualified, passionate educators who understand early childhood development.', color: 'yellow' },
  { icon: <FiUsers />, title: 'Small Class Sizes', desc: 'Personalized attention with optimal student-to-teacher ratios.', color: 'lavender' },
  { icon: <FiAward />, title: 'Holistic Growth', desc: 'Focus on cognitive, physical, social, and emotional development.', color: 'green' },
];

const stats = [
  { number: 500, suffix: '+', label: 'Happy Students', emoji: '👧', color: 'blue' },
  { number: 15, suffix: '+', label: 'Years of Trust', emoji: '🏫', color: 'green' },
  { number: 50, suffix: '+', label: 'Trained Teachers', emoji: '👩‍🏫', color: 'yellow' },
  { number: 98, suffix: '%', label: 'Parent Satisfaction', emoji: '💯', color: 'coral' },
];

const testimonials = [
  { name: 'Priya Ramesh', child: 'Parent of Aarav, UKG', stars: 5, message: 'The teachers here are so warm and caring. My son went from being very shy to confidently performing on stage at the Annual Day. Best decision we ever made!', avatar: 'PR' },
  { name: 'Kavitha Suresh', child: 'Parent of Dhanya, Nursery', stars: 5, message: 'Chittukurumbakam is like a second home for our daughter. The activities are so creative and she comes home excited every single day!', avatar: 'KS' },
  { name: 'Rajan Pillai', child: 'Parent of Rohan, LKG', stars: 5, message: 'The play-based learning approach is outstanding. Rohan developed his reading skills earlier than expected, and more importantly — he loves learning!', avatar: 'RP' },
];

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCounter(stat.number, 1800, inView);

  return (
    <motion.div
      ref={ref}
      className={`stat-card stat-card--${stat.color}`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
    >
      <span className="stat-card__emoji">{stat.emoji}</span>
      <span className="stat-card__number">{count}{stat.suffix}</span>
      <span className="stat-card__label">{stat.label}</span>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } })
};

const Home = () => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevTestimonial = () => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const nextTestimonial = () => setTestimonialIdx(i => (i + 1) % testimonials.length);

  const prevShowcase = () => {
    setShowcaseIdx(i => (i - 1 + heroShowcaseImages.length) % heroShowcaseImages.length);
  };

  const nextShowcase = () => {
    setShowcaseIdx(i => (i + 1) % heroShowcaseImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  // 5 seconds moving for showcase images
  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      setShowcaseIdx(i => (i + 1) % heroShowcaseImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isModalOpen]);

  // Modal keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isModalOpen) setIsModalOpen(false);
      if (e.key === 'ArrowRight' && isModalOpen) nextShowcase();
      if (e.key === 'ArrowLeft' && isModalOpen) prevShowcase();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isModalOpen]);

  // Prevent scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const t = testimonials[testimonialIdx];
  const currShowcase = heroShowcaseImages[showcaseIdx];

  return (
    <>
      <Helmet>
        <title>Chittukurumbakam Play School — Where Every Child Blossoms 🌈</title>
        <meta name="description" content="Chittukurumbakam Play School offers Playgroup, Nursery, LKG & UKG programs with a nurturing, safe, and joyful learning environment for children aged 1.5 to 5.5 years." />
      </Helmet>

      {/* Hero */}
      <section className="hero">
        {/* Ambient floating blobs */}
        <div className="hero__bg-shapes">
          <div className="hero__blob hero__blob--1"></div>
          <div className="hero__blob hero__blob--2"></div>
          <div className="hero__blob hero__blob--3"></div>
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
          <div className="hero__shape hero__shape--3"></div>
        </div>

        <div className="container hero__container">
          {/* School & Students Showcase Banner — Top Full View */}
          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="hero__showcase hero__showcase--fullview">
              {/* Category tabs across top */}
              <div className="hero__showcase-tabs">
                {heroShowcaseImages.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`hero__showcase-tab ${i === showcaseIdx ? 'hero__showcase-tab--active' : ''}`}
                    onClick={() => setShowcaseIdx(i)}
                  >
                    <span>{img.badge}</span>
                  </button>
                ))}
              </div>

              {/* Main Media in Top Full View */}
              <div
                className="hero__showcase-media hero__showcase-media--fullview"
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Click to enlarge photo popup"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showcaseIdx}
                    className="hero__showcase-slide"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <img
                      src={currShowcase.src}
                      alt={currShowcase.title}
                      className="hero__showcase-img"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Top Badge: Clean and minimal without any timer */}
                <div className="hero__showcase-top-badges">
                  <span className="hero__showcase-badge">
                    <span
                      className="hero__showcase-badge-pulse"
                      style={{ backgroundColor: currShowcase.color }}
                    />
                    {currShowcase.tag}
                  </span>

                  {/* Expand / Popup Button */}
                  <button
                    type="button"
                    className="hero__showcase-expand-btn"
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                    aria-label="Open image in popup"
                    title="Click for full view popup"
                  >
                    <FiMaximize2 />
                    <span>Full View Popup</span>
                  </button>
                </div>

                {/* Prev / Next navigation arrows */}
                <button
                  type="button"
                  className="hero__showcase-nav-btn hero__showcase-nav-btn--prev"
                  onClick={(e) => { e.stopPropagation(); prevShowcase(); }}
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  className="hero__showcase-nav-btn hero__showcase-nav-btn--next"
                  onClick={(e) => { e.stopPropagation(); nextShowcase(); }}
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
              </div>

              {/* Bottom Info Bar — clean, outside image so it never blocks children */}
              <div className="hero__showcase-bottom-bar">
                <div className="hero__showcase-info">
                  <h3 className="hero__showcase-title">{currShowcase.title}</h3>
                  <p className="hero__showcase-desc">{currShowcase.subtitle}</p>
                </div>
                <div className="hero__showcase-dots">
                  {heroShowcaseImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`hero__showcase-dot ${i === showcaseIdx ? 'hero__showcase-dot--active' : ''}`}
                      onClick={() => setShowcaseIdx(i)}
                      aria-label={`Go to photo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Admissions Headline & CTAs */}
          <motion.div
            className="hero__content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Subtle Muted Rainbow Arch Graphic */}
            <div className="hero__rainbow-arch" aria-hidden="true">
              <svg viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 20 130 A 110 110 0 0 1 240 130" stroke="#FFC93C" strokeWidth="10" strokeLinecap="round" opacity="0.55"/>
                <path d="M 38 130 A 92 92 0 0 1 222 130" stroke="#DCEFFB" strokeWidth="10" strokeLinecap="round" opacity="0.8"/>
                <path d="M 56 130 A 74 74 0 0 1 204 130" stroke="#1F7AB8" strokeWidth="10" strokeLinecap="round" opacity="0.45"/>
                <path d="M 74 130 A 56 56 0 0 1 186 130" stroke="#3FB984" strokeWidth="8" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>

            <motion.span
              className="hero__badge"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              ☀️ Admissions Open 2026-27
            </motion.span>
            <h1 className="hero__title">
              Where Every Child{' '}
              <span className="hero__title-highlight">Blossoms</span>{' '}
              with Joy & Wonder
            </h1>
            <p className="hero__subtitle">
              At Chittukurumbakam, we believe every child is unique and full of potential. Our warm,
              nurturing environment helps your little one grow, learn, and shine — through play,
              creativity, and gentle guidance.
            </p>
            <div className="hero__actions">
              <Link to="/admission" className="btn btn--primary btn--lg">
                Start Child's Journey <FiArrowRight />
              </Link>
              <Link to="/enquiry" className="btn btn--secondary btn--lg">
                Admission Enquiry
              </Link>
            </div>
            <div className="hero__trust">
              <div className="hero__trust-avatars">
                {['👦', '👧', '👶', '🧒'].map((e, i) => (
                  <span key={i} className="hero__trust-avatar">{e}</span>
                ))}
              </div>
              <span className="hero__trust-text">Trusted by <strong>500+ families</strong></span>
            </div>
          </motion.div>
        </div>

        {/* Soft Wavy Divider */}
        <div className="hero__wavy-bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
            <path d="M0,25 C360,50 720,0 1080,25 C1260,38 1380,20 1440,25 L1440,50 L0,50 Z" fill="#FFFBF0"/>
          </svg>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="hero__scroll"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span>Scroll to explore</span>
          <div className="hero__scroll-arrow">↓</div>
        </motion.div>
      </section>

      {/* Fullscreen / Lightbox Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="showcase-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="showcase-modal__container"
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="showcase-modal__close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close popup modal"
              >
                <FiX />
              </button>

              <div className="showcase-modal__image-wrapper">
                <img
                  src={currShowcase.src}
                  alt={currShowcase.title}
                  className="showcase-modal__img"
                />
                <button
                  type="button"
                  className="showcase-modal__nav-btn showcase-modal__nav-btn--prev"
                  onClick={prevShowcase}
                  aria-label="Previous photo"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  className="showcase-modal__nav-btn showcase-modal__nav-btn--next"
                  onClick={nextShowcase}
                  aria-label="Next photo"
                >
                  <FiChevronRight />
                </button>
              </div>

              <div className="showcase-modal__content">
                <div className="showcase-modal__badges">
                  <span className="showcase-modal__pill showcase-modal__pill--primary">{currShowcase.badge}</span>
                  <span className="showcase-modal__pill showcase-modal__pill--gold">{currShowcase.tag}</span>
                  <span className="showcase-modal__pill showcase-modal__pill--teal">{currShowcase.stat}</span>
                </div>
                <h2 className="showcase-modal__title">{currShowcase.title}</h2>
                <p className="showcase-modal__desc">{currShowcase.description}</p>

                <div className="showcase-modal__footer">
                  <div className="showcase-modal__thumbs">
                    {heroShowcaseImages.map((img, i) => (
                      <button
                        key={img.id || i}
                        type="button"
                        className={`showcase-modal__thumb ${i === showcaseIdx ? 'showcase-modal__thumb--active' : ''}`}
                        onClick={() => setShowcaseIdx(i)}
                        aria-label={img.title}
                      >
                        <img src={img.src} alt={img.title} />
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/admission"
                    className="btn btn--primary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Admissions Open — Apply Now <FiArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Programs */}
      <section className="section programs-section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">🎓 Our Programs</span>
            <h2 className="section-header__title">Programs Tailored for Every Stage</h2>
            <p className="section-header__subtitle">
              From first steps to school-readiness, each program is carefully designed to match
              your child's developmental stage with age-appropriate learning experiences.
            </p>
          </div>
          <div className="programs-grid">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.name}
                className={`program-card card card--colored ${prog.color}`}
                style={{ '--prog-gradient': prog.gradient }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -8 }}
              >
                <div className="program-card__bg"></div>
                <span className="program-card__emoji">{prog.emoji}</span>
                <h3 className="program-card__name">{prog.name}</h3>
                <span className={`badge badge--${prog.color}`}>{prog.age}</span>
                <p className="program-card__desc">{prog.desc}</p>
                <Link to="/programs" className="program-card__link">
                  Learn More <FiArrowRight />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section--alt highlights-section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">💝 Why Choose Us</span>
            <h2 className="section-header__title">What Makes Us Special</h2>
            <p className="section-header__subtitle">
              We don't just teach — we nurture. Here's why parents trust us with their most precious little ones.
            </p>
          </div>
          <div className="grid grid-3 stagger">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                className="card card--shine highlight-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeUp}
              >
                <div className={`highlight-card__icon highlight-card__icon--${h.color}`}>{h.icon}</div>
                <h4 className="highlight-card__title">{h.title}</h4>
                <p className="highlight-card__desc">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">📊 Our Impact</span>
            <h2>Numbers That Tell Our Story</h2>
            <p className="section-header__subtitle">
              Every milestone represents a smiling child, a confident step, and a proud family.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-home-section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge">⭐ Testimonials</span>
            <h2 className="section-header__title">What Parents Are Saying</h2>
          </div>
          <div className="testimonial-carousel">
            <motion.div
              key={testimonialIdx}
              className="testimonial-carousel__card card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="testimonial-carousel__stars">
                {'⭐'.repeat(t.stars)}
              </div>
              <p className="testimonial-carousel__message">"{t.message}"</p>
              <div className="testimonial-carousel__author">
                <div className="testimonial-carousel__avatar">{t.avatar}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span className="testimonial-carousel__child">{t.child}</span>
                </div>
              </div>
            </motion.div>
            <div className="testimonial-carousel__controls">
              <button className="testimonial-carousel__btn" onClick={prevTestimonial}><FiChevronLeft /></button>
              <div className="testimonial-carousel__dots">
                {testimonials.map((_, i) => (
                  <button key={i} className={`testimonial-carousel__dot ${i === testimonialIdx ? 'active' : ''}`} onClick={() => setTestimonialIdx(i)} />
                ))}
              </div>
              <button className="testimonial-carousel__btn" onClick={nextTestimonial}><FiChevronRight /></button>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-xl)' }}>
            <Link to="/testimonials" className="btn btn--outline">Read All Testimonials <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="cta-card__bg"></div>
            <div className="cta-card__content">
              <span className="cta-card__emoji"><FiSmile size={44} /></span>
              <h2>Ready to Give Your Child the Best Start?</h2>
              <p>
                Join our warm family of learners. Schedule a campus visit or apply online today —
                admissions are now open for the upcoming academic year!
              </p>
              <div className="cta-card__actions">
                <Link to="/admission" className="btn btn--primary btn--lg">
                  Apply Now <FiArrowRight />
                </Link>
                <Link to="/contact" className="btn btn--outline btn--lg">
                  Visit Our Campus
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
