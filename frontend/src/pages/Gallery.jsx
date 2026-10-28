import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import API from '../api';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

const defaultImages = [
  { _id: '1', title: 'Annual Day Celebration', category: 'Events', type: 'photo', url: '', emoji: '🎉', color: '#e3f2fd' },
  { _id: '2', title: 'Art & Craft Workshop', category: 'Classroom', type: 'photo', url: '', emoji: '🎨', color: '#fce4ec' },
  { _id: '3', title: 'Sports Day Fun', category: 'Events', type: 'photo', url: '', emoji: '🏅', color: '#fff8e1' },
  { _id: '4', title: 'Nature Walk', category: 'Activities', type: 'photo', url: '', emoji: '🌿', color: '#e8f5e9' },
  { _id: '5', title: 'Music Class', category: 'Classroom', type: 'photo', url: '', emoji: '🎵', color: '#f3e5f5' },
  { _id: '6', title: 'Diwali Celebration', category: 'Events', type: 'photo', url: '', emoji: '🪔', color: '#fff3e0' },
  { _id: '7', title: 'Outdoor Play Time', category: 'Activities', type: 'photo', url: '', emoji: '⛹️', color: '#e0f7fa' },
  { _id: '8', title: 'Story Time Session', category: 'Classroom', type: 'photo', url: '', emoji: '📖', color: '#fce4ec' },
  { _id: '9', title: 'Graduation Day', category: 'Events', type: 'photo', url: '', emoji: '🎓', color: '#e8eaf6' },
];

const Gallery = () => {
  const [items, setItems] = useState(defaultImages);
  const [categories, setCategories] = useState(['All', 'Events', 'Classroom', 'Activities']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    API.get('/gallery').then(res => {
      if (res.data.data && res.data.data.length > 0) setItems(res.data.data);
    }).catch(() => {});
    API.get('/gallery/categories').then(res => {
      if (res.data.data && res.data.data.length > 0) setCategories(['All', ...res.data.data]);
    }).catch(() => {});
  }, []);

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const openLightbox = (index) => setLightboxIdx(index);
  const nextLightbox = () => setLightboxIdx(i => (i + 1) % filtered.length);
  const prevLightbox = () => setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length);

  // Close lightbox on Escape key, navigate with arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight' && lightboxIdx !== null) nextLightbox();
      if (e.key === 'ArrowLeft' && lightboxIdx !== null) prevLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, filtered.length]);

  const catEmojis = { All: '🌟', Events: '🎉', Classroom: '📚', Activities: '🏃' };

  return (
    <>
      <Helmet>
        <title>Gallery — Chittukurumbakam Play School</title>
        <meta name="description" content="Browse photos and videos from our classrooms, events, and activities at Chittukurumbakam Play School." />
      </Helmet>

      <section className="page-hero page-hero--gallery">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">📸 Gallery</span>
            <h1>Moments That Make Us Smile</h1>
            <p>A glimpse into the joy, creativity, and celebrations at our school.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
            {categories.map(cat => (
              <motion.button
                key={cat}
                className={`gallery-filter ${activeCategory === cat ? 'gallery-filter--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {catEmojis[cat] || '📌'} {cat}
                <span className="gallery-filter__count">
                  {cat === 'All' ? items.length : items.filter(i => i.category === cat).length}
                </span>
              </motion.button>
            ))}
          </div>

          <motion.div className="gallery-grid" layout>
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item._id}
                  className="gallery-item"
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => openLightbox(i)}
                  whileHover={{ scale: 1.03 }}
                >
                  {item.url ? (
                    <img src={item.url} alt={item.title} className="gallery-item__img" loading="lazy" />
                  ) : (
                    <div className="gallery-item__placeholder" style={{ background: item.color || 'linear-gradient(135deg, #e3f2fd, #e8f5e9)' }}>
                      <span className="gallery-item__placeholder-emoji">{item.emoji || '📷'}</span>
                    </div>
                  )}
                  <div className="gallery-item__overlay">
                    <div className="gallery-item__overlay-top">
                      <FiMaximize2 size={18} />
                    </div>
                    <div className="gallery-item__overlay-bottom">
                      <span className="gallery-item__title">{item.title}</span>
                      <span className="badge badge--blue" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <span className="empty-state__emoji">🖼️</span>
              <h3>No photos in this category yet</h3>
              <p>Check back soon for new memories!</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* Prev Button */}
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={e => { e.stopPropagation(); prevLightbox(); }}
            >
              <FiChevronLeft size={28} />
            </button>

            <motion.div
              className="lightbox__content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              key={lightboxIdx}
            >
              <button className="lightbox__close" onClick={() => setLightboxIdx(null)}>
                <FiX size={20} />
              </button>
              {filtered[lightboxIdx]?.url ? (
                <img src={filtered[lightboxIdx].url} alt={filtered[lightboxIdx].title} />
              ) : (
                <div
                  className="gallery-item__placeholder lightbox__placeholder"
                  style={{ background: filtered[lightboxIdx]?.color }}
                >
                  <span>{filtered[lightboxIdx]?.emoji || '📷'}</span>
                </div>
              )}
              <div className="lightbox__info">
                <p className="lightbox__title">{filtered[lightboxIdx]?.title}</p>
                <span className="badge badge--blue">{filtered[lightboxIdx]?.category}</span>
              </div>
              <div className="lightbox__counter">{lightboxIdx + 1} / {filtered.length}</div>
            </motion.div>

            {/* Next Button */}
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={e => { e.stopPropagation(); nextLightbox(); }}
            >
              <FiChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
