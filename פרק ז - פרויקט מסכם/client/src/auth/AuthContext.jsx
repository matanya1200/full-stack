// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  // Fetch user info from server if token exists
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.whoAmI();
      if (res.status === 403) throw new Error('not authenticated');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Call this after successful login
  const login = async (token) => {
    localStorage.setItem('token', token);
    await fetchUser();
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAdmin: !!user && user.role === 'admin',
    isStoreKeeper: !!user && user.role === 'storekeeper',
    isWorker: !!user && user.role === 'worker',
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser: fetchUser,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);