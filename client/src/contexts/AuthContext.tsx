import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useToastContext } from './ToastContext';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'host' | 'tenant' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  fullName: string;
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
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Fetch users from API
const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      
      // Find user with matching email and password
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        error('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng');
        return false;
      }

      if (foundUser.status !== 'active') {
        error('Lỗi đăng nhập', 'Tài khoản chưa được kích hoạt hoặc bị khóa');
        return false;
      }

      const userData: User = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status,
        avatar: foundUser.avatar
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      success('Thành công', `Chào mừng ${foundUser.fullName}!`);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      error('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);

      // Check if email already exists
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        error('Lỗi đăng ký', 'Email đã được sử dụng');
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      const createResponse = await fetch('http://localhost:5000/users', {
      });

const apiResponse = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to create user');
      }

      success('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      return true;
    } catch (err) {
      console.error('Register error:', err);
      error('Lỗi', 'Không thể đăng ký. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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