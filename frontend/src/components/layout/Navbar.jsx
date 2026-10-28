import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiPhone,
  FiChevronDown,
  FiArrowRight,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiCamera,
  FiCalendar,
  FiMessageSquare,
  FiHelpCircle,
  FiBell,
  FiShield,
  FiSmile,
  FiGrid,
  FiCompass,
  FiLayers,
  FiHeart,
  FiUser,
  FiSun
} from 'react-icons/fi';
import './Navbar.css';

const navItems = [
  { path: '/', label: 'Home' },
  {
    label: 'About',
    badge: '4 Pages',
    children: [
      {
        path: '/about',
        label: 'About Chittukurumbakam',
        desc: 'Our story, philosophy & caring culture',
        icon: FiUsers,
        color: 'blue'
      },
      {
        path: '/vision-mission',
        label: 'Vision & Mission',
        desc: 'Foundational values & nurturing pillars',
        icon: FiCompass,
        color: 'teal'
      },
      {
        path: '/principal-message',
        label: "Principal's Message",
        desc: 'A warm welcome from our leadership',
        icon: FiAward,
        color: 'amber'
      },
      {
        path: '/safety',
        label: 'Safety & Security',
        desc: 'CCTV surveillance & child-safe campus',
        icon: FiShield,
        color: 'rose'
      },
    ]
  },
  {
    label: 'Academics',
    children: [
      {
        path: '/programs',
        label: 'Our Programs',
        desc: 'Playgroup, Pre-KG, LKG & UKG stages',
        icon: FiBookOpen,
        color: 'blue'
      },
      {
        path: '/curriculum',
        label: 'Curriculum & Methodology',
        desc: 'Play-way, Montessori & joyful learning',
        icon: FiLayers,
        color: 'purple'
      },
      {
        path: '/enquiry',
        label: 'Admission Enquiry',
        desc: 'Ask questions or book a friendly visit',
        icon: FiMessageSquare,
        color: 'teal'
      },
    ]
  },
  {
    label: 'Campus Life',
    children: [
      {
        path: '/facilities',
        label: 'Facilities & Spaces',
        desc: 'Smart classrooms, sensory & play zones',
        icon: FiGrid,
        color: 'teal'
      },
      {
        path: '/gallery',
        label: 'Photo Gallery',
        desc: 'Capturing everyday smiles & activities',
        icon: FiCamera,
        color: 'blue'
      },
      {
        path: '/events',
        label: 'Events & Celebrations',
        desc: 'Festivals, sports day & special themes',
        icon: FiCalendar,
        color: 'amber'
      },
    ]
  },
  {
    label: 'Parents',
    children: [
      {
        path: '/announcements',
        label: 'Announcements & Circulars',
        desc: 'Important school notices & updates',
        icon: FiBell,
        color: 'blue'
      },
      {
        path: '/testimonials',
        label: 'Parent Testimonials',
        desc: 'Genuine reviews from our loving families',
        icon: FiSmile,
        color: 'amber'
      },
      {
        path: '/faqs',
        label: 'Frequently Asked Questions',
        desc: 'Quick answers on admissions, hours & care',
        icon: FiHelpCircle,
        color: 'teal'
      },
    ]
  },
  { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const location = useLocation();
  const navRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Scroll detection for sticky elevated navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Click outside and Escape key handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Hover handlers with debounce / grace period (prevents dropdown vanishing)
  const handleMouseEnter = (index) => {
    if (window.innerWidth <= 1024) return;
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth <= 1024) return;
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Toggle on click for desktop & mobile
  const handleDropdownTriggerClick = (index, e) => {
    e.preventDefault();
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  // Mobile accordion toggle
  const toggleMobileSubmenu = (index) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Check if current route matches any child
  const isSectionActive = (item) => {
    if (item.path) {
      return item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path);
    }
    if (item.children) {
      return item.children.some((child) => child.path === location.pathname);
    }
    return false;
  };

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-header--scrolled' : ''}`} ref={navRef}>
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar__container container">
          {/* Logo & School Branding */}
          <Link to="/" className="navbar__brand" aria-label="Chittukurumbakam Play School Home">
            <div className="navbar__logo-wrap">
              <img
                src="/logo.jpg"
                alt="Chittukurumbakam Play School"
                className="navbar__logo-img"
              />
            </div>
            <div className="navbar__brand-text">
              <span className="navbar__brand-title">
                Chittukurumbakam <FiSun className="navbar__sun-icon" title="Sunny Beginnings" aria-label="Sunny Beginnings" />
              </span>
              <span className="navbar__brand-subtitle">
                <span>Play School</span>
                <span className="navbar__brand-dot">•</span>
                <span className="navbar__brand-tag">Sunny Beginnings</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar__menu-desktop">
            <ul className="navbar__list">
              {navItems.map((item, index) => {
                const isActive = isSectionActive(item);
                const isDropdownOpen = activeDropdown === index;

                if (item.children) {
                  return (
                    <li
                      key={item.label}
                      className={`navbar__item navbar__item--has-dropdown ${isDropdownOpen ? 'navbar__item--open' : ''}`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        className={`navbar__link navbar__link--dropdown ${isActive ? 'navbar__link--active' : ''}`}
                        onClick={(e) => handleDropdownTriggerClick(index, e)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <FiChevronDown
                          className={`navbar__chevron ${isDropdownOpen ? 'navbar__chevron--rotated' : ''}`}
                          size={15}
                        />
                      </button>

                      {/* Dropdown Card */}
                      <div className="navbar__dropdown-bridge">
                        <div className="navbar__dropdown-panel" role="menu">
                          <div className="navbar__dropdown-header">
                            <span className="navbar__dropdown-category">{item.label} Section</span>
                            <span className="navbar__dropdown-count">{item.children.length} links</span>
                          </div>
                          <div className="navbar__dropdown-grid">
                            {item.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildCurrent = location.pathname === child.path;
                              return (
                                <NavLink
                                  key={child.path}
                                  to={child.path}
                                  role="menuitem"
                                  className={`navbar__dropdown-item ${isChildCurrent ? 'navbar__dropdown-item--active' : ''}`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <div className={`navbar__dropdown-icon navbar__dropdown-icon--${child.color}`}>
                                    <ChildIcon size={17} />
                                  </div>
                                  <div className="navbar__dropdown-content">
                                    <div className="navbar__dropdown-title-row">
                                      <span className="navbar__dropdown-title">{child.label}</span>
                                    </div>
                                    <p className="navbar__dropdown-desc">{child.desc}</p>
                                  </div>
                                  <FiArrowRight className="navbar__dropdown-arrow" size={13} />
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.path} className="navbar__item">
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Action CTAs (Call + Apply) */}
          <div className="navbar__actions">
            <a
              href="tel:+919952285838"
              className="navbar__call-btn"
              title="Call Chittukurumbakam Play School"
            >
              <div className="navbar__call-icon-wrap">
                <FiPhone size={14} />
              </div>
              <div className="navbar__call-details">
                <span className="navbar__call-label">Quick Call</span>
                <span className="navbar__call-number">99522 85838</span>
              </div>
            </a>

            <Link
              to="/login"
              className="navbar__portal-btn"
              title="Parent Application Status & Staff Sign In"
            >
              <FiUser size={14} />
              <span>Portal</span>
            </Link>

            <Link to="/admission" className="navbar__cta-btn">
              <span>Apply Now</span>
              <FiArrowRight size={15} className="navbar__cta-arrow" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className={`navbar__mobile-toggle ${isOpen ? 'navbar__mobile-toggle--active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`navbar__drawer-backdrop ${isOpen ? 'navbar__drawer-backdrop--visible' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Out Drawer */}
      <aside
        className={`navbar__drawer ${isOpen ? 'navbar__drawer--open' : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className="navbar__drawer-head">
          <div className="navbar__brand">
            <div className="navbar__logo-wrap">
              <img
                src="/logo.jpg"
                alt="Chittukurumbakam Play School"
                className="navbar__logo-img"
              />
            </div>
            <div className="navbar__brand-text">
              <span className="navbar__brand-title">Chittukurumbakam</span>
              <span className="navbar__brand-subtitle">Play School</span>
            </div>
          </div>
          <button
            type="button"
            className="navbar__drawer-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="navbar__drawer-banner">
          <FiHeart className="navbar__drawer-banner-icon" size={15} />
          <span>Admissions Open for 2026-2027</span>
        </div>

        <div className="navbar__drawer-scroll">
          <ul className="navbar__mobile-list">
            {navItems.map((item, idx) => {
              const isExpanded = !!mobileExpanded[idx];
              const isActive = isSectionActive(item);

              if (item.children) {
                return (
                  <li key={item.label} className="navbar__mobile-item navbar__mobile-item--group">
                    <button
                      type="button"
                      className={`navbar__mobile-group-btn ${isActive ? 'navbar__mobile-group-btn--active' : ''} ${isExpanded ? 'navbar__mobile-group-btn--expanded' : ''}`}
                      onClick={() => toggleMobileSubmenu(idx)}
                    >
                      <span className="navbar__mobile-group-title">{item.label}</span>
                      <div className="navbar__mobile-group-meta">
                        <span className="navbar__mobile-tag">{item.children.length} pages</span>
                        <FiChevronDown
                          className={`navbar__mobile-chevron ${isExpanded ? 'navbar__mobile-chevron--rotated' : ''}`}
                          size={16}
                        />
                      </div>
                    </button>

                    <div
                      className={`navbar__mobile-sublist-wrapper ${isExpanded ? 'navbar__mobile-sublist-wrapper--expanded' : ''}`}
                    >
                      <ul className="navbar__mobile-sublist">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildCurrent = location.pathname === child.path;
                          return (
                            <li key={child.path}>
                              <NavLink
                                to={child.path}
                                className={`navbar__mobile-sublink ${isChildCurrent ? 'navbar__mobile-sublink--active' : ''}`}
                                onClick={() => setIsOpen(false)}
                              >
                                <div className={`navbar__dropdown-icon navbar__dropdown-icon--${child.color}`}>
                                  <ChildIcon size={16} />
                                </div>
                                <div className="navbar__mobile-sublink-text">
                                  <span className="navbar__mobile-sublink-title">{child.label}</span>
                                  <span className="navbar__mobile-sublink-desc">{child.desc}</span>
                                </div>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.path} className="navbar__mobile-item">
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.label}</span>
                    <FiArrowRight size={15} className="navbar__mobile-link-arrow" />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Drawer Bottom CTAs */}
        <div className="navbar__drawer-footer">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <a href="tel:+919952285838" className="navbar__drawer-call">
              <FiPhone size={15} />
              <span>Call Us</span>
            </a>
            <Link
              to="/login"
              className="navbar__drawer-portal"
              onClick={() => setIsOpen(false)}
            >
              <FiUser size={15} />
              <span>Track / Portal</span>
            </Link>
          </div>
          <Link
            to="/admission"
            className="navbar__drawer-apply"
            onClick={() => setIsOpen(false)}
          >
            <span>Apply for Admission</span>
            <FiArrowRight size={16} />
          </Link>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
