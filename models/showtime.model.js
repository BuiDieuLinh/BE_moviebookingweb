const db = require("../common/db");

const Showtime = ( showtime) => {
  this.showtime_id = showtime.showtime_id;
  this.movie_id = showtime.movie_id;
  this.room_id = showtime.room_id;
  this.start_time = showtime.start_time;
  this.end_time = showtime.end_time;
};

Showtime.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Showtimes WHERE showtime_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Showtime.getAll = (callback) => {
  const sqlString = "SELECT * FROM Showtimes ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Showtime.insert = (showtime, callBack) => {
  const sqlString = "INSERT INTO Showtimes SET ?";
  db.query(sqlString, showtime, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...showtime });
  });
};

Showtime.update = (showtime, id, callBack) => {
  const sqlString = "UPDATE Showtimes SET ? WHERE showtime_id = ?";
  db.query(sqlString, [showtime, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập suất chiếu id = " + id + " thành công");
  });
};

Showtime.delete = (id, callBack) => {
  db.query(`DELETE FROM Showtimes WHERE showtime_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa suất chiếu id = " + id + " thành công");
  });
};

module.exports = Showtime;