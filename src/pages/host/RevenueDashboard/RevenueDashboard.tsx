// src/pages/host/RevenueDashboard/RevenueDashboard.tsx
// Mô-đun Dashboard Doanh Thu
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, Home, Calendar, PieChart, BarChart3, AlertCircle } from 'lucide-react';
import type { RevenueData, PaymentStats, RoomStats } from '../../../utils/revenueCalculator'; 
import { RevenueCalculator } from '../../../utils/revenueCalculator';
export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [collectionRate, setCollectionRate] = useState<{ rate: number; details: any } | null>(null);
  const [forecast, setForecast] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [revenue, payments, rooms, collection, forecastData] = await Promise.all([
        RevenueCalculator.calculateTotalRevenue(),
        RevenueCalculator.calculatePaymentStats(),
        RevenueCalculator.calculateRoomStats(),
        RevenueCalculator.calculateCollectionRate(),
        RevenueCalculator.forecastNextMonthRevenue()
      ]);

      setRevenueData(revenue);
      setPaymentStats(payments);
      setRoomStats(rooms);
      setCollectionRate(collection);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setError('Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu doanh thu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Doanh Thu</h1>
        <p className="text-gray-600">Tổng quan về doanh thu và hiệu suất kinh doanh</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng Doanh Thu</p>
              <p className="text-2xl font-bold">
                {revenueData?.totalRevenue.toLocaleString()}₫
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Doanh Thu Tháng Này</p>
              <p className="text-2xl font-bold">
                {revenueData?.monthlyRevenue.toLocaleString()}₫
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tỷ Lệ Lấp Đầy</p>
              <p className="text-2xl font-bold">
                {roomStats?.occupancyRate.toFixed(1)}%
              </p>
            </div>
            <Home className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Dự Báo Tháng Tới</p>
              <p className="text-2xl font-bold">
                {forecast.toLocaleString()}₫
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Doanh Thu Theo Tháng</h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {revenueData?.revenueByMonth.slice(-6).map((item: { month: string; revenue: number }, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((item.revenue / (revenueData?.monthlyRevenue || 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.revenue.toLocaleString()}₫
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thống Kê Thanh Toán</h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Đã thanh toán</span>
              <span className="text-sm font-bold text-green-600">
                {paymentStats?.paidAmount.toLocaleString()}₫
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">Chưa thanh toán</span>
              <span className="text-sm font-bold text-yellow-600">
                {paymentStats?.unpaidAmount.toLocaleString()}₫
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-800">Quá hạn</span>
              <span className="text-sm font-bold text-red-600">
                {paymentStats?.overdueAmount.toLocaleString()}₫
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Room Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống Kê Phòng</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng phòng:</span>
              <span className="font-medium">{roomStats?.totalRooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đã thuê:</span>
              <span className="font-medium text-green-600">{roomStats?.rented}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Còn trống:</span>
              <span className="font-medium text-yellow-600">{roomStats?.available}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bảo trì:</span>
              <span className="font-medium text-red-600">{roomStats?.maintenance}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Giá TB:</span>
              <span className="font-medium">{roomStats?.averagePrice.toLocaleString()}₫</span>
            </div>
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tỷ Lệ Thu Hồi</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {collectionRate?.rate.toFixed(1)}%
            </div>
            <p className="text-gray-600 mb-4">Tỷ lệ thanh toán đúng hạn</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Đã thanh toán:</span>
                <span className="font-medium">{collectionRate?.details.paid}</span>
              </div>
              <div className="flex justify-between">
                <span>Chưa thanh toán:</span>
                <span className="font-medium">{collectionRate?.details.unpaid}</span>
              </div>
              <div className="flex justify-between">
                <span>Quá hạn:</span>
                <span className="font-medium">{collectionRate?.details.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rooms by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Phòng Theo Doanh Thu</h3>
          <div className="space-y-3">
            {revenueData?.revenueByRoom.slice(0, 5).map((room: { roomId: string; revenue: number; roomTitle: string }, index: number) => (
              <div key={room.roomId} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium">{room.roomId}</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {room.revenue.toLocaleString()}₫
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <TrendingUp size={16} />
          <span>Làm mới dữ liệu</span>
        </button>
        <button
          onClick={async () => {
            try {
              await RevenueCalculator.saveStatistics();
              alert('✅ Đã lưu thống kê thành công!');
            } catch (error) {
              alert('❌ Lỗi khi lưu thống kê!');
            }
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
        >
          <Calendar size={16} />
          <span>Lưu thống kê</span>
        </button>
        {(!revenueData?.revenueByRoom || revenueData.revenueByRoom.length === 0) && (
          <div className="text-center text-gray-500 py-4">
            <p>Chưa có dữ liệu doanh thu theo phòng</p>
          </div>
        )}
      </div>
    </div>
  );
}