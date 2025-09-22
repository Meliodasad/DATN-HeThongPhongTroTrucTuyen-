const usersMap = new Map();
global.usersMap = usersMap;

const cookie = require('cookie');
const { verifyToken } = require('./tokenSevices');

class SocketServices {
    connection(socket) {
        try {
            // Parse cookie từ header
            const { token } = cookie.parse(socket.handshake.headers.cookie || '');
            console.log('Cookie nhận được:', socket.handshake.headers.cookie); // log thêm cho dễ debug

            if (!token) {
                console.warn('Không tìm thấy token trong cookie');
                return socket.disconnect();
            }

            verifyToken(token)
                .then((dataDecode) => {
                    if (dataDecode) {
                        // Lưu thông tin người dùng vào map khi kết nối thành công
                        usersMap.set(dataDecode.id.toString(), socket);
                        console.log(`✅ User connected: ${dataDecode.id}`);

                        // Gửi thông báo test đến client khi connect
                        socket.emit('welcome', { message: 'Kết nối socket thành công 🎉' });

                        // Xử lý khi người dùng ngắt kết nối
                        socket.on('disconnect', (reason) => {
                            console.log(`❌ User disconnected: ${dataDecode.id}, reason: ${reason}`);
                            usersMap.delete(dataDecode.id.toString());
                        });

                        // Thêm 1 event giả để test
                        socket.on('ping-server', () => {
                            console.log(`📡 Ping từ user: ${dataDecode.id}`);
                            socket.emit('pong-client', { time: new Date() });
                        });
                    } else {
                        console.warn('Token không hợp lệ');
                        socket.disconnect();
                    }
                })
                .catch((error) => {
                    console.error('❌ Socket authentication error:', error.message);
                    socket.disconnect();
                });
        } catch (error) {
            console.error('❌ Socket connection error:', error.message);
            return socket.disconnect();
        }
    }
}

module.exports = new SocketServices();
