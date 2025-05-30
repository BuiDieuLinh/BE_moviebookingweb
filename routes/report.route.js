const express = require('express');
const router = express.Router();
const db = require("../common/db");
const moment = require('moment');

router.get("/report", async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                (SELECT IFNULL(SUM(DISTINCT p.amount), 0)
                 FROM Payments p 
                 WHERE DATE(p.created_at) = CURDATE() 
                   AND p.payment_status = 'success') AS revenue_today,
                 
                (SELECT COUNT(*) 
                 FROM Users 
                 WHERE DATE(created_at) = CURDATE() 
                   AND role = 'customer') AS new_customers_today,
                 
                (SELECT COUNT(*) 
                 FROM BookingDetails bd 
                 JOIN Bookings b ON bd.booking_id = b.booking_id 
                 WHERE DATE(b.created_at) = CURDATE() 
                   AND b.status = 'paid') AS tickets_sold_today,

                (SELECT IFNULL(SUM(p.amount), 0) 
                 FROM Payments p 
                 WHERE p.payment_status = 'success') AS total_revenue;
        `);

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Lỗi truy vấn thống kê:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});

router.get("/historybooking", (req, res) => {
    const sql = `
        SELECT u.username, b.total_price, b.created_at, b.status
        FROM Bookings b
        JOIN Users u ON b.user_id = u.user_id
        ORDER BY b.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn lịch sử đặt vé:", err);
            return res.status(500).json({ success: false, message: "Lỗi server khi lấy lịch sử đặt vé" });
        }

        res.json(result);
    });
});

router.get('/revenue-daily', (req, res) => {
    const sql = `SELECT 
                DATE(b.created_at) AS date, 
                SUM(b.total_price) AS revenue
            FROM Bookings b
            WHERE b.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                AND b.status = 'paid'
            GROUP BY DATE(b.created_at)
            ORDER BY date ASC;`
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn lịch sử đặt vé:", err);
            return res.status(500).json({ success: false, message: "Lỗi server khi lấy lịch sử đặt vé" });
        }

        res.json(result);
    });
})

router.get('/topmovie', (req, res) => {
    const sql = `SELECT 
        m.title,
        SUM(b.total_price) AS total_revenue, -- Doanh thu
        COUNT(DISTINCT bd.detail_id) AS tickets_sold, -- Số vé bán ra
        COUNT(DISTINCT b.booking_id) AS view_count, -- Lượt xem (số booking)
        r.total_seats, -- Tổng số ghế trong phòng
        COUNT(DISTINCT bd.detail_id) / r.total_seats * 100 AS seat_occupancy_rate -- Tỷ lệ kín ghế
    FROM 
        Movies m
    JOIN 
        Showtimes sh ON m.movie_id = sh.movie_id
    JOIN 
        Screenings sc ON sh.showtime_id = sc.showtime_id
    JOIN 
        Rooms r ON sc.room_id = r.room_id
    JOIN 
        Bookings b ON sc.screening_id = b.screening_id
    JOIN 
        BookingDetails bd ON b.booking_id = bd.booking_id
    WHERE 
        b.status = 'paid' -- Chỉ lấy các booking đã thanh toán
        AND WEEK(b.created_at, 1) = WEEK(CURDATE(), 1) -- Lọc theo tuần hiện tại
        AND YEAR(b.created_at) = YEAR(CURDATE())
    GROUP BY 
         m.title, r.total_seats
	ORDER BY total_revenue DESC`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn top phim:", err);
            return res.status(500).json({ success: false, message: "Lỗi server khi lấy top phim" });
        }

        res.json(result);
    });
})

// Hàm tính khoảng thời gian và tạo labels
const getDateRange = (date, duration) => {
  const endDate = moment(date, 'YYYY-MM-DD');
  let startDate;
  let labels = [];

  if (duration === 'day') {
    startDate = endDate.clone();
    labels = [startDate.format('YYYY-MM-DD')];
  } else if (duration === 'week') {
    startDate = endDate.clone().subtract(6, 'days'); // Trừ 6 ngày để lấy ngày bắt đầu
    for (let d = startDate.clone(); d.isSameOrBefore(endDate); d.add(1, 'day')) {
      labels.push(d.format('YYYY-MM-DD'));
    }
  } else if (duration === 'month') {
    startDate = endDate.clone().startOf('month'); // Ngày đầu tiên của tháng
    for (let d = startDate.clone(); d.isSameOrBefore(endDate); d.add(1, 'day')) {
      labels.push(d.format('YYYY-MM-DD'));
    }
  } else {
    throw new Error('Invalid duration. Must be day, week, or month.');
  }

  return {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
    labels
  };
};

// API endpoint để lấy thống kê phòng
router.get('/:room_id/statistics', (req, res) => {
  const { room_id } = req.params;
  const { date, duration } = req.query;

  // Kiểm tra tham số
  if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ success: false, message: 'Tham số date không hợp lệ hoặc thiếu' });
  }
  if (!duration || !['day', 'week', 'month'].includes(duration)) {
    return res.status(400).json({ success: false, message: 'Tham số duration không hợp lệ hoặc thiếu' });
  }

  try {
    // Tính khoảng thời gian và labels
    const { startDate, endDate, labels } = getDateRange(date, duration);

    // 1. Tính số suất chiếu (screenings)
    const sqlScreenings= `
      SELECT COUNT(*) as screenings
      FROM Screenings sr
      JOIN Rooms r ON sr.room_id = r.room_id
      WHERE sr.room_id = ? AND sr.screening_date BETWEEN ? AND ?`;
    db.query(sqlScreenings, [room_id, startDate, endDate], (err, screeningsResult) => {
      if (err) {
        console.error('Lỗi truy vấn số suất chiếu:', err);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy số suất chiếu' });
      }
      console.log("start " + startDate + "end " + endDate)
      const screenings = screeningsResult[0].screenings || 0;

      // 2. Tính số ghế đã đặt (bookedSeats)
      const sqlBookedSeats = `
        SELECT COALESCE(COUNT(bd.detail_id), 0) as booked_seats
        FROM BookingDetails bd
        JOIN Bookings b ON bd.booking_id = b.booking_id
        JOIN Screenings s ON b.screening_id = s.screening_id
        WHERE s.room_id = ? AND s.screening_date BETWEEN ? AND ?
        AND b.status = 'paid'`;
      db.query(sqlBookedSeats, [room_id, startDate, endDate], (err, bookedSeatsResult) => {
        if (err) {
          console.error('Lỗi truy vấn số ghế đã đặt:', err);
          return res.status(500).json({ success: false, message: 'Lỗi server khi lấy số ghế đã đặt' });
        }

        const bookedSeats = bookedSeatsResult[0].booked_seats || 0;

        // 3. Tính doanh thu (revenue)
        const sqlRevenue = `
          SELECT COALESCE(SUM(b.total_price), 0) as revenue
          FROM Bookings b
          JOIN Screenings s ON b.screening_id = s.screening_id
          WHERE s.room_id = ? AND s.screening_date BETWEEN ? AND ?
          AND b.status = 'paid'`;
        db.query(sqlRevenue, [room_id, startDate, endDate], (err, revenueResult) => {
          if (err) {
            console.error('Lỗi truy vấn doanh thu:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server khi lấy doanh thu' });
          }

          const revenue = parseFloat(revenueResult[0].revenue) || 0;

          // 4. Tạo dữ liệu biểu đồ (chartData)
          const sqlChartData = `
            SELECT DATE(s.screening_date) as screening_date, COUNT(*) as showtime_count
            FROM Screenings s
            WHERE s.room_id = ? AND s.screening_date BETWEEN ? AND ?
            GROUP BY DATE(s.screening_date)
            ORDER BY screening_date ASC`;
          db.query(sqlChartData, [room_id, startDate, endDate], (err, chartResult) => {
            if (err) {
              console.error('Lỗi truy vấn dữ liệu biểu đồ:', err);
              return res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu biểu đồ' });
            }

            // Tạo mảng data, gán 0 cho ngày không có suất chiếu
            const data = labels.map(label => {
              const result = chartResult.find(row => row.screening_date === label);
              return result ? result.showtime_count : 0;
            });

            // Định dạng chartData
            const chartData = {
              labels,
              datasets: [
                {
                  label: 'Suất chiếu',
                  data
                }
              ]
            };

            // Trả về JSON
            res.json({
              date,
              duration,
              screenings,
              bookedSeats,
              revenue,
              chartData
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});
module.exports = router;
