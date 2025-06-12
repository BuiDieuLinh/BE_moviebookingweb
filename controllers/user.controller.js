const user = require("../models/user.model");
const { OAuth2Client } = require("google-auth-library")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const client_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(client_id);
async function verifyToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id
    });
    const payload = ticket.getPayload();
    return payload;
}
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Yêu cầu cung cấp token' });
    }

    const payload = await verifyToken(token);
    const { email, name, sub: googleId } = payload;

    console.log('Checking email:', email);
    user.getByEmail(email, (foundUser) => {
      if (foundUser) {
        console.log("Đăng nhập Google thành công cho người dùng hiện có:", email);
        return res.status(200).json({
          user_id: foundUser.user_id,
          username: foundUser.username,
          email: foundUser.email,
          name: foundUser.fullname,
          role: foundUser.role,
        });
      }

      if(!foundUser){
        const newUser = {
            username: email.split('@')[0],
            email,
            fullname: name,
            password: null,
            role: 'customer',
        };

        user.insert(newUser, (result) => {
            if (result.error) {
            console.error("Lỗi khi tạo người dùng mới:", result.message);
            return res.status(400).json({
                field: result.field,
                message: result.message,
            });
            }

            console.log("Tạo và đăng nhập thành công người dùng Google mới:", email);
            res.status(201).json({
            user_id: result.id,
            username: newUser.username,
            email: newUser.email,
            name: newUser.fullname,
            role: newUser.role,
            });
        });
      }
    });
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error.stack);
    res.status(500).json({ message: 'Xác thực thất bại' });
  }
};

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
        const token = jwt.sign({ user_id: foundUser.user_id, username: foundUser.username, role: foundUser.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

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
    const page = req.query.page || 1;
    const limit = req.query.limit || 10; 
    user.getAll(page, limit,(err, result) => {        
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

    // Hash mật khẩu
    const hashedPassword = bcrypt.hashSync(u.password, 12);
    if (!hashedPassword) {
        return res.status(500).json({ field: 'password', message: 'Không thể tạo mật khẩu' });
    }

    u.password = hashedPassword;

    // Gọi hàm insert từ model
    user.insert(u, (result) => {
        if (result.error) {
            // Trả lỗi kèm trường cụ thể (field) để FE hiển thị chính xác
            return res.status(400).json({ field: result.field, message: result.message });
        }
        res.status(201).json(result);
    });
};

const update = (req, res) => {
    const u = req.body;
    const id = req.params.id;
    user.update(u, id, (result) => {
        res.send(result);
    });
};

const updateRole = (req, res) => {
    const role = req.body.role;
    const id = req.params.id;
    user.updateRole(role, id, (result) => {
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
    googleLogin,
    protectedRoute,
    getAll,
    getById,
    insert,
    update,
    updateRole,
    delete: deleteUser
};
