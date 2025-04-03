var express = require('express');
var router = express.Router();
const showtimeController = require("../controllers/showtime.controller");
/* GET showtimes listing. */
router.get('/', showtimeController.getAll);
router.get('/showtimebydate', showtimeController.getByDate);
router.get('/:id', showtimeController.getById);
router.post('/', showtimeController.insert);
router.put('/:id', showtimeController.update);
router.delete('/:id', showtimeController.delete); 

module.exports = router;
