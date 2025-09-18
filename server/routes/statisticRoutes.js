// routes/statisticRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminStats,
  getHostStats,
  getTenantStats,
} = require('../controllers/statisticsController');

// Lấy thống kê cho admin
router.get('/dashboard', protect, authorize('admin'), getAdminStats);

// Lấy thống kê cho chủ trọ
router.get('/host', protect, authorize('host'), getHostStats);

// Lấy thống kê cho người thuê
router.get('/tenant', protect, authorize('tenant'), getTenantStats);

module.exports = router;