import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiNavigation, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './PageStyles.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

// Real Google Maps embed URL for Chittu kurumbagam Daycare and playgroup, Tiruppur
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.5!2d77.3421!3d11.1085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9a9ef24133e67%3A0x14b4747dc58b5257!2sChittu%20kurumbagam%20Daycare%20and%20playgroup!5e0!3m2!1sen!2sin!4v1724685900000!5m2!1sen!2sin";
const MAPS_LINK = "https://maps.app.goo.gl/ceBNW1M9cNawmBKG7";
const ADDRESS = "Dharapuram - Tiruppur Rd, L S G Nagar, Palaniandavar Nagar, K Chettipalayam, Tiruppur, Tamil Nadu 641604";

const contactCards = [
  {
    icon: <FiMapPin size={24} />,
    color: 'blue',
    title: 'Visit Us',
    content: ADDRESS,
    action: { href: MAPS_LINK, label: 'Get Directions', external: true },
  },
  {
    icon: <FiPhone size={24} />,
    color: 'green',
    title: 'Call Us',
    lines: [
      { href: 'tel:+919952285838', label: '+91 99522 85838' },
    ],
  },
  {
    icon: <FiMail size={24} />,
    color: 'coral',
    title: 'Email Us',
    lines: [
      { href: 'mailto:info@chittukurumbakam.com', label: 'info@chittukurumbakam.com' },
      { href: 'mailto:admissions@chittukurumbakam.com', label: 'admissions@...' },
    ],
  },
  {
    icon: <FiClock size={24} />,
    color: 'yellow',
    title: 'Office Hours',
    lines: [
      { label: 'Mon – Fri: 8:30 AM – 4:30 PM' },
      { label: 'Saturday: 9:00 AM – 1:00 PM' },
      { label: 'Sunday: Closed' },
    ],
  },
];

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us — Chittukurumbakam Play School</title>
        <meta name="description" content="Get in touch with Chittukurumbakam Play School in Tiruppur, Tamil Nadu. Visit us, call, or email — we're here to help!" />
      </Helmet>

      <section className="page-hero page-hero--contact">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="page-hero__content">
            <span className="section-header__badge"><FiMapPin /> Contact Us</span>
            <h1>We're Here for You</h1>
            <p>Visit us in Tiruppur, Tamil Nadu — we'd love to show you around our campus!</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Cards */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="contact-cards-enhanced stagger">
                {contactCards.map((card, i) => (
                  <motion.div
                    key={i}
                    className={`card contact-card-enhanced`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`contact-card__icon contact-card__icon--${card.color}`}>
                      {card.icon}
                    </div>
                    <div className="contact-card-enhanced__body">
                      <h4>{card.title}</h4>
                      {card.content && <p className="contact-card-enhanced__address">{card.content}</p>}
                      {card.lines && (
                        <div className="contact-card-enhanced__lines">
                          {card.lines.map((line, j) => (
                            <span key={j}>
                              {line.href
                                ? <a href={line.href}>{line.label}</a>
                                : <span>{line.label}</span>
                              }
                            </span>
                          ))}
                        </div>
                      )}
                      {card.action && (
                        <a
                          href={card.action.href}
                          target={card.action.external ? '_blank' : undefined}
                          rel={card.action.external ? 'noopener noreferrer' : undefined}
                          className="contact-card-enhanced__action"
                        >
                          <FiNavigation size={13} /> {card.action.label}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="contact-whatsapp">
                <a
                  href="https://wa.me/919952285838?text=Hello%2C%20I%27m%20interested%20in%20admission%20at%20Chittukurumbakam%20Play%20School"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--green"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-lg)' }}
                >
                  <FaWhatsapp size={18} /> Chat with Us on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <div className="contact-map-section">
                <div className="contact-map-header">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiMapPin style={{ color: 'var(--color-primary)' }} /> Find Us on the Map</h3>
                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map-open-link"
                  >
                    Open in Google Maps <FiExternalLink size={14} />
                  </a>
                </div>
                <div className="map-container">
                  <iframe
                    src={MAPS_EMBED_URL}
                    width="100%"
                    height="420"
                    style={{ border: 0, borderRadius: '16px', display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Chittu kurumbagam Daycare and playgroup — Tiruppur, Tamil Nadu"
                  ></iframe>
                </div>
                <div className="contact-map-address">
                  <FiMapPin size={16} className="contact-map-address__icon" />
                  <span>{ADDRESS}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
