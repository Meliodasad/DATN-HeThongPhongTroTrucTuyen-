import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import RoomsPage from './pages/RoomsPage';
import CommentsPage from './pages/CommentsPage';
import StatisticsPage from './pages/StatisticsPage';
import ReviewsPage from './pages/ReviewsPage';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/comments" element={<CommentsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;