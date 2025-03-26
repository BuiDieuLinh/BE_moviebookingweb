const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Vui lòng đăng nhập');

    jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send('Xác thực thất bại');
        req.user = decoded;
        next();
    });
};
function verifyAdmin(req, res, next) {

    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access denied. You need an Admin role to get access." });
    }
    next();
  }
module.exports = { authenticateToken, verifyAdmin};
