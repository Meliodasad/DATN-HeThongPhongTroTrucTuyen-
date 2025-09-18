const Payment = require('../models/Payment');
const User = require('../models/User');
const Contract = require('../models/Contract');
const vnpay = require('../config/vnpay');

function makeTxnRef() {
  return 'VNP' + Date.now(); 
}
exports.paymentResult = async (req, res) => {
  try {
    const { ref, status } = req.query; 
    if (!ref) return res.status(400).json({ success: false, message: 'Thiếu ref' });

    const payment = await Payment.findOne({
      $or: [{ vnpTxnRef: ref }, { paymentId: ref }]
    }).lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }

   
    let tenant = null;
    if (payment.tenantId) {
      tenant = await User.findOne({ userId: payment.tenantId })
        .select('userId fullName email phone')
        .lean();
    }
    const payload = {
      paymentId: payment.paymentId,
      contractId: payment.contractId,
      tenantId: payment.tenantId,
      amount: payment.amount,
      paymentStatus: payment.paymentStatus,         
      vnpTxnRef: payment.vnpTxnRef,
      vnpResponseCode: payment.vnpResponseCode,    
      vnpBankCode: payment.vnpBankCode,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      tenant,
      clientStatus: status || null
    };

    return res.json({ success: true, data: payload });
  } catch (err) {
    console.error('Lỗi paymentResult:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
exports.createVnpayPayment = async (req, res) => {
  try {
    const { tenantId, contractId, amount, extraNote } = req.body;

    const tenant = await User.findOne({ userId: tenantId });
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant không tồn tại' });

    const contract = await Contract.findOne({ contractId });
    if (!contract) return res.status(404).json({ success: false, message: 'Hợp đồng không tồn tại' });

    const vnpTxnRef = makeTxnRef();
    const payment = await Payment.create({
      tenantId,
      contractId,
      amount,
      extraNote,
      vnpTxnRef,
      paymentStatus: 'pending'
    });

    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const baseUrl = process.env.CLIENT_URL?.replace(/\/+$/, '') || `${req.protocol}://${req.get('host')}`;

    const payUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: amount * 100,
      vnp_TxnRef: vnpTxnRef,
      vnp_OrderInfo: `Thanh toán hợp đồng ${contractId}`,
      vnp_IpAddr: clientIp,
      vnp_ReturnUrl: `${baseUrl}/payments/vnpay/return`,
      vnp_Locale: 'vn',
      vnp_OrderType: 'other'
    });

    res.json({
      success: true,
      data: {
        paymentId: payment.paymentId,
        vnpTxnRef,
        payUrl
      }
    });
  } catch (err) {
    console.error('Lỗi tạo VNPay payment:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.vnpayReturn = async (req, res) => {
  try {
    const verify = await vnpay.verifyReturnUrl(req.query);
    const { vnp_TxnRef, vnp_ResponseCode, vnp_BankCode } = req.query;

    if (!vnp_TxnRef) return res.status(400).send('Thiếu vnp_TxnRef');

    if (verify.isSuccess && vnp_ResponseCode === '00') {
      await Payment.findOneAndUpdate(
        { vnpTxnRef: vnp_TxnRef },
        { paymentStatus: 'paid', vnpResponseCode: vnp_ResponseCode, vnpBankCode: vnp_BankCode, paidAt: new Date() }
      );
      return res.redirect(`/payments/payment-result?status=success&ref=${vnp_TxnRef}`);
    } else {
      await Payment.findOneAndUpdate(
        { vnpTxnRef: vnp_TxnRef },
        { paymentStatus: 'failed', vnpResponseCode: vnp_ResponseCode }
      );
      return res.redirect(`/payments/payment-result?status=failed&ref=${vnp_TxnRef}`);
    }
  } catch (err) {
    console.error('Lỗi verify return:', err);
    res.status(500).send('Lỗi verify');
  }
};

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
