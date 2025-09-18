
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
// Tạo booking mới
// Xoá booking theo bookingId
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const actor = req.user;

    // Tìm booking
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
    }

    const isHostOrAdmin = actor.role === 'host' || actor.role === 'admin';
    const isTenant = actor.role === 'tenant';

    // Nếu là tenant, phải là chủ booking và chưa approved
    if (isTenant) {
      if (booking.tenantId !== actor.userId) {
        return res.status(403).json({ success: false, message: 'Không thể xoá booking của người khác' });
      }
      if (booking.status === 'approved') {
        return res.status(400).json({ success: false, message: 'Không thể xoá booking đã được duyệt' });
      }
    } else if (!isHostOrAdmin) {
      return res.status(403).json({ success: false, message: 'Không có quyền xoá booking' });
    }

    await booking.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Xoá booking thành công',
      data: { bookingId }
    });
  } catch (err) {
    console.error('deleteBooking error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { roomId, startDate, endDate, note } = req.body;

    // Lấy user từ token
    const user = req.user;

    // Kiểm tra vai trò là tenant
    if (user.role !== 'tenant') {
      return res.status(403).json({ success: false, message: 'Chỉ tenant mới được đặt phòng' });
    }

    // Kiểm tra roomId có tồn tại trong Room không
    const room = await Room.findOne({ roomId }); // roomId là mã phòng riêng
    if (!room) {
      return res.status(404).json({ success: false, message: 'Phòng không tồn tại' });
    }

    // Tạo mã bookingId ngẫu nhiên
    const bookingId = `BKG-${uuidv4().slice(0, 8)}`;

    // Tạo bản ghi booking mới
    const newBooking = await Booking.create({
      bookingId,
      roomId,
      tenantId: user.userId, // lấy userId từ token
      startDate,
      endDate,
      note,
    });

    res.status(201).json({
      success: true,
      message: 'Đặt phòng thành công',
      data: newBooking,
    });
  } catch (error) {
    console.error('[ERROR]', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
// Lấy tất cả bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('roomId', 'roomId title')
      .populate('tenantId', 'name email');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy các bookings của người thuê hiện tại
exports.getMyBookings = async (req, res) => {
  try {
    const myBookings = await Booking.find({ tenantId: req.user.userId })
      .populate('roomId', 'roomId title');

    res.status(200).json({
      success: true,
      count: myBookings.length,
      data: myBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật trạng thái booking theo bookingId 
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Tìm booking theo bookingId (là chuỗi như BKG-23913175)
    const booking = await Booking.findOne({ bookingId: bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    // Cập nhật trạng thái nếu được gửi lên từ client
    if (req.body.status) {
      booking.status = req.body.status;
    }

    // Cập nhật thời gian cập nhật
    booking.updatedAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái booking thành công',
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + err.message
    });
  }
};
