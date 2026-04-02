import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, GraduationCap, School } from 'lucide-react';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'teacher';

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { role: defaultRole },
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const role = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authAPI.register(data);
      login(res.token, res.user);
      toast.success('Account created successfully!');
      if (res.user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/school/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Maa Savitri Consultancy Services</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selector — "I am a..." */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Teacher Card */}
                <button
                  type="button"
                  onClick={() => setValue('role', 'teacher')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === 'teacher'
                      ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'teacher' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    <GraduationCap className={`w-5 h-5 ${role === 'teacher' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className={`text-sm font-semibold ${role === 'teacher' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Teacher
                  </span>
                </button>

                {/* School Card */}
                <button
                  type="button"
                  onClick={() => setValue('role', 'school')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === 'school'
                      ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'school' ? 'bg-amber-400' : 'bg-gray-100'}`}>
                    <School className={`w-5 h-5 ${role === 'school' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className={`text-sm font-semibold ${role === 'school' ? 'text-amber-600' : 'text-gray-600'}`}>
                    School
                  </span>
                </button>
              </div>
              <input type="hidden" {...register('role')} />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {role === 'school' ? 'Contact Person Name' : 'Full Name'}
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* School Name (conditional) */}
            {role === 'school' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  School Name
                </label>
                <input
                  {...register('schoolName', { required: 'School name is required' })}
                  placeholder="Enter school name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
                type="email"
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Phone Number
              </label>
              <input
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-bold text-sm transition-colors disabled:opacity-60 mt-2 ${
                role === 'school'
                  ? 'bg-amber-400 text-gray-900 hover:bg-amber-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'school' ? 'School' : 'Teacher'}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
