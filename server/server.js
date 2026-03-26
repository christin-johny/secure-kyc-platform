require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('KYC Auth API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});