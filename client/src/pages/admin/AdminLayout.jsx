import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUsers, FiMessageSquare, FiImage, FiBell, FiCalendar, FiStar, FiHelpCircle, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
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

const AdminLayout = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  return (
    <div className="admin">
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__sidebar-header">
          <span>🌈</span>
          <div>
            <strong>CK Admin</strong>
            <small>{user?.name}</small>
          </div>
        </div>
        <nav className="admin__nav">
          {sidebarLinks.map(link => (
            <NavLink key={link.path} to={link.path} className={({ isActive }) => `admin__nav-link ${isActive ? 'admin__nav-link--active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {link.icon} <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin__sidebar-footer">
          <NavLink to="/" className="admin__nav-link" target="_blank">🌐 View Site</NavLink>
          <button onClick={logout} className="admin__nav-link admin__logout-btn"><FiLogOut /> <span>Logout</span></button>
        </div>
      </aside>

      <div className="admin__main">
        <header className="admin__topbar">
          <button className="admin__menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><FiMenu size={20} /></button>
          <h3 className="admin__topbar-title">Admin Dashboard</h3>
          <div className="admin__topbar-user">
            <span className="admin__user-avatar">{user?.name?.charAt(0)}</span>
            <span>{user?.name}</span>
          </div>
        </header>
        <div className="admin__content">
          <Outlet />
        </div>
      </div>

      {sidebarOpen && <div className="admin__overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default AdminLayout;
