import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, LayoutDashboard, User, Activity, FileText, Settings,
  LogOut, ChevronRight, Bell, Shield, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from './StatusBadge';

const teacherLinks = [
  { icon: LayoutDashboard, label: 'Dashboard',  to: '/teacher/dashboard', color: 'text-blue-600',    bg: 'bg-blue-50' },
  { icon: User,            label: 'My Profile', to: '/teacher/profile',   color: 'text-purple-600',  bg: 'bg-purple-50' },
  { icon: Activity,        label: 'My Status',  to: '/teacher/status',    color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const schoolLinks = [
  { icon: LayoutDashboard, label: 'Dashboard',    to: '/school/dashboard',    color: 'text-blue-600',   bg: 'bg-blue-50' },
  { icon: User,            label: 'School Profile', to: '/school/profile',    color: 'text-amber-600',  bg: 'bg-amber-50' },
  { icon: FileText,        label: 'Requirements', to: '/school/requirements', color: 'text-teal-600',   bg: 'bg-teal-50' },
];

const adminLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard', color: 'text-blue-600',    bg: 'bg-blue-50' },
  { icon: User,            label: 'Teachers',  to: '/admin/teachers',  color: 'text-purple-600',  bg: 'bg-purple-50' },
  { icon: FileText,        label: 'Schools',   to: '/admin/schools',   color: 'text-amber-600',   bg: 'bg-amber-50' },
  { icon: Activity,        label: 'Vacancies', to: '/admin/vacancies', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const roleColors = {
  teacher:    { ring: 'ring-blue-400',   badge: 'bg-blue-600',   label: 'bg-blue-100 text-blue-700' },
  school:     { ring: 'ring-amber-400',  badge: 'bg-amber-500',  label: 'bg-amber-100 text-amber-700' },
  admin:      { ring: 'ring-purple-400', badge: 'bg-purple-600', label: 'bg-purple-100 text-purple-700' },
  superadmin: { ring: 'ring-red-400',    badge: 'bg-red-600',    label: 'bg-red-100 text-red-700' },
};

const ProfilePanel = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const links =
    user.role === 'teacher' ? teacherLinks
    : user.role === 'school' ? schoolLinks
    : adminLinks;

  const colors = roleColors[user.role] || roleColors.admin;

  const handleLogout = () => { logout(); navigate('/'); onClose?.(); };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-3 top-20 z-50 w-72 flex flex-col gap-3 animate-in slide-in-from-right-4 duration-200">

        {/* ── Card 1: Avatar + Identity ─────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Gradient header strip */}
          <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-900 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Avatar — overlaps the strip */}
          <div className="px-5 pb-5">
            <div className="flex items-end gap-3 -mt-8 mb-3">
              <div className={`w-16 h-16 rounded-2xl ${colors.badge} flex items-center justify-center text-white text-2xl font-extrabold ring-4 ring-white shadow-lg flex-shrink-0`}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="pb-1 min-w-0">
                <p className="font-extrabold text-gray-900 text-sm truncate">{user.name}</p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>

            {/* Role badge + status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colors.label}`}>
                <Shield className="w-3 h-3" />
                {user.role}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Card 2: Navigation Links ──────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Navigation</p>
          </div>
          <div className="px-2 pb-2 space-y-0.5">
            {links.map(({ icon: Icon, label, to, color, bg }) => (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">{label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Card 3: Quick Actions ─────────────────────── */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Account</p>
          </div>
          <div className="px-2 pb-2 space-y-0.5">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 text-left">Notifications</span>
              <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 text-left">Help & Support</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500" />
            </button>

            <div className="mx-2 my-1 border-t border-gray-100" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-red-500 flex-1 text-left">Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default ProfilePanel;
