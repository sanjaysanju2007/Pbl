import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiShield, FiCamera, FiUserCheck, FiAlertTriangle, FiTruck, FiLock } from 'react-icons/fi';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const safety = [
  { icon: <FiCamera />, title: 'CCTV Surveillance', desc: 'Every corner of our campus — classrooms, play areas, corridors, and entry points — is monitored by high-definition CCTV cameras, accessible to management in real-time.', color: 'blue' },
  { icon: <FiUserCheck />, title: 'Staff Verification', desc: 'All staff undergo thorough background verification, police checks, and reference validation before joining. Regular training on child safety protocols is mandatory.', color: 'green' },
  { icon: <FiTruck />, title: 'Pick-Up / Drop Protocol', desc: 'Children are released only to authorized persons with valid ID cards. Any change in pick-up personnel must be communicated in writing by parents.', color: 'yellow' },
  { icon: <FiAlertTriangle />, title: 'Emergency Procedures', desc: 'Regular fire drills, earthquake preparedness training, and documented emergency response protocols. First-aid trained staff on campus at all times.', color: 'coral' },
  { icon: <FiLock />, title: 'Secure Campus', desc: 'Controlled entry gates with visitor log system. No unauthorized person can access the campus. Security guards stationed at all entry/exit points.', color: 'lavender' },
  { icon: <FiShield />, title: 'Child Protection Policy', desc: 'A comprehensive child protection policy covering anti-bullying measures, safe touch education, and a confidential reporting mechanism for any concerns.', color: 'blue' },
];

const Safety = () => {
  return (
    <>
      <Helmet>
        <title>Safety & Security — Chittukurumbakam Play School</title>
        <meta name="description" content="Your child's safety is our #1 priority. Learn about our CCTV surveillance, staff verification, pickup protocols, and emergency procedures." />
      </Helmet>

      <section className="page-hero page-hero--safety">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiShield aria-hidden="true" /> Safety & Security</span>
            <h1>Your Child's Safety — Our Highest Priority</h1>
            <p>Comprehensive safety measures so you can have complete peace of mind.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 stagger" style={{ gap: '24px' }}>
            {safety.map((s, i) => (
              <motion.div key={s.title} className={`card card--colored ${s.color}`} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="safety-card">
                  <div className={`value-card__icon value-card__icon--${s.color}`}>{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Safety;
