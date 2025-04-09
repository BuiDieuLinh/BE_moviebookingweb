const payment = require("../models/payment.model");
const axios = require('axios');
const request = require('request');
const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const config = require('../config/config');
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();

  for (let key of keys) {
      sorted[key] = obj[key];
  }

  return sorted;
}

module.exports = {
  getAll: (req, res) => {
    payment.getAll((result) => {
      res.send(result);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    payment.getById(id, (result) => {
      res.send(result);
    });
  },

  insert: (req, res) => {
    const u = req.body;
    payment.insert(u, (result) => {
      res.send(result);
    });
  },

  update: (req, res) => {
    const u = req.body;
    const id = req.params.id;
    payment.update(u,id, (result) => {
      res.send(result);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    payment.delete(id, (result) => {
      res.send(result);
    });
  },

  payment: async (req, res) =>{
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = `thanh toan don ve ${orderId}`; // nội dung giao dịch
    var redirectUrl = "https://momo.vn/return";
    var ipnUrl = "http://localhost:5000/payment";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = "10000";
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
        lang: 'en'
    });

    const options = {
      method: "POST",
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        "Content-Type" :'application/json',
        "Content-Length" : Buffer.byteLength(requestBody)
      },
      data: requestBody
    }

    let result;
    try{
      result = await axios(options);
      return res.status(200).json(result.data);
    }catch (error){
      return res.status(500).json({
        statusCode: 500,
        message: 'server error'
      })
    }
  },

  paymentBy_vnpay: async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // Cấu hình từ tệp config
    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    
    // Thông tin đơn hàng
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = req.body.language || 'vn';
    let currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100; // chuyển sang đơn vị tiền tệ (VND)
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    // Thêm mã ngân hàng nếu có
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp tham số theo thứ tự chữ cái
    vnp_Params = sortObject(vnp_Params);

    // Tạo chuỗi querystring từ các tham số đã sắp xếp
    let signData = querystring.stringify(vnp_Params, { encode: false });
    
    // Tạo chữ ký HMAC với secretKey
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // Chuyển hướng người dùng tới trang thanh toán
    res.redirect(vnpUrl);
  }
};


