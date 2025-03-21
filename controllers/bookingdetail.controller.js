const bookingdetail = require("../models/bookingdetail.model");

module.exports = {
  getAll: (req, res) => {
    bookingdetail.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    bookingdetail.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const u = req.body;
    bookingdetail.insert(u, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    bookingdetail.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    bookingdetail.delete(id, (result) => {
      res.send(result);
    });
  },
};


