var express = require('express');
var router = express.Router();
const seatController = require("../controllers/seat.controller");
/* GET seats listing. */
router.get('/', seatController.getAll);
router.get('/:id', seatController.getById);
router.get('/room/:room_id', seatController.getByRoomId);
router.post('/', seatController.insert);
router.put('/:id', seatController.update);
router.delete('/:id', seatController.delete); 
// API tạo nhiều ghế
// Route chèn một ghế
// router.post('/', seatController.insert);

// Route chèn nhiều ghế
router.post('/bulk', seatController.insertBulk);
module.exports = router;
