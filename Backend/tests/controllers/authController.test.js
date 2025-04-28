// tests/controllers/authController.test.js

jest.mock('../../models/Signup', () => ({
  countDocuments: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
}));

const SignupModel = require('../../models/Signup');
const authController = require('../../controllers/authController');
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');

// Stub bcrypt & jwt
bcrypt.hash    = jest.fn();
bcrypt.compare = jest.fn();
jwt.sign      = jest.fn();

describe('authController.registerUser', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    req = { body: { name: 'Alice', email: 'alice@example.com', password: 'password123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  it('registers the first user as admin and returns JSON', async () => {
    SignupModel.countDocuments.mockResolvedValue(0);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    SignupModel.create.mockResolvedValue({ name: 'Alice', role: 'admin' });

    await authController.registerUser(req, res);

    expect(SignupModel.countDocuments).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(SignupModel.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashedPassword',
      role: 'admin'
    });
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: { name: 'Alice', role: 'admin' }
    });
  });

  it('returns 500 and error message on exception', async () => {
    SignupModel.countDocuments.mockRejectedValue(new Error('DB error'));

    await authController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user.' });
  });
});

describe('authController.loginUser', () => {
  let req, res, fakeUser;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: { email: 'bob@example.com', password: 'mypassword' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    fakeUser = {
      _id: '123',
      name: 'Bob',
      email: 'bob@example.com',
      role: 'user',
      profileImage: 'img.png',
      isFirstLogin: true,
      password: 'hashed'
    };
  });

  it('responds with failure when email not found', async () => {
    SignupModel.findOne.mockResolvedValue(null);

    await authController.loginUser(req, res);

    expect(SignupModel.findOne).toHaveBeenCalledWith({
      email: { $regex: new RegExp(`^${req.body.email}$`, 'i') }
    });
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'This email is not registered.' });
  });

  it('responds with failure on incorrect password', async () => {
    SignupModel.findOne.mockResolvedValue({ password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    await authController.loginUser(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('mypassword', 'hashed');
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Incorrect password. Please try again.' });
  });

  it('responds with token and user data on success', async () => {
    SignupModel.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt-token');

    await authController.loginUser(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: fakeUser._id, username: fakeUser.name, email: fakeUser.email },
      expect.any(String),
      { expiresIn: '1h' }
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Login successful.',
      token: 'jwt-token',
      user: {
        _id: fakeUser._id,
        name: fakeUser.name,
        email: fakeUser.email,
        role: fakeUser.role,
        profileImage: fakeUser.profileImage,
        isFirstLogin: fakeUser.isFirstLogin
      }
    });
  });
});
