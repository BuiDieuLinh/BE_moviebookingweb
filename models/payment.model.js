const db = require("../common/db");

const Payment = ( payment) => {
  this.payment_id = payment.payment_id;
  this.booking_id = payment.booking_id;
  this.payment_method = payment.payment_method;
  this.payment_status = payment.payment_status;
  this.amount = payment.amount;
  this.created_at = payment.created_at;
};

Payment.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Payments WHERE payment_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Payment.getAll = (callback) => {
  const sqlString = "SELECT * FROM Payments ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Payment.insert = (payment, callBack) => {
  const sqlString = "INSERT INTO Payments SET ?";
  db.query(sqlString, payment, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...payment });
  });
};

Payment.update = (payment, id, callBack) => {
  const sqlString = "UPDATE Payments SET ? WHERE payment_id = ?";
  db.query(sqlString, [payment, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập phương thức thanh toán id = " + id + " thành công");
  });
};

Payment.delete = (id, callBack) => {
  db.query(`DELETE FROM Payments WHERE payment_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa phương thức thanh toán id = " + id + " thành công");
  });
};

module.exports = Payment;