const { sequelize } = require('../config/database');
const User = require('./user.model');
const Note = require('./note.model');

module.exports = { sequelize, User, Note };
