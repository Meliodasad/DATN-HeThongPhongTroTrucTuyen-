const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByHost,
  getMyRooms
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('host', 'admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, authorize('host', 'admin'), updateRoom)
  .delete(protect, authorize('host', 'admin'), deleteRoom);

router.get('/host/:hostId', getRoomsByHost);
router.get('/my/rooms', protect, authorize('host'), getMyRooms);

module.exports = router;