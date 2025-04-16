const db = require("../common/db");

const User = ( user) => {
  this.user_id = user.user_id;
  this.username = user.username;
  this.fullname = user.fullname;
  this.email = user.email;
  this.password = user.password;
  this.phone = user.phone;
  this.role = user.role;
  this.created_at = user.created_at;
};

User.getByUsername = (username, callback) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
      if (err) {
          callback(err, null);
      } else {
          callback(null, result.length ? result[0] : null);
      }
  });
}

User.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Users WHERE user_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

User.getAll = (callback) => {
  const sqlString = "SELECT * FROM Users ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

User.insert = (user, callBack) => {
  const checkQuery = `SELECT * FROM Users WHERE email = ? OR username = ?`;

  db.query(checkQuery, [user.email, user.username], (err, results) => {
      if (err) {
          return callBack({ error: true, message: "Lỗi kiểm tra dữ liệu", field: null });
      }

      if (results.length > 0) {
          const existing = results[0];
          const fieldConflict = existing.email === user.email ? 'email' : 'username';

          return callBack({
              error: true,
              message: `${fieldConflict === 'email' ? 'Email' : 'Username'} đã được đăng ký. Vui lòng nhập lại!`,
              field: fieldConflict
          });
      }

      const insertQuery = "INSERT INTO Users SET ?";
      db.query(insertQuery, user, (err, res) => {
          if (err) {
              return callBack({ error: true, message: "Lỗi khi chèn dữ liệu", field: null });
          }

          callBack({ id: res.insertId, ...user });
      });
  });
};


User.update = (user, id, callBack) => {
  const sqlString = "UPDATE Users SET ? WHERE user_id = ?";
  db.query(sqlString, [user, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập người dùng id = " + id + " thành công");
  });
};

User.delete = (id, callBack) => {
  db.query(`DELETE FROM Users WHERE user_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa người dùng id = " + id + " thành công");
  });
};

module.exports = User;