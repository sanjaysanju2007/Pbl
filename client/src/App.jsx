import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import VisionMission from './pages/VisionMission';
import PrincipalMessage from './pages/PrincipalMessage';
import Programs from './pages/Programs';
import Curriculum from './pages/Curriculum';
import Facilities from './pages/Facilities';
import Safety from './pages/Safety';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import AdmissionForm from './pages/AdmissionForm';
import Enquiry from './pages/Enquiry';
import Testimonials from './pages/Testimonials';
import FAQs from './pages/FAQs';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageAdmissions from './pages/admin/ManageAdmissions';
import ManageEnquiries from './pages/admin/ManageEnquiries';
import ManageGallery from './pages/admin/ManageGallery';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageEvents from './pages/admin/ManageEvents';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageFAQs from './pages/admin/ManageFAQs';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/principal-message" element={<PrincipalMessage />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Authentication & Portal Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admissions" element={<ManageAdmissions />} />
          <Route path="enquiries" element={<ManageEnquiries />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="announcements" element={<ManageAnnouncements />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
          <Route path="faqs" element={<ManageFAQs />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
