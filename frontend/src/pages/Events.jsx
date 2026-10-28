import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API from '../api';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const defaultEvents = [
  { _id: '1', title: 'Annual Day Celebrations', description: 'A grand showcase of talent, creativity, and teamwork as our little stars perform dances, skits, and songs on stage.', date: '2026-02-15', type: 'celebration' },
  { _id: '2', title: "Children's Day Special", description: 'Fun-filled games, fancy dress competition, and surprise gifts to celebrate the joy of being a child.', date: '2025-11-14', type: 'celebration' },
  { _id: '3', title: 'Sports Day', description: 'Exciting races, obstacle courses, and team events that encourage physical fitness and sportsmanship.', date: '2026-01-20', type: 'competition' },
  { _id: '4', title: 'Diwali & Pongal Celebrations', description: 'Cultural festivities with traditional dress, rangoli, and learning about our rich heritage.', date: '2025-10-20', type: 'celebration' },
  { _id: '5', title: 'Parent-Teacher Meet', description: "Regular interactions between parents and teachers to discuss each child's progress and development.", date: '2026-03-10', type: 'workshop' },
  { _id: '6', title: 'Science Exhibition', description: 'Little scientists showcase their experiments and discoveries — a celebration of curiosity!', date: '2026-04-05', type: 'competition' },
];

const typeConfig = {
  celebration: { emoji: '🎉', label: 'Celebration', color: 'coral' },
  competition: { emoji: '🏆', label: 'Competition', color: 'yellow' },
  workshop: { emoji: '📝', label: 'Workshop', color: 'blue' },
  'field-trip': { emoji: '🚌', label: 'Field Trip', color: 'green' },
  holiday: { emoji: '🏖️', label: 'Holiday', color: 'lavender' },
  other: { emoji: '📌', label: 'Event', color: 'blue' },
};

// Countdown component
function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date(date);
      const diff = target - now;
      if (diff <= 0) { setTimeLeft(null); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [date]);

  if (!timeLeft) return null;

  return (
    <div className="event-countdown">
      <span className="event-countdown__label">⏳ Starts in</span>
      <div className="event-countdown__units">
        {[['days', 'Days'], ['hours', 'Hrs'], ['mins', 'Min']].map(([key, label]) => (
          <div key={key} className="event-countdown__unit">
            <span className="event-countdown__num">{String(timeLeft[key]).padStart(2, '0')}</span>
            <span className="event-countdown__unit-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const Events = () => {
  const [events, setEvents] = useState(defaultEvents);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    API.get('/events').then(res => {
      if (res.data.data && res.data.data.length > 0) setEvents(res.data.data);
    }).catch(() => {});
  }, []);

  const now = new Date();
  const filtered = events.filter(e => {
    const d = new Date(e.date);
    return tab === 'upcoming' ? d >= now : d < now;
  }).sort((a, b) => tab === 'upcoming'
    ? new Date(a.date) - new Date(b.date)
    : new Date(b.date) - new Date(a.date)
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateShort = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en-IN', { month: 'short' }),
      year: d.getFullYear(),
    };
  };

  const upcomingCount = events.filter(e => new Date(e.date) >= now).length;
  const pastCount = events.filter(e => new Date(e.date) < now).length;

  return (
    <>
      <Helmet>
        <title>Events & Celebrations — Chittukurumbakam Play School</title>
        <meta name="description" content="View upcoming and past events, celebrations, and activities at Chittukurumbakam Play School." />
      </Helmet>

      <section className="page-hero page-hero--events">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">🎪 Events</span>
            <h1>Events & Celebrations</h1>
            <p>Making memories that last a lifetime through joyful celebrations and activities.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="events-tabs">
            <button
              className={`events-tab ${tab === 'upcoming' ? 'events-tab--active' : ''}`}
              onClick={() => setTab('upcoming')}
            >
              🗓️ Upcoming Events
              {upcomingCount > 0 && <span className="events-tab__badge">{upcomingCount}</span>}
            </button>
            <button
              className={`events-tab ${tab === 'past' ? 'events-tab--active' : ''}`}
              onClick={() => setTab('past')}
            >
              📋 Past Events
              {pastCount > 0 && <span className="events-tab__badge events-tab__badge--muted">{pastCount}</span>}
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__emoji">📅</span>
              <h3>No {tab} events at the moment</h3>
              <p>Check back soon for updates!</p>
            </div>
          ) : (
            <div className="events-list">
              {filtered.map((event, i) => {
                const cfg = typeConfig[event.type] || typeConfig.other;
                const dateShort = formatDateShort(event.date);
                const isUpcoming = new Date(event.date) >= now;
                return (
                  <motion.div
                    key={event._id}
                    className={`event-card-new card event-card-new--${cfg.color}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                  >
                    {/* Date Badge */}
                    <div className={`event-card-new__date event-card-new__date--${cfg.color}`}>
                      <span className="event-card-new__day">{dateShort.day}</span>
                      <span className="event-card-new__month">{dateShort.month}</span>
                      <span className="event-card-new__year">{dateShort.year}</span>
                    </div>

                    {/* Content */}
                    <div className="event-card-new__content">
                      <div className="event-card-new__header">
                        <span className="event-card-new__emoji">{cfg.emoji}</span>
                        <h3>{event.title}</h3>
                        <span className={`badge badge--${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p>{event.description}</p>
                      <div className="event-card-new__meta">
                        <span className="event-card-new__meta-item">
                          <FiCalendar size={13} /> {formatDate(event.date)}
                        </span>
                        {event.time && (
                          <span className="event-card-new__meta-item">
                            <FiClock size={13} /> {event.time}
                          </span>
                        )}
                      </div>
                      {isUpcoming && <Countdown date={event.date} />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          {tab === 'upcoming' && (
            <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
              <p style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                Want to stay updated on our events?
              </p>
              <Link to="/announcements" className="btn btn--outline">
                📢 View Announcements <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Events;
