import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('API is running');
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server đang chạy tại http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ Lỗi kết nối MongoDB:', err));
