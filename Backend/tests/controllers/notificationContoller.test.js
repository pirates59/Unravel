// tests/controllers/notificationController.test.js

jest.mock('../../models/Notification', () => ({
    find: jest.fn(),
    updateMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  }));
  
  const Notification = require('../../models/Notification');
  const notificationController = require('../../controllers/notificationController');
  
  describe('notificationController.getNotifications', () => {
    let req, res;
    const mockQuery = { sort: jest.fn().mockReturnThis(), populate: jest.fn() };
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = { user: { username: 'john_doe' } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('fetches and returns processed notifications', async () => {
      const rawNotifications = [
        {
          toObject: () => ({ id: '1', actorId: { name: 'Alice', profileImage: 'alice.png' }, recipient: 'john_doe', state: false }),
          actorId: { name: 'Alice', profileImage: 'alice.png' },
        },
        {
          toObject: () => ({ id: '2', actorId: null, recipient: 'john_doe', state: true }),
          actorId: null,
        },
      ];
      mockQuery.populate.mockResolvedValue(rawNotifications);
      Notification.find.mockReturnValue(mockQuery);
  
      await notificationController.getNotifications(req, res);
  
      expect(Notification.find).toHaveBeenCalledWith({ recipient: 'john_doe' });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.populate).toHaveBeenCalledWith('actorId', 'name profileImage');
  
      const expectedNotifications = [
    { id: '1', actorId: { name: 'Alice', profileImage: 'alice.png' }, recipient: 'john_doe', state: false, actorName: 'Alice', actorProfileImage: 'alice.png' },
    rawNotifications[1],
  ];
      expect(res.json).toHaveBeenCalledWith({ notifications: expectedNotifications });
    });
  
    it('handles errors with 500 status', async () => {
      Notification.find.mockReturnValue({
        sort: () => ({
          populate: () => Promise.reject(new Error('DB failure'))
        })
      });
  
      await notificationController.getNotifications(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB failure' });
    });
  });
  
  describe('notificationController.markAllAsRead', () => {
    let req, res;
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = { user: { username: 'john_doe' } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('marks all unread notifications as read', async () => {
      Notification.updateMany.mockResolvedValue({ modifiedCount: 3 });
  
      await notificationController.markAllAsRead(req, res);
  
      expect(Notification.updateMany).toHaveBeenCalledWith(
        { recipient: 'john_doe', state: false },
        { state: true }
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'All notifications marked as read' });
    });
  
    it('handles errors with 500 status', async () => {
      Notification.updateMany.mockRejectedValue(new Error('Update error'));
  
      await notificationController.markAllAsRead(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update error' });
    });
  });
  
  describe('notificationController.markSingleAsRead', () => {
    let req, res;
  
    beforeEach(() => {
      jest.clearAllMocks();
      req = { params: { notificationId: 'notif123' } };
      res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
  
    it('marks a single notification as read', async () => {
      Notification.findByIdAndUpdate.mockResolvedValue({});
  
      await notificationController.markSingleAsRead(req, res);
  
      expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith('notif123', { state: true });
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification marked as read' });
    });
  
    it('handles errors with 500 status', async () => {
      Notification.findByIdAndUpdate.mockRejectedValue(new Error('FindById error'));
  
      await notificationController.markSingleAsRead(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'FindById error' });
    });
  });
  