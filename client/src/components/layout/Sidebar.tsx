import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building, 
  MessageSquare, 
  Calendar, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Settings,
  Phone,
  Star
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Người dùng', path: '/users' },
    { icon: Building, label: 'Phòng trọ', path: '/rooms' },
    { icon: Calendar, label: 'Đặt phòng', path: '/bookings' },
    { icon: FileText, label: 'Hợp đồng', path: '/contracts' },
    { icon: CreditCard, label: 'Thanh toán', path: '/payments' },
    { icon: Star, label: 'Đánh giá', path: '/reviews' },
    { icon: MessageSquare, label: 'Tin nhắn', path: '/messages' },
    { icon: Phone, label: 'Liên hệ', path: '/contacts' },
    { icon: BarChart3, label: 'Báo cáo', path: '/reports' },
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
        <div className="flex items-center">
          <Home className="w-8 h-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">RentalHub</span>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;