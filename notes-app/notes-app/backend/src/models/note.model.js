const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: true, len: [1, 200] },
    },
    content: {
      // Stores rich-text HTML produced by the frontend editor
      type: DataTypes.TEXT('long'),
      allowNull: true,
      defaultValue: '',
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Note',
    tableName: 'notes',
    timestamps: true,
  }
);

// A user has many notes; a note belongs to a single user.
User.hasMany(Note, { foreignKey: 'userId', as: 'notes', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = Note;
