const db = require("../common/db");

const Room = ( room) => {
  this.room_id = room.room_id;
  this.name = room.name;
  this.total_seats = room.total_seats;
};

Room.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Rooms WHERE room_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Room.getAll = (callback) => {
  const sqlString = "SELECT * FROM Rooms ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Room.insert = (room, callBack) => {
  const sqlString = "INSERT INTO Rooms SET ?";
  db.query(sqlString, room, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack({ id: res.insertId, ...room });
  });
};

Room.update = (room, id, callBack) => {
  const sqlString = "UPDATE Rooms SET ? WHERE room_id = ?";
  db.query(sqlString, [room, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập phòng chiếu id = " + id + " thành công");
  });
};

Room.delete = (id, callBack) => {
  db.query(`DELETE FROM Rooms WHERE room_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa phòng chiếu id = " + id + " thành công");
  });
};

module.exports = Room;