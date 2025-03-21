const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Vui lòng đăng nhập');

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send('Xác thực thất bại');
        req.user = decoded;
        next();
    });
};
module.exports = authenticateToken;
