// src/pages/teacher/TeacherHistory.jsx
import { useEffect, useState } from 'react';
import { teacherAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  CheckCircle, Clock, AlertCircle, TrendingUp,
  Calendar, MessageSquare, Building2, Star
} from 'lucide-react';

// ─── Full pipeline with descriptions ──────────────────────────────────────
const PIPELINE_MAP = {
  applied:              { label: 'Application Received',      icon: '📝', color: 'gray',   desc: 'Your profile has been registered in our system.' },
  contacted:            { label: 'Admin Contacted You',       icon: '📞', color: 'blue',   desc: 'Our team has reached out to you for initial discussion.' },
  test_scheduled:       { label: 'Test Scheduled',            icon: '📅', color: 'purple', desc: 'A written/practical test has been scheduled for you.' },
  test_completed:       { label: 'Test Completed',            icon: '✅', color: 'indigo', desc: 'You have completed the test. Results under evaluation.' },
  interview_scheduled:  { label: 'Interview Scheduled',       icon: '🤝', color: 'amber',  desc: 'A school interview has been arranged for you.' },
  interview_completed:  { label: 'Interview Completed',       icon: '🎯', color: 'orange', desc: 'Interview done. Final decision pending.' },
  assigned:             { label: 'Assigned to School',        icon: '🏫', color: 'emerald',desc: 'You have been placed at a school.' },
  completed:            { label: 'Placement Completed',       icon: '🎉', color: 'green',  desc: 'Your placement process is successfully completed.' },
  rejected:             { label: 'Not Selected',              icon: '❌', color: 'red',    desc: 'Unfortunately you were not selected this time.' },
};

// Completion % per stage
const STAGE_PCT = {
  applied: 10, contacted: 22, test_scheduled: 38, test_completed: 52,
  interview_scheduled: 65, interview_completed: 78, assigned: 90, completed: 100, rejected: 0,
};

const colorMap = {
  gray:   { dot: 'bg-gray-400',   bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-700',   badge: 'bg-gray-100 text-gray-700' },
  blue:   { dot: 'bg-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700' },
  purple: { dot: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  indigo: { dot: 'bg-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700' },
  amber:  { dot: 'bg-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700' },
  orange: { dot: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  emerald:{ dot: 'bg-emerald-500',bg: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700',badge: 'bg-emerald-100 text-emerald-700' },
  green:  { dot: 'bg-green-500',  bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700' },
  red:    { dot: 'bg-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700' },
};

// ─── Progress Ring ─────────────────────────────────────────────────────────
const ProgressRing = ({ pct, size = 100, stroke = 9 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={pct === 100 ? '#10B981' : pct === 0 ? '#EF4444' : '#2563EB'}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
};

const TeacherHistory = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getStatus()
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  const currentStage = data?.currentStatus || 'applied';
  const pct = STAGE_PCT[currentStage] ?? 10;
  const history = data?.statusHistory || [];
  const currentInfo = PIPELINE_MAP[currentStage] || PIPELINE_MAP['applied'];
  const colors = colorMap[currentInfo.color];

  // Build full ordered pipeline with "reached" flag
  const orderedStages = Object.keys(PIPELINE_MAP).filter(k => k !== 'rejected');
  const currentOrderIdx = orderedStages.indexOf(currentStage);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">My History</h2>
        <p className="text-gray-400 text-sm mt-1">Track every step of your placement journey</p>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={pct} size={90} stroke={8} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-black text-2xl leading-none">{pct}</span>
              <span className="text-blue-200 text-[9px] font-bold">%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentInfo.icon}</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                {currentInfo.label}
              </span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">{currentInfo.desc}</p>
            <p className="text-blue-300 text-[11px] mt-2">
              {currentOrderIdx + 1} of {orderedStages.length} stages completed
            </p>
          </div>
        </div>
      </div>

      {/* Admin notes */}
      {data?.adminNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <MessageSquare size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-800 text-sm">Message from Admin</p>
            <p className="text-blue-700 text-sm mt-0.5">{data.adminNotes}</p>
          </div>
        </div>
      )}

      {/* Assigned school */}
      {data?.assignedSchool && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={18} className="text-emerald-200" />
            <p className="font-black text-lg">You're Placed! 🎉</p>
          </div>
          <p className="text-emerald-100 text-sm">Assigned to:</p>
          <p className="font-extrabold text-xl mt-0.5">{data.assignedSchool.schoolName}</p>
          <p className="text-emerald-200 text-sm">
            {data.assignedSchool.city}, {data.assignedSchool.state}
          </p>
          {data.assignedAt && (
            <p className="text-emerald-300 text-xs mt-2 flex items-center gap-1">
              <Calendar size={11} />
              Assigned on {new Date(data.assignedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      )}

      {/* Scheduled dates */}
      {(data?.testDate || data?.interviewDate) && (
        <div className="grid grid-cols-2 gap-3">
          {data.testDate && (
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
              <p className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-1">📅 Test Date</p>
              <p className="text-purple-900 font-extrabold text-base">
                {new Date(data.testDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-purple-600 text-xs">
                {new Date(data.testDate).toLocaleDateString('en-IN', { year: 'numeric' })}
              </p>
            </div>
          )}
          {data.interviewDate && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-amber-600 font-bold text-xs uppercase tracking-wide mb-1">🤝 Interview</p>
              <p className="text-amber-900 font-extrabold text-base">
                {new Date(data.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-amber-600 text-xs">
                {new Date(data.interviewDate).toLocaleDateString('en-IN', { year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Full pipeline tracker */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-gray-900 text-sm mb-5 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          Placement Pipeline
        </h3>

        <div className="space-y-1">
          {orderedStages.map((stageKey, idx) => {
            const info    = PIPELINE_MAP[stageKey];
            const c       = colorMap[info.color];
            const done    = idx < currentOrderIdx;
            const current = stageKey === currentStage;
            const pending = idx > currentOrderIdx;
            // Find if there's a history entry for this stage
            const histEntry = history.find(h => h.status === stageKey);

            return (
              <div key={stageKey} className="flex gap-3">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                    border-2 transition-all ${
                    done    ? 'bg-emerald-500 border-emerald-500' :
                    current ? `${c.bg} border-current ${c.text} ring-4 ring-offset-1` :
                              'bg-gray-50 border-gray-200'
                  }`}
                    style={current ? { ringColor: 'currentColor' } : {}}>
                    {done    ? <CheckCircle size={16} className="text-white" /> :
                     current ? <span className="text-lg">{info.icon}</span> :
                               <span className="text-gray-300 text-xs font-bold">{idx + 1}</span>}
                  </div>
                  {idx < orderedStages.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 rounded-full transition-colors ${
                      done ? 'bg-emerald-300' : 'bg-gray-100'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-4 ${idx < orderedStages.length - 1 ? 'mb-0' : ''}`}>
                  <div className={`p-3 rounded-xl transition-all ${
                    current ? `${c.bg} border ${c.border}` :
                    done    ? 'bg-emerald-50 border border-emerald-100' :
                              'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-sm ${
                        done ? 'text-emerald-700' : current ? c.text : 'text-gray-400'
                      }`}>
                        {info.label}
                        {current && <span className="ml-2 text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">← Current</span>}
                      </p>
                      {done && <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />}
                      {pending && <Clock size={13} className="text-gray-300 flex-shrink-0" />}
                    </div>
                    {!pending && (
                      <p className={`text-xs mt-0.5 ${done ? 'text-emerald-600' : current ? c.text : 'text-gray-300'}`}>
                        {info.desc}
                      </p>
                    )}
                    {histEntry?.updatedAt && (
                      <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(histEntry.updatedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    )}
                    {histEntry?.note && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{histEntry.note}"</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Rejected state */}
          {currentStage === 'rejected' && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
                  <AlertCircle size={16} className="text-red-500" />
                </div>
              </div>
              <div className="flex-1">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="font-bold text-red-700 text-sm">Application Not Selected</p>
                  <p className="text-red-600 text-xs mt-0.5">
                    Thank you for applying. You may re-apply after updating your profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity log from statusHistory */}
      {history.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Calendar size={15} className="text-blue-600" />
            Activity Log
          </h3>
          <div className="space-y-2">
            {[...history].reverse().map((entry, idx) => {
              const info = PIPELINE_MAP[entry.status] || { icon: '📋', label: entry.status, color: 'gray' };
              const c = colorMap[info.color];
              return (
                <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl ${c.bg} border ${c.border}`}>
                  <span className="text-lg flex-shrink-0">{info.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${c.text}`}>{info.label}</p>
                    {entry.note && <p className="text-xs text-gray-500 mt-0.5 italic">"{entry.note}"</p>}
                  </div>
                  <p className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                    {new Date(entry.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short'
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHistory;