import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FiActivity, 
  FiBookOpen, 
  FiMusic, 
  FiStar, 
  FiGlobe, 
  FiSmile, 
  FiLayers, 
  FiCompass, 
  FiCpu, 
  FiMessageSquare, 
  FiHash, 
  FiUsers, 
  FiTrendingUp, 
  FiFeather 
} from 'react-icons/fi';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const methodologies = [
  { icon: <FiSmile />, title: 'Play-Based Learning', desc: 'Children learn best when they are having fun. Our play-based approach turns every activity into a meaningful learning experience.', color: 'blue' },
  { icon: <FiActivity />, title: 'Montessori Elements', desc: 'Hands-on, self-directed activities build independence and a deep understanding of concepts through tactile exploration.', color: 'green' },
  { icon: <FiBookOpen />, title: 'Thematic Approach', desc: 'Learning is organized around engaging themes (seasons, animals, community) to create connections across subjects.', color: 'yellow' },
  { icon: <FiMusic />, title: 'Multiple Intelligences', desc: 'We nurture all types of intelligence — linguistic, logical, musical, spatial, kinesthetic, and interpersonal.', color: 'coral' },
  { icon: <FiGlobe />, title: 'Experiential Learning', desc: 'Field trips, experiments, cooking activities, and nature walks make learning real and memorable.', color: 'lavender' },
  { icon: <FiStar />, title: 'Continuous Assessment', desc: 'No exams or grades — we observe, document, and celebrate each child\'s individual progress journey.', color: 'blue' },
];

const Curriculum = () => {
  return (
    <>
      <Helmet>
        <title>Curriculum & Learning Methodology — Chittukurumbakam Play School</title>
        <meta name="description" content="Our play-based curriculum integrates Montessori elements, thematic learning, and experiential activities for holistic child development." />
      </Helmet>

      <section className="page-hero page-hero--curriculum">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiBookOpen aria-hidden="true" /> Curriculum</span>
            <h1>Learning Through Play, Growing Through Joy</h1>
            <p>A research-backed, child-centered curriculum that makes learning an adventure.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-center" style={{ marginBottom: '16px' }}>Our Philosophy</h2>
            <p style={{ textAlign: 'center', margin: '0 auto 48px' }}>
              At Chittukurumbakam, we don't believe in rote memorization or rigid schedules for young children. Instead, 
              our curriculum is built on the understanding that children are natural explorers. We create rich, stimulating 
              environments and guide children through carefully designed experiences that spark curiosity, build 
              confidence, and lay strong academic foundations — all while keeping the magic of childhood alive.
            </p>
          </motion.div>
        </div>
        <div className="container">
          <div className="section-header">
            <span className="section-header__badge"><FiLayers aria-hidden="true" /> Our Approach</span>
            <h2 className="section-header__title">Learning Methodologies</h2>
          </div>
          <div className="grid grid-3 stagger">
            {methodologies.map((m, i) => (
              <motion.div key={m.title} className={`card card--colored ${m.color}`} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="value-card">
                  <div className={`value-card__icon value-card__icon--${m.color}`}>{m.icon}</div>
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <div className="section-header">
            <span className="section-header__badge"><FiCompass aria-hidden="true" /> Development Areas</span>
            <h2 className="section-header__title">Holistic Growth Framework</h2>
          </div>
          <div className="dev-areas stagger">
            {[
              { icon: <FiCpu size={22} />, area: 'Cognitive', items: 'Critical thinking, problem-solving, memory, concentration, logical reasoning' },
              { icon: <FiMessageSquare size={22} />, area: 'Language & Literacy', items: 'Phonics, vocabulary, reading readiness, creative expression, bilingual exposure' },
              { icon: <FiHash size={22} />, area: 'Mathematical', items: 'Number sense, patterns, sorting, measurement, spatial awareness' },
              { icon: <FiUsers size={22} />, area: 'Social & Emotional', items: 'Sharing, empathy, self-regulation, conflict resolution, confidence' },
              { icon: <FiTrendingUp size={22} />, area: 'Physical', items: 'Gross motor (running, climbing), fine motor (writing, cutting), yoga, coordination' },
              { icon: <FiFeather size={22} />, area: 'Creative', items: 'Art, music, dance, dramatic play, imaginative thinking' },
            ].map((d, i) => (
              <motion.div key={d.area} className="dev-area-card" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <span className="dev-area-card__emoji" aria-hidden="true">{d.icon}</span>
                <div>
                  <h4>{d.area}</h4>
                  <p>{d.items}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Curriculum;
