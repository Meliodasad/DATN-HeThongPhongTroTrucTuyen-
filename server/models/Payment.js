const mongoose = require('mongoose');

// Tạo auto-increment paymentId
let counter = 0;
async function generatePaymentId() {
  counter++;
  return `pay${String(counter).padStart(3, '0')}`;
}

// models/Payment.js
const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    default: () => 'pay' + Math.floor(Math.random() * 1000000).toString().padStart(3, '0')
  },
  tenantId: { type: String, ref: 'User', required: true },
  contractId: { type: String, ref: 'Contract', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  extraNote: String,

  // ====== VNPay fields ======
  vnpTxnRef: String,           // mã giao dịch gửi sang VNPay
  vnpResponseCode: String,     // mã trả về (00 = thành công)
  vnpBankCode: String,
  paidAt: Date
}, { timestamps: true });

// Middleware tạo paymentId tự động
paymentSchema.pre('save', async function (next) {
  if (!this.paymentId) {
    const lastPayment = await mongoose.model('Payment').findOne().sort({ createdAt: -1 });
    let nextNumber = 1;
    if (lastPayment && lastPayment.paymentId) {
      nextNumber = parseInt(lastPayment.paymentId.replace('pay', ''), 10) + 1;
    }
    this.paymentId = `pay${String(nextNumber).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
