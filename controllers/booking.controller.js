const booking = require("../models/booking.model");
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

module.exports = {
  getAll: (req, res) => {
    booking.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    booking.getById(id, (result) => {
      res.send(result);
    });
  },

  getByUserId: (req, res) => {
    const user_id = req.params.user_id;

    booking.getByUserId(user_id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi server', error: err });
      }
      res.status(200).json(result);
    });
  },

  insert: (req, res) => {
    const { bookings, details} = req.body; // Nhận booking và details từ body
  
    // Kiểm tra dữ liệu đầu vào
    if (!bookings || !details ) {
      return res.status(400).json({ error: 'Missing booking or details data' });
    }
  
    booking.insert(bookings, details, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(result);
    });
  },

 updateQRCodeAndStatus: async (req, res) => {
    const id = req.params.id;
    console.log(id)
  
    try {
      // Lấy thông tin đơn hàng
      booking.getById(id, async (bookingData) => {
        if (!bookingData) {
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        console.log(bookingData)
        const realData = bookingData[0]
        
      // 2. Tạo nội dung QR
      const qrText = JSON.stringify({
        booking_id: realData.booking_id,
        user_id: realData.user_id,
        screening_id: realData.screening_id,
        total_price: realData.total_price,
        status: 'paid'
      });
      console.log(qrText)

      // 3. Định nghĩa đường dẫn lưu QR
      const qrFolder = path.join(__dirname, '..', 'public', 'images', 'qr-codes');
      const fileName = `${id}_qr.png`;
      const filePath = path.join(qrFolder, fileName);
      const qrPath = `/images/qr-codes/${fileName}`; // Đường dẫn public

      // 4. Tạo thư mục nếu chưa tồn tại
      if (!fs.existsSync(qrFolder)) {
        fs.mkdirSync(qrFolder, { recursive: true });
      }

      // 5. Tạo file QR
      await QRCode.toFile(filePath, qrText);

      // 6. Cập nhật trạng thái và qr_code
      const updateData = {
        qr_code: qrPath,
        status: 'paid'
      };

      booking.update(updateData, id, (result) => {
        res.json({
          message: 'Cập nhật thành công',
          booking_id: id,
          qr_code: qrPath,
          status: updateData.status
        });
      });
    });

    } catch (err) {
      console.error('Lỗi tạo QR:', err);
      res.status(500).json({ message: 'Lỗi tạo mã QR hoặc cập nhật đơn hàng' });
    }
  },

  delete: (req, res) => {
    const id = req.params.id;
    booking.delete(id, (result) => {
      res.send(result);
    });
  },
};


