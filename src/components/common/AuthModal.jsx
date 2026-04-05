import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  X, Eye, EyeOff, GraduationCap, School,
  Mail, ArrowLeft, LogIn, UserPlus, KeyRound,
} from 'lucide-react';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

// ─── small shared input ───────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
  </div>
);

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 ' +
  'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white';

// ─── LOGIN VIEW ───────────────────────────────────────────
const LoginView = ({ onSwitch, onClose }) => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authAPI.login(data);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      onClose();
      const role = res.user.role;
      if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'school') navigate('/school/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <LogIn className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Welcome Back</h2>
        <p className="text-gray-400 text-xs mt-0.5">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email Address" error={errors.email?.message}>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            placeholder="your@email.com"
            className={inputCls}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => onSwitch('reset')}
            className="text-[11px] text-blue-600 font-semibold hover:underline mt-1 block text-right w-full"
          >
            Forgot password?
          </button>
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-xl py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      {/* Demo creds */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-[11px] text-blue-700 font-bold mb-0.5">Demo Credentials</p>
        <p className="text-[11px] text-blue-500">superadmin@maasavitri.com / Admin@123</p>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Don't have an account?{' '}
        <button onClick={() => onSwitch('register')} className="text-blue-600 font-bold hover:underline">
          Register here
        </button>
      </p>
    </>
  );
};

// ─── REGISTER VIEW ────────────────────────────────────────
const RegisterView = ({ onSwitch, onClose, defaultRole = 'teacher' }) => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
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
      onClose();
      if (res.user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/school/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Create Account</h2>
        <p className="text-gray-400 text-xs mt-0.5">Join Maa Savitri Consultancy Services</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Role toggle */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            I am a…
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue('role', 'teacher')}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                role === 'teacher'
                  ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                role === 'teacher' ? 'bg-blue-600' : 'bg-gray-100'
              }`}>
                <GraduationCap className={`w-4 h-4 ${role === 'teacher' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-bold ${role === 'teacher' ? 'text-blue-600' : 'text-gray-500'}`}>
                Teacher
              </span>
            </button>

            <button
              type="button"
              onClick={() => setValue('role', 'school')}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                role === 'school'
                  ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-200 bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                role === 'school' ? 'bg-amber-400' : 'bg-gray-100'
              }`}>
                <School className={`w-4 h-4 ${role === 'school' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <span className={`text-sm font-bold ${role === 'school' ? 'text-amber-600' : 'text-gray-500'}`}>
                School
              </span>
            </button>
          </div>
          <input type="hidden" {...register('role')} />
        </div>

        <Field label={role === 'school' ? 'Contact Person Name' : 'Full Name'} error={errors.name?.message}>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter your full name"
            className={inputCls}
          />
        </Field>

        {role === 'school' && (
          <Field label="School Name" error={errors.schoolName?.message}>
            <input
              {...register('schoolName', { required: 'School name is required' })}
              placeholder="Enter school name"
              className={inputCls}
            />
          </Field>
        )}

        <Field label="Email Address" error={errors.email?.message}>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
            })}
            type="email"
            placeholder="your@email.com"
            className={inputCls}
          />
        </Field>

        <Field label="Phone Number">
          <input
            {...register('phone')}
            placeholder="+91 98765 43210"
            className={inputCls}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl py-2.5 font-bold text-sm transition-colors disabled:opacity-60 ${
            role === 'school'
              ? 'bg-amber-400 text-gray-900 hover:bg-amber-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating Account…' : `Register as ${role === 'school' ? 'School' : 'Teacher'}`}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Already have an account?{' '}
        <button onClick={() => onSwitch('login')} className="text-blue-600 font-bold hover:underline">
          Sign in
        </button>
      </p>
    </>
  );
};

// ─── FORGOT / RESET PASSWORD VIEW ────────────────────────
const ResetView = ({ onSwitch }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => onSwitch('login')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to login
      </button>

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <KeyRound className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-400 text-xs mt-0.5">We'll send a reset link to your email</p>
      </div>

      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-gray-700 font-semibold text-sm">Check your inbox!</p>
          <p className="text-gray-400 text-xs mt-1">A password reset link has been sent.</p>
          <button
            onClick={() => onSwitch('login')}
            className="mt-5 text-blue-600 text-xs font-bold hover:underline"
          >
            Back to login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email Address" error={errors.email?.message}>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="your@email.com"
              className={inputCls}
            />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN MODAL SHELL
// ══════════════════════════════════════════════════════════
const AuthModal = () => {
  const { modal, closeModal } = useAuthModal();
  const [view, setView] = useState('login');

  // sync view when modal opens from outside (e.g. "Register as Teacher" button)
  useEffect(() => {
    if (modal.open) setView(modal.view || 'login');
  }, [modal.open, modal.view]);

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeModal]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = modal.open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal.open]);

  if (!modal.open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden
          animate-[modalIn_.25s_cubic-bezier(.4,0,.2,1)]"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '92vh' }}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-7" style={{ maxHeight: '92vh' }}>
          {view === 'login'    && <LoginView    onSwitch={setView} onClose={closeModal} />}
          {view === 'register' && <RegisterView onSwitch={setView} onClose={closeModal} defaultRole={modal.role || 'teacher'} />}
          {view === 'reset'    && <ResetView    onSwitch={setView} />}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)  translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;