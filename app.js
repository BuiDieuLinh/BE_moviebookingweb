var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import các router
var userRouter = require('./routes/user.route');
var showtimeRouter = require('./routes/showtime.route');
var seatRouter = require('./routes/seat.route');
var roomRouter = require('./routes/room.route');
var screeningRouter = require('./routes/screening.route');
var reviewRouter = require('./routes/review.route');
var paymentRouter = require('./routes/payment.route');
var movieRouter = require('./routes/movie.route');
var ticketpriceRouter = require('./routes/ticketprice.route');
var bookingdetailRouter = require('./routes/bookingdetail.route');
var bookingRouter = require('./routes/booking.route');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ tệp tĩnh từ thư mục public
app.use(bodyParser.json());

// Định nghĩa các tuyến đường (routes)
app.use('/users', userRouter);
app.use('/showtimes', showtimeRouter);
app.use('/seats', seatRouter);
app.use('/rooms', roomRouter);
app.use('/screenings', screeningRouter);
app.use('/reviews', reviewRouter);
app.use('/payments', paymentRouter);
app.use('/movies', movieRouter);
app.use('/ticketprices', ticketpriceRouter);
app.use('/bookingdetails', bookingdetailRouter);
app.use('/bookings', bookingRouter);


// Route mặc định để kiểm tra server
app.get('/', (req, res) => {
  res.send('Welcome to Cinema API! Server is running.');
});

// Xử lý lỗi 404
app.use(function(req, res, next) {
  res.status(404).json({
    message: 'Không tìm thấy tài nguyên bạn yêu cầu!',
  });
});

// Xử lý lỗi chung
app.use(function(err, req, res, next) {
  console.error(err.stack); // In lỗi ra console để debug
  res.status(err.status || 500).json({
    message: err.message || 'Có lỗi xảy ra trên server!',
    error: req.app.get('env') === 'development' ? err : {},
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app;