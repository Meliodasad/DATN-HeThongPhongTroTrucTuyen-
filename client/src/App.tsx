import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from './pages/layout/AdminLayout';
import ClientLayout from './pages/layout/ClientLayout';

// Client pages
import HomePage from './pages/user/HomePage';
import PostDetail from './pages/user/PostDetail';
import UserProfile from './pages/user/UserProfile';
import EditProfile from './pages/user/EditProfile';

// Admin pages
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
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/edit-profile/:userId" element={<EditProfile />} />
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
