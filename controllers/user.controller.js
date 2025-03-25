const user = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const SECRET_KEY = 'your_jwt_secret_key';

const login = (req, res) => {
    const { username, password } = req.body;

    console.log("Dữ liệu nhận từ Postman:", req.body);

    user.getByUsername(username, (err, foundUser) => {
        if (err) {
            console.error("Lỗi truy vấn database:", err);
            return res.status(500).send('Lỗi server');
        }

        if (!foundUser) {
            console.warn("Không tìm thấy user:", username);
            return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng');
        }

        console.log("Tìm thấy user:", foundUser);

        // so sánh input pw vs pass đc mã hoá
        const isVaildPass = bcrypt.compareSync(password, foundUser.password);
        if (!isVaildPass) {
            console.warn("Mật khẩu không đúng:", password);
            return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng');
        }

        // Tạo JWT Token
        const token = jwt.sign({ user_id: foundUser.user_id, username: foundUser.username }, SECRET_KEY, { expiresIn: '1h' });

        console.log("Đăng nhập thành công, trả về token");
        res.status(200).json({ token });
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

    // Hash mật khẩu trước khi lưu vào database
    const hashedPassword = bcrypt.hashSync(u.password, 12);
    console.log(hashedPassword);
    if (!hashedPassword) {
        return res.json({ message: 'Không thể tạo mật khẩu' });
    }

    // Cập nhật mật khẩu đã hash vào object user
    u.password = hashedPassword;

    // Chèn user vào database
    user.insert(u, (result) => {
        if (result.message) {
            return res.status(400).json(result); // Trả về lỗi nếu có
        }
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
