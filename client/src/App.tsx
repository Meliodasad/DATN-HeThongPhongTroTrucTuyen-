import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './pages/layout/AdminLayout';
import ClientLayout from './pages/layout/ClientLayout';
import HomePage from './pages/user/HomePage';
import PostDetail from './pages/user/PostDetail';
import Dashboard from './pages/admin/Dashboard';
import UserTable from './pages/admin/UserTable';
import RoomManagement from './pages/admin/RoomManagement';

function App() {
  return (
    <Routes>
      {/* Client Layout */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Route>

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserTable />} />
        <Route path="rooms" element={<RoomManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
