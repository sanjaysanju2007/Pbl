import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiArrowRight, FiSun, FiCheckCircle, FiHeart } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      {/* Wave Divider */}
      <div className="footer__wave">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 50L60 44C120 38 240 26 360 22C480 18 600 22 720 32C840 42 960 58 1080 62C1200 66 1320 58 1380 54L1440 50V100H0V50Z" fill="#FFF3C4"/>
        </svg>
      </div>

      <div className="footer__body">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <img src="/logo.jpg" alt="Chittukurumbakam Play School" className="footer__logo-img" />
                <div className="footer__logo-text">
                  <span className="footer__logo-name">Chittukurumbakam <FiSun aria-hidden="true" style={{ color: '#f59e0b', verticalAlign: 'middle', marginLeft: '4px' }} /></span>
                  <span className="footer__logo-sub">Sunny Beginnings</span>
                </div>
              </div>
              <p className="footer__description">
                Where every child blossoms! We nurture young minds with warmth, love,
                and a joyful learning environment that sets the foundation for a lifetime of curiosity and wonder.
              </p>

              {/* School Hours */}
              <div className="footer__hours">
                <div className="footer__hours-title">
                  <FiClock size={14} /> School Hours
                </div>
                <div className="footer__hours-list">
                  <span>Mon – Fri: 9:00 AM – 3:00 PM</span>
                  <span>Saturday: 9:00 AM – 12:00 PM</span>
                  <span>Sunday: Closed</span>
                </div>
              </div>

              <div className="footer__social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link footer__social-link--fb" aria-label="Facebook"><FaFacebookF /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link footer__social-link--ig" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-link footer__social-link--yt" aria-label="YouTube"><FaYoutube /></a>
                <a href="https://wa.me/919952285838" target="_blank" rel="noopener noreferrer" className="footer__social-link footer__social-link--wa" aria-label="WhatsApp"><FaWhatsapp /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer__section">
              <h4 className="footer__heading">Quick Links</h4>
              <ul className="footer__list">
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/programs', label: 'Our Programs' },
                  { to: '/admission', label: 'Admissions' },
                  { to: '/gallery', label: 'Gallery' },
                  { to: '/events', label: 'Events' },
                  { to: '/announcements', label: 'Announcements' },
                  { to: '/contact', label: 'Contact Us' },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to}>
                      <FiArrowRight size={12} /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div className="footer__section">
              <h4 className="footer__heading">Programs</h4>
              <ul className="footer__list">
                {[
                  { label: 'Playgroup (1.5–2.5 yrs)' },
                  { label: 'Nursery (2.5–3.5 yrs)' },
                  { label: 'LKG (3.5–4.5 yrs)' },
                  { label: 'UKG (4.5–5.5 yrs)' },
                  { label: 'Curriculum', to: '/curriculum' },
                  { label: 'FAQs', to: '/faqs' },
                ].map((item, i) => (
                  <li key={i}>
                    {item.to
                      ? <Link to={item.to}><FiArrowRight size={12} /> {item.label}</Link>
                      : <Link to="/programs"><FiArrowRight size={12} /> {item.label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Newsletter */}
            <div className="footer__section">
              <h4 className="footer__heading">Get in Touch</h4>
              <ul className="footer__contact">
                <li>
                  <FiMapPin className="footer__contact-icon" />
                  <a href="https://maps.app.goo.gl/ceBNW1M9cNawmBKG7" target="_blank" rel="noopener noreferrer">
                    Dharapuram - Tiruppur Rd, L S G Nagar, Palaniandavar Nagar, K Chettipalayam, Tiruppur, Tamil Nadu 641604
                  </a>
                </li>
                <li>
                  <FiPhone className="footer__contact-icon" />
                  <a href="tel:+919952285838">+91 99522 85838</a>
                </li>
                <li>
                  <FiMail className="footer__contact-icon" />
                  <a href="mailto:info@chittukurumbakam.com">info@chittukurumbakam.com</a>
                </li>
              </ul>

              {/* Newsletter */}
              <div className="footer__newsletter">
                <h5 className="footer__newsletter-title"><FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Stay Updated</h5>
                <p className="footer__newsletter-text">Get updates on events and admissions.</p>
                {subscribed ? (
                  <div className="footer__newsletter-success">
                    <FiCheckCircle style={{ color: 'var(--color-success)', marginRight: '6px', verticalAlign: 'middle' }} /> Subscribed! Thank you
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="footer__newsletter-form">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="footer__newsletter-input"
                      required
                    />
                    <button type="submit" className="footer__newsletter-btn">
                      <FiSend size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Chittukurumbakam Play School. All rights reserved.</p>
          <p className="footer__bottom-tagline">Made with <FiHeart style={{ color: '#ef4444', verticalAlign: 'middle', margin: '0 2px' }} /> for little learners</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
