import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { schoolAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Other'];
const classLevels = ['Nursery', 'KG', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];

const RequirementForm = ({ onSubmit, defaultValues, onCancel, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })} className="bg-blue-50 rounded-xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
          <select {...register('subject', { required: true })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Level *</label>
          <select {...register('classLevel', { required: true })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
            <option value="">Select level</option>
            {classLevels.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.classLevel && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
          <input {...register('salary', { required: true })} placeholder="e.g. ₹25,000/month"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
          {errors.salary && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input {...register('description')} placeholder="Additional details"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
          <Check className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const SchoolRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequirements = () => {
    schoolAPI.getRequirements().then(({ data }) => setRequirements(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequirements(); }, []);

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await schoolAPI.addRequirement(data);
      toast.success('Requirement added!');
      setShowForm(false);
      fetchRequirements();
    } catch {
      toast.error('Failed to add requirement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await schoolAPI.updateRequirement(editId, data);
      toast.success('Requirement updated!');
      setEditId(null);
      fetchRequirements();
    } catch {
      toast.error('Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this requirement?')) return;
    try {
      await schoolAPI.deleteRequirement(id);
      toast.success('Requirement removed');
      fetchRequirements();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Requirements</h2>
          <p className="text-gray-500 text-sm mt-1">Post and manage your teacher requirements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Requirement
        </button>
      </div>

      {showForm && <RequirementForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} loading={submitting} />}

      {requirements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-500">No requirements posted yet. Add your first requirement!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              {editId === req._id ? (
                <RequirementForm
                  defaultValues={{ subject: req.subject, classLevel: req.classLevel, salary: req.salary, description: req.description }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditId(null)}
                  loading={submitting}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{req.subject}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {req.isActive ? 'Open' : 'Filled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Class: {req.classLevel} • Salary: {req.salary}</p>
                    {req.description && <p className="text-sm text-gray-400 mt-1">{req.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(req._id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(req._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolRequirements;
