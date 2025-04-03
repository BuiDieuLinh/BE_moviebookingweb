const booking = require("../models/booking.model");

module.exports = {
  getAll: (req, res) => {
    booking.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    booking.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const { bookings, details } = req.body; // Nhận booking và details từ body
  
    // Kiểm tra dữ liệu đầu vào
    if (!bookings || !details) {
      return res.status(400).json({ error: 'Missing booking or details data' });
    }
  
    booking.insert(bookings, details, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    booking.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    booking.delete(id, (result) => {
      res.send(result);
    });
  },
};


