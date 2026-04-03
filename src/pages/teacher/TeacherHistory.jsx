import { useEffect, useState } from 'react';
import { teacherAPI } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import {
  CheckCircle, Clock, TrendingUp, FileText,
  BookOpen, GraduationCap, Briefcase, Calendar,
  User, MapPin, Award
} from 'lucide-react';

const PIPELINE = [
  { key: 'applied',        label: 'Application Received', icon: '📝', color: 'gray' },
  { key: 'contacted',      label: 'Contacted by Admin',   icon: '📞', color: 'blue' },
  { key: 'test_scheduled', label: 'Test Scheduled',       icon: '📋', color: 'purple' },
  { key: 'interview',      label: 'Interview',            icon: '🤝', color: 'amber' },
  { key: 'assigned',       label: 'Assigned to School',   icon: '🏫', color: 'emerald' },
  { key: 'completed',      label: 'Placement Completed',  icon: '🎉', color: 'green' },
];

const Section = ({ icon: Icon, title, color = 'blue', children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h4 className={`font-bold text-gray-900 text-sm mb-4 flex items-center gap-2`}>
      <Icon size={15} className={`text-${color}-600`} /> {title}
    </h4>
    {children}
  </div>
);

const TeacherHistory = () => {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([teacherAPI.getProfile(), teacherAPI.getStatus()])
      .then(([p, s]) => {
        setProfile(p.data.profile || p.data);
        setStatus(s.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const currentIdx = PIPELINE.findIndex(s => s.key === status?.currentStatus);
  const pct = Math.round(((currentIdx + 1) / PIPELINE.length) * 100);

  // Completion checklist
  const checks = [
    { label: 'Basic Info Filled',       done: !!(profile?.fullName && profile?.phone) },
    { label: 'Profile Photo Uploaded',  done: !!profile?.profilePhoto },
    { label: 'Subjects Selected',       done: profile?.subjects?.length > 0 },
    { label: 'Class Levels Selected',   done: profile?.classLevels?.length > 0 },
    { label: 'Education Added',         done: profile?.education?.length > 0 },
    { label: 'Resume Uploaded',         done: !!profile?.resume },
    { label: 'Experience Added',        done: profile?.experienceYears > 0 },
    { label: 'Application Submitted',   done: !!profile?.isProfileComplete },
  ];
  const completedChecks = checks.filter(c => c.done).length;
  const checkPct = Math.round((completedChecks / checks.length) * 100);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">My History</h2>
        <p className="text-gray-400 text-sm mt-1">Track your application progress and history</p>
      </div>

      {/* Overall progress card */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-1">Placement Progress</p>
            <StatusBadge status={status?.currentStatus || 'applied'} />
          </div>
          <div className="text-right">
            <p className="text-amber-400 font-black text-3xl">{pct}%</p>
            <p className="text-blue-300 text-xs">Pipeline complete</p>
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-blue-200 text-xs mt-2">
          Step {currentIdx + 1} of {PIPELINE.length} — {PIPELINE[currentIdx]?.label || 'Registered'}
        </p>
      </div>

      {/* Profile completion checklist */}
      <Section icon={TrendingUp} title={`Profile Checklist (${completedChecks}/${checks.length} done)`} color="blue">
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Completion</span>
            <span className="font-bold text-blue-600">{checkPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
              style={{ width: `${checkPct}%` }} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {checks.map(({ label, done }) => (
            <div key={label} className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm ${
              done ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50 border border-gray-100'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                done ? 'bg-emerald-500' : 'bg-gray-200'
              }`}>
                {done
                  ? <CheckCircle size={12} className="text-white" />
                  : <Clock size={11} className="text-gray-400" />}
              </div>
              <span className={`text-xs font-medium ${done ? 'text-emerald-700' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Pipeline history */}
      <Section icon={TrendingUp} title="Placement Pipeline History" color="blue">
        <div className="space-y-2">
          {PIPELINE.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={step.key} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCurrent ? 'bg-blue-50 border border-blue-100' :
                isDone ? 'bg-emerald-50 border border-emerald-100' :
                'bg-gray-50 border border-transparent'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${
                  isDone ? 'bg-emerald-500' : isCurrent ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {isDone
                    ? <CheckCircle size={16} className="text-white" />
                    : <span>{step.icon}</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    isDone ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                </div>
                <span className={`text-xs font-bold ${
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-gray-300'
                }`}>
                  {idx + 1}/{PIPELINE.length}
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Saved profile snapshot */}
      {profile && (
        <Section icon={User} title="Saved Application Snapshot" color="blue">
          <div className="space-y-3 text-sm">
            {[
              { icon: User,      label: 'Name',       value: profile.fullName },
              { icon: MapPin,    label: 'Location',   value: [profile.city, profile.state].filter(Boolean).join(', ') },
              { icon: BookOpen,  label: 'Subjects',   value: profile.subjects?.join(', ') },
              { icon: Award,     label: 'Experience', value: profile.experienceYears ? `${profile.experienceYears} years` : null },
              { icon: Calendar,  label: 'Expected Salary', value: profile.expectedSalary },
            ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-800 font-medium text-sm mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Education history */}
          {profile.education?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                <GraduationCap size={11} /> Education History
              </p>
              <div className="space-y-2">
                {profile.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-blue-50 rounded-xl">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={13} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{edu.degree} {edu.specialization && `— ${edu.specialization}`}</p>
                      <p className="text-gray-500 text-xs">{edu.institution}</p>
                      {edu.yearOfPassing && <p className="text-gray-400 text-[10px]">{edu.yearOfPassing} {edu.percentage && `• ${edu.percentage}%`}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work experience history */}
          {profile.experiences?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                <Briefcase size={11} /> Work Experience History
              </p>
              <div className="space-y-2">
                {profile.experiences.map((exp, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-amber-50 rounded-xl">
                    <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase size={13} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{exp.schoolName}</p>
                      <p className="text-amber-700 text-xs font-medium">{exp.role} {exp.subject && `• ${exp.subject}`}</p>
                      <p className="text-gray-400 text-[10px]">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                        {' — '}
                        {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume */}
          {profile.resume && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a href={profile.resume} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700 text-sm">{profile.resumeOriginalName || 'View Resume'}</p>
                  <p className="text-emerald-500 text-xs">Click to open PDF</p>
                </div>
              </a>
            </div>
          )}
        </Section>
      )}

      {/* Admin notes */}
      {status?.adminNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-blue-800 text-sm">Admin Notes</p>
            <p className="text-blue-700 text-sm mt-0.5">{status.adminNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHistory;
