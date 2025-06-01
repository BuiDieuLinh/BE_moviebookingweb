const TicketPriceRule = require("../models/ticketprice.model");

module.exports = {
  getPriceBySeatAndScreening: (req, res) =>{
    const { seat_type, screening_id } = req.query;

    if (!seat_type || !screening_id) {
      return res.status(400).json({ error: 'Thiếu seat_type hoặc screening_id' });
    }
    TicketPriceRule.getPriceBySeatAndScreening(seat_type, screening_id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  },
  getAll: (req, res) => {
    TicketPriceRule.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    TicketPriceRule.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const u = req.body;
    TicketPriceRule.insert(u, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    TicketPriceRule.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    TicketPriceRule.delete(id, (result) => {
      res.send(result);
    });
  },
};


