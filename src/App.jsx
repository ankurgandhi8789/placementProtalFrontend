import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ContactPage from './pages/public/ContactPage';
import VacancyPage from './pages/public/VacancyPage';
import TermsPage from './pages/public/TermsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherApply from './pages/teacher/TeacherApply';
import TeacherEdit from './pages/teacher/TeacherEdit';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherHistory from './pages/teacher/TeacherHistory';
import TeacherStatus from './pages/teacher/TeacherStatus';

// School Pages
import SchoolDashboard from './pages/school/SchoolDashboard';
import SchoolProfile from './pages/school/SchoolProfile';
import SchoolRequirements from './pages/school/SchoolRequirements';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminTeacherDetail from './pages/admin/AdminTeacherDetail';
import AdminSchools from './pages/admin/AdminSchools';
import AdminSchoolDetail from './pages/admin/AdminSchoolDetail';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminContent from './pages/admin/AdminContent';
import AdminManagement from './pages/admin/AdminManagement';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }} />
      <Routes>

        {/* Public + Auth pages (Navbar + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/vacancy" element={<VacancyPage />} />
          <Route path="/terms/teacher" element={<TermsPage role="teacher" />} />
          <Route path="/terms/school" element={<TermsPage role="school" />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute roles={['teacher']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/edit" element={<TeacherEdit />} />
          <Route path="/teacher/apply" element={<TeacherApply />} />
          <Route path="/teacher/history" element={<TeacherHistory />} />
          <Route path="/teacher/status" element={<TeacherStatus />} />
        </Route>

        {/* School Routes */}
        <Route element={<ProtectedRoute roles={['school']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/school" element={<Navigate to="/school/dashboard" replace />} />
          <Route path="/school/dashboard" element={<SchoolDashboard />} />
          <Route path="/school/profile" element={<SchoolProfile />} />
          <Route path="/school/requirements" element={<SchoolRequirements />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/teachers/:id" element={<AdminTeacherDetail />} />
          <Route path="/admin/schools" element={<AdminSchools />} />
          <Route path="/admin/schools/:id" element={<AdminSchoolDetail />} />
          <Route path="/admin/vacancies" element={<AdminVacancies />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/admins" element={<AdminManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
