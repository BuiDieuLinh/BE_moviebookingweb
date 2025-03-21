var express = require('express');
var router = express.Router();
const reviewController = require("../controllers/review.controller");
/* GET reviews listing. */
router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getById);
router.post('/', reviewController.insert);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.delete); 

module.exports = router;
