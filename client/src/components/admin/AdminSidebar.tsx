import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users, Home, LayoutDashboard, MessageSquare,
  Star, Phone, TrendingUp
} from 'lucide-react';

// ✅ Khai báo kiểu props
interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard, path: '/admin' },
  { id: 'users', label: 'Người dùng', icon: Users, path: '/admin/users' },
  { id: 'rooms', label: 'Phòng trọ', icon: Home, path: '/admin/rooms' },
  { id: 'statistics', label: 'Thống kê', icon: TrendingUp, path: '/admin/statistics' },
  { id: 'comments', label: 'Bình luận', icon: MessageSquare, path: '/admin/comments' },
  { id: 'reviews', label: 'Đánh giá', icon: Star, path: '#', disabled: true },
  { id: 'contacts', label: 'Liên hệ', icon: Phone, path: '#', disabled: true },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-slate-700">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        <p className="text-xs text-slate-400">Hệ thống quản lý</p>
      </div>

      <nav className="flex-1 p-4">
        {sidebarItems.map(item => (
          <NavLink
            to={item.path}
            key={item.id}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${
                isActive ? 'bg-blue-600' : 'hover:bg-slate-700'
              }`
            }
          >
            <item.icon size={18} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
