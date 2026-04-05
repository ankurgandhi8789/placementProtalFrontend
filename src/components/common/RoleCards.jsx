import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleCards = () => {
  const { user, openLogin, openRegister } = useAuth();
  const navigate = useNavigate();

  const handleTeacherClick = () => {
    if (!user) {
      // Not logged in → open login modal
      openLogin();
      return;
    }
    // Logged in → go to correct dashboard
    if (user.role === 'teacher') navigate('/teacher/dashboard');
    else if (user.role === 'admin' || user.role === 'superadmin') navigate('/admin/dashboard');
    else openLogin(); // wrong role, ask to login again
  };

  const handleSchoolClick = () => {
    if (!user) {
      openLogin();
      return;
    }
    if (user.role === 'school') navigate('/school/dashboard');
    else if (user.role === 'admin' || user.role === 'superadmin') navigate('/admin/dashboard');
    else openLogin();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

      {/* Teacher Card */}
      <button
        onClick={handleTeacherClick}
        className="relative bg-white rounded-2xl p-6 text-left flex flex-col gap-3
          transition-all duration-300 border-2 border-transparent hover:-translate-y-1.5
          hover:shadow-2xl hover:border-blue-300 overflow-hidden w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20" />

        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl
          bg-gradient-to-br from-blue-600 to-indigo-600 text-white relative z-10">
          👨‍🏫
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-blue-900">I am a Teacher</h2>
          <p className="text-sm text-gray-400 -mt-1">मैं एक शिक्षक हूँ</p>
          <p className="text-sm text-gray-600 mt-1">
            Submit your profile and qualifications to get placed in the right school.
          </p>

          {/* Show "Login required" hint when not logged in */}
          {!user && (
            <p className="text-xs text-blue-500 font-semibold mt-2 flex items-center gap-1">
              🔒 Login required to continue
            </p>
          )}
          {user?.role === 'teacher' && (
            <p className="text-xs text-green-500 font-semibold mt-2 flex items-center gap-1">
              ✅ Go to your dashboard →
            </p>
          )}
        </div>

        <div className="text-xl text-blue-400 mt-1 transition-transform relative z-10">→</div>
      </button>

      {/* School Card */}
      <button
        onClick={handleSchoolClick}
        className="relative bg-white rounded-2xl p-6 text-left flex flex-col gap-3
          transition-all duration-300 border-2 border-transparent hover:-translate-y-1.5
          hover:shadow-2xl hover:border-green-300 overflow-hidden w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20" />

        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl
          bg-gradient-to-br from-green-600 to-blue-600 text-white relative z-10">
          🏫
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-blue-900">I represent a School</h2>
          <p className="text-sm text-gray-400 -mt-1">मैं एक विद्यालय का प्रतिनिधि हूँ</p>
          <p className="text-sm text-gray-600 mt-1">
            Register your school and tell us what teachers you need.
          </p>

          {!user && (
            <p className="text-xs text-blue-500 font-semibold mt-2 flex items-center gap-1">
              🔒 Login required to continue
            </p>
          )}
          {user?.role === 'school' && (
            <p className="text-xs text-green-500 font-semibold mt-2 flex items-center gap-1">
              ✅ Go to your dashboard →
            </p>
          )}
        </div>

        <div className="text-xl text-blue-400 mt-1 relative z-10">→</div>
      </button>

    </div>
  );
};

export default RoleCards;