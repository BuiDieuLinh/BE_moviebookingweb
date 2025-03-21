var express = require('express');
var router = express.Router();
const movieController = require("../controllers/movie.controller");
/* GET movies listing. */

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);
router.post('/', movieController.insert);
router.put('/:id', movieController.update);
router.delete('/:id', movieController.delete); 

module.exports = router;
