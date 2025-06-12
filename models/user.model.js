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
User.getByEmail = (email, callback) => {
  console.log('Trong User.getByEmail, callback:', typeof callback);
  const sql = 'SELECT user_id, username, email, fullname, role FROM Users WHERE email = ?';
  db.query(sql, email, (err, results) => {
    if (err) {
      console.error('Lỗi khi kiểm tra email:', err);
      return callback(err);
    }
    console.log('Kết quả getByEmail:', results);
    callback(results.length > 0 ? results[0] : null);
  });
};

User.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Users WHERE user_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

User.getAll = (page = 1, limit = 10, callback) => {
  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));
  const offset = (page - 1) * limit;
  let sqlString = `SELECT * FROM Users u ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
  let countSqlString = `
    SELECT COUNT(*) as total
    FROM Users `;

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

User.updateRole = (role, id, callBack) => {
  const sqlString = "UPDATE Users SET role = ? WHERE user_id = ?";
  db.query(sqlString, [role, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("Cập nhật vai trò cho người dùng id = " + id + " thành công");
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