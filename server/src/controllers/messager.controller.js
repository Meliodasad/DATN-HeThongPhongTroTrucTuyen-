const { BadRequestError } = require('../core/error.response');
const modelMessager = require('../models/Messager.model');
const modelUser = require('../models/users.model');

const { Created, OK } = require('../core/success.response');

class controllerMessager {
    // ✅ Tạo tin nhắn mới
    async createMessage(req, res) {
        const { id } = req.user;
        const { receiverId, message } = req.body;

        if (!receiverId || !message) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }

        const newMessage = await modelMessager.create({
            senderId: id,
            receiverId,
            message,
            isRead: false,
        });

        // DEBUG log
        console.log(`[Message] ${id} -> ${receiverId}: ${message}`);

        // Gửi socket cho người nhận nếu online
        const socket = global.usersMap.get(receiverId.toString());
        if (socket) {
            socket.emit('new-message', { message: newMessage });
        }

        // TODO: nên paginate thay vì lấy hết messages
        const messages = await modelMessager.find({
            $or: [
                { senderId: id, receiverId },
                { senderId: receiverId, receiverId: id },
            ],
        });

        if (messages.length <= 1) {
            if (socket) {
                socket.emit('new-user-message', { message: newMessage });
            }
            return new Created({
                message: 'Tạo tin nhắn thành công',
                metadata: newMessage,
            }).send(res);
        }

        return new Created({
            message: 'Tạo tin nhắn thành công',
            metadata: newMessage,
        }).send(res);
    }

    // ✅ Lấy toàn bộ tin nhắn với 1 user
    async getMessages(req, res) {
        const { id } = req.user;
        const { receiverId } = req.query;

        // TODO: validate receiverId trước khi query
        const messages = await modelMessager
            .find({
                $or: [
                    { senderId: id, receiverId },
                    { senderId: receiverId, receiverId: id },
                ],
            })
            .sort({ createdAt: 1 });

        // DEBUG log
        console.log(`[Message] getMessages ${id} <-> ${receiverId} : ${messages.length} messages`);

        await modelMessager.updateMany(
            { senderId: receiverId, receiverId: id, isRead: false },
            { isRead: true },
        );

        return new OK({
            message: 'Lấy tin nhắn thành công',
            count: messages.length,
            metadata: messages,
        }).send(res);
    }

    // ✅ Đánh dấu 1 tin nhắn đã đọc
    async markMessageAsRead(req, res) {
        const { id } = req.user;
        const { messageId } = req.body;

        if (!messageId) {
            throw new BadRequestError('Vui lòng cung cấp ID tin nhắn');
        }

        const updatedMessage = await modelMessager.findOneAndUpdate(
            { _id: messageId, receiverId: id, isRead: false },
            { isRead: true },
            { new: true },
        );

        if (!updatedMessage) {
            throw new BadRequestError('Không tìm thấy tin nhắn hoặc tin nhắn đã được đọc');
        }

        console.log(`[Message] markMessageAsRead ${messageId}`);

        return new OK({
            message: 'Đánh dấu tin nhắn đã đọc thành công',
            metadata: updatedMessage,
        }).send(res);
    }

    // ✅ Đánh dấu toàn bộ tin nhắn từ 1 user đã đọc
    async markAllMessagesAsRead(req, res) {
        const { id } = req.user;
        const { senderId } = req.body;

        if (!senderId) {
            throw new BadRequestError('Vui lòng cung cấp ID người gửi');
        }

        const result = await modelMessager.updateMany(
            { senderId, receiverId: id, isRead: false },
            { isRead: true },
        );

        // DEBUG log
        console.log(`[Message] markAllMessagesAsRead ${senderId} -> ${id}, updated: ${result.modifiedCount}`);

        const socket = global.usersMap.get(senderId.toString());
        if (socket) {
            socket.emit('messages-read', { readerId: id, count: result.modifiedCount });
        }

        return new OK({
            message: 'Đánh dấu tất cả tin nhắn đã đọc thành công',
            metadata: { updatedCount: result.modifiedCount },
        }).send(res);
    }

    // ✅ Lấy danh sách user đã nhắn tin với mình
    async getMessagesByUserId(req, res) {
        const { id } = req.user;

        // TODO: có thể optimize query bằng aggregate
        const messages = await modelMessager.find({
            $or: [{ senderId: id }, { receiverId: id }],
        });

        const uniqueUserIds = [
            ...new Set([
                ...messages.filter((msg) => msg.senderId !== id).map((msg) => msg.senderId),
                ...messages.filter((msg) => msg.receiverId !== id).map((msg) => msg.receiverId),
            ]),
        ];

        const users = await modelUser.find({ _id: { $in: uniqueUserIds } });

        const userMap = {};
        users.forEach((user) => {
            const userId = user._id.toString();
            let statusUser = 'Đang offline';
            if (global.usersMap.get(userId)) {
                statusUser = 'Đang hoạt động';
            }
            userMap[userId] = {
                id: user._id,
                username: user.fullName,
                avatar: user.avatar,
                status: statusUser,
            };
        });

        const unreadCounts = {};
        messages.forEach((msg) => {
            if (msg.receiverId.toString() === id && !msg.isRead) {
                const senderId = msg.senderId.toString();
                if (!unreadCounts[senderId]) {
                    unreadCounts[senderId] = 0;
                }
                unreadCounts[senderId]++;
            }
        });

        const result = uniqueUserIds
            .map((userId) => {
                const userIdStr = userId.toString();
                const userMessages = messages.filter(
                    (msg) =>
                        (msg.senderId.toString() === userIdStr && msg.receiverId.toString() === id) ||
                        (msg.senderId.toString() === id && msg.receiverId.toString() === userIdStr),
                );

                const lastMessage =
                    userMessages.length > 0
                        ? userMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                        : null;

                return {
                    sender: userMap[userIdStr] || { id: userIdStr },
                    unreadCount: unreadCounts[userIdStr] || 0,
                    lastMessage,
                };
            })
            .filter((item) => item.lastMessage !== null);

        console.log(`[Message] getMessagesByUserId ${id} -> ${result.length} conversations`);

        return new OK({
            message: 'Lấy tin nhắn thành công',
            count: result.length,
            metadata: result,
        }).send(res);
    }
}

module.exports = new controllerMessager();
