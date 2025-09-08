// src/components/Header.tsx
// Header đã được cập nhật với thông tin user và logout
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: "/host/dashboard", label: "Tổng quan" },
    { path: "/host/room-list", label: "Danh sách phòng" },
    { path: "/host/tenant-list", label: "Người thuê" },
    { path: "/host/rental-request", label: "Yêu cầu thuê" },
    { path: "/host/contracts", label: "Hợp đồng" },
    { path: "/host/invoices", label: "Hóa đơn" },
    { path: "/host/revenue", label: "Doanh thu" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/host/dashboard" className="text-2xl font-bold text-blue-600">
              Phòng trọ 123
            </Link>
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
              {user?.role === 'host' ? 'Chủ trọ' : 'Người thuê'}
            </span>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Đăng tin mới
            </button>
            
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <img
                  src={user?.avatar || `https://i.pravatar.cc/100?u=${user?.email}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">{user?.fullName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/host/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} />
                    <span>Thông tin cá nhân</span>
                  </Link>
                  
                  <Link
                    to="/host/update-profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    <span>Cài đặt tài khoản</span>
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-1 mt-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg hover:bg-gray-100 transition ${
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;