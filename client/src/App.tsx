import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext'; // Đường dẫn tùy thuộc vào vị trí file

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
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import CommentsPage from './pages/admin/components/CommentManagement';
import StatisticsPage from './pages/admin/StatisticsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import ContactsPage from './pages/admin/ContactsPage';

function App() {
  return (
    <ToastProvider> {/* ✅ Bọc toàn bộ app */}
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
          <Route path="users" element={<UsersPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="comments" element={<CommentsPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
