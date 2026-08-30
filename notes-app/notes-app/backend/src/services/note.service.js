const { Op } = require('sequelize');
const { Note } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getNotesForUser = async (userId, { search } = {}) => {
  const where = { userId };
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
    ];
  }

  return Note.findAll({
    where,
    order: [
      ['isPinned', 'DESC'],
      ['updatedAt', 'DESC'],
    ],
  });
};

const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) {
    throw ApiError.notFound('Note not found.');
  }
  return note;
};

const createNote = async (userId, { title, content }) => {
  const note = await Note.create({ title, content, userId });
  logger.info({ noteId: note.id, userId }, 'Note created');
  return note;
};

const updateNote = async (noteId, userId, updates) => {
  const note = await getNoteById(noteId, userId);
  const allowedFields = ['title', 'content', 'isPinned'];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) note[field] = updates[field];
  });
  await note.save();
  logger.info({ noteId: note.id, userId }, 'Note updated');
  return note;
};

const deleteNote = async (noteId, userId) => {
  const note = await getNoteById(noteId, userId);
  await note.destroy();
  logger.info({ noteId, userId }, 'Note deleted');
  return { id: noteId };
};

module.exports = { getNotesForUser, getNoteById, createNote, updateNote, deleteNote };
