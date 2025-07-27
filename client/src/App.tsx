import './App.css';
import Header from './components/user/Header';
import Footer from './components/user/Footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import PostDetail from './pages/user/PostDetail';
import UserProfile from './pages/user/UserProfile';
import EditProfile from './pages/user/EditProfile';
import BookingForm from './components/user/BookingForm';
import MyBookingsPage from './pages/user/MyBookingsPage';
import MyContracts from './pages/user/MyContracts';
import BookingRequests from './pages/user/BookingRequests';
import ContractDetail from './pages/user/ContractDetail';

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
          <Route path="/edit-profile/:userId" element={<EditProfile />} />
          <Route path="/booking/:roomId" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/my-contracts" element={<MyContracts tenantId="u1" />} />
          <Route path="/booking-requests" element={<BookingRequests />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
