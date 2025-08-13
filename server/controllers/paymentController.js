const Payment = require('../models/Payment');
const User = require('../models/User');
const Contract = require('../models/Contract');

// Tạo thanh toán mới (Host/Admin)
exports.createPayment = async (req, res) => {
  try {
    const { tenantId, contractId, amount, paymentDate, paymentStatus, extraNote } = req.body;

    // Kiểm tra tenantId có tồn tại trong User không
    const tenant = await User.findOne({ userId: tenantId });
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant không tồn tại' });
    }

    // Kiểm tra contractId có tồn tại không
    const contract = await Contract.findOne({ contractId });
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Hợp đồng không tồn tại' });
    }

    const payment = await Payment.create({
      tenantId,
      contractId,
      amount,
      paymentDate,
      paymentStatus,
      extraNote
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error("Lỗi tạo thanh toán:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách thanh toán
exports.getPayments = async (req, res) => {
  try {
    let query = {};

    // Nếu là tenant => chỉ lấy thanh toán của mình
    if (req.user.role === 'tenant') {
      query.tenantId = req.user.userId;
    }

    const payments = await Payment.find(query);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Lỗi lấy danh sách thanh toán:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật thanh toán
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { paymentId: req.params.id }, // Tìm theo paymentId
      req.body,
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thanh toán' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Lỗi cập nhật thanh toán:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
