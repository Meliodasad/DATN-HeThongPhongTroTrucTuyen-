// src/components/AuthGuard.tsx
// Component bảo vệ các route cần xác thực
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'host' | 'tenant';
}

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  requiredRole 
}: AuthGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Đang loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Route cần xác thực nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Route không cần xác thực nhưng đã đăng nhập (login/register page)
  if (!requireAuth && isAuthenticated) {
    const redirectTo = user?.role === 'host' ? '/host/dashboard' : '/tenant/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // Kiểm tra role nếu yêu cầu
  if (requiredRole && user?.role !== requiredRole) {
    const redirectTo = user?.role === 'host' ? '/host/dashboard' : '/tenant/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;