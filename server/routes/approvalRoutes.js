const express = require('express');
const {
  getRoomApprovals,
  updateApprovalStatus,
  getSingleApproval
} = require('../controllers/approvalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách approvals (admin)
router.get('/', protect, authorize('admin', 'host'), getRoomApprovals);

// Lấy chi tiết 1 approval theo approvalId
router.get('/:id', protect, authorize('admin', 'host'), getSingleApproval);

// Cập nhật trạng thái approval
router.put('/:id', protect, authorize('admin'), updateApprovalStatus);

module.exports = router;
