var express = require('express');
var router = express.Router();
const ticketpriceController = require("../controllers/ticketprice.controller");
/* GET ticketprices listing. */
// Mock API - Kiểm tra có tồn tại không
router.get('/', ticketpriceController.getAll);
router.get('/:id', ticketpriceController.getById);
router.post('/', ticketpriceController.insert);
router.put('/:id', ticketpriceController.update);
router.delete('/:id', ticketpriceController.delete); 

module.exports = router;
