import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const facilities = [
  { emoji: '🏫', name: 'Bright Classrooms', desc: 'Spacious, well-ventilated classrooms with child-sized furniture, colorful learning walls, and natural lighting.' },
  { emoji: '🎪', name: 'Indoor Play Area', desc: 'A safe, padded indoor play zone with age-appropriate toys, slides, tunnels, and activity stations.' },
  { emoji: '🌳', name: 'Outdoor Playground', desc: 'A lush, shaded outdoor space with swings, sandpit, climbing structures, and a mini garden.' },
  { emoji: '📚', name: 'Library Corner', desc: 'A cozy reading nook stocked with picture books, storybooks, and interactive learning materials.' },
  { emoji: '🎵', name: 'Music & Dance Studio', desc: 'A dedicated space with instruments, audio equipment, and mirrors for music and movement sessions.' },
  { emoji: '🎨', name: 'Art & Craft Room', desc: 'Stocked with paints, clay, craft supplies, and easels for creative expression activities.' },
  { emoji: '💧', name: 'Clean Restrooms', desc: 'Child-friendly, hygienically maintained restrooms with step stools and trained attendants.' },
  { emoji: '🍱', name: 'Dining Area', desc: 'A clean, cheerful dining space where children enjoy nutritious meals and learn table manners.' },
  { emoji: '🏥', name: 'Medical Room', desc: 'On-campus first aid room with basic medical supplies and a tie-up with nearby pediatric clinics.' },
  { emoji: '🚌', name: 'Transport', desc: 'GPS-tracked, air-conditioned mini buses with trained drivers and female attendants on every route.' },
  { emoji: '💻', name: 'Smart Classroom', desc: 'Interactive projectors and age-appropriate digital learning tools for audio-visual lessons.' },
  { emoji: '🌿', name: 'Kitchen Garden', desc: 'A mini garden where children grow vegetables and flowers, learning about nature and responsibility.' },
];

const Facilities = () => {
  return (
    <>
      <Helmet>
        <title>Facilities & Infrastructure — Chittukurumbakam Play School</title>
        <meta name="description" content="Explore our world-class facilities including bright classrooms, outdoor playground, music studio, smart classrooms, and more." />
      </Helmet>

      <section className="page-hero page-hero--facilities">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">🏫 Facilities</span>
            <h1>A Space Designed for Little Dreamers</h1>
            <p>Every corner of our campus is crafted to inspire, protect, and delight your child.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3 stagger">
            {facilities.map((f, i) => (
              <motion.div key={f.name} className="card facility-card" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <span className="facility-card__emoji">{f.emoji}</span>
                <h3 className="facility-card__name">{f.name}</h3>
                <p className="facility-card__desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Facilities;
