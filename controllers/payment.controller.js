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
    const {booking_id, amountOr} = req.body;
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = booking_id;
    var orderInfo = `Thanh toan don ve ${orderId}`; // nội dung giao dịch
    var redirectUrl = "http://localhost:3000/payment";
    var ipnUrl = "http://localhost:3000/payment";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = `${amountOr}`;
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
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

};


