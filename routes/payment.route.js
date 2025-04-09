var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const config = require('../config/config');
const paymentController = require("../controllers/payment.controller");
/* GET payments listing. */
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.post('/', paymentController.insert);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.delete); 
router.get('/payment-sucsess')
router.post('/payment_momo', paymentController.payment)
router.post('/payment_vnpay', paymentController.paymentBy_vnpay);
// Hàm mã hóa chữ ký bảo mật
function createSecureHash(params) {
    const hashData = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  
    const data = `${hashData}&vnp_HashSecret=${config.vnp_HashSecret}`;
    return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
  }
  
  // API thanh toán - gửi yêu cầu đến VNPay
  router.post('/create-payment', (req, res) => {
    const { booking_id, amount } = req.body;

    const amount1 = parseInt(amount);
  const vnp_TmnCode = 'QF9M1HRI'; // Thay bằng mã của bạn
  const vnp_HashSecret = 'TLMZMJNEK0KZXU8EOGRHYV75GS834PCS'; // Thay bằng secret key của VNPAY
  const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const vnp_ReturnUrl = 'http://localhost:3000/payment';

// Tạo tham số cho VNPAY
const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: amount1 * 100, // Đảm bảo nhân với 100
    vnp_Command: 'pay',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: booking_id,
    vnp_OrderInfo: `thanh toan don hang`,
    vnp_Locale: 'vn',
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_CreateDate: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14), // YYYYMMDDHHMMSS
    vnp_IpAddr: '127.0.0.1',
  };

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // Tạo chuỗi hash (theo đúng tài liệu VNPAY)
  const signData = Object.keys(sortedParams)
    .map(key => `${key}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, '+')}`)
    .join('&');
  console.log('Sign data:', signData); // Log để kiểm tra chuỗi hash

  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const vnp_SecureHash = hmac.update(signData).digest('hex');
  console.log('Generated SecureHash:', vnp_SecureHash); // Log để kiểm tra SecureHash

  // Thêm SecureHash vào tham số
  sortedParams.vnp_SecureHash = vnp_SecureHash;

  // Tạo URL thanh toán
  const paymentUrl = `${vnp_Url}?${new URLSearchParams(sortedParams).toString()}`;

  // Log để kiểm tra
  console.log('Params:', sortedParams);
  console.log('Payment URL:', paymentUrl);

  // Trả về URL thanh toán cho frontend
  res.json({ paymentUrl });
});
  
  // API callback từ VNPay sau khi thanh toán
  router.get('/payment-callback', (req, res) => {
    const { vnp_ResponseCode, vnp_SecureHash, ...params } = req.query;
  
    // Kiểm tra chữ ký bảo mật
    const secureHash = createSecureHash(params);
    if (secureHash === vnp_SecureHash && vnp_ResponseCode === '00') {
      // Thanh toán thành công
      res.send('Thanh toán thành công!');
    } else {
      // Thanh toán thất bại
      res.send('Thanh toán thất bại!');
    }
  });
module.exports = router;
