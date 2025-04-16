const express = require('express');
const router = express.Router();
const db = require("../common/db");

router.get("/report", async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                (SELECT IFNULL(SUM(p.amount), 0)
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

module.exports = router;
