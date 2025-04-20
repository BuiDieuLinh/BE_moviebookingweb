const db = require("../common/db");

const Seat = ( seat) => {
  this.seat_id = seat.seat_id;
  this.room_id = seat.room_id;
  this.seat_number = seat.seat_number;
  this.seat_type = seat.seat_type;
};

Seat.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Seats WHERE seat_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Seat.getAll = (callback) => {
  const sqlString = "SELECT * FROM Seats ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Seat.getByRoomId = (room_id, screening_id, callBack) => {
  console.log(room_id)
  const sql = `SELECT 
            s.seat_id, 
            s.seat_number, 
            s.seat_type, 
            COALESCE(
                CASE 
                    WHEN EXISTS (
                        SELECT 1
                        FROM BookingDetails bt
                        JOIN Bookings b ON b.booking_id = bt.booking_id
                        WHERE bt.seat_id = s.seat_id
                        AND b.status = 'paid'
                        AND b.screening_id = ?
                    ) 
                    THEN 'booked' 
                    ELSE 'available' 
                END, 
                'available'
            ) AS seat_status,
            SUBSTRING(s.seat_number, 1, 1) AS seat_row,
            CAST(SUBSTRING(s.seat_number, 2) AS UNSIGNED) AS seat_num
        FROM 
            Seats s
        WHERE 
            s.room_id = ?
        ORDER BY 
            seat_row ASC,
            seat_num ASC;
                `;
  db.query(sql, [screening_id,room_id], (err, results) => {
    if (err) {
      return callBack(err);
    }
    callBack(null, results);
  });
};

Seat.insert = (seat, callBack) => {
  console.log('Ghế cần chèn:', seat);

  // Kiểm tra dữ liệu đầu vào
  if (!seat || typeof seat !== 'object' || !seat.seat_id || !seat.room_id || !seat.seat_number || !seat.seat_type) {
    const error = new Error('Dữ liệu ghế không hợp lệ hoặc thiếu thông tin');
    console.error('Lỗi dữ liệu:', error.message, seat);
    callBack(error);
    return;
  }

  const sqlString = "INSERT INTO Seats (seat_id, room_id, seat_number, seat_type) VALUES (?, ?, ?, ?)";
  const values = [seat.seat_id, seat.room_id, seat.seat_number, seat.seat_type];

  db.query(sqlString, values, (err, res) => {
    if (err) {
      console.error('Lỗi khi chèn ghế:', err);
      callBack(err);
      return;
    }
    console.log('Kết quả chèn:', res);
    callBack(null, { seat_id: seat.seat_id, ...seat });
  });
};


Seat.update = (seat, id, callBack) => {
  const sqlString = "UPDATE Seats SET ? WHERE seat_id = ?";
  db.query(sqlString, [seat, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập ghế ngồi id = " + id + " thành công");
  });
};

Seat.delete = (id, callBack) => {
  db.query(`DELETE FROM Seats WHERE seat_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa ghế ngồi id = " + id + " thành công");
  });
};

module.exports = Seat;