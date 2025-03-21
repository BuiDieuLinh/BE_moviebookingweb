var express = require('express');
var router = express.Router();
const seatController = require("../controllers/seat.controller");
/* GET seats listing. */
router.get('/', seatController.getAll);
router.get('/:id', seatController.getById);
router.post('/', seatController.insert);
router.put('/:id', seatController.update);
router.delete('/:id', seatController.delete); 

module.exports = router;
