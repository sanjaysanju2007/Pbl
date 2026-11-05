import { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiImage,
  FiBell,
  FiCalendar,
  FiStar,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiGlobe,
  FiPlusCircle,
  FiGrid
} from 'react-icons/fi';
import API from '../../api';
import './Admin.css';

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { path: '/admin/admissions', label: 'Admissions', icon: <FiUsers /> },
  { path: '/admin/enquiries', label: 'Enquiries', icon: <FiMessageSquare /> },
  { path: '/admin/gallery', label: 'Gallery', icon: <FiImage /> },
  { path: '/admin/announcements', label: 'Announcements', icon: <FiBell /> },
  { path: '/admin/events', label: 'Events', icon: <FiCalendar /> },
  { path: '/admin/testimonials', label: 'Testimonials', icon: <FiStar /> },
  { path: '/admin/faqs', label: 'FAQs', icon: <FiHelpCircle /> },
];

const getPageTitle = (pathname) => {
  if (pathname.includes('/admissions')) return 'Admissions';
  if (pathname.includes('/enquiries')) return 'Enquiries';
  if (pathname.includes('/gallery')) return 'Gallery';
  if (pathname.includes('/announcements')) return 'Announcements';
  if (pathname.includes('/events')) return 'Events';
  if (pathname.includes('/testimonials')) return 'Testimonials';
  if (pathname.includes('/faqs')) return 'FAQs';
  return 'Dashboard';
};

const AdminLayout = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newAdmissionsCount, setNewAdmissionsCount] = useState(0);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Fetch pending badge count
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBadge = async () => {
      try {
        const res = await API.get('/admissions?status=submitted&limit=1');
        setNewAdmissionsCount(res.data.pagination?.total || 0);
      } catch (e) {
        // quiet
      }
    };
    fetchBadge();
  }, [isAuthenticated, location.pathname]);

  if (loading) return <div className="admin-loading">Loading Admin Portal...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="admin">
      {/* Sidebar (Desktop permanent / Mobile slide-over) */}
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__sidebar-header">
          <div className="admin__brand-wrap">
            <img
              src="/logo.jpg"
              alt="Chittu Kurumbagam"
              className="admin__brand-logo"
              style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.2)' }}
            />
            <div className="admin__brand-text">
              <strong>Chittukurumbakam</strong>
              <small>Admin Portal</small>
            </div>
          </div>
          <button
            type="button"
            className="admin__sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User Card inside Sidebar on Mobile */}
        <div className="admin__sidebar-user">
          <span className="admin__user-avatar">{user?.name?.charAt(0) || 'A'}</span>
          <div>
            <strong>{user?.name || 'Administrator'}</strong>
            <span className="admin__user-role">Super Admin • Online</span>
          </div>
        </div>

        <nav className="admin__nav">
          <span className="admin__nav-heading">MAIN MENU</span>
          {sidebarLinks.map(link => {
            const isAdmissions = link.path === '/admin/admissions';
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `admin__nav-link ${isActive ? 'admin__nav-link--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin__nav-icon">{link.icon}</span>
                <span className="admin__nav-label">{link.label}</span>
                {isAdmissions && newAdmissionsCount > 0 && (
                  <span className="admin__nav-badge">{newAdmissionsCount}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="admin__sidebar-footer">
          <NavLink
            to="/"
            className="admin__nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiGlobe /> <span>View Live Site</span>
          </NavLink>
          <button
            onClick={logout}
            className="admin__nav-link admin__logout-btn"
          >
            <FiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin__main">
        {/* Sticky Mobile & Desktop Topbar */}
        <header className="admin__topbar">
          <div className="admin__topbar-left">
            <button
              className="admin__menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <FiMenu size={22} />
            </button>
            <div className="admin__topbar-brand-mobile">
              <img src="/logo.jpg" alt="Chittu Kurumbagam" style={{ width: '28px', height: '28px', borderRadius: '7px', objectFit: 'cover' }} />
              <span>CK</span>
            </div>
            <h1 className="admin__topbar-title">{pageTitle}</h1>
          </div>

          <div className="admin__topbar-right">
            <Link
              to="/admission"
              target="_blank"
              className="admin__quick-apply-btn"
              title="Open public admission form in new tab"
            >
              <FiPlusCircle />
              <span className="admin__quick-apply-text">New Form</span>
            </Link>

            <div className="admin__topbar-user">
              <span className="admin__user-avatar">{user?.name?.charAt(0) || 'A'}</span>
              <span className="admin__user-name">{user?.name || 'Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Content Area with Bottom Padding on Mobile */}
        <main className="admin__content">
          <Outlet />
        </main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar (App-like UX on phones) */}
      <nav className="admin-mobile-bottom-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `admin-mobile-bottom-tab ${isActive ? 'active' : ''}`}
        >
          <FiHome size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/admissions"
          className={({ isActive }) => `admin-mobile-bottom-tab ${isActive ? 'active' : ''}`}
        >
          <div className="admin-mobile-tab-icon-wrap">
            <FiUsers size={20} />
            {newAdmissionsCount > 0 && (
              <span className="admin-mobile-badge-dot">{newAdmissionsCount}</span>
            )}
          </div>
          <span>Admissions</span>
        </NavLink>

        <NavLink
          to="/admin/enquiries"
          className={({ isActive }) => `admin-mobile-bottom-tab ${isActive ? 'active' : ''}`}
        >
          <FiMessageSquare size={20} />
          <span>Enquiries</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`admin-mobile-bottom-tab ${sidebarOpen ? 'active' : ''}`}
        >
          <FiGrid size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* Dimmed Backdrop for Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div
          className="admin__overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;
