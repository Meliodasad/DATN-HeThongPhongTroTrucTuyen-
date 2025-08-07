import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Client Pages
import HomePage from './pages/user/HomePage';
import PostDetail from './pages/user/PostDetail';
import UserProfile from './pages/user/UserProfile';
import BookingForm from './components/user/BookingForm';
import MyBookingsPage from './pages/user/MyBookingsPage';
import MyContracts from './pages/user/MyContracts';
import BookingRequests from './pages/user/BookingRequests';
import ContractDetail from './pages/user/ContractDetail';
import MyAccount from './pages/user/MyAccount';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import BookingsPage from './pages/admin/BookingPage';
import ContractsPage from './pages/admin/ContractsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import MessagesPage from './pages/admin/MessagesPage';
import ContactsPage from './pages/admin/ContactsPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Client Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/user/:userId" element={<UserProfile />} />
      <Route path="/booking/:roomId" element={<BookingForm />} />
      <Route path="/contracts/:id" element={<ContractDetail />} />
      <Route path="/my-account" element={<MyAccount />} />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute requiredRoles={['tenant', 'host']}>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-contracts"
        element={
          <ProtectedRoute requiredRoles={['tenant', 'host']}>
            <MyContracts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-requests"
        element={
          <ProtectedRoute requiredRoles={['host']}>
            <BookingRequests />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/rooms" element={<RoomsPage />} />
      <Route path="/admin/bookings" element={<BookingsPage />} />
      <Route path="/admin/contracts" element={<ContractsPage />} />
      <Route path="/admin/payments" element={<PaymentsPage />} />
      <Route path="/admin/reviews" element={<ReviewsPage />} />
      <Route path="/admin/messages" element={<MessagesPage />} />
      <Route path="/admin/contacts" element={<ContactsPage />} />
      <Route path="/admin/reports" element={<ReportsPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
