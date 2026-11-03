import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPhone, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import siteConfig from '../../data/siteConfig';

/**
 * Mobile Sticky Action Bar: Call · WhatsApp · Apply Now
 * Automatically hidden on /admission to preserve wizard focus.
 */
export const MobileActionBar = () => {
  const location = useLocation();

  // Hide on admission wizard to avoid distraction/accidental navigation
  if (location.pathname === '/admission') {
    return null;
  }

  const encodedMsg = encodeURIComponent(siteConfig.whatsapp.defaultMessage);
  const waUrl = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodedMsg}`;

  return (
    <aside className="mobile-action-bar" aria-label="Quick contact and admission actions">
      <div className="mobile-action-bar__container">
        {/* Call Link */}
        <a
          href={`tel:${siteConfig.phone.value}`}
          className="mobile-action-bar__btn mobile-action-bar__btn--call"
          aria-label={`Call Chittukurumbakam at ${siteConfig.phone.display}`}
        >
          <FiPhone className="mobile-action-bar__icon" aria-hidden="true" />
          <span className="mobile-action-bar__text">Call</span>
        </a>

        {/* WhatsApp Link */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-action-bar__btn mobile-action-bar__btn--whatsapp"
          aria-label="Chat with school admissions on WhatsApp"
        >
          <FaWhatsapp className="mobile-action-bar__icon" aria-hidden="true" />
          <span className="mobile-action-bar__text">WhatsApp</span>
        </a>

        {/* Primary Apply CTA */}
        <Link
          to="/admission"
          className="mobile-action-bar__btn mobile-action-bar__btn--apply"
          aria-label="Apply online for admission"
        >
          <span className="mobile-action-bar__text">Apply Now</span>
          <FiArrowRight className="mobile-action-bar__icon" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
};

export default MobileActionBar;

