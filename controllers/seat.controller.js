const seat = require("../models/seat.model");

module.exports = {
  getAll: (req, res) => {
    seat.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    seat.getById(id, (result) => {
      res.send(result);
    });
  },

  getByRoomId: (req, res) => {
    const { screening_id, room_id } = req.params
    console.log("Received room_id:", room_id); 
    seat.getByRoomId( screening_id, room_id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  },
// Chèn một ghế duy nhất
insert: (req, res) => {
  const seat = req.body;
  console.log('Dữ liệu ghế trong insert:', seat); // Log để kiểm tra

  if (!seat || !seat.seat_id || !seat.room_id || !seat.seat_number || !seat.seat_type) {
    return res.status(400).json({ error: 'Dữ liệu ghế không hợp lệ hoặc thiếu thông tin' });
  }

  seat.insert(seat, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi chèn ghế', details: err.message });
    }
    res.status(200).json(result); // Trả về kết quả thành công
  });
},

// Chèn nhiều ghế (cho /seats/bulk)
insertBulk: (req, res) => {
  const seats = req.body;
  console.log('Dữ liệu ghế trong insertBulk:', seats); // Log để kiểm tra

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'Dữ liệu ghế không hợp lệ hoặc rỗng' });
  }

  let completed = 0;
  let errors = [];

  seats.forEach((s, index) => {
    console.log(`Xử lý ghế thứ ${index + 1}:`, s); // Log từng ghế
    seat.insert(s, (err, result) => {
      if (err) {
        errors.push({ s, error: err.message });
      }
      completed += 1;

      if (completed === seats.length) {
        if (errors.length > 0) {
          console.error('Lỗi khi thêm ghế:', errors);
          res.status(500).json({ error: 'Có lỗi khi thêm ghế', details: errors });
        } else {
          res.status(200).json({ message: 'Tạo tất cả ghế thành công!' });
        }
      }
    });
  });
},

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    seat.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    seat.delete(id, (result) => {
      res.send(result);
    });
  },
};


