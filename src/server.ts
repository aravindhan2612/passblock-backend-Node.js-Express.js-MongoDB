import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/authRoutes'
import { verifyToken } from './middleware/auth';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => console.log('MongoDB connected'))
.catch((err: Error) => console.log(err));

 app.use('/api/auth', authRouter);
 app.use('/api/protected', verifyToken);
//app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});