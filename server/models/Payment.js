const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// Tạo auto-increment paymentId
const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, default: () => uuidv4(), index: true },
  tenantId: { type: String, required: true },
  contractId: { type: String, required: true },
  amount: { type: Number, required: true },          // VND (chưa *100)

  paymentDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  // VNPay fields
  vnpTxnRef: { type: String, index: true },
  vnpResponseCode: { type: String },
  vnpBankCode: { type: String },

  extraNote: {
    type: String
  },
  paidAt: { type: Date }
}, { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
