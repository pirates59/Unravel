// tests/controllers/bookingController.test.js

const bookingController = require('../../controllers/bookingController');
const Booking = require('../../models/Booking');
const transporter = require('../../config/mailer');

jest.mock('../../config/mailer', () => ({
  options: { auth: { user: 'test@mailer.com' } },
  sendMail: jest.fn((opts, cb) => cb(null, { response: 'sent' })),
}));

describe('bookingController.getBookedDates', () => {
  let req, res;
  beforeEach(() => {
    jest.clearAllMocks();
    req = { query: { month: '5', year: '2025' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  it('returns formatted booked dates', async () => {
    const fakeBookings = [
      { year: '2025', month: '5', day: '1', time: '8:00 AM' },
      { year: '2025', month: '5', day: '1', time: '9:00 AM' },
    ];
    jest.spyOn(Booking, 'find').mockResolvedValue(fakeBookings);

    await bookingController.getBookedDates(req, res);

    expect(Booking.find).toHaveBeenCalledWith({ month: '5', year: '2025' });
    expect(res.json).toHaveBeenCalledWith({
      '2025-5-1': { times: ['8:00 AM', '9:00 AM'], isFullyBooked: false }
    });
  });

  it('handles errors gracefully', async () => {
    jest.spyOn(Booking, 'find').mockRejectedValue(new Error('DB error'));

    await bookingController.getBookedDates(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error fetching bookings.' });
  });
});

describe('bookingController.bookTimeslot', () => {
  let req, res;
  const validBody = {
    date: '2025-06-15', time: '10:00 AM', firstName: 'Jane', lastName: 'Doe',
    contact: '1234567890', email: 'jane@example.com', service: 'Therapy', therapist: 'Dr. Smith'
  };
  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: { ...validBody } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  it('returns 400 if required fields are missing', async () => {
    delete req.body.email;
    await bookingController.bookTimeslot(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required.' });
  });

  it('returns 400 for invalid date format', async () => {
    req.body.date = '15-06-2025';
    await bookingController.bookTimeslot(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  });

  it('returns 400 if timeslot already exists', async () => {
    jest.spyOn(Booking, 'findOne').mockResolvedValue({});
    await bookingController.bookTimeslot(req, res);
    expect(Booking.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Timeslot already booked.' });
  });

  it('books a new timeslot and sends email', async () => {
    jest.spyOn(Booking, 'findOne').mockResolvedValue(null);
    jest.spyOn(Booking.prototype, 'save').mockResolvedValue({});
    jest.spyOn(transporter, 'sendMail').mockImplementation((opts, cb) => cb(null, { response: 'sent' }));
  
    await bookingController.bookTimeslot(req, res);
  
    expect(Booking.findOne).toHaveBeenCalled();
    expect(Booking.prototype.save).toHaveBeenCalled();
    expect(transporter.sendMail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking successful!' });
  });
  
  

  it('handles exceptions with 500 status', async () => {
    jest.spyOn(Booking, 'findOne').mockRejectedValue(new Error('Unexpected'));
    await bookingController.bookTimeslot(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unexpected' });
  });
});

describe('bookingController.getAppointments', () => {
  let req, res;
  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  it('returns all appointments', async () => {
    const appts = [{ id: 1 }, { id: 2 }];
    jest.spyOn(Booking, 'find').mockResolvedValue(appts);

    await bookingController.getAppointments(req, res);

    expect(Booking.find).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: appts });
  });

  it('handles errors fetching appointments', async () => {
    jest.spyOn(Booking, 'find').mockRejectedValue(new Error('Fetch failed'));
    await bookingController.getAppointments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Failed to fetch appointments.' });
  });
});
