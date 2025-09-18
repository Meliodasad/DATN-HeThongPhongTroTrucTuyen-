const express = require('express');
const {
  createContract,
  getAllContracts,
  getSingleContract
} = require('../controllers/contractController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Tạo hợp đồng mới - Chỉ Host hoặc Admin
router.post('/', protect, authorize('host', 'admin'), createContract);

// Lấy danh sách hợp đồng - Chỉ Admin
router.get('/', protect, authorize('admin', 'host'), getAllContracts);

// Lấy thông tin 1 hợp đồng - Admin, Host hoặc Tenant được xem nếu liên quan
router.get('/:contractId', protect, getSingleContract);

module.exports = router;
