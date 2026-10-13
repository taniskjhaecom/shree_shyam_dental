import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingActions from './components/common/FloatingActions';
import AppointmentModal from './components/common/AppointmentModal';
import ScrollToTop from './components/common/ScrollToTop';
import Loader from './components/common/Loader';
import { PageSkeleton } from './components/common/Skeleton';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';

// Public Pages (Lazy Loaded for Core Web Vitals & Code Splitting)
const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const TreatmentsPage = lazy(() => import('./pages/public/TreatmentsPage'));
const TreatmentDetailPage = lazy(() => import('./pages/public/TreatmentDetailPage'));
const ResultsPage = lazy(() => import('./pages/public/ResultsPage'));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage'));
const BlogsPage = lazy(() => import('./pages/public/BlogsPage'));
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage'));
const FAQPage = lazy(() => import('./pages/public/FAQPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const BookAppointmentPage = lazy(() => import('./pages/public/BookAppointmentPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/public/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

// Admin Pages (Lazy Loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminAppointmentsPage = lazy(() => import('./pages/admin/AdminAppointmentsPage'));
const AdminTreatmentsPage = lazy(() => import('./pages/admin/AdminTreatmentsPage'));
const AdminBeforeAfterPage = lazy(() => import('./pages/admin/AdminBeforeAfterPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const AdminBlogsPage = lazy(() => import('./pages/admin/AdminBlogsPage'));
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'));
const AdminFAQsPage = lazy(() => import('./pages/admin/AdminFAQsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));

// Protected Admin Route wrapper
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const { initialSplash } = useSettings();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Grand Opening Initial Splash Screen Animation */}
      <AnimatePresence>
        {initialSplash && (
          <motion.div
            key="grand-opening-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999]"
          >
            <Loader message="Loading Hospital Experience..." fullScreen={true} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen">
        {/* Automatically scrolls to top on every route navigation */}
        <ScrollToTop />

        {/* Public Navbar (Hidden on Admin pages) */}
        {!isAdminRoute && <Navbar />}

      {/* Global Appointment Booking Modal */}
      <AppointmentModal />

      {/* Floating Call & WhatsApp Buttons (Auto-hidden on Admin) */}
      <FloatingActions />

      {/* Main Routed Content with Suspense Fallback */}
      <div className="flex-grow">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="treatments" element={<AdminTreatmentsPage />} />
              <Route path="before-after" element={<AdminBeforeAfterPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="blogs" element={<AdminBlogsPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="faqs" element={<AdminFAQsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      {/* Public Footer (Hidden on Admin pages) */}
      {!isAdminRoute && <Footer />}
    </div>
  </>
);
}

export default App;
