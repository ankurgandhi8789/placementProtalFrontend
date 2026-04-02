// src/pages/teacher/TeacherProfile.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  User, Phone, Mail, MapPin, BookOpen, GraduationCap,
  Briefcase, FileText, Edit3, ExternalLink, CheckCircle,
  Calendar, Award, ClipboardList
} from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, color = 'gray' }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon size={14} className={`text-${color}-600`} />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const Tag = ({ label, color = 'blue' }) => {
  const colors = {
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber:  'bg-amber-100 text-amber-700',
    emerald:'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${colors[color]}`}>
      {label}
    </span>
  );
};

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getProfile()
      .then(({ data }) => setProfile(data.profile || data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-400">No profile found.</div>;

  return (
    <div className="max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">My Profile</h2>
          <p className="text-gray-400 text-sm mt-0.5">Your full teacher profile</p>
        </div>
        <Link to="/teacher/edit"
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600
            bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
          <Edit3 size={14} /> Edit Info
        </Link>
      </div>

      {/* Avatar + name card */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full ring-2 ring-white/30 overflow-hidden flex-shrink-0 bg-white/20">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={28} className="text-white/60" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-black text-xl leading-tight">{profile.fullName}</h3>
            <p className="text-blue-200 text-sm mt-0.5">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge status={profile.currentStatus || 'applied'} />
              {profile.isVerified && (
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/teacher/apply"
          className="flex items-center gap-2.5 bg-white border border-blue-100 rounded-2xl p-4
            hover:shadow-md hover:border-blue-200 transition-all group">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ClipboardList size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Edit Application</p>
            <p className="text-gray-400 text-xs">Update full form</p>
          </div>
        </Link>
        <Link to="/teacher/history"
          className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-4
            hover:shadow-md hover:border-blue-200 transition-all group">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">View History</p>
            <p className="text-gray-400 text-xs">Track progress</p>
          </div>
        </Link>
      </div>

      {/* Personal info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <User size={14} className="text-blue-600" /> Personal Information
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoRow icon={Phone} label="Phone" value={profile.phone} color="blue" />
          {profile.alternatePhone && <InfoRow icon={Phone} label="Alt. Phone" value={profile.alternatePhone} color="blue" />}
          <InfoRow icon={Mail} label="Email" value={profile.email} color="indigo" />
          <InfoRow icon={Calendar} label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN') : null} color="purple" />
          <InfoRow icon={User} label="Gender" value={profile.gender?.charAt(0).toUpperCase() + profile.gender?.slice(1)} color="gray" />
          <InfoRow icon={MapPin} label="City & State" value={[profile.city, profile.state].filter(Boolean).join(', ')} color="emerald" />
          {profile.currentAddress && (
            <div className="sm:col-span-2">
              <InfoRow icon={MapPin} label="Current Address" value={profile.currentAddress} color="emerald" />
            </div>
          )}
        </div>
      </div>

      {/* Teaching info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <BookOpen size={14} className="text-blue-600" /> Teaching Information
        </h4>
        {profile.subjects?.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Subjects</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.subjects.map(s => <Tag key={s} label={s} color="blue" />)}
            </div>
          </div>
        )}
        {profile.classLevels?.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Class Levels</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.classLevels.map(cl => <Tag key={cl} label={cl} color="purple" />)}
            </div>
          </div>
        )}
        {profile.teachingQualifications?.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Teaching Qualifications</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.teachingQualifications.map(q => <Tag key={q} label={q} color="amber" />)}
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
          <InfoRow icon={Briefcase} label="Experience" value={profile.experienceYears ? `${profile.experienceYears} years` : null} color="amber" />
          <InfoRow icon={Award} label="Expected Salary" value={profile.expectedSalary} color="emerald" />
        </div>
      </div>

      {/* Education */}
      {profile.education?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <GraduationCap size={14} className="text-blue-600" /> Education
          </h4>
          <div className="space-y-3">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{edu.degree}</p>
                  {edu.specialization && <p className="text-blue-600 text-xs font-medium">{edu.specialization}</p>}
                  <p className="text-gray-600 text-xs mt-0.5">{edu.institution}</p>
                  {edu.boardOrUniversity && <p className="text-gray-400 text-xs">{edu.boardOrUniversity}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    {edu.yearOfPassing && <span className="text-xs text-gray-500">{edu.yearOfPassing}</span>}
                    {edu.percentage && <span className="text-xs text-emerald-600 font-semibold">{edu.percentage}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {profile.experiences?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Briefcase size={14} className="text-blue-600" /> Work Experience
          </h4>
          <div className="space-y-3">
            {profile.experiences.map((exp, idx) => (
              <div key={idx} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="font-bold text-gray-900 text-sm">{exp.schoolName}</p>
                <p className="text-amber-700 text-xs font-semibold">{exp.role}</p>
                {exp.subject && <p className="text-gray-500 text-xs">{exp.subject}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                  {' — '}
                  {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume */}
      {profile.resume && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <FileText size={14} className="text-blue-600" /> Resume
          </h4>
          <a href={profile.resume} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl
              hover:bg-blue-100 transition-colors group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-700 text-sm">
                {profile.resumeOriginalName || 'View Resume'}
              </p>
              <p className="text-blue-400 text-xs">Click to open PDF</p>
            </div>
            <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600" />
          </a>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;