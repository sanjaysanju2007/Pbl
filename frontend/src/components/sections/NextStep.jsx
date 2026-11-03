import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSmile, FiHeart, FiPhone, FiCalendar, FiBookOpen } from 'react-icons/fi';

/**
 * Reusable NextStep Block
 * Every page ends with one primary CTA and one secondary text link.
 */
export const NextStep = ({
  icon,
  badge = 'Next Step',
  title = 'Take the Next Step for Your Child',
  description = 'Our welcoming mentors are here to answer your questions and guide your family.',
  primaryAction = {
    label: 'Apply for Admission',
    to: '/admission',
    icon: <FiArrowRight aria-hidden="true" />
  },
  secondaryAction = {
    label: 'Book a Campus Visit',
    to: '/contact'
  }
}) => {
  return (
    <section className="next-step-section" aria-label="Next steps and actions">
      <div className="container">
        <div className="next-step-card">
          <div className="next-step-card__badge-row">
            <span className="next-step-card__badge">
              {icon || <FiSmile aria-hidden="true" />}
              <span>{badge}</span>
            </span>
          </div>

          <h2 className="next-step-card__title">{title}</h2>
          <p className="next-step-card__desc">{description}</p>

          <div className="next-step-card__actions">
            {primaryAction.href ? (
              <a
                href={primaryAction.href}
                className="btn btn--primary btn--lg"
              >
                <span>{primaryAction.label}</span>
                {primaryAction.icon}
              </a>
            ) : (
              <Link
                to={primaryAction.to}
                className="btn btn--primary btn--lg"
              >
                <span>{primaryAction.label}</span>
                {primaryAction.icon || <FiArrowRight aria-hidden="true" />}
              </Link>
            )}

            {secondaryAction && (
              secondaryAction.href ? (
                <a
                  href={secondaryAction.href}
                  className="next-step-card__secondary-link"
                >
                  {secondaryAction.label} →
                </a>
              ) : (
                <Link
                  to={secondaryAction.to}
                  className="next-step-card__secondary-link"
                >
                  {secondaryAction.label} →
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextStep;

