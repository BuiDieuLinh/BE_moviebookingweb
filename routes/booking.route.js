var express = require('express');
var router = express.Router();
const bookingController = require("../controllers/booking.controller");
/* GET bookings listing. */
router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);
router.post('/', bookingController.insert);
router.put('/:id', bookingController.update);
router.delete('/:id', bookingController.delete); 

module.exports = router;
