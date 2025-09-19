const Statistics = require('../models/Statistics');
const Room = require('../models/Room');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Contract = require('../models/Contract');

// Thống kê cho Admin
exports.getAdminStats = async (req, res) => {
  try {
    // Nếu bạn muốn tính tự động từ các collection
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalRevenueAggregate = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalRevenue = totalRevenueAggregate[0]?.total || 0;
    const totalBookings = await Booking.countDocuments();
    const totalContracts = await Contract.countDocuments();
    const newUsers = await User.countDocuments({ createdAt: { $gte: new Date(new Date() - 30*24*60*60*1000) } });
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(new Date() - 7*24*60*60*1000) } });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRooms,
        totalRevenue,
        totalBookings,
        totalContracts,
        newUsers,
        activeUsers
      }
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Thống kê cho Host
exports.getHostStats = async (req, res) => {
  try {
    const hostId = req.user.userId; // tham chiếu từ token

    const totalRooms = await Room.countDocuments({ hostId });
    const totalBookings = await Booking.countDocuments({ hostId });
    const totalRevenueAggregate = await Booking.aggregate([
      { $match: { hostId } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalRevenue = totalRevenueAggregate[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        totalBookings,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('getHostStats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Thống kê cho Tenant
exports.getTenantStats = async (req, res) => {
  try {
    const tenantId = req.user.userId; // tham chiếu từ token

    const totalBookings = await Booking.countDocuments({ tenantId });
    const totalContracts = await Contract.countDocuments({ tenantId });
    const totalSpentAggregate = await Booking.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalSpent = totalSpentAggregate[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalContracts,
        totalSpent
      }
    });
  } catch (error) {
    console.error('getTenantStats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
