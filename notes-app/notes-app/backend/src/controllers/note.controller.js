const asyncHandler = require('../utils/asyncHandler');
const noteService = require('../services/note.service');
const { validateNoteInput } = require('../utils/validators');

// @route   GET /api/notes?search=term
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotesForUser(req.user.id, { search: req.query.search });
  res.status(200).json({ success: true, data: { notes, count: notes.length } });
});

// @route   GET /api/notes/:id
// @access  Private
const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: { note } });
});

// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  validateNoteInput(req.body);
  const note = await noteService.createNote(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Note created', data: { note } });
});

// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  if (req.body.title !== undefined) validateNoteInput(req.body);
  const note = await noteService.updateNote(req.params.id, req.user.id, req.body);
  res.status(200).json({ success: true, message: 'Note updated', data: { note } });
});

// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: 'Note deleted' });
});

module.exports = { getNotes, getNote, createNote, updateNote, deleteNote };
