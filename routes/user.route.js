var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller");
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');

const SECRET_KEY = 'your_jwt_secret_key';

router.post('/login', userController.login);
router.get('/protected', authenticateToken, userController.protectedRoute);
/* GET users listing. */
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.insert);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete); 

module.exports = router;
