import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db';
import * as ERRORS from './constants/errors';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import kycRoutes from './routes/kycRoutes';

dotenv.config();
connectDB();

const app = express();
 
app.set('trust proxy', 1);
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 1000,
  message: { success: false, error: ERRORS.SECURITY.GLOBAL_RATE_LIMIT }
});

app.use('/api', globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kyc', kycRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});