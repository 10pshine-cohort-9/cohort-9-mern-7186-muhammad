process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const { expect } = require('chai');
const sinon = require('sinon');
const { User } = require('../src/models');
const authService = require('../src/services/auth.service');

describe('Auth Service', () => {
  afterEach(() => sinon.restore());

  describe('registerUser', () => {
    it('creates a new user and returns a token when the email is unused', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        id: 1,
        toSafeObject: () => ({ id: 1, name: 'Ali', email: 'ali@example.com' }),
      });

      const result = await authService.registerUser({
        name: 'Ali',
        email: 'ali@example.com',
        password: 'secret123',
      });

      expect(result).to.have.property('token').that.is.a('string');
      expect(result.user).to.deep.equal({ id: 1, name: 'Ali', email: 'ali@example.com' });
    });

    it('throws a conflict error when the email is already registered', async () => {
      sinon.stub(User, 'findOne').resolves({ id: 5, email: 'ali@example.com' });

      try {
        await authService.registerUser({
          name: 'Ali',
          email: 'ali@example.com',
          password: 'secret123',
        });
        expect.fail('Expected registerUser to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(409);
        expect(err.message).to.match(/already exists/i);
      }
    });
  });

  describe('loginUser', () => {
    it('returns a token when credentials are valid', async () => {
      const fakeUser = {
        id: 2,
        comparePassword: sinon.stub().resolves(true),
        toSafeObject: () => ({ id: 2, name: 'Sara', email: 'sara@example.com' }),
      };
      sinon.stub(User, 'findOne').resolves(fakeUser);

      const result = await authService.loginUser({ email: 'sara@example.com', password: 'correct' });

      expect(result.token).to.be.a('string');
      expect(result.user.email).to.equal('sara@example.com');
    });

    it('throws unauthorized when the user does not exist', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      try {
        await authService.loginUser({ email: 'nobody@example.com', password: 'x' });
        expect.fail('Expected loginUser to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
      }
    });

    it('throws unauthorized when the password does not match', async () => {
      const fakeUser = { id: 3, comparePassword: sinon.stub().resolves(false) };
      sinon.stub(User, 'findOne').resolves(fakeUser);

      try {
        await authService.loginUser({ email: 'sara@example.com', password: 'wrong' });
        expect.fail('Expected loginUser to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
        expect(err.message).to.match(/invalid email or password/i);
      }
    });
  });

  describe('generateToken', () => {
    it('produces a JWT containing the user id', () => {
      const jwt = require('jsonwebtoken');
      const token = authService.generateToken(42);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).to.equal(42);
    });
  });
});
