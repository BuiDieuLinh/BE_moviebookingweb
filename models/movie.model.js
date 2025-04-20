const db = require("../common/db");

const Movie = (movie) => {
  this.movie_id = movie.movie_id;
  this.title = movie.title;
  this.description = movie.description;
  this.duration = movie.duration;
  this.release_date = movie.release_date;
  this.genre = movie.genre;
  this.director = movie.director;
  this.rating = movie.rating;
  this.cast = movie.cast;
  this.origin = movie.origin;
  this.age_restriction = movie.age_restriction;
  this.poster_url = movie.poster_url;
  this.trailer_url = movie.trailer_url;
  this.created_at = movie.created_at;
};

Movie.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Movies WHERE movie_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Movie.getAll = (callback) => {
  const sqlString = "SELECT * FROM Movies ";
  db.query(sqlString, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

Movie.insert = (movie, callBack) => {
  const sqlString = "INSERT INTO Movies SET ?";
  db.query(sqlString, movie, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { id: res.insertId, ...movie }); // Trả về null cho err, dữ liệu cho result
  });
};

Movie.update = (movie, id, callBack) => {
  const sqlString = "UPDATE Movies SET ? WHERE movie_id = ?";
  db.query(sqlString, [movie, id], (err, res) => {
    if (err) return callBack(err);
    callBack(null, { message: `Cập nhật phim id = ${id} thành công`, affectedRows: res.affectedRows }); // Trả về null cho err
  });
};

Movie.delete = (id, callBack) => {
  db.query(`DELETE FROM Movies WHERE movie_id = ?`, id, (err, res) => {
    if (err) return callBack(err);
    callBack(null, { message: `Xóa phim id = ${id} thành công`, affectedRows: res.affectedRows });
  });
};

module.exports = Movie;