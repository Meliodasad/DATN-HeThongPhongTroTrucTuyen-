import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "react-toastify";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'host' | 'tenant';
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'host' | 'tenant';
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (userData: RegisterData) => Promise<{ userId: string } | null>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (userData: RegisterData): Promise<{ userId: string } | null> => {
    try {
      setIsLoading(true);

      // Check if email already exists
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        error('Lỗi đăng ký', 'Email đã được sử dụng');
        return null;
      }

      // Create new user
      const userId = `user_${Date.now()}`;
      const newUser = {
        id: userId,
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      const apiResponse = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to create user');
      }

toast.success("Thành công! Đăng ký tài khoản thành công.");
      return { userId };
    } catch (err) {
      console.error('Register error:', err);
      toast.error("Lỗi! Không thể đăng ký. Vui lòng thử lại.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: `user_${Date.now()}`,
        fullName: 'Test User',
        email: data.email,
        role: 'tenant'
      };
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};