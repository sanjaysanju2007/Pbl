import React from 'react';

/**
 * Accessible Skip to Content Link
 * Visible when keyboard users press Tab upon initial page entry
 */
export const SkipLink = ({ targetId = 'main-content', label = 'Skip to main content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={(e) => {
        const el = document.getElementById(targetId);
        if (el) {
          el.setAttribute('tabIndex', '-1');
          el.focus();
        }
      }}
    >
      {label}
    </a>
  );
};

export default SkipLink;

