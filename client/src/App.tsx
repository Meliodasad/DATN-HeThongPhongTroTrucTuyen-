import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Shared Auth Pages
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
import Dashboard from './pages/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import RoomsPage from './pages/admin/RoomsPage';
import BookingsPage from './pages/admin/BookingsPage';
import ContractsPage from './pages/ContractsPage';
import PaymentsPage from './pages/PaymentsPage';
import MessagesPage from './pages/MessagesPage';
import ContactsPage from './pages/admin/ContactsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
// import ReviewsPage from './pages/ReviewsPage';
// import StatisticsPage from './pages/admin/StatisticsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Client routes - không cần đăng nhập */}
            <Route element={<ClientLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/booking/:roomId" element={<BookingForm />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />
              <Route path="/my-account" element={<MyAccount />} />

              {/* Các route cần đăng nhập */}
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
            </Route>

            {/* Admin routes */}
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
              {/* <Route path="reviews" element={<ReviewsPage />} /> */}
              <Route path="messages" element={<MessagesPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              {/* <Route path="statistics" element={<StatisticsPage />} /> */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
