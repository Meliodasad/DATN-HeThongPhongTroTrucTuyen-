const express = require('express');
const {
  createContract,
  getAllContracts,
  getSingleContract,
  getContractsByTenant,
  getContractsByHost
} = require('../controllers/contractController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.get('/host',
  protect,
  authorize('host', 'admin'),
  getContractsByHost
);
// Tạo hợp đồng mới - Chỉ Host hoặc Admin
router.post('/', protect, authorize('host', 'admin'), createContract);

// Lấy danh sách hợp đồng - Chỉ Admin
router.get('/', protect, authorize('admin', 'host'), getAllContracts);

// Tenant/Host/Admin xem theo tenantId (hoặc tự mình)
router.get('/tenant', protect, authorize('tenant', 'host', 'admin'), getContractsByTenant);
// Lấy thông tin 1 hợp đồng - Admin, Host hoặc Tenant được xem nếu liên quan
router.get('/:contractId', protect, getSingleContract);

module.exports = router;
