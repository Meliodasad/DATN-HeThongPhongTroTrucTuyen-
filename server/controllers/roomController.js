const Room = require('../models/Room');
const User = require('../models/User');
// const RoomApproval = require('../models/RoomApproval');
const asyncHandler = require('express-async-handler');
// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      roomType,
      location,
      minPrice,
      maxPrice,
      status,
      utilities,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (roomType) query.roomType = roomType;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;
    else query.status = 'available'; // Default to available rooms for public access
    
    if (minPrice || maxPrice) {
      if (minPrice || maxPrice) {
        query['price.monthly'] = {};
        if (minPrice) query['price.monthly'].$gte = parseInt(minPrice);
        if (maxPrice) query['price.monthly'].$lte = parseInt(maxPrice);
      }

    }
    
    if (utilities) {
      const utilitiesArray = utilities.split(',');
      query.utilities = { $in: utilitiesArray };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const rooms = await Room.find(query)
      .populate('hostId', 'fullName email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRooms: total,
          hasNextPage: skip + rooms.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public

const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id }).populate({
      path: 'hostId',
      select: 'fullName email phone avatar address'
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...room.toObject(),
        hostInfo: room.hostId  // đã được populate thành thông tin User
      }
    });

  } catch (error) {
    console.error('❌ Error in getRoom:', error);
    next(error);
  }
};


// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Host only)

const createRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      hostId: req.user.userId // Gán userId (string) từ người đang login
    };

    const newRoom = await Room.create(roomData);

    res.status(201).json({
      success: true,
      data: newRoom
    });
  } catch (err) {
    console.error('Lỗi tạo phòng:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Host only - own rooms)

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({ roomId: id });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // 🔁 So sánh userId (chuỗi) thay vì _id
    const currentUserId = req.user.userId || req.user._id.toString();

    if (
      room.hostId !== currentUserId &&  // dùng hostId là string
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    // Không cho phép sửa hostId
    delete req.body.hostId;

    const updatedRoom = await Room.findOneAndUpdate(
      { roomId: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedRoom
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Host only - own rooms)

const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params; // đây là roomId như "room202"

  const room = await Room.findOne({ roomId: id });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  // Kiểm tra quyền xoá
  if (
    room.hostId !== req.user.userId && // hostId là userId dạng string
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this room'
    });
  }

  await room.deleteOne(); // xóa bản ghi

  res.status(200).json({
    success: true,
    message: 'Xóa phòng thành công'
  });
});


// @desc    Get rooms by host
// @route   GET /api/rooms/host/:hostId
// @access  Public
const getRoomsByHost = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const rooms = await Room.find({ hostId: req.params.hostId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments({ hostId: req.params.hostId });

    res.status(200).json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRooms: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my rooms (for authenticated host)
// @route   GET /api/rooms/my-rooms
// @access  Private (Host only)
const getMyRooms = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { hostId: req.user.userId };
    if (status) query.status = status;

    const rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRooms: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByHost,
  getMyRooms
};