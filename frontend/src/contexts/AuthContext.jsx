import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('waste_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('waste_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('waste_auth_user', JSON.stringify(res.data));
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('waste_auth_token', newToken);
      localStorage.setItem('waste_auth_user', JSON.stringify(newUser));
      return res;
    }
    throw new Error(res.message || 'Login gagal.');
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch {
      // Ignore logout API error
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('waste_auth_token');
      localStorage.removeItem('waste_auth_user');
    }
  };

  const isAdmin = user?.role === 'Administrator';
  const isStaff = user?.role === 'Staff';

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin,
    isStaff,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

