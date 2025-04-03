const db = require("../common/db");
const { v4: uuidv4 } = require('uuid')

const Booking = ( booking) => {
  this.booking_id = booking.booking_id;
  this.user_id = booking.user_id;
  this.screening_id = booking.screening_id;
  this.created_at = booking.created_at;
  this.total_price = booking.total_price;
  this.status = booking.status;
  this.qr_code = booking.qr_code;
};

Booking.getById = (id, callback) => {
  const sqlString = "SELECT * FROM Bookings WHERE booking_id = ? ";
  db.query(sqlString, id, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Booking.getAll = (callback) => {
  const sqlString = "SELECT * FROM Bookings ";
  db.query(sqlString, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(result);
  });
};

Booking.insert = (bookings, bookingDetails, callBack) => {
  db.beginTransaction((err) => {
    if (err) {
      console.error("Lỗi bắt đầu transaction:", err);
      callBack(err);
      return;
    }

    const bookingId = uuidv4(); // Sinh UUID trong Node.js
    console.log("bookingId sinh trong backend:", bookingId);

    const sqlString = "INSERT INTO Bookings (booking_id, user_id, screening_id, total_price, status) VALUES (?, ?, ?, ?, ?)";
    const bookingValues = [
      bookingId,
      bookings.user_id,
      bookings.screening_id,
      bookings.total_price,
      bookings.status || "pending",
    ];

    db.query(sqlString, bookingValues, (err, res) => {
      if (err) {
        console.error("Lỗi khi chèn vào Bookings:", err);
        return db.rollback(() => {
          callBack(err);
        });
      }

      const bookingResponse = { id: bookingId, ...bookings };

      let detailsToInsert = [];
      if (Array.isArray(bookingDetails)) {
        detailsToInsert = bookingDetails.map((detail) => ({
          ...detail,
          booking_id: bookingId,
        }));
      } else {
        detailsToInsert = [{ ...bookingDetails, booking_id: bookingId }];
      }

      const detailSql = "INSERT INTO BookingDetails (booking_id, seat_id, price) VALUES ?";
      const detailValues = detailsToInsert.map((detail) => [
        detail.booking_id,
        detail.seat_id,
        detail.price,
      ]);

      db.query(detailSql, [detailValues], (err, detailRes) => {
        if (err) {
          console.error("Lỗi khi chèn vào BookingDetails:", err);
          return db.rollback(() => {
            callBack(err);
          });
        }

        db.commit((err) => {
          if (err) {
            console.error("Lỗi khi commit:", err);
            return db.rollback(() => {
              callBack(err);
            });
          }

          callBack(null, {
            bookings: bookingResponse,
            details: detailsToInsert,
          });
        });
      });
    });
  });
};

Booking.update = (booking, id, callBack) => {
  const sqlString = "UPDATE Bookings SET ? WHERE booking_id = ?";
  db.query(sqlString, [booking, id], (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("cập đơn đặt vé id = " + id + " thành công");
  });
};

Booking.delete = (id, callBack) => {
  db.query(`DELETE FROM Bookings WHERE booking_id = ?`, id, (err, res) => {
    if (err) {
      callBack(err);
      return;
    }
    callBack("xóa đơn đặt vé id = " + id + " thành công");
  });
};

module.exports = Booking;