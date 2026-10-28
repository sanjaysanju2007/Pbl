import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import API from '../api';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const defaultTestimonials = [
  { _id: '1', parentName: 'Mrs. Anjali Reddy', childName: 'Arjun', program: 'Nursery', message: 'Chittukurumbakam has been the best decision for our son. The teachers genuinely care about each child, and Arjun comes home every day excited to tell us what he learned. The safety measures give us complete peace of mind.', rating: 5 },
  { _id: '2', parentName: 'Mr. Suresh Kumar', childName: 'Kavya', program: 'LKG', message: 'We were amazed at how quickly Kavya adapted to school. The warm, loving environment and the structured play-based learning approach helped her blossom. She can now read simple words and loves painting!', rating: 5 },
  { _id: '3', parentName: 'Mrs. Preethi Nair', childName: 'Aadith', program: 'Playgroup', message: "As first-time parents, we were nervous about sending our toddler to school. But the Chittukurumbakam team made the transition so smooth. Aadith's separation anxiety vanished within the first week!", rating: 5 },
  { _id: '4', parentName: 'Dr. Ramesh Babu', childName: 'Meera', program: 'UKG', message: "Meera has been with Chittukurumbakam since Playgroup, and we've seen incredible growth — academically, socially, and emotionally. The school's holistic approach truly works. She's completely ready for primary school now.", rating: 5 },
  { _id: '5', parentName: 'Mrs. Fatima Sheikh', childName: 'Zara', program: 'Nursery', message: 'The inclusive environment at Chittukurumbakam is heartwarming. Every festival, every culture is celebrated with equal joy. Zara has learned so much about diversity and respect at such a young age.', rating: 4 },
  { _id: '6', parentName: 'Mr. Vikram Patel', childName: 'Dhruv', program: 'LKG', message: "The communication between teachers and parents is excellent. We always know what Dhruv is learning, and the regular progress updates are very helpful. It truly feels like a partnership in our child's education.", rating: 5 },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    API.get('/testimonials').then(res => {
      if (res.data.data && res.data.data.length > 0) setTestimonials(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Parent Testimonials — Chittukurumbakam Play School</title>
        <meta name="description" content="Hear from parents who trust Chittukurumbakam Play School with their children's early education." />
      </Helmet>

      <section className="page-hero page-hero--testimonials">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">💬 Testimonials</span>
            <h1>What Parents Say About Us</h1>
            <p>Real stories from real families — hear why parents love Chittukurumbakam.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 stagger">
            {testimonials.map((t, i) => (
              <motion.div key={t._id} className="card testimonial-card" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="testimonial-card__stars">
                  {[...Array(t.rating || 5)].map((_, j) => <FiStar key={j} className="star-filled" />)}
                </div>
                <p className="testimonial-card__message">"{t.message}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.parentName.charAt(0)}</div>
                  <div>
                    <strong>{t.parentName}</strong>
                    <span className="testimonial-card__child">Parent of {t.childName} • {t.program}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
