import './App.css';
import Header from './components/user/Header';
import Footer from './components/user/Footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import PostDetail from './pages/user/PostDetail';
import UserProfile from './pages/user/UserProfile';
import BookingForm from './components/user/BookingForm';
import MyBookingsPage from './pages/user/MyBookingsPage';
import MyContracts from './pages/user/MyContracts';
import BookingRequests from './pages/user/BookingRequests';
import ContractDetail from './pages/user/ContractDetail';
import RegisterPage from './pages/user/auth/RegisterPage';
import LoginPage from './pages/user/auth/LoginPage';
import MyAccount from './pages/user/MyAccount';


function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
           <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/booking/:roomId" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/my-contracts" element={<MyContracts />} />
          <Route path="/booking-requests" element={<BookingRequests />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/my-account" element={<MyAccount />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
