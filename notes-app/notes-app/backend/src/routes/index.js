const express = require('express');
const authRoutes = require('./auth.routes');
const noteRoutes = require('./note.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);

module.exports = router;
