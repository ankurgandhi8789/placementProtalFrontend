import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {
  Activity, User, Edit3, ClipboardList, History,
  TrendingUp, LogOut, ChevronRight, X, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';

const SIDEBAR_ITEMS = [
  { icon: Activity,      label: 'Dashboard',    to: '/teacher/dashboard', key: 'dashboard' },
  { icon: User,          label: 'My Profile',   to: '/teacher/profile',   key: 'profile'   },
  { icon: Edit3,         label: 'Edit Info',    to: '/teacher/edit',      key: 'edit'      },
  { icon: ClipboardList, label: 'Application',  to: '/teacher/apply',     key: 'apply'     },
  { icon: History,       label: 'My History',   to: '/teacher/history',   key: 'history'   },
  { icon: TrendingUp,    label: 'Track Status', to: '/teacher/status',    key: 'status'    },
];

const calcCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    !!profile.phone, !!profile.gender, !!profile.dateOfBirth,
    !!profile.currentAddress, profile.subjects?.length > 0,
    profile.classLevels?.length > 0, profile.education?.length > 0,
    !!profile.profilePhoto, !!profile.resume, profile.experienceYears >= 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// ── Right Floating Sidebar (shared across all teacher pages) ──────────────
export const TeacherSidebar = ({ open, onClose, profile, user, onLogout }) => {
  const initials = (user?.name || 'T')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const completion = calcCompletion(profile);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white flex flex-col
          rounded-l-[22px] overflow-hidden
          transition-transform duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ boxShadow: '-8px 0 40px rgba(37,99,235,0.18)' }}
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-600 px-5 pt-6 pb-5 flex-shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25
              flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {profile?.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/40" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/20 ring-2 ring-white/40
                  flex items-center justify-center text-white font-black text-xl">
                  {initials}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-blue-700" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-extrabold text-[15px] leading-tight truncate">
                {user?.name || 'Teacher'}
              </p>
              <p className="text-blue-200 text-[11px] mt-0.5 truncate">{user?.email}</p>
              <span className="inline-flex items-center gap-1 bg-white/15 border border-white/25
                rounded-full px-2 py-0.5 text-white/90 text-[10px] font-semibold mt-1">
                🎓 Teacher
              </span>
            </div>
          </div>

          {/* Completion bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">
                Profile Complete
              </span>
              <span className="text-white font-bold text-[11px]">{completion}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[.7px] mb-2 ml-2">Menu</p>

          {SIDEBAR_ITEMS.map(item => (
            <NavLink
              key={item.key}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                transition-all mb-0.5 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0
                    ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <item.icon size={15} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight size={13} className={isActive ? 'text-blue-400' : 'text-gray-300'} />
                </>
              )}
            </NavLink>
          ))}

          <div className="h-px bg-gray-100 my-3" />

          {/* Status card */}
          {profile?.currentStatus && (
            <div className="mx-1 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                Current Status
              </p>
              <StatusBadge status={profile.currentStatus} />
            </div>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px]
              font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-[10px] bg-red-50 flex items-center justify-center">
              <LogOut size={15} className="text-red-500" />
            </span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// ── Top bar trigger button (used on every teacher page) ───────────────────
export const TeacherTopBar = ({ title, user, profile, onOpenSidebar }) => (
  <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3
    flex items-center justify-between sticky top-[72px] z-30">
    <div className="flex items-center gap-2">
      <Activity size={15} className="text-blue-600" />
      <span className="text-sm font-bold text-gray-700">{title}</span>
    </div>
    <button
      onClick={onOpenSidebar}
      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5
        rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors"
    >
      {profile?.profilePhoto ? (
        <img src={profile.profilePhoto} alt="" className="w-5 h-5 rounded-full object-cover" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-black">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      )}
      <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
      <Menu size={13} />
    </button>
  </div>
);
