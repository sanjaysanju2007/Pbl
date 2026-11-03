import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top and shift accessibility focus to the primary heading on route change.
 */
export const useFocusOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Set focus on the main heading or container for accessibility
    const timer = setTimeout(() => {
      const heading = document.querySelector('main h1') || document.querySelector('h1') || document.querySelector('#main-content');
      if (heading) {
        if (!heading.hasAttribute('tabIndex')) {
          heading.setAttribute('tabIndex', '-1');
        }
        heading.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);
};

export default useFocusOnRouteChange;

