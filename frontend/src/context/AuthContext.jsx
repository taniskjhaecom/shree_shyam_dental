import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('ssd_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ssd_admin_token') || null);
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        setToken(token);
        setAdminUser(userData);
        localStorage.setItem('ssd_admin_token', token);
        localStorage.setItem('ssd_admin_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.success && response.data.data) {
        setAdminUser(response.data.data);
        localStorage.setItem('ssd_admin_user', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.warn('Could not sync admin profile from server:', error?.message);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      refreshProfile();
    }
  }, [token]);

  const updateUser = (userData, newToken) => {
    setAdminUser((prev) => {
      const merged = { ...(prev || {}), ...userData };
      localStorage.setItem('ssd_admin_user', JSON.stringify(merged));
      return merged;
    });
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('ssd_admin_token', newToken);
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('ssd_admin_token');
    localStorage.removeItem('ssd_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token,
        authLoading,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
