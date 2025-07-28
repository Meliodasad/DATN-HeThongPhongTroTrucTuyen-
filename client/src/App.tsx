import React from 'react';
<<<<<<< HEAD
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
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import BookingsPage from './pages/admin/BookingsPage';
import ContractsPage from './pages/ContractsPage';
import PaymentsPage from './pages/PaymentsPage';
import ReviewsPage from './pages/ReviewsPage';
import MessagesPage from './pages/MessagesPage';
import ContactsPage from './pages/admin/ContactsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="rooms" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <RoomsPage />
                </ProtectedRoute>
              } />
              <Route path="bookings" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <BookingsPage />
                </ProtectedRoute>
              } />
              <Route path="contracts" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <ContractsPage />
                </ProtectedRoute>
              } />
              <Route path="payments" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <PaymentsPage />
                </ProtectedRoute>
              } />
              <Route path="reviews" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <ReviewsPage />
                </ProtectedRoute>
              } />
              <Route path="messages" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="contacts" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <ContactsPage />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <ReportsPage />
                </ProtectedRoute>
              } />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
>>>>>>> origin/xuan-tung
    </ToastProvider>
  );
}

export default App;
