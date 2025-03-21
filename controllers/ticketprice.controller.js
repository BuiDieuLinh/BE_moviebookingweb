const ticketprice = require("../models/ticketprice.model");

module.exports = {
  getAll: (req, res) => {
    ticketprice.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    ticketprice.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const u = req.body;
    ticketprice.insert(u, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    ticketprice.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    ticketprice.delete(id, (result) => {
      res.send(result);
    });
  },
};


