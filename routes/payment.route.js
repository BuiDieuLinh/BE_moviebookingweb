var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const config = require('../config/config');
const paymentController = require("../controllers/payment.controller");
/* GET payments listing. */
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.post('/', paymentController.insert);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.delete); 
router.post('/payment_momo', paymentController.payment)

module.exports = router;
