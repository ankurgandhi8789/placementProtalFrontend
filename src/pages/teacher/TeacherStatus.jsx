// src/pages/teacher/TeacherStatus.jsx
import { useEffect, useState } from 'react';
import { teacherAPI } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import {
  CheckCircle, Clock, AlertCircle, Calendar,
  Building2, MessageSquare, TrendingUp, Bell
} from 'lucide-react';

const STEPS = [
  { key: 'applied',             label: 'Application Received',  icon: '📝', desc: 'Your profile is registered in our system' },
  { key: 'contacted',           label: 'Contacted by Admin',     icon: '📞', desc: 'Our team has reached out to you' },
  { key: 'test_scheduled',      label: 'Test Scheduled',         icon: '📋', desc: 'A test has been scheduled for you' },
  { key: 'test_completed',      label: 'Test Completed',         icon: '✅', desc: 'Test completed, evaluation in progress' },
  { key: 'interview_scheduled', label: 'Interview Scheduled',    icon: '🤝', desc: 'School interview has been arranged' },
  { key: 'interview_completed', label: 'Interview Completed',    icon: '🎯', desc: 'Interview done, final decision pending' },
  { key: 'assigned',            label: 'Assigned to School',     icon: '🏫', desc: 'You have been placed at a school!' },
  { key: 'completed',           label: 'Placement Completed',    icon: '🎉', desc: 'Your placement process is fully complete' },
];

const TeacherStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getStatus()
      .then(({ data }) => setStatus(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  const currentIdx = STEPS.findIndex(s => s.key === status?.currentStatus);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Track Status</h2>
        <p className="text-gray-400 text-sm mt-1">Monitor your placement pipeline in real time</p>
      </div>

      {/* Current status hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-1">Current Status</p>
            <StatusBadge status={status?.currentStatus || 'applied'} />
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">Step</p>
            <p className="text-white font-black text-2xl">{currentIdx + 1}
              <span className="text-blue-300 text-sm font-medium">/{STEPS.length}</span>
            </p>
          </div>
        </div>
        {/* Mini progress */}
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${((currentIdx + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-blue-200 text-xs mt-2">
          {STEPS[currentIdx]?.label || 'Registered'} — {Math.round(((currentIdx + 1) / STEPS.length) * 100)}% complete
        </p>
      </div>

      {/* Scheduled dates */}
      {(status?.testDate || status?.interviewDate) && (
        <div className="grid grid-cols-2 gap-3">
          {status.testDate && (
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
              <Calendar size={18} className="text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-purple-500 text-[10px] font-bold uppercase tracking-wide">Test Date</p>
                <p className="text-purple-900 font-extrabold text-sm">
                  {new Date(status.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}
          {status.interviewDate && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
              <Calendar size={18} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-amber-500 text-[10px] font-bold uppercase tracking-wide">Interview Date</p>
                <p className="text-amber-900 font-extrabold text-sm">
                  {new Date(status.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin notes */}
      {status?.adminNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <Bell size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-800 text-sm">Admin Message</p>
            <p className="text-blue-700 text-sm mt-0.5">{status.adminNotes}</p>
          </div>
        </div>
      )}

      {/* Step-by-step vertical */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-gray-900 text-sm mb-5 flex items-center gap-2">
          <TrendingUp size={15} className="text-blue-600" />
          Placement Steps
        </h3>

        <div className="space-y-2">
          {STEPS.map((step, idx) => {
            const isDone    = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isPending = idx > currentIdx;
            return (
              <div key={step.key} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                isCurrent ? 'bg-blue-50 border border-blue-100' :
                isDone    ? 'bg-emerald-50 border border-emerald-100' :
                            'bg-gray-50 border border-transparent'
              }`}>
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDone    ? 'bg-emerald-500' :
                  isCurrent ? 'bg-blue-600' :
                              'bg-gray-200'
                }`}>
                  {isDone    ? <CheckCircle size={18} className="text-white" /> :
                   isCurrent ? <span className="text-xl">{step.icon}</span> :
                               <Clock size={16} className="text-gray-400" />}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${
                    isDone ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] font-semibold bg-blue-600 text-white
                        px-2 py-0.5 rounded-full align-middle">
                        You're here
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    isPending ? 'text-gray-300' : isDone ? 'text-emerald-600' : 'text-blue-500'
                  }`}>
                    {step.desc}
                  </p>
                </div>

                {/* Step number */}
                <span className={`text-xs font-bold flex-shrink-0 ${
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-gray-300'
                }`}>
                  {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned school */}
      {status?.assignedSchool && (
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={18} className="text-emerald-200" />
            <p className="font-black text-xl">Congratulations! 🎉</p>
          </div>
          <p className="text-emerald-100 text-sm mb-1">You have been assigned to:</p>
          <p className="font-extrabold text-2xl">{status.assignedSchool.schoolName}</p>
          <p className="text-emerald-200 text-sm mt-0.5">
            {status.assignedSchool.city}, {status.assignedSchool.state}
          </p>
          {status.assignedAt && (
            <p className="text-emerald-300 text-xs mt-3 flex items-center gap-1">
              <Calendar size={11} />
              Assigned on {new Date(status.assignedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          )}
        </div>
      )}

      {/* Rejected */}
      {status?.currentStatus === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800 text-base">Not Selected This Time</p>
            <p className="text-red-600 text-sm mt-1">
              We appreciate your time and effort. You can update your profile and re-apply.
              Our admin team will contact you about future opportunities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStatus;