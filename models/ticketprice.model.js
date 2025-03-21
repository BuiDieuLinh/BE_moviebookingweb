const db = require("../common/db");

const TicketPrice = ( ticketprice) => {
  this.price_id = ticketprice.price_id;
  this.showtime_id = ticketprice.showtime_id;
  this.seat_type = ticketprice.seat_type;
  this.price = ticketprice.price;
  this.discount = ticketprice.discount;
  this.created_at = ticketprice.created_at;
};

TicketPrice.getById = (id, callback) => {
  const sqlString = "SELECT * FROM TicketPrices WHERE price_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

TicketPrice.getAll = (callback) => {
  const sqlString = "SELECT * FROM TicketPrices ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

TicketPrice.insert = (ticketprice, callBack) => {
  const sqlString = "INSERT INTO TicketPrices SET ?";
  db.query(sqlString, ticketprice, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...ticketprice });
  });
};

TicketPrice.update = (ticketprice, id, callBack) => {
  const sqlString = "UPDATE TicketPrices SET ? WHERE price_id = ?";
  db.query(sqlString, [ticketprice, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập nhật giá vé có id = " + id + " thành công");
  });
};

TicketPrice.delete = (id, callBack) => {
  db.query(`DELETE FROM TicketPrices WHERE price_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa giá vé id = " + id + " thành công");
  });
};

module.exports = TicketPrice;