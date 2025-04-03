const showtime = require("../models/showtime.model");

module.exports = {
  getAll: (req, res) => {
    showtime.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    showtime.getById(id, (result) => {
      res.send(result);
    });
  },

  getByDate: (req, res) => {
    showtime.getByDate((result) => {
      res.send(result)
    })
  }, 
  insert: (req, res) => {
    const u = req.body;
    showtime.insert(u, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    showtime.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    showtime.delete(id, (result) => {
      res.send(result);
    });
  },
};


