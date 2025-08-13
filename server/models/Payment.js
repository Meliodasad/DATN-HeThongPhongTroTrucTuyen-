const mongoose = require('mongoose');

// Tạo auto-increment paymentId
let counter = 0;
async function generatePaymentId() {
  counter++;
  return `pay${String(counter).padStart(3, '0')}`;
}

const paymentSchema = new mongoose.Schema({
  paymentId: {
  type: String,
  unique: true,
  default: () => 'pay' + Math.floor(Math.random() * 1000000).toString().padStart(3, '0')
},
  tenantId: {
    type: String,
    ref: 'User', // Tham chiếu đến userId trong User
    required: true
  },
  contractId: {
    type: String,
    ref: 'Contract', // Tham chiếu đến contractId trong Contracts
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  extraNote: {
    type: String
  }
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
