import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { LogOut, Menu, X, School, User, FileText, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const schoolNav = [
  { label: 'Dashboard',      to: '/school/dashboard',    icon: LayoutDashboard },
  { label: 'School Profile', to: '/school/profile',      icon: User },
  { label: 'Requirements',   to: '/school/requirements', icon: FileText },
];



const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user?.role === 'teacher';
  const isSchool = user?.role === 'school';

  // Teacher — single Navbar (pill + right panel with all teacher data on avatar click)
  if (isTeacher) {
    return (
      <div className="min-h-screen bg-[#EEF2FF]"
        style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(37,99,235,0.06) 0%, transparent 50%)' }}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    );
  }

  if (isSchool) {
    return (
      <div className="min-h-screen bg-[#EEF2FF]"
        style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(37,99,235,0.06) 0%, transparent 50%)' }}>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    );
  }

  // School — single Navbar on top + left sidebar below
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-80px)]">
        <SchoolSidebar open={sidebarOpen} setOpen={setSidebarOpen} user={user} logout={logout} navigate={navigate} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile sidebar trigger */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 h-11 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-gray-700 font-semibold text-sm">School Portal</p>
          </div>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
