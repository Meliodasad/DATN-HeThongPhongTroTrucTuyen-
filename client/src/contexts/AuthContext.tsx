/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useToastContext } from './ToastContext';
import { headers } from '../utils/config';
import type { User } from '../types/user';

// interface User {
//   id: string;
//   fullName: string;
//   phone: string;
//   email: string;
//   role: 'admin' | 'host' | 'tenant' | 'guest';
//   status: 'active' | 'inactive' | 'pending';
//   avatar?: string;
// }

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  fullName: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  role: 'host' | 'tenant';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToastContext();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();

      const foundUser = users.data.user;
      if (!foundUser) {
        error('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng');
        return null;
      }

      if (foundUser.status !== 'active') {
        error('Lỗi đăng nhập', 'Tài khoản chưa được kích hoạt hoặc bị khóa');
        return null;
      }

      const userData: User = {
        id: foundUser.userId,
        fullName: foundUser.fullName,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
        status: foundUser.status,
        avatar: foundUser.avatar
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', users.data.token);
      success('Thành công', `Chào mừng ${foundUser.fullName}!`);
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      error('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
  try {
    setLoading(true);

    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role,
        status: "active",
        createdAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    success("Thành công", "Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
    return true;
  } catch (err) {
    console.error("Register error:", err);
    error("Lỗi", "Không thể đăng ký. Vui lòng thử lại.");
    return false;
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    success('Thành công', 'Đã đăng xuất');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
