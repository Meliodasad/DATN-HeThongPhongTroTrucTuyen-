import React from 'react';
import { Home, CheckCircle, XCircle, Wrench, DollarSign, TrendingUp,  } from 'lucide-react';
import type { RoomStats } from '../../../types/room';

interface RoomStatsProps {
  stats: RoomStats;
  loading?: boolean;
}

const RoomStatsComponent: React.FC<RoomStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Tổng số phòng',
      value: stats.total,
      icon: Home,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Phòng trống',
      value: stats.available,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Đang cho thuê',
      value: stats.rented,
      icon: XCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Đang bảo trì',
      value: stats.maintenance,
      icon: Wrench,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Giá TB/tháng',
      value: formatCurrency(stats.averagePrice),
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      isPrice: true
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      isPrice: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${card.textColor} mb-1`}>
                {card.title}
              </p>
              <p className={`${card.isPrice ? 'text-lg' : 'text-2xl'} font-bold ${card.textColor}`}>
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

export default RoomStatsComponent;
