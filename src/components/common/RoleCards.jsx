import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, School } from 'lucide-react';

const RoleCards = () => {
  const { user, openLogin } = useAuth();
  const navigate = useNavigate();

  const handleTeacherClick = () => {
    if (!user) {
      openLogin();
      return;
    }
    if (user.role === 'teacher') navigate('/teacher/dashboard');
    else if (user.role === 'admin' || user.role === 'superadmin') navigate('/admin/dashboard');
    else openLogin();
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
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={handleTeacherClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg text-sm"
      >
        <GraduationCap className="w-4 h-4" />
        Teacher (Apply Here) For Job
      </button>

      <button
        onClick={handleSchoolClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-900 font-semibold rounded-lg hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg text-sm"
      >
        <School className="w-4 h-4" />
        School/Institute Post your Requirements
      </button>
    </div>
  );
};

export default RoleCards;
