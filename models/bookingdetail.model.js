const db = require("../common/db");

const BookingDetail = ( bookingdetail) => {
  this.bookingdetail_id = bookingdetail.bookingdetail_id;
  this.booking_id = bookingdetail.booking_id;
  this.seat_id = bookingdetail.seat_id;
  this.price = bookingdetail.price;
};

BookingDetail.getById = (id, callback) => {
  const sqlString = "SELECT * FROM BookingDetails WHERE bookingdetail_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

BookingDetail.getAll = (callback) => {
  const sqlString = "SELECT * FROM BookingDetails ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

BookingDetail.insert = (bookingdetail, callBack) => {
  const sqlString = "INSERT INTO BookingDetails SET ?";
  db.query(sqlString, bookingdetail, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...bookingdetail });
  });
};

BookingDetail.update = (bookingdetail, id, callBack) => {
  const sqlString = "UPDATE BookingDetails SET ? WHERE bookingdetail_id = ?";
  db.query(sqlString, [bookingdetail, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập chi tiết đơn đặt vé id = " + id + " thành công");
  });
};

BookingDetail.delete = (id, callBack) => {
  db.query(`DELETE FROM BookingDetails WHERE bookingdetail_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa chi tiết đơn đặt vé id = " + id + " thành công");
  });
};

module.exports = BookingDetail;