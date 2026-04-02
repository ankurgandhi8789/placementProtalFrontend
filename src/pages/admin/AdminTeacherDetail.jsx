import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, FileText, User, BookOpen, Briefcase } from 'lucide-react';

const statuses = ['applied', 'contacted', 'test_scheduled', 'interview', 'assigned', 'completed', 'rejected'];

const AdminTeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const { register: regAssign, handleSubmit: handleAssign } = useForm();

  useEffect(() => {
    Promise.all([adminAPI.getTeacher(id), adminAPI.getSchools({ limit: 100 })])
      .then(([t, s]) => {
        setTeacher(t.data);
        setSchools(s.data.schools);
        setValue('currentStatus', t.data.currentStatus);
        setValue('adminNotes', t.data.adminNotes || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onUpdateStatus = async (data) => {
    setUpdating(true);
    try {
      const updated = await adminAPI.updateTeacherStatus(id, data);
      setTeacher(updated.data);
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const onAssign = async (data) => {
    if (!data.schoolId) return toast.error('Select a school');
    setAssigning(true);
    try {
      const updated = await adminAPI.assignTeacher(id, data);
      setTeacher(updated.data);
      toast.success('Teacher assigned to school!');
    } catch {
      toast.error('Failed to assign teacher');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (!teacher) return <div className="text-center py-12 text-gray-400">Teacher not found</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{teacher.user?.name}</h2>
          <p className="text-gray-500 text-sm">{teacher.user?.email}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={teacher.currentStatus} /></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Teacher Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-blue-600" /> Profile</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Phone', value: teacher.user?.phone || teacher.phone || '—' },
              { label: 'City', value: teacher.city || '—' },
              { label: 'State', value: teacher.state || '—' },
              { label: 'Experience', value: teacher.experienceYears ? `${teacher.experienceYears} years` : '—' },
              { label: 'Expected Salary', value: teacher.expectedSalary || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          {teacher.subjects?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><BookOpen className="w-4 h-4" /> Subjects</p>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.map(s => <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{s}</span>)}
              </div>
            </div>
          )}

          {teacher.resume && (
            <a href={teacher.resume} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors w-fit">
              <FileText className="w-4 h-4" /> View Resume
            </a>
          )}

          {teacher.education?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Education</p>
              {teacher.education.map((edu, i) => (
                <div key={i} className="text-sm text-gray-600 py-1 border-b border-gray-50">
                  <span className="font-medium">{edu.degree}</span> — {edu.institution} ({edu.year})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Controls */}
        <div className="space-y-4">
          {/* Update Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600" /> Update Status</h3>
            <form onSubmit={handleSubmit(onUpdateStatus)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select {...register('currentStatus')} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea {...register('adminNotes')} rows={3} placeholder="Notes for the teacher..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>
              <button type="submit" disabled={updating}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm">
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </form>
          </div>

          {/* Assign to School */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assign to School</h3>
            {teacher.assignedSchool && (
              <div className="mb-3 p-3 bg-green-50 rounded-xl text-sm text-green-700">
                Currently assigned: <strong>{teacher.assignedSchool.schoolName}</strong>
              </div>
            )}
            <form onSubmit={handleAssign(onAssign)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select School</label>
                <select {...regAssign('schoolId')} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Select a school...</option>
                  {schools.map(s => <option key={s._id} value={s._id}>{s.schoolName} — {s.city}</option>)}
                </select>
              </div>
              <button type="submit" disabled={assigning}
                className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 text-sm">
                {assigning ? 'Assigning...' : 'Assign Teacher'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherDetail;
