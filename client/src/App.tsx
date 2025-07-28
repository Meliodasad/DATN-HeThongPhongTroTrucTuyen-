import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';


import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Client pages
import HomePage from './pages/user/HomePage';
import PostDetail from './pages/user/PostDetail';
import UserProfile from './pages/user/UserProfile';
import EditProfile from './pages/user/EditProfile';

// Admin pages
import Dashboard from './pages/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import BookingsPage from './pages/admin/BookingsPage';
import ContractsPage from './pages/ContractsPage';
import PaymentsPage from './pages/PaymentsPage';
// import ReviewsPage from './pages/ReviewsPage';
import MessagesPage from './pages/MessagesPage';
import ContactsPage from './pages/admin/ContactsPage';
import ReportsPage from './pages/ReportsPage';
// import StatisticsPage from './pages/admin/StatisticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Client Layout (không cần đăng nhập) */}
            <Route element={<ClientLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/edit-profile/:userId" element={<EditProfile />} />
            </Route>

            {/* Admin Layout (cần đăng nhập + phân quyền) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
