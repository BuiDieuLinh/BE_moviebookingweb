var express = require('express');
var router = express.Router();
const screeningController = require("../controllers/screening.controller");
/* GET screenings listing. */
router.get('/', screeningController.getAll);
router.get('/:id', screeningController.getById);
router.post('/', screeningController.insert);
router.put('/:id', screeningController.update);
router.delete('/:id', screeningController.delete); 

module.exports = router;
