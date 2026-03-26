require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Initialize the Express application
const app = express();

// --- Middlewares ---
// 1. Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet());

// 2. CORS (Cross-Origin Resource Sharing) allows our React frontend to communicate with this backend.
app.use(cors());

// 3. Body Parser parses incoming JSON requests (req.body).
app.use(express.json());


// --- Routes ---
// A basic test route to ensure the server is responding
app.get('/', (req, res) => {
  res.send('KYC Auth API is running...');
});


// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
