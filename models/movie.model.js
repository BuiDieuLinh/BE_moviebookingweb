const db = require("../common/db");

const Movie = ( movie) => {
  this.movie_id = movie.movie_id;
  this.title = movie.title;
  this.description = movie.description;
  this.duration = movie.duration;
  this.release_date = movie.release_date;
  this.genre = movie.genre;
  this.director = movie.director;
  this.rating = movie.rating;
  this.cast = movie.cast;
  this.poster_url = movie.poster_url;
  this.trailer_url = movie.trailer_url;
  this.created_at = movie.created_at;
};

Movie.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Movies WHERE movie_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Movie.getAll = (callback) => {
  const sqlString = "SELECT * FROM Movies ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Movie.insert = (movie, callBack) => {
  const sqlString = "INSERT INTO Movies SET ?";
  db.query(sqlString, movie, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...movie });
  });
};

Movie.update = (movie, id, callBack) => {
  const sqlString = "UPDATE Movies SET ? WHERE movie_id = ?";
  db.query(sqlString, [movie, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập phim id = " + id + " thành công");
  });
};

Movie.delete = (id, callBack) => {
  db.query(`DELETE FROM Movies WHERE movie_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa phim id = " + id + " thành công");
  });
};

module.exports = Movie;