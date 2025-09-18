import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign,
  Calendar,
  Download,
  Eye,
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { headers } from '../../utils/config';

interface ReportData {
  userStats: {
    total: number;
    newThisMonth: number;
    activeUsers: number;
    growthRate: number;
  };
  roomStats: {
    total: number;
    available: number;
    rented: number;
    occupancyRate: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageRent: number;
    growthRate: number;
  };
  monthlyData: Array<{
    month: string;
    users: number;
    rooms: number;
    revenue: number;
  }>;
}

const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    userStats: { total: 0, newThisMonth: 0, activeUsers: 0, growthRate: 0 },
    roomStats: { total: 0, available: 0, rented: 0, occupancyRate: 0 },
    revenueStats: { totalRevenue: 0, monthlyRevenue: 0, averageRent: 0, growthRate: 0 },
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const { success, error } = useToastContext();

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [usersRes, roomsRes, paymentsRes, contractsRes] = await Promise.all([
        fetch('http://localhost:3000/users', { headers }),
        fetch('http://localhost:3000/rooms', { headers }),
        fetch('http://localhost:3000/payments', { headers }),
        fetch('http://localhost:3000/contracts', { headers })
      ]);

      const [users, rooms, payments, contracts] = await Promise.all([
        usersRes.json(),
        roomsRes.json(),
        paymentsRes.json(),
        contractsRes.json()
      ]);

      // Calculate user stats
      const currentMonth = new Date().getMonth();
      const newUsersThisMonth = users.data.users.filter((user: any) => 
        new Date(user.createdAt).getMonth() === currentMonth
      ).length;
      const activeUsers = users.data.users.filter((user: any) => user.status === 'active').length;

      // Calculate room stats
      const availableRooms = rooms.data.rooms.filter((room: any) => room.status === 'available').length;
      const rentedRooms = rooms.data.rooms.filter((room: any) => room.status === 'rented').length;
      const occupancyRate = rooms.data.rooms.length > 0 ? (rentedRooms / rooms.data.rooms.length) * 100 : 0;

      // Calculate revenue stats
      const completedPayments = payments.data.filter((payment: any) => payment.paymentStatus === 'completed');
      const totalRevenue = completedPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      const currentMonthPayments = completedPayments.filter((payment: any) => 
        new Date(payment.paymentDate).getMonth() === currentMonth
      );
      const monthlyRevenue = currentMonthPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      const averageRent = rooms.data.pagination.totalRooms > 0 ? (rooms.data.rooms.reduce((sum: number, room: any) => Number(sum + room.price.value || room.price), 0)) / rooms.data.pagination.totalRooms : 0;

      // Generate monthly data for charts
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        
        const monthUsers = users.data.users.filter((user: any) => {
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === date.getFullYear();
        }).length;

        const monthRooms = rooms.data.rooms.filter((room: any) => {
          const roomDate = new Date(room.createdAt);
          return roomDate.getMonth() === date.getMonth() && roomDate.getFullYear() === date.getFullYear();
        }).length;

        const monthRevenue = payments.data.filter((payment: any) => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === date.getMonth() && 
                 paymentDate.getFullYear() === date.getFullYear() &&
                 payment.paymentStatus === 'completed';
        }).reduce((sum: number, payment: any) => sum + payment.amount, 0);

        monthlyData.push({
          month: monthStr,
          users: monthUsers,
          rooms: monthRooms,
          revenue: monthRevenue
        });
      }
      setReportData({
        userStats: {
          total: users.data.pagination.totalUsers,
          newThisMonth: newUsersThisMonth,
          activeUsers,
          growthRate: users.data.users.length > 0 ? (newUsersThisMonth / users.data.users.length) * 100 : 0
        },
        roomStats: {
          total: rooms.data.pagination.totalRooms,
          available: availableRooms,
          rented: rentedRooms,
          occupancyRate
        },
        revenueStats: {
          totalRevenue,
          monthlyRevenue,
          averageRent,
          growthRate: totalRevenue > 0 ? (monthlyRevenue / totalRevenue) * 100 : 0
        },
        monthlyData
      });
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    success('Thành công', 'Đang xuất báo cáo...');
    // Implementation for exporting report
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600">Tổng quan về hiệu suất và doanh thu hệ thống</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          <button 
            onClick={handleExportReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Người dùng</h3>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{reportData.userStats.growthRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng người dùng</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(reportData.userStats.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mới tháng này</span>
              <span className="text-sm font-medium text-green-600">+{formatNumber(reportData.userStats.newThisMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Đang hoạt động</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(reportData.userStats.activeUsers)}</span>
            </div>
          </div>
        </div>

        {/* Room Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-green-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Phòng trọ</h3>
            </div>
            <div className="flex items-center text-blue-600">
              <span className="text-sm font-medium">{reportData.roomStats.occupancyRate.toFixed(1)}% lấp đầy</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng phòng</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(reportData.roomStats.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Còn trống</span>
              <span className="text-sm font-medium text-green-600">{formatNumber(reportData.roomStats.available)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Đã thuê</span>
              <span className="text-sm font-medium text-blue-600">{formatNumber(reportData.roomStats.rented)}</span>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">Doanh thu</h3>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{reportData.revenueStats.growthRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng doanh thu</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(reportData.revenueStats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tháng này</span>
              <span className="text-sm font-medium text-green-600">{formatCurrency(reportData.revenueStats.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Giá thuê TB</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(reportData.revenueStats.averageRent)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Users Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Người dùng mới theo tháng</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Eye className="w-4 h-4 inline mr-1" />
              Chi tiết
            </button>
          </div>
          <div className="space-y-4">
            {reportData.monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.month}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((data.users / Math.max(...reportData.monthlyData.map(d => d.users))) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{data.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Doanh thu theo tháng</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Eye className="w-4 h-4 inline mr-1" />
              Chi tiết
            </button>
          </div>
          <div className="space-y-4">
            {reportData.monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.month}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((data.revenue / Math.max(...reportData.monthlyData.map(d => d.revenue))) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Báo cáo chi tiết</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Báo cáo người dùng</h4>
              <p className="text-sm text-gray-600 mb-3">Phân tích chi tiết về người dùng</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Xem báo cáo
              </button>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Báo cáo phòng trọ</h4>
              <p className="text-sm text-gray-600 mb-3">Thống kê về tình trạng phòng</p>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                Xem báo cáo
              </button>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Báo cáo doanh thu</h4>
              <p className="text-sm text-gray-600 mb-3">Phân tích doanh thu và lợi nhuận</p>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Xem báo cáo
              </button>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Báo cáo hoạt động</h4>
              <p className="text-sm text-gray-600 mb-3">Theo dõi hoạt động hệ thống</p>
              <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                Xem báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;