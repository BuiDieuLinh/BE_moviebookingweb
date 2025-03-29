const db = require("../common/db");

const Booking = ( booking) => {
  this.booking_id = booking.booking_id;
  this.user_id = booking.user_id;
  this.screening_id = booking.screening_id;
  this.created_at = booking.created_at;
  this.total_price = booking.total_price;
  this.status = booking.status;
  this.qr_code = booking.qr_code;
};

Booking.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Bookings WHERE booking_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Booking.getAll = (callback) => {
  const sqlString = "SELECT * FROM Bookings ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Booking.insert = (booking, callBack) => {
  const sqlString = "INSERT INTO Bookings SET ?";
  db.query(sqlString, booking, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...booking });
  });
};

Booking.update = (booking, id, callBack) => {
  const sqlString = "UPDATE Bookings SET ? WHERE booking_id = ?";
  db.query(sqlString, [booking, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập đơn đặt vé id = " + id + " thành công");
  });
};

Booking.delete = (id, callBack) => {
  db.query(`DELETE FROM Bookings WHERE booking_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa đơn đặt vé id = " + id + " thành công");
  });
};

module.exports = Booking;