import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const routeMap = {
  // About
  '/about': { title: 'About Us', parent: 'About' },
  '/vision-mission': { title: 'Vision & Mission', parent: 'About' },
  '/principal-message': { title: "Principal's Message", parent: 'About' },
  '/safety': { title: 'Safety & Security', parent: 'About' },

  // Learning / Academics
  '/programs': { title: 'Our Programs', parent: 'Academics' },
  '/curriculum': { title: 'Curriculum', parent: 'Academics' },
  '/enquiry': { title: 'Admission Enquiry', parent: 'Academics' },

  // Campus
  '/facilities': { title: 'Facilities', parent: 'Campus' },
  '/gallery': { title: 'Photo Gallery', parent: 'Campus' },
  '/events': { title: 'Events & Celebrations', parent: 'Campus' },

  // Parents
  '/announcements': { title: 'Announcements', parent: 'Parents' },
  '/testimonials': { title: 'Testimonials', parent: 'Parents' },
  '/faqs': { title: 'FAQs', parent: 'Parents' },

  // Portal & Actions
  '/admission': { title: 'Online Admission', parent: 'Admissions' },
  '/contact': { title: 'Contact Us', parent: null },
  '/login': { title: 'Track / Portal', parent: null }
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const path = location.pathname;

  // Don't show breadcrumbs on Home or Admin routes
  if (path === '/' || path.startsWith('/admin')) {
    return null;
  }

  const currentRoute = routeMap[path] || {
    title: path.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    parent: null
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="container breadcrumbs__container">
        <ol className="breadcrumbs__list">
          <li className="breadcrumbs__item">
            <Link to="/" className="breadcrumbs__link">
              <FiHome className="breadcrumbs__home-icon" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </li>

          {currentRoute.parent && (
            <li className="breadcrumbs__item">
              <FiChevronRight className="breadcrumbs__separator" aria-hidden="true" />
              <span className="breadcrumbs__parent">{currentRoute.parent}</span>
            </li>
          )}

          <li className="breadcrumbs__item" aria-current="page">
            <FiChevronRight className="breadcrumbs__separator" aria-hidden="true" />
            <span className="breadcrumbs__current">{currentRoute.title}</span>
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;

