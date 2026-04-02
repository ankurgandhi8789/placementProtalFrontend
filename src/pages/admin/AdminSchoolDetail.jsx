import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, CheckCircle, XCircle, MapPin, Phone, Mail, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getSchool(id).then(({ data }) => setSchool(data)).finally(() => setLoading(false));
  }, [id]);

  const handleVerify = async () => {
    try {
      const updated = await adminAPI.verifySchool(id, { isVerified: !school.isVerified });
      setSchool(updated.data);
      toast.success(`School ${!school.isVerified ? 'verified' : 'unverified'}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (!school) return <div className="text-center py-12 text-gray-400">School not found</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          {school.logo ? <img src={school.logo} alt="" className="w-12 h-12 rounded-xl object-cover" /> :
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold text-xl">
              {school.schoolName?.[0]?.toUpperCase()}
            </div>}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{school.schoolName}</h2>
            <p className="text-gray-500 text-sm">{school.city}, {school.state}</p>
          </div>
        </div>
        <button onClick={handleVerify}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${school.isVerified ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
          {school.isVerified ? <><XCircle className="w-4 h-4" /> Unverify</> : <><CheckCircle className="w-4 h-4" /> Verify School</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">School Information</h3>
          <div className="space-y-3 text-sm">
            {[
              { icon: Phone, label: 'Phone', value: school.phone || '—' },
              { icon: Mail, label: 'Email', value: school.email || '—' },
              { icon: MapPin, label: 'Address', value: school.address || '—' },
              { icon: Globe, label: 'Website', value: school.website || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 w-20">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 py-2 border-b border-gray-50">
              <span className="text-gray-500 w-20">Type</span>
              <span className="font-medium text-gray-900 capitalize">{school.schoolType || '—'}</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="text-gray-500 w-20">Board</span>
              <span className="font-medium text-gray-900">{school.board || '—'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Requirements ({school.requirements?.length || 0})</h3>
          {school.requirements?.length === 0 ? (
            <p className="text-gray-400 text-sm">No requirements posted</p>
          ) : (
            <div className="space-y-3">
              {school.requirements?.map((req) => (
                <div key={req._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{req.subject}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${req.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {req.isActive ? 'Open' : 'Filled'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{req.classLevel} • {req.salary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSchoolDetail;
