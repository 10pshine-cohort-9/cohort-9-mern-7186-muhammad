const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requestLogger = require('./middleware/requestLogger.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const apiRouter = require('./routes');

const app = express();
app.disable('x-powered-by');

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // logs every request/response via Pino

// --- Routes ---
app.use('/api', apiRouter);

// --- 404 + global exception handling ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
