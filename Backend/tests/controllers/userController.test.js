// tests/controllers/userController.test.js

// --- Explicit mock factories so all methods exist as jest.fn() ---
jest.mock('../../models/Signup', () => ({
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  }));
  jest.mock('../../models/Post', () => ({ updateMany: jest.fn() }));
  jest.mock('../../models/Comment', () => ({ updateMany: jest.fn() }));
  jest.mock('../../models/Notification', () => ({ updateMany: jest.fn() }));
  
  jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
  }));
  
  // --- Now require everything under test ---
  const SignupModel = require('../../models/Signup');
  const Post        = require('../../models/Post');
  const Comment     = require('../../models/Comment');
  const Notification= require('../../models/Notification');
  const bcrypt      = require('bcrypt');
  const userController = require('../../controllers/userController');
  
  describe('userController.fetchUsers', () => {
    let req, res;
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = {};
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('should fetch and return users', async () => {
      const fakeUsers = [{ name: 'Alice' }, { name: 'Bob' }];
      SignupModel.find.mockResolvedValue(fakeUsers);
  
      await userController.fetchUsers(req, res);
  
      expect(SignupModel.find).toHaveBeenCalledWith(
        { role: 'user' },
        'name email profileImage isFrozen'
      );
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });
  
    it('should handle errors', async () => {
      SignupModel.find.mockRejectedValue(new Error('DB error'));
  
      await userController.fetchUsers(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch users.' });
    });
  });
  
  describe('userController.updateProfile', () => {
    let req, res;
    const oldEmail = 'old@example.com';
    const updatedUser = {
      _id: 'u1',
      name: 'NewName',
      email: 'new@example.com',
      profileImage: 'img.png'
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      req = {
        user: { email: oldEmail },
        body: { username: 'NewName', email: 'new@example.com' },
        file: { filename: 'img.png' },
      };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('should update profile and propagate changes', async () => {
      SignupModel.findOneAndUpdate.mockResolvedValue(updatedUser);
      Post.updateMany.mockResolvedValue({});
      Comment.updateMany.mockResolvedValue({});
      Notification.updateMany.mockResolvedValue({});
  
      await userController.updateProfile(req, res);
  
      expect(SignupModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: new RegExp(`^${oldEmail}$`, 'i') },
        { name: 'NewName', email: 'new@example.com', profileImage: 'img.png', isFirstLogin: false },
        { new: true }
      );
  
      expect(Post.updateMany).toHaveBeenCalledWith(
        { authorId: updatedUser._id },
        { author: updatedUser.name, profileImage: updatedUser.profileImage }
      );
      expect(Comment.updateMany).toHaveBeenCalledWith(
        { authorId: updatedUser._id },
        { author: updatedUser.name, profileImage: updatedUser.profileImage }
      );
      expect(Notification.updateMany).toHaveBeenCalledWith(
        { actorId: updatedUser._id },
        { actorName: updatedUser.name, actorProfileImage: updatedUser.profileImage }
      );
  
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully.',
        user: updatedUser,
      });
    });
  
    it('should return 404 if user not found', async () => {
      SignupModel.findOneAndUpdate.mockResolvedValue(null);
  
      await userController.updateProfile(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found.' });
    });
  
    it('should handle errors', async () => {
      SignupModel.findOneAndUpdate.mockRejectedValue(new Error('Update error'));
  
      await userController.updateProfile(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error updating profile.' });
    });
  });
  
  describe('userController.freezeUser', () => {
    let req, res;
    const userId = 'u1';
    const frozenUser = { _id: userId, isFrozen: true };
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = { params: { id: userId } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('should freeze user successfully', async () => {
      SignupModel.findByIdAndUpdate.mockResolvedValue(frozenUser);
  
      await userController.freezeUser(req, res);
  
      expect(SignupModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { isFrozen: true },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'User frozen successfully.',
        user: frozenUser,
      });
    });
  
    it('should return 404 if user not found', async () => {
      SignupModel.findByIdAndUpdate.mockResolvedValue(null);
  
      await userController.freezeUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });
  
    it('should handle errors', async () => {
      SignupModel.findByIdAndUpdate.mockRejectedValue(new Error('DB fail'));
  
      await userController.freezeUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error freezing user.' });
    });
  });
  
  describe('userController.deleteUser', () => {
    let req, res;
    const userId = 'u1';
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = { params: { id: userId } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('should delete user successfully', async () => {
      SignupModel.findByIdAndDelete.mockResolvedValue({ _id: userId });
  
      await userController.deleteUser(req, res);
  
      expect(SignupModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully.' });
    });
  
    it('should return 404 if user not found', async () => {
      SignupModel.findByIdAndDelete.mockResolvedValue(null);
  
      await userController.deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });
  
    it('should handle errors', async () => {
      SignupModel.findByIdAndDelete.mockRejectedValue(new Error('Delete error'));
  
      await userController.deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting user.' });
    });
  });
  
  describe('userController.changePassword', () => {
    let req, res;
    const email = 'me@example.com';
    const dbUser = { password: 'hashedpw', save: jest.fn() };
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = {
        user: { email },
        body: { currentPassword: 'curr', newPassword: 'newpw' },
      };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('should return 400 if missing fields', async () => {
      req.body = { currentPassword: '', newPassword: '' };
  
      await userController.changePassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Both current and new passwords are required.',
      });
    });
  
    it('should return 404 if user not found', async () => {
      SignupModel.findOne.mockResolvedValue(null);
  
      await userController.changePassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found.' });
    });
  
    it('should return 400 if current password incorrect', async () => {
      SignupModel.findOne.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(false);
  
      await userController.changePassword(req, res);
  
      expect(bcrypt.compare).toHaveBeenCalledWith('curr', dbUser.password);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Current password is incorrect.',
      });
    });
  
    it('should update password on success', async () => {
      SignupModel.findOne.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newHashed');
      dbUser.save.mockResolvedValue();
  
      await userController.changePassword(req, res);
  
      expect(bcrypt.hash).toHaveBeenCalledWith('newpw', 10);
      expect(dbUser.password).toBe('newHashed');
      expect(dbUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password updated successfully.',
      });
    });
  
    it('should handle errors', async () => {
      SignupModel.findOne.mockRejectedValue(new Error('Oops'));
  
      await userController.changePassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error updating password.',
      });
    });
  });
  