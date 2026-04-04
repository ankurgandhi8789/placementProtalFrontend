import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, School, Briefcase, Image,
  UserCog, LogOut, ChevronRight, X, Crown, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: Users, label: 'Teachers', to: '/admin/teachers' },
  { icon: School, label: 'Schools', to: '/admin/schools' },
  { icon: Briefcase, label: 'Vacancies', to: '/admin/vacancies' },
  { icon: Image, label: 'Content', to: '/admin/content' },
  { icon: UserCog, label: 'Admins', to: '/admin/admins', superOnly: true },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = user?.role === 'superadmin';
  const visibleNav = NAV.filter(i => !i.superOnly || isSuperAdmin);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (user?.name || 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ✅ Your existing navbar */}
      <Navbar onProfileClick={() => setOpen(true)} />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Right Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white
        transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className={`p-5 ${
          isSuperAdmin
            ? 'bg-gradient-to-br from-purple-800 to-purple-600'
            : 'bg-gradient-to-br from-blue-800 to-blue-600'
        } text-white`}>

          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="text-xs opacity-80">{user?.email}</p>
            </div>
          </div>

          <div className="mt-3 text-xs flex items-center gap-1">
            {isSuperAdmin ? <Crown size={12}/> : <Shield size={12}/>}
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-1">
          {visibleNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}

          <hr className="my-3" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}