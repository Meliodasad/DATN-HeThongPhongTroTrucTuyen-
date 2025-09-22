const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const fs = require('fs');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const server = http.createServer(app);
const io = require('socket.io')(server, {
    transports: ['websocket'],
    credentials: true,
});
global.io = io;

// ✅ CORS cấu hình chuẩn để dùng cookie
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// ✅ Các middleware
app.use(express.static(path.join(__dirname, '../src')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ DB & Routes
const connectDB = require('./config/ConnectDB');
const routes = require('./routes/index');
connectDB();
routes(app);

// ✅ Gắn io vào request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ✅ Socket services
const socketServices = require('./services/socketServices');
global.io.on('connect', socketServices.connection);

// ✅ Các API AI
const { askQuestion } = require('./utils/Chatbot/chatbot');
const { AiSearch } = require('./utils/AISearch/AISearch');

app.post('/chat', async (req, res) => {
    const { question } = req.body;
    const data = await askQuestion(question);
    return res.status(200).json(data);
});

app.get('/ai-search', async (req, res) => {
    const { question } = req.query;
    const data = await AiSearch(question);
    return res.status(200).json(data);
});

// ✅ Xử lý lỗi chung
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server',
    });
});

// ✅ Dummy hot-search API (nếu cần)
let hotSearch = [];

// thêm console.log để debug
app.post('/api/add-search', (req, res) => {
    const { title } = req.body;
    console.log(`[HotSearch] Thêm từ khóa: ${title}`);

    const index = hotSearch.findIndex((item) => item.title === title);
    if (index !== -1) {
        hotSearch[index].count++;
    } else {
        hotSearch.push({ title, count: 1 });
    }
    return res.status(200).json({ message: 'Thêm từ khóa thành công' });
});

// ✅ API test đơn giản
app.get('/api/health-check', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        message: 'Server vẫn hoạt động bình thường 🚀',
    });
});

// ✅ Khởi động server
server.listen(port, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
