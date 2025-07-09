import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    quanTriVien: 0,
    nguoiDung: 0,
    phongTro: 0,
    donThue: 0,
    danhGia: 0,
    khachThamQuan: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [qtv, nd, pt, dt, dg, ktq] = await Promise.all([
        axios.get('/quan_tri_vien'),
        axios.get('/nguoi_dung'),
        axios.get('/phong_tro'),
        axios.get('/don_thue'),
        axios.get('/danh_gia'),
        axios.get('/khach_tham_quan'),
      ]);

      setStats({
        quanTriVien: qtv.data.length,
        nguoiDung: nd.data.length,
        phongTro: pt.data.length,
        donThue: dt.data.length,
        danhGia: dg.data.length,
        khachThamQuan: ktq.data.length,
      });
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'QTV', value: stats.quanTriVien },
    { name: 'Người dùng', value: stats.nguoiDung },
    { name: 'Phòng trọ', value: stats.phongTro },
    { name: 'Đơn thuê', value: stats.donThue },
    { name: 'Đánh giá', value: stats.danhGia },
    { name: 'Khách', value: stats.khachThamQuan },
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">📊 Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.quanTriVien}</p>
          <p>Quản trị viên</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.nguoiDung}</p>
          <p>Người dùng</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.phongTro}</p>
          <p>Phòng trọ</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.donThue}</p>
          <p>Đơn thuê</p>
        </div>
        <div className="bg-pink-500 text-white p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.danhGia}</p>
          <p>Đánh giá</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.khachThamQuan}</p>
          <p>Khách tham quan</p>
        </div>
      </div>

      {/* Biểu đồ thống kê */}
      <div className="bg-white rounded shadow p-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Thống kê hệ thống</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;