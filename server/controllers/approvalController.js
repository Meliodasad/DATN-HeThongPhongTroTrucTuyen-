const Approval = require('../models/RoomApproval');

// Lấy danh sách approvals
exports.getRoomApprovals = async (req, res) => {
  try {
    console.log('🔍 Bắt đầu lấy danh sách approvals...');
    
    const approvals = await Approval.find().populate('requestedBy', 'name email');
    // console.log(`📦 Số lượng tìm thấy: ${approvals.length}`);
    // console.log('📄 Dữ liệu:', approvals);

    res.status(200).json({
      success: true,
      count: approvals.length,
      data: approvals
    });
  } catch (err) {
    // console.error('❌ Lỗi khi lấy approvals:', err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Lấy chi tiết 1 approval theo approvalId
exports.getSingleApproval = async (req, res) => {
  try {
    // console.log(`🔍 Tìm approvalId: ${req.params.id}`);
    
    const approval = await Approval.findOne({ approvalId: req.params.id })
      .populate('requestedBy', 'name email');

    if (!approval) {
      console.warn('⚠️ Không tìm thấy approval');
      return res.status(404).json({ success: false, error: 'Approval not found' });
    }

    // console.log('📄 Dữ liệu tìm thấy:', approval);

    res.status(200).json({ success: true, data: approval });
  } catch (err) {
    // console.error('❌ Lỗi khi lấy approval:', err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Cập nhật trạng thái approval
exports.updateApprovalStatus = async (req, res) => {
  try {
    // console.log(`🔄 Cập nhật approvalId: ${req.params.id}, Trạng thái mới: ${req.body.status}`);

    const approval = await Approval.findOneAndUpdate(
      { approvalId: req.params.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!approval) {
      // console.warn('⚠️ Không tìm thấy approval để cập nhật');
      return res.status(404).json({ success: false, error: 'Approval not found' });
    }

    // console.log('✅ Cập nhật thành công:', approval);

    res.status(200).json({ success: true, data: approval });
  } catch (err) {
    // console.error('❌ Lỗi khi cập nhật approval:', err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
