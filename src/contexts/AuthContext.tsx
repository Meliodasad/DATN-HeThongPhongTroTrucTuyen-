// src/contexts/AuthContext.tsx
// Context quản lý trạng thái xác thực
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/hostService';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  role: 'host' | 'tenant';
  address?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'host' | 'tenant';
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData, token } = response.data;
      
      // Lưu thông tin vào localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register({
        ...userData,
        phone: userData.phone || "",
      });
      // Không tự động đăng nhập sau khi đăng ký
      // Để user tự đăng nhập
      console.log('Đăng ký thành công:', response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};