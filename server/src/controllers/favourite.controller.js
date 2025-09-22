const modelFavourite = require('../models/favourite.model');
const modelUser = require('../models/users.model');
const modelPost = require('../models/post.model');

const { Created, OK } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

class controllerFavourite {
    // ✅ Thêm vào yêu thích
    async createFavourite(req, res) {
        const { id } = req.user;
        const { postId } = req.body;

        // TODO: validate thêm trường hợp postId không có
        if (!postId) {
            throw new BadRequestError('Thiếu postId');
        }

        const findUser = await modelUser.findById(id);
        const findPost = await modelPost.findById(postId);

        if (!findPost) {
            throw new BadRequestError('Bài đăng không tồn tại');
        }

        const findFavourite = await modelFavourite.findOne({ userId: id, postId });
        if (findFavourite) {
            throw new BadRequestError('Bạn đã thêm vào yêu thích');
        }

        const favourite = await modelFavourite.create({ userId: id, postId });

        // DEBUG log
        console.log(`[Favourite] User ${id} -> Post ${postId}`);

        // NOTE: push noti qua socket nếu user đang online
        const socket = global.usersMap.get(findPost.userId.toString());
        if (socket) {
            socket.emit('new-favourite', {
                favourite,
                avatar: findUser.avatar,
                content: `${findUser.fullName} đã thêm tin đăng ${findPost.title} vào yêu thích`,
            });
        }

        return new Created({
            message: 'Thêm vào yêu thích thành công',
            metadata: favourite,
        }).send(res);
    }

    // ✅ Xóa khỏi yêu thích
    async deleteFavourite(req, res) {
        const { id } = req.user;
        const { postId } = req.body;

        if (!postId) {
            throw new BadRequestError('Thiếu postId');
        }

        const findFavourite = await modelFavourite.findOne({ userId: id, postId });
        if (!findFavourite) {
            throw new BadRequestError('Bạn chưa thêm vào yêu thích');
        }

        await modelFavourite.deleteOne({ userId: id, postId });

        // DEBUG log
        console.log(`[Favourite] Deleted -> User ${id}, Post ${postId}`);

        return new OK({
            message: 'Xóa khỏi yêu thích thành công',
        }).send(res);
    }

    // ✅ Lấy danh sách yêu thích
    async getFavourite(req, res) {
        const { id } = req.user;
        const findFavourite = await modelFavourite.find({ userId: id });

        // TODO: paginate để tối ưu hiệu suất
        const findPost = await modelPost.find({
            _id: { $in: findFavourite.map((item) => item.postId) },
        });

        return new OK({
            message: 'Lấy danh sách yêu thích thành công',
            count: findPost.length, // thêm số lượng cho tiện
            metadata: findPost,
        }).send(res);
    }
}

module.exports = new controllerFavourite();
