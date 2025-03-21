const db = require("../common/db");

const Review = ( review) => {
  this.review_id = review.review_id;
  this.user_id = review.user_id;
  this.movie_id = review.movie_id;
  this.rating = review.rating;
  this.comment = review.comment;
  this.created_at = review.created_at;
};

Review.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Reviews WHERE review_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Review.getAll = (callback) => {
  const sqlString = "SELECT * FROM Reviews ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Review.insert = (review, callBack) => {
  const sqlString = "INSERT INTO Reviews SET ?";
  db.query(sqlString, review, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...review });
  });
};

Review.update = (review, id, callBack) => {
  const sqlString = "UPDATE Reviews SET ? WHERE review_id = ?";
  db.query(sqlString, [review, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập đánh giá id = " + id + " thành công");
  });
};

Review.delete = (id, callBack) => {
  db.query(`DELETE FROM Reviews WHERE review_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa đánh giá id = " + id + " thành công");
  });
};

module.exports = Review;