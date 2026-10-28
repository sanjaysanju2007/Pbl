import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiSmile, 
  FiSun, 
  FiBookOpen, 
  FiMusic, 
  FiFeather, 
  FiShield, 
  FiCoffee, 
  FiPlusCircle, 
  FiNavigation, 
  FiMonitor, 
  FiCompass 
} from 'react-icons/fi';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const facilities = [
  { icon: <FiHome size={26} />, name: 'Bright Classrooms', desc: 'Spacious, well-ventilated classrooms with child-sized furniture, colorful learning walls, and natural lighting.' },
  { icon: <FiSmile size={26} />, name: 'Indoor Play Area', desc: 'A safe, padded indoor play zone with age-appropriate toys, slides, tunnels, and activity stations.' },
  { icon: <FiSun size={26} />, name: 'Outdoor Playground', desc: 'A lush, shaded outdoor space with swings, sandpit, climbing structures, and a mini garden.' },
  { icon: <FiBookOpen size={26} />, name: 'Library Corner', desc: 'A cozy reading nook stocked with picture books, storybooks, and interactive learning materials.' },
  { icon: <FiMusic size={26} />, name: 'Music & Dance Studio', desc: 'A dedicated space with instruments, audio equipment, and mirrors for music and movement sessions.' },
  { icon: <FiFeather size={26} />, name: 'Art & Craft Room', desc: 'Stocked with paints, clay, craft supplies, and easels for creative expression activities.' },
  { icon: <FiShield size={26} />, name: 'Clean Restrooms', desc: 'Child-friendly, hygienically maintained restrooms with step stools and trained attendants.' },
  { icon: <FiCoffee size={26} />, name: 'Dining Area', desc: 'A clean, cheerful dining space where children enjoy nutritious meals and learn table manners.' },
  { icon: <FiPlusCircle size={26} />, name: 'Medical Room', desc: 'On-campus first aid room with basic medical supplies and a tie-up with nearby pediatric clinics.' },
  { icon: <FiNavigation size={26} />, name: 'Transport', desc: 'GPS-tracked, air-conditioned mini buses with trained drivers and female attendants on every route.' },
  { icon: <FiMonitor size={26} />, name: 'Smart Classroom', desc: 'Interactive projectors and age-appropriate digital learning tools for audio-visual lessons.' },
  { icon: <FiCompass size={26} />, name: 'Kitchen Garden', desc: 'A mini garden where children grow vegetables and flowers, learning about nature and responsibility.' },
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
            <span className="section-header__badge"><FiHome aria-hidden="true" /> Facilities</span>
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
                <span className="facility-card__emoji" aria-hidden="true">{f.icon}</span>
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
