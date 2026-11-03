import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from '../ui/SkipLink';
import MobileActionBar from '../ui/MobileActionBar';
import Breadcrumbs from '../sections/Breadcrumbs';
import useFocusOnRouteChange from '../../hooks/useFocusOnRouteChange';

const Layout = () => {
  // Focus on route change and scroll to top smoothly
  useFocusOnRouteChange();

  return (
    <>
      <SkipLink targetId="main-content" />
      <Navbar />
      <Breadcrumbs />
      <main id="main-content" className="layout-main" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
};

export default Layout;
