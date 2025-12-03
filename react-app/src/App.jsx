import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import DeveloperWebsites from './pages/DeveloperWebsites';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Components
import AdminOverview from './components/admin/AdminOverview';
import AdminPricing from './components/admin/AdminPricing';
import AdminServices from './components/admin/AdminServices';
import AdminFAQs from './components/admin/AdminFAQs';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminInquiries from './components/admin/AdminInquiries';
import AdminDeveloperWebsites from './components/admin/AdminDeveloperWebsites';

// Styles
import './index.css';
import './pages/Home.css';

// Public Layout
function PublicLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/developer-websites" element={<DeveloperWebsites />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="developer-websites" element={<AdminDeveloperWebsites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
