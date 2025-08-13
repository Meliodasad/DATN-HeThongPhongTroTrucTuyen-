const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createPayment,
  getPayments,
  updatePayment
} = require('../controllers/paymentController');

const router = express.Router();

// @route   POST /api/payments
// @desc    Tạo thanh toán mới (chỉ Host/Admin)
// @access  Private
router.post('/', protect, authorize('host', 'admin'), createPayment);

// @route   GET /api/payments
// @desc    Lấy danh sách thanh toán, phân quyền theo vai trò (Tenant, Host, Admin)
// @access  Private
router.get('/', protect, getPayments);

// @route   PUT /api/payments/:id
// @desc    Cập nhật trạng thái thanh toán (Paid, phương thức, ghi chú...)
// @access  Private
router.put('/:id', protect, updatePayment);

module.exports = router;
