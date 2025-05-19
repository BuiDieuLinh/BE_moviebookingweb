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
      s.start_time AS 'start_date',
      s.end_time AS 'end_date',
      sc.screening_id,
      sc.room_id,
      sc.screening_date,
      sc.screening_format,
      sc.screening_translation,
      sc.start_time,
      sc.end_time,
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
    if (results.length === 0) {
      return callback(null, null); 
    }
    console.log(results, results[0])

    const showtime = {
      showtime_id: results[0].showtime_id,
      movie_id: results[0].movie_id,
      movie_title: results[0].movie_title,
      start_time: results[0].start_date,
      end_time: results[0].end_date,
      screenings: results
        .filter(row => row.screening_id) 
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
        }))
    };

    callback(showtime);
  });
};

Showtime.getAll = (page = 1, limit = 10, status = '', callback) => {
  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));
  const offset = (page - 1) * limit;

  let sqlString = `
    SELECT st.*, m.title as 'movie_title'
    FROM Showtimes st
    JOIN Movies m ON st.movie_id = m.movie_id
  `;
  let countSqlString = `
    SELECT COUNT(*) as total
    FROM Showtimes st
    JOIN Movies m ON st.movie_id = m.movie_id
  `;

  const today = new Date().toISOString().split('T')[0]; 
  let statusCondition = '';
  if (status) {
    if (status === 'Hoàn thành') {
      statusCondition = `WHERE st.end_time < '${today}'`;
    } else if (status === 'Sắp chiếu') {
      statusCondition = `WHERE st.start_time > '${today}'`;
    } else if (status === 'Đang chiếu') {
      statusCondition = `WHERE st.start_time <= '${today}' AND st.end_time >= '${today}'`;
    }
  }

  sqlString += ` ${statusCondition} ORDER BY st.start_time DESC LIMIT ? OFFSET ?`;
  countSqlString += ` ${statusCondition}`;

  db.query(countSqlString, (err, countResult) => {
    if (err) {
      return callback(err);
    }

    const totalRecords = countResult[0].total;

    db.query(sqlString, [limit, offset], (err, result) => {
      if (err) {
        return callback(err);
      }

      const paginationResult = {
        data: result,
        pagination: {
          currentPage: page,
          limit: limit,
          totalRecords: totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
        },
      };

      callback(null, paginationResult);
    });
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