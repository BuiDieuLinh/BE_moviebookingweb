const Movie = require("../models/movie.model");
const multer = require("multer");
const path = require("path");

// Cấu hình multer để lưu file vào public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Thư mục lưu file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Tạo tên file duy nhất
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh JPEG, JPG hoặc PNG!"));
    }
  },
}).single("poster"); // Đổi từ "poster_url" thành "poster" để đồng bộ với frontend

module.exports = {
  getAll: (req, res) => {
    Movie.getAll((err, result) => { // Kiểm tra cả lỗi
      if (err) {
        console.error("Lỗi khi lấy danh sách phim:", err);
        return res.status(500).send({ message: "Lỗi server", error: err.message });
      }
      console.log("Danh sách phim:", result); // Log để kiểm tra dữ liệu
      res.status(200).send(result);
    });
  },


  getById: (req, res) => {
    const id = req.params.id;
    Movie.getById(id, (err, result) => {
      if (err) {
        console.error("Lỗi khi lấy phim:", err);
        return res.status(500).send({ message: "Lỗi server", error: err.message });
      }
      res.status(200).send(result);
    });
  },

  insert: (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.error("Lỗi khi upload file:", err);
        return res.status(400).send({ message: err.message });
      }

      const movieData = {
        title: req.body.title,
        description: req.body.description || "",
        duration: req.body.duration,
        release_date: req.body.release_date,
        genre: req.body.genre,
        director: req.body.director,
        cast: req.body.cast,
        poster_url: req.file ? `/images/${req.file.filename}` : null,
        trailer_url: req.body.trailer_url || "",
        created_at: req.body.created_at,
      };

      Movie.insert(movieData, ( result) => {
        console.log(movieData)
        console.log("Dữ liệu phim đã thêm:", movieData);
        res.status(201).send(result);
      });
    });
  },

  update: (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.error("Lỗi khi upload file:", err);
        return res.status(400).send({ message: err.message });
      }

      const id = req.params.id;
      const movieData = {
        title: req.body.title,
        description: req.body.description || "",
        duration: req.body.duration,
        release_date: req.body.release_date,
        genre: req.body.genre,
        director: req.body.director,
        cast: req.body.cast,
        trailer_url: req.body.trailer_url || "",
      };

      // Nếu có file mới, cập nhật poster_url
      if (req.file) {
        movieData.poster_url = `/images/${req.file.filename}`;
      } else if (req.body.poster_url) {
        movieData.poster_url = req.body.poster_url; // Giữ đường dẫn cũ nếu không upload file mới
      }

      Movie.update(movieData, id, (err, result) => {
        if (err) {
          console.error("Lỗi khi cập nhật phim:", err);
          return res.status(500).send({ message: "Lỗi khi cập nhật phim", error: err.message });
        }
        console.log("Dữ liệu phim đã cập nhật:", movieData);
        res.status(200).send(result);
      });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Movie.delete(id, (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa phim:", err);
        return res.status(500).send({ message: "Lỗi khi xóa phim", error: err.message });
      }
      res.status(200).send(result);
    });
  },
};