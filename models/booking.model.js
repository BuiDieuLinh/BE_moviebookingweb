const db = require("../common/db");
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

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

    // Sử dụng booking_id từ frontend, không tự sinh
    const bookingId = bookings.booking_id;

    // Insert vào Bookings
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
        return db.rollback(() => callBack(err));
      }

      const bookingResponse = { id: bookingId, ...bookings };

      // Insert vào BookingDetails
      let detailsToInsert = Array.isArray(bookingDetails)
        ? bookingDetails.map((detail) => ({ ...detail, booking_id: bookingId }))
        : [{ ...bookingDetails, booking_id: bookingId }];

      const detailSql = "INSERT INTO BookingDetails (booking_id, seat_id, price) VALUES ?";
      const detailValues = detailsToInsert.map((detail) => [
        detail.booking_id,
        detail.seat_id,
        detail.price,
      ]);

      db.query(detailSql, [detailValues], (err, detailRes) => {
        if (err) {
          console.error("Lỗi khi chèn vào BookingDetails:", err);
          return db.rollback(() => callBack(err));
        }

        // Commit transaction
        db.commit((err) => {
          if (err) {
            console.error("Lỗi khi commit:", err);
            return db.rollback(() => callBack(err));
          }

          // Trả kết quả, không tạo QR hay xử lý thanh toán ở đây
          callBack(null, {
            bookings: bookingResponse,
            details: detailsToInsert
          });
        });
      });
    });
  });
};

Booking.getByUserId = (user_id, callback) => {
  const query = `
    SELECT 
      b.booking_id, 
      b.screening_id, 
      b.total_price, 
      b.status, 
      m.title AS movie_title, 
      m.poster_url AS movie_image,
      s.screening_date, 
      s.start_time, 
      s.screening_format, 
      r.room_name,
      GROUP_CONCAT(bd.seat_id) AS seat_ids,
      GROUP_CONCAT(st.seat_number) AS seat_names
    FROM Bookings b
    JOIN Screenings s ON b.screening_id = s.screening_id
    JOIN Showtimes sh ON sh.showtime_id = s.showtime_id
    JOIN Movies m ON sh.movie_id = m.movie_id
    JOIN Rooms r ON s.room_id = r.room_id
    JOIN BookingDetails bd ON b.booking_id = bd.booking_id
    JOIN Seats st ON bd.seat_id = st.seat_id
    WHERE b.user_id = ?
    GROUP BY b.booking_id
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return callback(err);

    // Chuyển đổi dữ liệu thành định dạng dễ dùng
    const tickets = results.map((row) => ({
      booking_id: row.booking_id,
      movie_title: row.movie_title,
      movie_image: row.movie_image,
      screening_date: row.screening_date,
      time: row.start_time,
      screening_format: row.screening_format,
      room_name: row.room_name,
      total_price: row.total_price,
      status: row.status,
      seats: row.seat_names.split(',').map((name, index) => ({
        seat_id: row.seat_ids.split(',')[index],
        seat_name: name,
      })),
    }));

    callback(null, tickets);
  });
},

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