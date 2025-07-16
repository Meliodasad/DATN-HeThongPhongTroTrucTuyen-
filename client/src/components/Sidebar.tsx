import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Home, 
  LayoutDashboard, 
  User, 
  ChevronDown, 
  BarChart3,
  Star,
  MessageSquare,
  Phone,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: 'Trang chủ', 
      icon: BarChart3, 
      path: '/dashboard',
      active: location.pathname === '/' || location.pathname === '/dashboard'
    },
    { 
      id: 'users', 
      label: 'Quản lý người dùng', 
      icon: Users, 
      path: '/users',
      active: location.pathname === '/users'
    },
    { 
      id: 'rooms', 
      label: 'Quản lý phòng trọ', 
      icon: Home, 
      path: '/rooms',
      active: location.pathname === '/rooms'
    },
    { 
      id: 'statistics', 
      label: 'Thống kê chi tiết', 
      icon: TrendingUp, 
      path: '/statistics',
      active: location.pathname === '/statistics'
    },
    { 
      id: 'comments', 
      label: 'Quản lý bình luận', 
      icon: MessageSquare, 
      path: '/comments',
      active: location.pathname === '/comments'
    },
    { 
      id: 'reviews', 
      label: 'Đánh giá & Phản hồi', 
      icon: Star, 
      path: '/reviews',
      active: location.pathname === '/reviews'
    },
    { 
      id: 'contacts', 
      label: 'Liên hệ & Hỗ trợ', 
      icon: Phone, 
      path: '/contacts',
      active: location.pathname === '/contacts'
    },
  ];

  const handleNavigation = (path: string, disabled?: boolean) => {
    if (!disabled) {
      navigate(path);
    }
  };

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg">Admin Bùi Xuân Tùng</h1>
              <p className="text-xs text-slate-400">Hệ thống quản lý</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.disabled)}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-blue-600 text-white shadow-lg'
                  : item.disabled
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-400">admin@system.com</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;