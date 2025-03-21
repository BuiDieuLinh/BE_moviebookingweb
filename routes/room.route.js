var express = require('express');
var router = express.Router();
const roomController = require("../controllers/room.controller");
/* GET rooms listing. */
router.get('/', roomController.getAll);
router.get('/:id', roomController.getById);
router.post('/', roomController.insert);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.delete); 

module.exports = router;
