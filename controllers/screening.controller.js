const screening = require("../models/screening.model");

module.exports = {
  getAll: (req, res) => {
    screening.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    screening.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const u = req.body;
    screening.insert(u, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    screening.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    screening.delete(id, (result) => {
      res.send(result);
    });
  },
};


