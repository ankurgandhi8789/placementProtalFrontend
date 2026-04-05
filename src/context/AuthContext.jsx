import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // ================= AUTH STATE =================
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  // ================= MODAL STATE =================
  const [modal, setModal] = useState({ open: false, view: 'login' });

  // ================= EFFECT =================
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      authAPI.getMe()
        .then(({ data }) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ================= AUTH FUNCTIONS =================
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ================= MODAL FUNCTIONS =================
  const openLogin    = () => setModal({ open: true, view: 'login' });
  const openRegister = (role) => setModal({ open: true, view: 'register', role });
  const openReset    = () => setModal({ open: true, view: 'reset' });
  const closeModal   = () => setModal(m => ({ ...m, open: false }));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',

        // modal
        modal,
        openLogin,
        openRegister,
        openReset,
        closeModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Safe Hook (IMPORTANT)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};