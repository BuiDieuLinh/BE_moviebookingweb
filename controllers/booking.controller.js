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
    const u = req.body;
    booking.insert(u, (result) => {
      res.send(result);
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


