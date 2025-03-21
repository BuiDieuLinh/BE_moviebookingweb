const user = require("../models/user.model");
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_jwt_secret_key';

const login = (req, res) => {
    const { username, password } = req.body;

    console.log("📌 Dữ liệu nhận từ Postman:", req.body);

    user.getByUsername(username, (err, foundUser) => {
        if (err) {
            console.error("❌ Lỗi truy vấn database:", err);
            return res.status(500).send('Lỗi server');
        }

        if (!foundUser) {
            console.warn("⚠️ Không tìm thấy user:", username);
            return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng');
        }

        console.log("✅ Tìm thấy user:", foundUser);

        // Kiểm tra mật khẩu (nếu chưa mã hóa)
        if (password !== foundUser.password) {
            console.warn("⚠️ Mật khẩu không đúng:", password);
            return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng');
        }

        // Tạo JWT Token
        const token = jwt.sign({ user_id: foundUser.user_id, username: foundUser.username }, SECRET_KEY, { expiresIn: '1h' });

        console.log("✅ Đăng nhập thành công, trả về token");
        res.json({ token });
    });
};

// Route cần xác thực
const protectedRoute = (req, res) => {
    res.send('Đây là một tuyến bảo vệ');
};

// Các chức năng CRUD cho user
const getAll = (req, res) => {
    user.getAll((result) => {
        res.send(result);
    });
};

const getById = (req, res) => {
    const id = req.params.id;
    user.getById(id, (result) => {
        res.send(result);
    });
};

const insert = (req, res) => {
    const u = req.body;
    user.insert(u, (result) => {
        res.send(result);
    });
};

const update = (req, res) => {
    const u = req.body;
    const id = req.params.id;
    user.update(u, id, (result) => {
        res.send(result);
    });
};

const deleteUser = (req, res) => {
    const id = req.params.id;
    user.delete(id, (result) => {
        res.send(result);
    });
};

// Xuất tất cả chức năng trong một object
module.exports = {
    login,
    protectedRoute,
    getAll,
    getById,
    insert,
    update,
    delete: deleteUser
};
