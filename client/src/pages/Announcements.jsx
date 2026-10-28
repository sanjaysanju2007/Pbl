import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';
import API from '../api';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const defaultAnnouncements = [
  { _id: '1', title: 'Admissions Open for 2025-26!', content: 'We are excited to announce that admissions are now open for the upcoming academic year 2025-26. Apply online or visit our campus to secure your child\'s spot in our Playgroup, Nursery, LKG, or UKG programs.', category: 'news', publishDate: '2025-06-01' },
  { _id: '2', title: 'Summer Camp Registration', content: 'Our annual Summer Fun Camp is back! Two weeks of art, music, sports, science experiments, and outdoor adventures. Open to children aged 2-6 years. Limited spots available!', category: 'update', publishDate: '2025-03-15' },
  { _id: '3', title: 'New Smart Classroom Inaugurated', content: 'We are proud to announce the inauguration of our new smart classroom equipped with interactive projectors, audio-visual learning tools, and age-appropriate educational software.', category: 'news', publishDate: '2025-01-20' },
  { _id: '4', title: 'Republic Day Holiday', content: 'The school will remain closed on January 26th (Sunday) in observance of Republic Day. Regular classes resume on Monday, January 27th.', category: 'holiday', publishDate: '2025-01-22' },
];

const catEmoji = { news: '📰', update: '📢', notice: '📌', holiday: '🏖️' };

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);

  useEffect(() => {
    API.get('/announcements').then(res => {
      if (res.data.data && res.data.data.length > 0) setAnnouncements(res.data.data);
    }).catch(() => {});
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Helmet>
        <title>Announcements & News — Chittukurumbakam Play School</title>
        <meta name="description" content="Stay updated with the latest announcements, news, and updates from Chittukurumbakam Play School." />
      </Helmet>

      <section className="page-hero page-hero--announcements">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">📢 Announcements</span>
            <h1>Announcements & News</h1>
            <p>Stay informed about the latest happenings at our school.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="announcements-list stagger">
            {announcements.map((a, i) => (
              <motion.div key={a._id} className="card announcement-card" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="announcement-card__meta">
                  <span className="announcement-card__emoji">{catEmoji[a.category] || '📌'}</span>
                  <span className="badge badge--blue">{a.category}</span>
                  <span className="announcement-card__date"><FiCalendar /> {formatDate(a.publishDate)}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Announcements;
