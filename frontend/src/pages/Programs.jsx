import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiClock, FiUsers, FiBookOpen, FiMusic, FiHeart } from 'react-icons/fi';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const programs = [
  {
    id: 'playgroup', name: 'Playgroup', emoji: '🧸', color: 'blue', age: '1.5 – 2.5 years',
    timing: '9:00 AM – 12:00 PM', ratio: '1:6 (Teacher:Student)',
    overview: 'The Playgroup program is a gentle, loving introduction to the world beyond home. In a safe, colorful environment, toddlers explore sensory materials, engage in free play, and begin forming their first friendships.',
    focus: ['Sensory exploration & motor development', 'Language stimulation through songs & rhymes', 'Social skills — sharing, turn-taking, cooperation', 'Toilet training support', 'Separation anxiety management', 'Creative expression through art & music'],
    schedule: ['Circle time & greetings', 'Free play & sensory exploration', 'Snack time', 'Story & rhyme session', 'Outdoor play', 'Art & creative activity']
  },
  {
    id: 'nursery', name: 'Nursery', emoji: '🎨', color: 'green', age: '2.5 – 3.5 years',
    timing: '9:00 AM – 1:00 PM', ratio: '1:8 (Teacher:Student)',
    overview: 'The Nursery program builds on early exploration with more structured activities. Children develop fine motor skills, pre-literacy abilities, and a growing sense of independence through guided play and creative projects.',
    focus: ['Pre-literacy: letter recognition, phonics introduction', 'Pre-numeracy: counting, sorting, patterns', 'Fine motor: cutting, coloring, threading', 'Storytelling & dramatic play', 'Music, movement & dance', 'Nature walks & environmental awareness'],
    schedule: ['Morning assembly & prayer', 'Thematic learning activity', 'Outdoor free play', 'Snack & rest', 'Art / Music / Dance', 'Story time & recap']
  },
  {
    id: 'lkg', name: 'LKG', emoji: '📚', color: 'yellow', age: '3.5 – 4.5 years',
    timing: '9:00 AM – 2:00 PM', ratio: '1:10 (Teacher:Student)',
    overview: 'LKG introduces structured learning readiness while maintaining the joy of discovery. Children begin reading simple words, writing letters, and understanding basic math concepts through hands-on activities.',
    focus: ['Phonics & early reading skills', 'Number concepts & basic addition', 'Writing: letters, numbers, simple words', 'Science exploration & experiments', 'Social studies: family, community, festivals', 'Physical education & yoga'],
    schedule: ['Assembly & morning routine', 'English / Phonics class', 'Math activity', 'Lunch & rest', 'EVS / Science exploration', 'Sports / Yoga / Library']
  },
  {
    id: 'ukg', name: 'UKG', emoji: '🎓', color: 'coral', age: '4.5 – 5.5 years',
    timing: '9:00 AM – 2:30 PM', ratio: '1:12 (Teacher:Student)',
    overview: 'UKG is our school-readiness program, preparing children for a smooth transition to formal primary school. The curriculum strengthens reading, writing, and analytical skills while fostering independence and leadership.',
    focus: ['Fluent reading & comprehension', 'Writing sentences & creative expression', 'Addition, subtraction & problem-solving', 'Science & environmental studies', 'Computer awareness (basic)', 'Leadership & public speaking activities'],
    schedule: ['Assembly & thought of the day', 'English / Hindi language class', 'Mathematics', 'Lunch & recess', 'Science / Computer / Library', 'Extracurricular: art, music, drama']
  }
];

const Programs = () => {
  const [active, setActive] = useState('playgroup');
  const activeProgram = programs.find(p => p.id === active);

  return (
    <>
      <Helmet>
        <title>Our Programs — Chittukurumbakam Play School</title>
        <meta name="description" content="Explore our Playgroup, Nursery, LKG & UKG programs designed for children aged 1.5 to 5.5 years." />
      </Helmet>

      <section className="page-hero page-hero--programs">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge">🎓 Our Programs</span>
            <h1>Programs for Every Stage of Growth</h1>
            <p>Age-appropriate learning experiences designed with love and backed by research.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="program-tabs">
            {programs.map(p => (
              <button key={p.id} className={`program-tab program-tab--${p.color} ${active === p.id ? 'program-tab--active' : ''}`} onClick={() => setActive(p.id)}>
                <span className="program-tab__emoji">{p.emoji}</span>
                <span className="program-tab__name">{p.name}</span>
                <span className="program-tab__age">{p.age}</span>
              </button>
            ))}
          </div>

          <motion.div key={active} className="program-detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="program-detail__header">
              <span className="program-detail__emoji">{activeProgram.emoji}</span>
              <div>
                <h2>{activeProgram.name}</h2>
                <div className="program-detail__meta">
                  <span className={`badge badge--${activeProgram.color}`}>{activeProgram.age}</span>
                  <span className="program-detail__info"><FiClock /> {activeProgram.timing}</span>
                  <span className="program-detail__info"><FiUsers /> {activeProgram.ratio}</span>
                </div>
              </div>
            </div>

            <p className="program-detail__overview">{activeProgram.overview}</p>

            <div className="program-detail__grid">
              <div className="program-detail__section">
                <h3><FiBookOpen /> Focus Areas</h3>
                <ul className="program-detail__list">
                  {activeProgram.focus.map((item, i) => (
                    <li key={i}><span className="program-detail__bullet">✦</span> {item}</li>
                  ))}
                </ul>
              </div>
              <div className="program-detail__section">
                <h3><FiMusic /> A Typical Day</h3>
                <ol className="program-detail__schedule">
                  {activeProgram.schedule.map((item, i) => (
                    <li key={i}><span className="program-detail__step">{i + 1}</span> {item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Programs;
