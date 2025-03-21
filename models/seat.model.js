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

Seat.insert = (seat, callBack) => {
  const sqlString = "INSERT INTO Seats SET ?";
  db.query(sqlString, seat, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...seat });
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