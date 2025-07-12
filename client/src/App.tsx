import React, { useState, useEffect, useMemo } from 'react';
import { Users, Home, LayoutDashboard, Settings, Bell, Search, User, ChevronDown, Menu, BarChart3 } from 'lucide-react';

import { useToast } from './hooks/useToast';
import { userService } from './services/userService';
import { roomService } from './services/roomService';
import type { RoomStats } from './types/room';
import UserTable from './pages/admin/UserTable';
import SearchAndFilter from './pages/admin/SearchAndFilter';
import Dashboard from './pages/admin/Dashboard';import Toast from './pages/admin/Toast'
import RoomManagement from './pages/admin/RoomManagement';
import UserModal from './pages/admin/UserModal';
import type { User as UserType, UserFormData,UserStats } from  './types/user';
import StatsSidebar from './pages/admin/StatsSidebar';
import { Star } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { Phone } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'rooms'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: { 'Admin': 0, 'Chủ trọ': 0, 'Người dùng': 0 }
  });
  const [roomStats, setRoomStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    byType: { single: 0, shared: 0, apartment: 0, studio: 0 },
    averagePrice: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserType['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserType['status'] | 'all'>('all');

  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData, roomStatsData] = await Promise.all([
        userService.getUsers(),
        userService.getUserStats(),
        roomService.getRoomStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
      setRoomStats(roomStatsData);
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmitUser = async (userData: UserFormData) => {
    try {
      setModalLoading(true);
      
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        success('Thành công', 'Cập nhật người dùng thành công');
      } else {
        await userService.createUser(userData);
        success('Thành công', 'Thêm người dùng thành công');
      }
      
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      error('Lỗi', 'Không thể thực hiện thao tác');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      await userService.deleteUser(id);
      success('Thành công', 'Xóa người dùng thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await userService.toggleUserStatus(id);
      success('Thành công', 'Cập nhật trạng thái thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

   const sidebarItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: BarChart3, active: activeTab === 'dashboard' },
    { id: 'users', label: 'Quản lý người dùng', icon: Users, active: activeTab === 'users' },
    { id: 'rooms', label: 'Quản lý phòng trọ', icon: Home, active: activeTab === 'rooms' },
    { id: 'statistics', label: 'Thống kê chi tiết', icon: TrendingUp, active: false, disabled: true },
    { id: 'comments', label: 'Quản lý bình luận', icon: MessageSquare, active: false, disabled: true },
    { id: 'reviews', label: 'Đánh giá & Phản hồi', icon: Star, active: false, disabled: true },
    { id: 'contacts', label: 'Liên hệ & Hỗ trợ', icon: Phone, active: false, disabled: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">ADMIN PANEL</h1>
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
                onClick={() => setActiveTab(item.id as 'dashboard' | 'users' | 'rooms')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-lg'
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'dashboard' ? 'Dashboard Tổng quan' : 
                   activeTab === 'users' ? 'Quản lý người dùng' : 'Quản lý phòng trọ'}
                </h2>
                <p className="text-sm text-gray-600">
                  {activeTab === 'dashboard' 
                    ? 'Theo dõi hiệu suất và thống kê hệ thống quản lý'
                    : activeTab === 'users' 
                    ? 'Quản lý tài khoản và phân quyền người dùng' 
                    : 'Quản lý thông tin phòng trọ và trạng thái cho thuê'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Settings */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex">
          <main className={`flex-1 overflow-auto ${activeTab === 'dashboard' ? '' : 'p-6'}`}>
            {activeTab === 'dashboard' ? (
              <Dashboard />
            ) : activeTab === 'users' ? (
            <>
              {/* <UserStats stats={stats} loading={loading} /> */}

              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onAddUser={handleAddUser}
              />

              <UserTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
                loading={loading}
              />

              <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitUser}
                user={editingUser}
                loading={modalLoading}
              />
            </>
          ) : (
            <RoomManagement />
          )}
          </main>

          {/* Stats Sidebar - only show on dashboard */}
          {activeTab === 'dashboard' && (
            <StatsSidebar userStats={stats} roomStats={roomStats} />
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}

export default App;