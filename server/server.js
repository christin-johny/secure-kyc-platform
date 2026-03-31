const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

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
  message: { success: false, error: 'Too many requests from this IP, please try again after 10 minutes.' }
});

app.use('/api', globalLimiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/kyc', require('./routes/kycRoutes'));

app.get('/', (req, res) => {
  res.send('KYC Auth API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});