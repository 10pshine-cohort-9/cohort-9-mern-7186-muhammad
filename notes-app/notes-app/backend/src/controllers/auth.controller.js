const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  validateRegisterInput(req.body);
  const { user, token } = await authService.registerUser(req.body);
  res.status(201).json({
  success: true,
  message: 'Registration successful',
  data: { user, token },
});
});

// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  validateLoginInput(req.body);
  const { user, token } = await authService.loginUser(req.body);
  res.status(200).json({
  success: true,
  message: 'Login successful',
  data: { user, token },
});
});

// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user.toSafeObject() } });
});

// @route   POST /api/auth/logout
// @access  Private
// JWTs are stateless, so logout is handled client-side by discarding the
// token. This endpoint exists for a consistent API and future token
// blacklisting if needed.
const logout = asyncHandler(async (req, res) => {
  req.log.info({ userId: req.user.id }, 'User logged out');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = { register, login, getMe, logout };
