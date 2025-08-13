const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');

const router = express.Router();

// Tạo booking mới
router.post('/', protect, authorize('tenant'), createBooking);

// Lấy tất cả booking (admin)
router.get('/', protect, authorize('admin'), getAllBookings);

// Lấy booking của chính người dùng
router.get('/my-bookings', protect, authorize('tenant'), getMyBookings);

// Cập nhật trạng thái booking
router.put('/:bookingId', protect, authorize('host', 'admin'), updateBookingStatus);

module.exports = router;
