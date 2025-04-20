const db = require("../common/db");

const Showtime = ( showtime) => {
  this.showtime_id = showtime.showtime_id;
  this.movie_id = showtime.movie_id;
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
  const sqlString = "SELECT st.*, m.title as 'movie_title' FROM Showtimes st JOIN Movies m ON st.movie_id = m.movie_id ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Showtime.getByDate = (callback) =>{
  const sql = `SELECT 
                m.movie_id,
                m.poster_url,
                m.age_restriction,
                m.origin,
                m.title,
                m.duration, 
                m.genre, 
                m.release_date, 
                s.screening_date, 
                s.screening_format,
                s.start_time
            FROM Screenings s
            JOIN Showtimes sh ON s.showtime_id = sh.showtime_id
            JOIN Movies m ON sh.movie_id = m.movie_id
            WHERE sh.start_time <= CURDATE()  
            AND sh.end_time >= CURDATE()       
            AND s.screening_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 5 DAY
            AND (s.screening_date > CURDATE() OR s.start_time >= CURTIME()) 
            ORDER BY m.title, s.screening_date, s.start_time;
            `
  db.query(sql, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
}

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