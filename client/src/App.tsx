import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

// Shared
import Header from './components/user/Header';
import Footer from './components/user/Footer';
import Layout from './components/layout/Layout';

// Auth
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
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Layout riêng */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Client Layout riêng, phải là `path="*"` */}
      <Route
        path="*"
        element={
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
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
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
