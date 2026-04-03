import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, School, Briefcase, Image, LogOut, Menu, X, UserPlus, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const navItems = [
  { label: 'Dashboard',        to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Teachers',         to: '/admin/teachers',  icon: Users },
  { label: 'Schools',          to: '/admin/schools',   icon: School },
  { label: 'Vacancies',        to: '/admin/vacancies', icon: Briefcase },
  { label: 'Homepage Content', to: '/admin/content',   icon: Image },
  { label: 'Admins',           to: '/admin/admins',    icon: UserPlus, superOnly: true },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const filtered = navItems.filter(i => !i.superOnly || user?.role === 'superadmin');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Single Navbar — pill floating nav + right panel on avatar click */}
      <Navbar />

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Sidebar — starts below the 80px navbar spacer */}

        {/* <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-blue-900 flex flex-col
          transform transition-transform duration-300 pt-20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:pt-0`}>

          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Maa Savitri</p>
              <p className="text-blue-300 text-xs">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div> */}

          {/* <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {filtered.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}>
                <Icon className="w-4 h-4 flex-shrink-0" /> {label}
              </NavLink>
            ))}
          </nav> */}

          {/* <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-blue-300 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div> */}
        {/* </aside> */}

        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile sidebar trigger only */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 h-11 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-gray-700 font-semibold text-sm">Admin Panel</p>
          </div>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>


    </div>
  );
};

export default AdminLayout;
