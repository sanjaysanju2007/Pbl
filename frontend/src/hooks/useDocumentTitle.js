import { useEffect } from 'react';
import siteConfig from '../data/siteConfig';

/**
 * Custom hook to update document.title consistently
 * @param {string} title - Page specific title
 * @param {boolean} [retainOnUnmount=false] - Whether to keep title on unmount
 */
export const useDocumentTitle = (title, retainOnUnmount = false) => {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = `${title} | ${siteConfig.name}`;
    } else {
      document.title = `${siteConfig.name} — ${siteConfig.tagline}`;
    }

    return () => {
      if (!retainOnUnmount) {
        document.title = previousTitle;
      }
    };
  }, [title, retainOnUnmount]);
};

export default useDocumentTitle;

