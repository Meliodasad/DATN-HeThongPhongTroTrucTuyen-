import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const trafficData = [
  { day: 'Mon', visits: 100, users: 80 },
  { day: 'Tue', visits: 180, users: 130 },
  { day: 'Wed', visits: 90, users: 100 },
  { day: 'Thu', visits: 200, users: 160 },
  { day: 'Fri', visits: 120, users: 110 },
  { day: 'Sat', visits: 170, users: 140 },
  { day: 'Sun', visits: 130, users: 90 },
];

const Dashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">📊 Dashboard</h2>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['#3b82f6', '#06b6d4', '#facc15', '#f87171'].map((color, i) => (
          <div
            key={i}
            className="rounded p-4 text-white shadow-md"
            style={{ backgroundColor: color }}
          >
            <p className="text-xl font-bold">9.823</p>
            <p className="text-sm">Members online</p>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Lượt truy cập</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#3b82f6" />
              <Line type="monotone" dataKey="users" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
        <div className="bg-white rounded p-4 shadow">
          <p className="font-bold text-blue-500">29.703</p>
          <p>Visits</p>
        </div>
        <div className="bg-white rounded p-4 shadow">
          <p className="font-bold text-purple-500">24.093</p>
          <p>Unique Users</p>
        </div>
        <div className="bg-white rounded p-4 shadow">
          <p className="font-bold text-yellow-500">78.706</p>
          <p>Pageviews</p>
        </div>
        <div className="bg-white rounded p-4 shadow">
          <p className="font-bold text-green-500">22.123</p>
          <p>New Users</p>
        </div>
        <div className="bg-white rounded p-4 shadow">
          <p className="font-bold text-red-500">40.15%</p>
          <p>Bounce Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
