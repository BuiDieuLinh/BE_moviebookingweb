var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateToken = require('../middleware/authMiddleware');


router.post('/login', userController.login);
router.get('/protected', authenticateToken.authenticateToken, userController.protectedRoute);
/* GET users listing. */
router.get('/', authenticateToken.authenticateToken, authenticateToken.verifyAdmin, userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.insert);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete); 

module.exports = router;
