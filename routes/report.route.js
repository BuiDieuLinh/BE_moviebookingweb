const express = require('express');
const router = express.Router();
const db = require("../common/db");

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
module.exports = router;
