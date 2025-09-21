// controllers/invoiceController.js
const Invoice = require('../models/Invoice');

// GET /api/invoices
// Query hỗ trợ: page, limit, status, paymentType, contractId, userId, sortBy, sortOrder
exports.getInvoices = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentType,
      contractId,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentType) query.paymentType = paymentType;
    if (contractId) query.contractId = contractId;
    if (userId) query.userId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [items, total] = await Promise.all([
      Invoice.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Invoice.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          hasNextPage: skip + items.length < total,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices/contract/:contractId
exports.getInvoicesByContract = async (req, res, next) => {
  try {
    const { contractId } = req.params;
    const items = await Invoice.find({ contractId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices/user/:userId
exports.getInvoicesByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const items = await Invoice.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// body: { contractId, roomId, userId, paymentType, amount, status?, note? }
exports.createInvoice = async (req, res, next) => {
  try {
    const { contractId, roomId, userId, paymentType, amount, status, note } = req.body;

    if (!contractId || !roomId || !userId || !paymentType || amount == null) {
      return res.status(400).json({ success: false, message: 'Thiếu trường bắt buộc' });
    }

    const created = await Invoice.create({
      contractId,
      roomId,
      userId,
      paymentType,
      amount,
      status, 
      note   
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};


exports.deleteInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const deleted = await Invoice.findOneAndDelete({ invoiceId }).lean();
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy invoice' });
    }
    return res.status(200).json({ success: true, message: 'Đã xóa', data: deleted });
  } catch (err) {
    next(err);
  }
};
