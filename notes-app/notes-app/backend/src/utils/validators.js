const ApiError = require('./ApiError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || name.trim().length < 2) {
    throw ApiError.badRequest('Name must be at least 2 characters long.');
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    throw ApiError.badRequest('A valid email address is required.');
  }
  if (!password || password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters long.');
  }
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw ApiError.badRequest('A valid email address is required.');
  }
  if (!password) {
    throw ApiError.badRequest('Password is required.');
  }
};

const validateNoteInput = ({ title }) => {
  if (!title || !title.trim()) {
    throw ApiError.badRequest('Note title is required.');
  }
  if (title.length > 200) {
    throw ApiError.badRequest('Note title must be under 200 characters.');
  }
};

module.exports = { validateRegisterInput, validateLoginInput, validateNoteInput };
