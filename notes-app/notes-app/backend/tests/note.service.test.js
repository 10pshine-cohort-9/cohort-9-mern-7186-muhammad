process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const sinon = require('sinon');
const { Note } = require('../src/models');
const noteService = require('../src/services/note.service');

describe('Note Service', () => {
  afterEach(() => sinon.restore());

  describe('getNotesForUser', () => {
    it('returns notes scoped to the given user, newest/pinned first', async () => {
      const fakeNotes = [{ id: 1, title: 'Groceries' }];
      const findAllStub = sinon.stub(Note, 'findAll').resolves(fakeNotes);

      const result = await noteService.getNotesForUser(7, {});

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where).to.deep.equal({ userId: 7 });
      expect(result).to.deep.equal(fakeNotes);
    });
  });

  describe('getNoteById', () => {
    it('returns the note when it belongs to the user', async () => {
      const fakeNote = { id: 1, userId: 7, title: 'Groceries' };
      sinon.stub(Note, 'findOne').resolves(fakeNote);

      const result = await noteService.getNoteById(1, 7);
      expect(result).to.equal(fakeNote);
    });

    it('throws a 404 ApiError when the note does not exist', async () => {
      sinon.stub(Note, 'findOne').resolves(null);

      try {
        await noteService.getNoteById(999, 7);
        expect.fail('Expected getNoteById to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(404);
      }
    });
  });

  describe('createNote', () => {
    it('creates a note attached to the current user', async () => {
      const createStub = sinon.stub(Note, 'create').resolves({ id: 10, title: 'New Note', userId: 7 });

      const result = await noteService.createNote(7, { title: 'New Note', content: '<p>hi</p>' });

      expect(createStub.calledWithMatch({ title: 'New Note', userId: 7 })).to.be.true;
      expect(result.id).to.equal(10);
    });
  });

  describe('updateNote', () => {
    it('updates only allowed fields and saves the note', async () => {
      const fakeNote = { id: 1, userId: 7, title: 'Old', content: 'old', save: sinon.stub().resolves() };
      sinon.stub(Note, 'findOne').resolves(fakeNote);

      const result = await noteService.updateNote(1, 7, { title: 'New Title' });

      expect(result.title).to.equal('New Title');
      expect(fakeNote.save.calledOnce).to.be.true;
    });
  });

  describe('deleteNote', () => {
    it('destroys the note and returns its id', async () => {
      const fakeNote = { id: 1, userId: 7, destroy: sinon.stub().resolves() };
      sinon.stub(Note, 'findOne').resolves(fakeNote);

      const result = await noteService.deleteNote(1, 7);

      expect(fakeNote.destroy.calledOnce).to.be.true;
      expect(result).to.deep.equal({ id: 1 });
    });
  });
});
