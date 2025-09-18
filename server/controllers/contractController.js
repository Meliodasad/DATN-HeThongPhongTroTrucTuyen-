const Contract = require('../models/Contract');
const Room = require('../models/Room');
const User = require('../models/User');
const Booking = require('../models/Booking');
// Tạo hợp đồng mới
exports.createContract = async (req, res, next) => {
  try {
    const { roomId, tenantId, duration, rentPrice, terms, startDate, endDate, bookingId } = req.body;

    // // Log request đầu vào
    // console.log('[DEBUG] Dữ liệu yêu cầu:', { roomId, tenantId, duration, rentPrice, terms, startDate });
    // console.log('[DEBUG] Thông tin người dùng hiện tại:', req.user);

    // Kiểm tra phòng có tồn tại không
    const room = await Room.findOne({ roomId });
    if (!room) {
      console.log(`[ERROR] Không tìm thấy phòng với roomId: ${roomId}`);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    // Kiểm tra người thuê có tồn tại không
    const tenant = await User.findOne({ userId: tenantId });
    if (!tenant) {
    //   console.log(`[ERROR] Không tìm thấy người thuê với userId: ${tenantId}`);
      return res.status(404).json({
        success: false,
        message: 'Người thuê không tồn tại'
      });
    }

    // Kiểm tra quyền truy cập
    if (req.user.role !== 'admin' && room.hostId !== req.user.userId) {
    //   console.log(`[ERROR] Người dùng không có quyền tạo hợp đồng. Role: ${req.user.role}, HostID: ${room.hostId}, CurrentUser: ${req.user.userId}`);
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền tạo hợp đồng cho phòng này'
      });
    }

    // Kiểm tra nếu đã có hợp đồng active
    const existingContract = await Contract.findOne({ roomId, status: 'active' });
    if (existingContract) {
    //   console.log(`[ERROR] Đã tồn tại hợp đồng active cho phòng: ${roomId}`);
      return res.status(400).json({
        success: false,
        message: 'Phòng đã có hợp đồng đang hoạt động'
      });
    }

    // Tạo hợp đồng
      const contract = await Contract.create({
      contractId: `CT-${Date.now()}`,
      bookingId,                        
      roomId,
      tenantId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),        
      duration,
      rentPrice,
      terms
    });
    // Cập nhật trạng thái phòng
    await Room.findOneAndUpdate({ roomId }, { status: 'rented' });

    // console.log('[DEBUG] Hợp đồng đã tạo:', contract);

    res.status(201).json({
      success: true,
      message: 'Tạo hợp đồng thành công',
      data: contract
    });
  } catch (error) {
    console.error('[FATAL ERROR] Khi tạo hợp đồng:', error);
    next(error);
  }
};
// Lấy tất cả hợp đồng (chỉ admin)
// Lấy tất cả hợp đồng (chỉ admin)
exports.getAllContracts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, roomId, tenantId, contractId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Lọc theo mã (không phải _id)
    if (status) query.status = status;
    if (roomId) query.roomId = roomId;
    if (tenantId) query.tenantId = tenantId;
    if (contractId) query.contractId = contractId;

    // Lấy danh sách contract
    const contracts = await Contract.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // dùng lean() để có thể chỉnh sửa object kết quả

    // Populate thủ công theo roomId, tenantId, bookingId
    for (const contract of contracts) {
      const room = await Room.findOne({ roomId: contract.roomId }).select('roomId roomTitle location');
      const tenant = await User.findOne({ userId: contract.tenantId }).select('userId fullName email phone');
      const booking = await Booking.findOne({ bookingId: contract.bookingId }).select('bookingId startDate');

      contract.roomInfo = room || null;
      contract.tenantInfo = tenant || null;
      contract.bookingInfo = booking || null;
    }

    const total = await Contract.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        contracts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalContracts: total
        }
      }
    });
  } catch (error) {
    console.error('[getAllContracts] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hợp đồng',
      error: error.message
    });
  }
};
// Lấy chi tiết hợp đồng theo contractId
// @desc    Lấy thông tin 1 hợp đồng bằng contractId
// @route   GET /api/contracts/:contractId
// @access  Admin, Host hoặc Tenant liên quan
// exports.getSingleContract = async (req, res) => {
//   const { contractId } = req.params;
//   console.log(`[DEBUG] Đang tìm contractId: ${contractId}`);

//   try {
//     const contract = await Contract.findOne({ contractId });

//     if (!contract) {
//       console.warn(`[WARN] Không tìm thấy hợp đồng với contractId: ${contractId}`);
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy hợp đồng',
//       });
//     }

//     // Lấy thêm thông tin booking, room, tenant theo custom ID
//     const [room, booking, tenant] = await Promise.all([
//       Room.findOne({ roomId: contract.roomId }).select('roomId roomTitle location price images hostId'),
//       Booking.findOne({ bookingId: contract.bookingId }).select('bookingId createdAt totalPrice'),
//       User.findOne({ userId: contract.tenantId }).select('userId fullName email phone'),
//     ]);

//     // ✅ Kiểm tra quyền
//     const isAdmin = req.user?.role === 'admin';
//     const isOwner = room?.hostId === req.user?.userId;
//     const isTenant = tenant?.userId === req.user?.userId;

//     if (!isAdmin && !isOwner && !isTenant) {
//       console.warn('[WARN] Truy cập bị từ chối do không có quyền');
//       return res.status(403).json({
//         success: false,
//         message: 'Bạn không có quyền xem hợp đồng này',
//       });
//     }

//     console.log('[INFO] Hợp đồng được tìm thấy và trả về thành công');

//     res.status(200).json({
//       success: true,
//       data: {
//         ...contract.toObject(),
//         roomInfo: room || null,
//         bookingInfo: booking || null,
//         tenantInfo: tenant || null
//       },
//     });
//   } catch (error) {
//     console.error('[ERROR] Lỗi khi lấy hợp đồng:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi server khi lấy chi tiết hợp đồng',
//       error: error.message,
//     });
//   }
// };
exports.getSingleContract = async (req, res) => {
  const { contractId } = req.params;
  console.log(`[DEBUG] Đang tìm contractId: ${contractId}`);

  try {
    const contract = await Contract.findOne({ contractId });

    if (!contract) {
      console.warn(`[WARN] Không tìm thấy hợp đồng với contractId: ${contractId}`);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hợp đồng',
      });
    }

    // Lấy thêm thông tin room, tenant theo custom ID
    const [room, tenant] = await Promise.all([
      Room.findOne({ roomId: contract.roomId }).select('roomId roomTitle location price images hostId'),
      User.findOne({ userId: contract.tenantId }).select('userId fullName email phone'),
    ]);

    // ✅ Kiểm tra quyền
    const isAdmin = req.user?.role === 'admin';
    const isOwner = room?.hostId === req.user?.userId;
    const isTenant = tenant?.userId === req.user?.userId;

    if (!isAdmin && !isOwner && !isTenant) {
      console.warn('[WARN] Truy cập bị từ chối do không có quyền');
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem hợp đồng này',
      });
    }

    console.log('[INFO] Hợp đồng được tìm thấy và trả về thành công');

    res.status(200).json({
      success: true,
      data: {
        ...contract.toObject(),
        roomInfo: room || null,
        tenantInfo: tenant || null
      },
    });
  } catch (error) {
    console.error('[ERROR] Lỗi khi lấy hợp đồng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết hợp đồng',
      error: error.message,
    });
  }
};