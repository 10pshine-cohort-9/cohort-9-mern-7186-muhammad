process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Notes API (integration)', () => {
  let token;

  before(async () => {
    // Fresh in-memory SQLite schema for this test run
    await sequelize.sync({ force: true });
  });

  after(async () => {
    await sequelize.close();
  });

  it('registers a new user via POST /api/auth/register', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.token).to.be.a('string');
    token = res.body.data.token;
  });

  it('rejects duplicate registration with 409', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).to.equal(409);
    expect(res.body.success).to.be.false;
  });

  it('logs in with correct credentials via POST /api/auth/login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).to.equal(200);
    expect(res.body.data.token).to.be.a('string');
  });

  it('rejects requests to protected routes without a token (401)', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).to.equal(401);
  });

  let createdNoteId;

  it('creates a note for the authenticated user', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My First Note', content: '<p>Hello world</p>' });

    expect(res.status).to.equal(201);
    expect(res.body.data.note.title).to.equal('My First Note');
    createdNoteId = res.body.data.note.id;
  });

  it('lists notes for the authenticated user', async () => {
    const res = await request(app).get('/api/notes').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.data.notes).to.have.length(1);
  });

  it('updates the note', async () => {
    const res = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.status).to.equal(200);
    expect(res.body.data.note.title).to.equal('Updated Title');
  });

  it('deletes the note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });

  it('returns 404 for an unknown route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).to.equal(404);
    expect(res.body.success).to.be.false;
  });
});
