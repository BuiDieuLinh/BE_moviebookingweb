var express = require('express');
var router = express.Router();
const bookingController = require("../controllers/booking.controller");
/* GET bookings listing. */
router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);
router.get('/user/:user_id', bookingController.getByUserId);
router.post('/', bookingController.insert);
router.delete('/:id', bookingController.delete); 
router.patch('/:id/qr', bookingController.updateQRCodeAndStatus);
router.patch('/updateStatus/:id', bookingController.updateStatus);

module.exports = router;
