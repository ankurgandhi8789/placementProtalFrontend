import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Redirects already-logged-in users to their dashboard
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user) {
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'school')  return <Navigate to="/school/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
