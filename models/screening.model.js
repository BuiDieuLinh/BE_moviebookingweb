const db = require("../common/db");

const Screening = ( screening) => {
  this.screening_id = screening.screening_id;
  this.showtime_id = screening.showtime_id;
  this.room_id = screening.room_id;
  this.screening_date = screening.screening_date;
  this.start_time = screening.start_time;
  this.end_time = screening.end_time;
  this.screening_format = screening.screening_format;
  this.screening_translation = screening.screening_translation;
};

Screening.getById = (id, callback) => {
  const sqlString = "SELECT s.*, m.title AS movie_title FROM Screenings s JOIN Showtimes st ON s.showtime_id = st.showtime_id JOIN Movies m ON st.movie_id = m.movie_id WHERE s.room_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Screening.getAll = (callback) => {
  const sqlString = "SELECT s.*, m.title AS movie_title, r.room_name AS room_name, r.room_type AS room_type FROM Screenings s JOIN Showtimes st ON s.showtime_id = st.showtime_id JOIN Movies m ON st.movie_id = m.movie_id JOIN Rooms r ON r.room_id = s.room_id";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Screening.insert = (screening, callBack) => {
  const sqlString = "INSERT INTO Screenings SET ?";
  db.query(sqlString, screening, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...screening });
  });
};

Screening.update = (screening, id, callBack) => {
  const sqlString = "UPDATE Screenings SET ? WHERE screening_id = ?";
  db.query(sqlString, [screening, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập suất chiếu id = " + id + " thành công");
  });
};

Screening.delete = (id, callBack) => {
  db.query(`DELETE FROM Screenings WHERE screening_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa suất chiếu id = " + id + " thành công");
  });
};

module.exports = Screening;