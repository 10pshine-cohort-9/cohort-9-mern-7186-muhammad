const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists.');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user.id);

  logger.info({ userId: user.id }, 'New user registered');
  return { user: user.toSafeObject(), token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const token = generateToken(user.id);
  logger.info({ userId: user.id }, 'User logged in');
  return { user: user.toSafeObject(), token };
};

module.exports = { registerUser, loginUser, generateToken };
