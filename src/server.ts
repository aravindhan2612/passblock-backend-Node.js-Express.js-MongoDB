import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/authRoutes'
import passwordRouter from './routes/passwordRoutes';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/passblockdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log(err));

app.use('/api/auth', authRouter);
app.use('/api/passwords', passwordRouter)

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});