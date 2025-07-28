import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  UserPlus,
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  occupancyRate: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [usersRes, roomsRes, bookingsRes, paymentsRes] = await Promise.all([
        fetch('/http://localhost:5000/users'),
        fetch('/http://localhost:5000/rooms'),
        fetch('/http://localhost:5000/bookings'),
        fetch('/http://localhost:5000/payments')
      ]);

      const [users, rooms, bookings, payments] = await Promise.all([
        usersRes.json(),
        roomsRes.json(),
        bookingsRes.json(),
        paymentsRes.json()
      ]);

      // Calculate stats
      const totalRevenue = payments.reduce((sum: number, payment: any) => 
        payment.paymentStatus === 'completed' ? sum + payment.amount : sum, 0
      );

      const currentMonth = new Date().getMonth();
      const newUsersThisMonth = users.filter((user: any) => 
        new Date(user.createdAt).getMonth() === currentMonth
      ).length;

      const rentedRooms = rooms.filter((room: any) => room.status === 'rented').length;
      const occupancyRate = rooms.length > 0 ? (rentedRooms / rooms.length) * 100 : 0;

      setStats({
        totalUsers: users.length,
        totalRooms: rooms.length,
        totalBookings: bookings.length,
        totalRevenue,
        newUsersThisMonth,
        occupancyRate
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.newUsersThisMonth} tháng này`,
      changeType: 'increase'
    },
    {
      title: 'Tổng phòng trọ',
      value: stats.totalRooms,
      icon: Building,
      color: 'bg-green-500',
      change: `${stats.occupancyRate.toFixed(1)}% đã thuê`,
      changeType: 'neutral'
    },
    {
      title: 'Đặt phòng',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: 'Tổng đặt phòng',
      changeType: 'neutral'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
      color: 'bg-purple-500',
      change: 'Tổng thu nhập',
      changeType: 'increase'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Chào mừng, {user?.fullName}! 👋
            </h1>
            <p className="text-blue-100">
              Đây là tổng quan về hệ thống quản lý cho thuê trọ của bạn
            </p>
          </div>
          <div className="hidden md:block">
            <Home className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof card.value === 'number' && card.title !== 'Doanh thu' 
                    ? card.value.toLocaleString() 
                    : card.value
                  }
                </p>
                <div className="flex items-center mt-2">
                  {card.changeType === 'increase' && (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  )}
                  {card.changeType === 'decrease' && (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    card.changeType === 'increase' ? 'text-green-600' :
                    card.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Người dùng mới đăng ký</p>
                  <p className="text-sm text-gray-500">2 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Phòng trọ mới được đăng</p>
                  <p className="text-sm text-gray-500">15 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Đặt phòng mới</p>
                  <p className="text-sm text-gray-500">1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thống kê nhanh</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ lấp đầy</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.occupancyRate.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats.occupancyRate}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Người dùng mới tháng này</span>
                <span className="text-sm font-medium text-green-600">
                  +{stats.newUsersThisMonth}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phòng trống</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalRooms - Math.round(stats.totalRooms * stats.occupancyRate / 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;