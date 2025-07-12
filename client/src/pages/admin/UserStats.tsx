import React from 'react';
import { Users, UserCheck, UserX,  Home } from 'lucide-react';
import type { UserStats } from '../../types/user';

interface UserStatsProps {
  stats: UserStats;
  loading?: boolean;
}
const UserStats: React.FC<UserStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Đang hoạt động',
      value: stats.active,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Không hoạt động',
      value: stats.inactive,
      icon: UserX,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Chủ trọ',
      value: stats.byRole['Chủ trọ'] || 0,
      icon: Home,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${card.textColor} mb-1`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.color} text-white p-3 rounded-lg`}>
              <card.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
