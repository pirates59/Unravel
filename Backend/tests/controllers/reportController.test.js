// tests/controllers/reportController.test.js

// --- Mock the models so all methods exist and are jest.fn() ---  
jest.mock('../../models/Signup', () => ({ findOne: jest.fn() }));  
jest.mock('../../models/Comment', () => ({  
  find: jest.fn(),  
  findByIdAndUpdate: jest.fn(),  
}));  

// Now require everything under test  
const User = require('../../models/Signup');  
const Comment = require('../../models/Comment');  
const reportController = require('../../controllers/reportController');

describe('reportController.getReportedComments', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    // silence console.error for error‑path tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it('should fetch, enrich, and return reported comments', async () => {
    const date1 = new Date('2025-04-20T10:00:00Z');
    const date2 = new Date('2025-04-21T12:00:00Z');
    const fakeComments = [
      { _id: 'c1', text: 'First', author: 'Alice', createdAt: date1 },
      { _id: 'c2', text: 'Second', author: 'Bob', createdAt: date2 },
    ];

    // Mock Comment.find().sort(...)
    const sortMock = jest.fn().mockResolvedValue(fakeComments);
    Comment.find.mockReturnValue({ sort: sortMock });

    // For first comment return a user, for second return null
    User.findOne
      .mockResolvedValueOnce({
        _id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
        profileImage: 'alice.png',
        isFrozen: true,
      })
      .mockResolvedValueOnce(null);

    await reportController.getReportedComments(req, res);

    expect(Comment.find).toHaveBeenCalledWith({ reported: true });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });

    // Build expected enriched array
    const expected = [
      {
        _id: 'c1',
        commentContent: 'First',
        createdAt: date1,
        user: {
          _id: 'u1',
          name: 'Alice',
          email: 'alice@example.com',
          profileImage: 'alice.png',
          isFrozen: true,
        },
      },
      {
        _id: 'c2',
        commentContent: 'Second',
        createdAt: date2,
        user: {
          name: 'Bob',
          email: 'Not available',
          profileImage: 'default-avatar.png',
          isFrozen: false,
        },
      },
    ];

    expect(res.json).toHaveBeenCalledWith(expected);
  });

  it('should respond with 500 on database error', async () => {
    const dbError = new Error('DB fail');
    const sortMock = jest.fn().mockRejectedValue(dbError);
    Comment.find.mockReturnValue({ sort: sortMock });

    await reportController.getReportedComments(req, res);

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching reported comments:',
      dbError
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch reported comments.' });
  });
});

describe('reportController.releaseComment', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it('should unflag and return the updated comment', async () => {
    const updated = { _id: 'c1', reported: false, reportedAt: null };
    Comment.findByIdAndUpdate.mockResolvedValue(updated);

    req = { params: { id: 'c1' } };
    await reportController.releaseComment(req, res);

    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      'c1',
      { reported: false, reportedAt: null },
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('should return 404 if comment not found', async () => {
    Comment.findByIdAndUpdate.mockResolvedValue(null);

    req = { params: { id: 'nonexistent' } };
    await reportController.releaseComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Comment not found.' });
  });

  it('should handle errors with 500 response', async () => {
    const err = new Error('Update error');
    Comment.findByIdAndUpdate.mockRejectedValue(err);

    req = { params: { id: 'c1' } };
    await reportController.releaseComment(req, res);

    expect(console.error).toHaveBeenCalledWith('Error releasing comment:', err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error releasing comment.' });
  });
});
