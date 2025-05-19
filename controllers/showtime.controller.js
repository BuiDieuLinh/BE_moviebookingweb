const showtime = require("../models/showtime.model");

module.exports = {
  getAll: (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10; 
    const status = req.query.status || '';
    showtime.getAll(page, limit, status, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
      }
      res.json(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    console.log(id)
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


