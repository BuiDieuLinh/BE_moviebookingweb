var express = require('express');
var router = express.Router();
const paymentController = require("../controllers/payment.controller");
/* GET payments listing. */
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.post('/', paymentController.insert);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.delete); 

module.exports = router;
