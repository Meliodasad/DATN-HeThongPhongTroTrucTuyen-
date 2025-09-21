const mongoose = require('mongoose');
const { generateInvoiceId } = require('../utils/generateId');

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true,
        default: generateInvoiceId,
        immutable: true
    },
    contractId: {
        type: String,
        required: true,
        ref: 'Contract'
    },
    roomId: {
        type: String,
        required: true,
        ref: 'Room'
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    paymentType: {
        type: String,
        enum: ['electricity', 'water', 'service', 'room', 'other'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be >= 0']
    },
    status: {
        type: String,
        enum: ['unpaid', 'paid', 'pending'],
        default: 'unpaid'
    },
    note: {
        type: String,
        trim: true,
        maxlength: [500, 'Note cannot be more than 500 characters']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Auto cập nhật updatedAt khi save
invoiceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
