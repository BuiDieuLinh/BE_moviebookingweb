var express = require('express');
var router = express.Router();
const bookingdetailController = require("../controllers/bookingdetail.controller");
/* GET bookingdetails listing. */
router.get('/', bookingdetailController.getAll);
router.get('/:id', bookingdetailController.getById);
router.post('/', bookingdetailController.insert);
router.put('/:id', bookingdetailController.update);
router.delete('/:id', bookingdetailController.delete); 

module.exports = router;
