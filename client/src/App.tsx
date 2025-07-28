import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import BookingsPage from './pages/admin/BookingModal';
import ContractsPage from './pages/admin/ContractsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import MessagesPage from './pages/admin/MessagesPage';
import ContactsPage from './pages/admin/ContactsPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

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
    </ToastProvider>
  );
}

export default App;