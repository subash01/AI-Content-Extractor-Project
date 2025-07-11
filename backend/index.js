const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const contentRoutes = require('./routes/content.routes');
const errorHandler = require('./middlewares/error.middleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.'
});

app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

// Routes
app.use('/extract', contentRoutes);

// Centralized Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});