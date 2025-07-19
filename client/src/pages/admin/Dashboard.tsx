import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Users, Home, DollarSign, Activity, ArrowUp, ArrowDown
} from 'lucide-react';

import { userService } from '../../services/userService';
import { roomService } from '../../services/roomService';

const Dashboard: React.FC = () => {
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {} as Record<string, number>
  });

  const [roomStats, setRoomStats] = useState({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    averagePrice: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userStatsDataRaw, roomStatsDataRaw] = await Promise.all([
        userService.getUserStats(),
        roomService.getRoomStats()
      ]);
  
      // fallback nếu API trả về undefined/null
      const userStatsData = {
        total: userStatsDataRaw?.total || 0,
        active: userStatsDataRaw?.active || 0,
        inactive: userStatsDataRaw?.inactive || 0,
        byRole: userStatsDataRaw?.byRole || {}
      };
  
      const roomStatsData = {
        total: roomStatsDataRaw?.total || 0,
        available: roomStatsDataRaw?.available || 0,
        rented: roomStatsDataRaw?.rented || 0,
        maintenance: roomStatsDataRaw?.maintenance || 0,
        averagePrice: roomStatsDataRaw?.averagePrice || 0,
        totalRevenue: roomStatsDataRaw?.totalRevenue || 0
      };
  
      setUserStats(userStatsData);
      setRoomStats(roomStatsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  const monthlyData = [
    { month: 'T1', users: 12, rooms: 8, revenue: 45000000 },
    { month: 'T2', users: 15, rooms: 12, revenue: 58000000 },
    { month: 'T3', users: 18, rooms: 15, revenue: 72000000 },
    { month: 'T4', users: 22, rooms: 18, revenue: 85000000 },
    { month: 'T5', users: 25, rooms: 22, revenue: 98000000 },
    { month: 'T6', users: 28, rooms: 25, revenue: 112000000 }
  ];

  const roomStatusData = [
    { name: 'Còn trống', value: roomStats.available, color: '#10B981' },
    { name: 'Đã thuê', value: roomStats.rented, color: '#F59E0B' },
    { name: 'Bảo trì', value: roomStats.maintenance, color: '#EF4444' }
  ];

  const userRoleData = Object.entries(userStats.byRole).map(([role, count]) => ({
    role,
    count,
    color: role === 'Admin' ? '#8B5CF6' : role === 'Chủ trọ' ? '#06B6D4' : '#3B82F6'
  }));

  const weeklyActivityData = [
    { day: 'T2', logins: 45, newUsers: 3, roomViews: 120 },
    { day: 'T3', logins: 52, newUsers: 5, roomViews: 145 },
    { day: 'T4', logins: 48, newUsers: 2, roomViews: 132 },
    { day: 'T5', logins: 61, newUsers: 7, roomViews: 178 },
    { day: 'T6', logins: 55, newUsers: 4, roomViews: 156 },
    { day: 'T7', logins: 38, newUsers: 1, roomViews: 98 },
    { day: 'CN', logins: 42, newUsers: 2, roomViews: 110 }
  ];

  const occupancyRate = roomStats.total > 0 ? Math.round((roomStats.rented / roomStats.total) * 100) : 0;
  const activeUserRate = userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Dashboard Tổng quan</h1>
        <p className="text-gray-600">Theo dõi hiệu suất và thống kê hệ thống quản lý</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng người dùng" value={userStats.total} percent={activeUserRate} icon={<Users size={24} />} color="blue" />
        <StatCard title="Tổng phòng trọ" value={roomStats.total} percent={occupancyRate} icon={<Home size={24} />} color="green" />
        <StatCard title="Doanh thu tháng" value={formatCurrency(roomStats.totalRevenue)} percent={12.5} icon={<DollarSign size={24} />} color="purple" />
        <StatCard title="Hoạt động hôm nay" value={247} percent={-3.2} icon={<Activity size={24} />} color="orange" />
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title="Tăng trưởng theo tháng">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area dataKey="users" stroke="#3B82F6" fill="#3B82F6" />
              <Area dataKey="rooms" stroke="#10B981" fill="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Trạng thái phòng trọ">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {roomStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title="Phân bố vai trò người dùng">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userRoleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Hoạt động trong tuần">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="logins" stroke="#3B82F6" />
              <Line type="monotone" dataKey="newUsers" stroke="#10B981" />
              <Line type="monotone" dataKey="roomViews" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      <ChartBox title="Biểu đồ doanh thu 6 tháng gần đây">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => [formatCurrency(value as number), 'Doanh thu']} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              strokeWidth={3}
              fill="url(#colorRevenue)"
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
};

export default Dashboard;

const StatCard = ({ title, value, percent, icon, color }: any) => {
  const isPositive = percent >= 0;
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {isPositive ? <ArrowUp size={16} className="text-green-600 mr-1" /> : <ArrowDown size={16} className="text-red-600 mr-1" />}
            <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(percent)}%</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ChartBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);
