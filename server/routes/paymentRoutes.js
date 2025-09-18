const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createPayment,
  getPayments,
  updatePayment,
  createVnpayPayment,
  vnpayReturn,
  paymentResult
} = require('../controllers/paymentController');

const router = express.Router();
router.post('/', protect, authorize('host', 'admin', 'tenant'), createPayment);
router.post('/vnpay/create', protect, createVnpayPayment);

router.get('/vnpay/return', vnpayReturn);

router.get('/payment-result', paymentResult);
router.get('/', protect, getPayments);

router.put('/:id', protect, updatePayment);

module.exports = router;
