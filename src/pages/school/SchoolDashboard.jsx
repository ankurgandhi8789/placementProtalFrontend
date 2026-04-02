import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { schoolAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { School, FileText, Plus, ArrowRight, CheckCircle } from 'lucide-react';

const SchoolDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([schoolAPI.getProfile(), schoolAPI.getRequirements()])
      .then(([p, r]) => { setProfile(p.data); setRequirements(r.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" />;

  const activeReqs = requirements.filter(r => r.isActive).length;
  const filledReqs = requirements.filter(r => !r.isActive).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">School Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your teacher requirements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Active Requirements', value: activeReqs, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: CheckCircle, label: 'Filled Positions', value: filledReqs, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: School, label: 'Total Posted', value: requirements.length, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className={`font-bold text-2xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {profile?.isVerified && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700 font-medium">Your school is verified by admin</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/school/requirements" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Post Requirement</p>
              <p className="text-gray-400 text-xs">Add new teacher requirement</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
        </Link>
        <Link to="/school/profile" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <School className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">School Profile</p>
              <p className="text-gray-400 text-xs">Update school information</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-600 transition-colors" />
        </Link>
      </div>

      {/* Recent Requirements */}
      {requirements.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Requirements</h3>
          <div className="space-y-3">
            {requirements.slice(0, 3).map((req) => (
              <div key={req._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{req.subject} — {req.classLevel}</p>
                  <p className="text-gray-400 text-xs">{req.salary} • {req.description?.slice(0, 40)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${req.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {req.isActive ? 'Open' : 'Filled'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolDashboard;
