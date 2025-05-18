const db = require("../common/db");
const { screening_format, screening_translation, start_time } = require("./screening.model");

const Showtime = ( showtime) => {
  this.showtime_id = showtime.showtime_id;
  this.movie_id = showtime.movie_id;
  this.start_time = showtime.start_time;
  this.end_time = showtime.end_time;
};

Showtime.getById = (id, callback) => {
  const sqlString = `
    SELECT 
      s.showtime_id,
      s.movie_id,
      s.start_time,
      s.end_time,
      sc.screening_id,
      sc.room_id,
      sc.screening_date,
      sc.screening_format,
      sc.screening_translation,
      m.title AS movie_title,
      r.room_name,
      r.room_type
    FROM Showtimes s
    LEFT JOIN Screenings sc ON s.showtime_id = sc.showtime_id
    LEFT JOIN Movies m ON s.movie_id = m.movie_id 
    LEFT JOIN Rooms r ON sc.room_id = r.room_id
    WHERE s.showtime_id = ?
  `;
  db.query(sqlString, id, (err, results) => {
    if (err) {
      return callback(err);
    }

    // Xử lý dữ liệu để tránh lặp showtime
    // if (results.length === 0) {
    //   return callback(null, null); // Không tìm thấy showtime
    // }
    console.log(results, results[0])

    // Lấy thông tin showtime từ bản ghi đầu tiên
    const showtime = {
      showtime_id: results[0].showtime_id,
      movie_id: results[0].movie_id,
      start_time: results[0].start_time,
      end_time: results[0].end_time,
      // ... các cột khác
      screenings: results
        .filter(row => row.screening_id) // Lọc các bản ghi có screening
        .map(row => ({
          screening_id: row.screening_id,
          room_id: row.room_id,
          room_name: row.room_name,
          movie_id: row.movie_id,
          movie_title: row.movie_title,
          screening_date: row.screening_date,
          screening_format: row.screening_format,
          screening_translation: row.screening_translation,
          start_time: row.start_time,
          end_time: row.end_time,
          // ... các cột khác
        }))
    };

    callback(showtime);
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